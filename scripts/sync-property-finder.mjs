#!/usr/bin/env node
/**
 * Syncs DRP's live listings from the Property Finder Enterprise API into
 * data/imported/listings.json. Runs before every build (`prebuild`), so each
 * deploy — including the scheduled hourly rebuild — shows Property Finder's
 * current listings.
 *
 *   PF_API_KEY, PF_API_SECRET   from PF Expert → Developer Resources →
 *                               API Credentials (type "API Integration")
 *   PF_API_BASE                 optional, default https://atlas.propertyfinder.com
 *
 *   npm run sync:pf              sync now
 *   npm run sync:pf -- --inspect print the shape of one listing (no values
 *                                that identify DRP's account), for mapping
 *
 * Safe by design: without the keys, or if Property Finder fails or returns
 * nothing usable, it keeps the current listings.json and the build carries on.
 */

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { inferArea } from './lib/gazetteer.mjs';

// Node's built-in fetch only honours HTTPS_PROXY when NODE_USE_ENV_PROXY is set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(child.status ?? 1);
}

const BASE = (process.env.PF_API_BASE || 'https://atlas.propertyfinder.com').replace(/\/$/, '');
const KEY = process.env.PF_API_KEY;
const SECRET = process.env.PF_API_SECRET;
const OUT = new URL('../data/imported/listings.json', import.meta.url);
const PER_PAGE = 50;
const MAX_PAGES = 40;
const INSPECT = process.argv.includes('--inspect');

const log = (...a) => console.log('[pf-sync]', ...a);

/* -------------------------------------------------------------------------- */
/*  API                                                                       */
/* -------------------------------------------------------------------------- */

async function getToken() {
  const res = await fetch(`${BASE}/v1/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ apiKey: KEY, apiSecret: SECRET }),
  });
  if (!res.ok) throw new Error(`token request failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const body = await res.json();
  const token = body.accessToken ?? body.access_token ?? body.token ?? body.data?.accessToken;
  if (!token) throw new Error(`token response had no access token (keys: ${Object.keys(body).join(', ')})`);
  return token;
}

async function api(token, path) {
  const res = await fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

/** The array of listings in a page, whatever the envelope is called. */
const rowsOf = (body) =>
  Array.isArray(body) ? body : (body.results ?? body.data ?? body.listings ?? body.items ?? []);

async function allListings(token) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const body = await api(token, `/v1/listings?page=${page}&perPage=${PER_PAGE}`);
    const batch = rowsOf(body);
    rows.push(...batch);
    const total = body.pagination?.total ?? body.meta?.total ?? body.total;
    if (batch.length < PER_PAGE || (total && rows.length >= total)) break;
  }
  return rows;
}

/** Location names by id, for listings that only carry a location id. */
const locationCache = new Map();
async function locationById(token, id) {
  if (locationCache.has(id)) return locationCache.get(id);
  let loc = null;
  try {
    const body = await api(token, `/v1/locations/${encodeURIComponent(id)}`);
    loc = body.data ?? body;
  } catch {
    try {
      const body = await api(token, `/v1/locations?filter[id]=${encodeURIComponent(id)}`);
      loc = rowsOf(body)[0] ?? null;
    } catch {
      loc = null;
    }
  }
  locationCache.set(id, loc);
  return loc;
}

/* -------------------------------------------------------------------------- */
/*  FIELD HELPERS — the API's field names are read defensively                */
/* -------------------------------------------------------------------------- */

/** First defined value among dotted paths. */
function pick(obj, ...paths) {
  for (const path of paths) {
    const v = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

/** Text that may be localised: "x" or { en: "x", ar: "…" }. */
const text = (v) => (v == null ? '' : typeof v === 'string' ? v : (v.en ?? v.value ?? Object.values(v).find((x) => typeof x === 'string') ?? ''));

const num = (v) => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'object') return num(v.value ?? v.amount);
  const n = Number(String(v).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && String(v).match(/\d/) ? n : null;
};

const titleCase = (s) => s.replace(/[_-]+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).trim();

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 90);

function offeringOf(raw) {
  const v = String(pick(raw, 'price.type', 'offeringType', 'offering_type', 'purpose', 'priceType') ?? '').toLowerCase();
  if (/rent/.test(v)) return 'rent';
  if (/sale|sell|buy/.test(v)) return 'buy';
  return pick(raw, 'price.amounts.yearly', 'price.amounts.monthly') ? 'rent' : 'buy';
}

function priceOf(raw, offering) {
  const amounts = pick(raw, 'price.amounts') ?? {};
  if (offering === 'rent') {
    const yearly = num(amounts.yearly ?? amounts.annual ?? amounts.year);
    if (yearly) return yearly;
    const monthly = num(amounts.monthly ?? amounts.month);
    if (monthly) return monthly * 12;
  } else {
    const sale = num(amounts.sale ?? amounts.price);
    if (sale) return sale;
  }
  return num(pick(raw, 'price.value', 'price.amount', 'price')) ?? null;
}

const TYPES = [
  [/penthouse/, 'Penthouse'],
  [/town ?house/, 'Townhouse'],
  [/villa|compound|bungalow/, 'Villa'],
  [/apartment|flat|duplex|loft|hotel/, 'Apartment'],
];
function typeOf(raw) {
  const v = String(pick(raw, 'type', 'propertyType', 'property_type', 'category') ?? '').toLowerCase();
  return TYPES.find(([re]) => re.test(v))?.[1] ?? 'Commercial';
}

function bedsOf(raw) {
  const v = pick(raw, 'bedrooms', 'beds', 'bedroom');
  if (v == null) return null;
  if (/studio/i.test(String(v))) return 0;
  return num(v);
}

function sizeOf(raw) {
  const v = pick(raw, 'size', 'area', 'builtUpArea', 'built_up_area');
  const unit = String(pick(raw, 'size.unit', 'sizeUnit', 'area.unit') ?? 'sqft').toLowerCase();
  const n = num(typeof v === 'object' ? (v.value ?? v.size) : v);
  if (!n) return null;
  return Math.round(/sqm|m2|metre|meter/.test(unit) ? n * 10.7639 : n);
}

function imagesOf(raw) {
  const list = pick(raw, 'media.images', 'images', 'photos', 'media') ?? [];
  return (Array.isArray(list) ? list : [])
    .map((img) =>
      typeof img === 'string'
        ? img
        : pick(img, 'original.url', 'large.url', 'url', 'src', 'link', 'watermarked.url', 'medium.url'),
    )
    .filter((u) => typeof u === 'string' && /^https:\/\//.test(u));
}

function featuresOf(raw) {
  const list = pick(raw, 'amenities', 'features', 'facilities') ?? [];
  return [...new Set((Array.isArray(list) ? list : []).map((a) => titleCase(typeof a === 'string' ? a : text(a.name ?? a.title ?? a.label))).filter(Boolean))];
}

function furnishingOf(raw) {
  const v = String(pick(raw, 'furnishingType', 'furnishing', 'furnished') ?? '').toLowerCase();
  if (/unfurnished|^no$|false/.test(v)) return 'Unfurnished';
  if (/furnished|^yes$|true/.test(v)) return 'Furnished';
  return null;
}

const completionOf = (raw) =>
  /off.?plan|under.?construction/i.test(String(pick(raw, 'projectStatus', 'completionStatus', 'completion_status') ?? ''))
    ? 'Off-Plan'
    : 'Ready';

const dateOf = (raw) => {
  const v = pick(raw, 'portals.propertyfinder.publishedAt', 'publishedAt', 'published_at', 'createdAt', 'created_at', 'updatedAt');
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null;
};

function agentOf(raw) {
  const a = pick(raw, 'assignedTo', 'agent', 'publicProfile', 'createdBy');
  if (!a || typeof a !== 'object') return typeof a === 'string' ? a : null;
  const name = a.name ?? [a.firstName ?? a.first_name, a.lastName ?? a.last_name].filter(Boolean).join(' ');
  return name ? titleCase(text(name)) : null;
}

const NOT_LIVE = /draft|archiv|unpublish|reject|delet|expired|takendown|inactive/;

/**
 * Live on Property Finder: drafts, archived and unpublished listings stay off
 * the site. Also returns which field decided it (e.g. "state.type=archived"),
 * which the build log counts so the mapping can be checked.
 */
function liveSignal(raw) {
  for (const path of ['portals.propertyfinder.isLive', 'isLive', 'is_live', 'published']) {
    const v = pick(raw, path);
    if (typeof v === 'boolean') return { live: v, why: `${path}=${v}` };
  }
  for (const path of ['state.type', 'state.stage', 'state', 'status']) {
    const v = pick(raw, path);
    if (v != null && typeof v !== 'object') {
      const value = String(v).toLowerCase();
      return { live: !NOT_LIVE.test(value), why: `${path}=${value}` };
    }
  }
  return { live: true, why: 'no status field' };
}

/** Community and building from the location tree, falling back to the listing text. */
async function placeOf(token, raw, title, description) {
  let loc = pick(raw, 'location');
  if (loc && typeof loc !== 'object') loc = { id: loc };
  if (loc && loc.id != null && !(loc.name || loc.path || loc.tree || loc.community)) {
    loc = { ...loc, ...((await locationById(token, loc.id)) ?? {}) };
  }
  const names = [];
  if (loc) {
    const tree = loc.tree ?? loc.path ?? loc.breadcrumbs ?? loc.hierarchy;
    if (Array.isArray(tree)) names.push(...tree.map((t) => text(typeof t === 'string' ? t : (t.name ?? t.title))));
    else if (typeof tree === 'string') names.push(...tree.split(/[,>/]/));
    for (const k of ['city', 'community', 'subCommunity', 'sub_community', 'tower', 'building', 'name']) {
      if (loc[k]) names.push(text(typeof loc[k] === 'object' ? loc[k].name : loc[k]));
    }
  }
  const clean = [...new Set(names.map((n) => n.trim()).filter((n) => n && !/^(dubai|uae|united arab emirates)$/i.test(n)))];
  const area = inferArea(...clean) ?? inferArea(title) ?? inferArea(description) ?? clean[0] ?? 'Dubai';
  /* The tree runs community → building, so its last name is the most specific */
  const last = clean.length > 1 ? clean[clean.length - 1] : null;
  const building = last && last.toLowerCase() !== area.toLowerCase() ? last : null;
  return { area, building, query: `${building ? `${building}, ` : ''}${area}, Dubai, United Arab Emirates` };
}

/* -------------------------------------------------------------------------- */
/*  SYNC                                                                      */
/* -------------------------------------------------------------------------- */

/** Every key of a listing with its type, values hidden — enough to fix the mapping. */
function shape(v, depth = 0) {
  if (Array.isArray(v)) return v.length ? [shape(v[0], depth + 1)] : [];
  if (v && typeof v === 'object') {
    if (depth > 4) return '{…}';
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x, depth + 1)]));
  }
  return typeof v;
}

async function main() {
  if (!KEY || !SECRET) {
    log('PF_API_KEY / PF_API_SECRET not set — keeping the current listings.');
    return;
  }

  const previous = JSON.parse(await readFile(OUT, 'utf8').catch(() => '[]'));
  const byRef = new Map(previous.map((p) => [p.ref, p]));

  const token = await getToken();
  const raws = await allListings(token);
  log(`${raws.length} listings from Property Finder`);

  if (INSPECT) {
    console.log(JSON.stringify(shape(raws[0] ?? {}), null, 2));
    return;
  }

  const skipped = {};
  const skip = (why) => ((skipped[why] = (skipped[why] ?? 0) + 1), null);
  const usedSlugs = new Set();

  /* Field names and status values only, never listing content — to check the mapping from the build log */
  log('listing fields:', Object.keys(raws[0] ?? {}).join(', '));
  log('status fields:', JSON.stringify({ state: shape(raws[0]?.state), portals: shape(raws[0]?.portals) }));
  const statusCounts = {};

  const rows = [];
  for (const raw of raws) {
    const status = liveSignal(raw);
    statusCounts[`${status.live ? 'live' : 'not live'}: ${status.why}`] = (statusCounts[`${status.live ? 'live' : 'not live'}: ${status.why}`] ?? 0) + 1;
    if (!status.live) { skip('not live'); continue; }
    /* The Property Finder listing id, as the importer stored it, so existing pages keep their address */
    const ref = String(pick(raw, 'id', 'reference', 'referenceNumber') ?? '');
    const title = text(pick(raw, 'title')).replace(/\s+/g, ' ').trim();
    const offering = offeringOf(raw);
    const price = priceOf(raw, offering);
    const images = imagesOf(raw);
    if (!ref || !title) { skip('no reference or title'); continue; }
    if (!price) { skip('no price'); continue; }
    if (images.length < 1) { skip('no photos'); continue; }

    const description = text(pick(raw, 'description'))
      .split(/\n+/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const old = byRef.get(ref);
    const place = await placeOf(token, raw, title, description.join(' '));

    /* Keep a listing's address stable across syncs */
    let slug = old?.slug ?? slugify(title);
    if (usedSlugs.has(slug)) slug = `${slug}-${slugify(ref).slice(-6)}`;
    usedSlugs.add(slug);

    rows.push({
      slug,
      ref,
      permit: pick(raw, 'compliance.listingAdvertisementNumber', 'compliance.advertisementLicenseNumber', 'permitNumber', 'permit', 'reraPermit') ?? null,
      title,
      offering,
      price,
      type: typeOf(raw),
      area: place.area,
      building: place.building,
      beds: bedsOf(raw),
      baths: num(pick(raw, 'bathrooms', 'baths')),
      size: sizeOf(raw),
      completion: completionOf(raw),
      furnishing: furnishingOf(raw),
      listedAt: dateOf(raw) ?? old?.listedAt ?? new Date().toISOString().slice(0, 10),
      agent: agentOf(raw) ?? old?.agent ?? null,
      images,
      description,
      features: featuresOf(raw),
      sourceUrl: pick(raw, 'portals.propertyfinder.url', 'url', 'link') ?? '',
      /* The importer's checked map wins; new listings show their building or community */
      map: old?.map ?? { query: place.query, exact: false },
    });
  }

  log('status:', statusCounts);
  if (Object.keys(skipped).length) log('skipped:', skipped);
  if (!rows.length) {
    log('No usable listings — keeping the current listings.json. Run `npm run sync:pf -- --inspect` to check the mapping.');
    return;
  }
  /*
   * A sudden drop to a fraction of the portfolio is far likelier an API or
   * mapping problem than real removals. Listings Property Finder itself marks
   * archived or unpublished are real removals, so only the rest count here.
   */
  const homes = (list) => list.filter((r) => r.type !== 'Commercial').length;
  const lost = raws.length - (skipped['not live'] ?? 0) - rows.length;
  const suspicious = raws.length < previous.length / 4 || lost > rows.length;
  if (previous.length >= 20 && suspicious && !process.env.PF_SYNC_FORCE) {
    log(`${raws.length} listings from Property Finder, ${rows.length} usable (${homes(rows)} homes) against ${previous.length} before — keeping the current listings.json. Set PF_SYNC_FORCE=1 to accept.`);
    return;
  }

  await writeFile(OUT, `${JSON.stringify(rows, null, 1)}\n`);
  const added = rows.filter((r) => !byRef.has(r.ref)).length;
  const removed = previous.filter((p) => !rows.some((r) => r.ref === p.ref)).length;
  log(`wrote ${rows.length} listings (${added} new, ${removed} no longer live)`);
}

main().catch((err) => {
  /* Never fail the build over the sync: the site keeps its last listings */
  log(`sync failed, keeping the current listings: ${err.message}`);
});
