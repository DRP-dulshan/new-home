#!/usr/bin/env node
/**
 * Pulls live content from the current DRP WordPress site into data/imported/.
 *
 *   npm run import:drp
 *
 * Sources (all public):
 *   listings.json      Property Finder listings — /properties/<slug>/ pages (sitemap: drp_pf_property)
 *   projects.json      Off-plan projects — `projects` post type + each /projects/<slug>/ page
 *   construction.json  Construction progress — /construction-updates/ (paginated cards)
 *   team.json          Team — /teams-detail/<slug>/ pages (sitemap: drp_teams)
 *
 * Each listing and project also gets `map: { query, exact }`, checked against
 * Google Maps (see placeOnMap). `npm run import:drp -- --maps-only` re-checks
 * the maps without downloading the content again.
 *
 * News is not imported: the WordPress posts are short 2023 social updates, so
 * /data/news.ts keeps its own articles until DRP publishes new ones.
 *
 * The data files in /data read these JSON files, so re-running the script and
 * rebuilding refreshes the site. Nothing here writes to WordPress.
 */

import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Node's built-in fetch only honours HTTPS_PROXY when NODE_USE_ENV_PROXY is set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(child.status ?? 1);
}

const SITE = 'https://dubairapidproperties.com';
const API = `${SITE}/wp-json/wp/v2`;
const OUT = new URL('../data/imported/', import.meta.url);

/* -------------------------------------------------------------------------- */
/*  HTTP + text helpers                                                       */
/* -------------------------------------------------------------------------- */

async function fetchText(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'DRP-site-import/1.0' } });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return { text: await res.text(), headers: res.headers };
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

/** Some endpoints are prefixed with stray Elementor CSS; parse what follows it. */
function parseJson(text) {
  const start = text.lastIndexOf('</style>');
  return JSON.parse(start >= 0 ? text.slice(start + 8) : text);
}

async function wpAll(path) {
  const items = [];
  for (let page = 1; ; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const { text, headers } = await fetchText(`${API}/${path}${sep}per_page=100&page=${page}`);
    items.push(...parseJson(text));
    if (page >= Number(headers.get('x-wp-totalpages') || 1)) return items;
  }
}

async function pool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const i = next++;
        try {
          results[i] = await fn(items[i], i);
        } catch (err) {
          console.warn(`  ! ${err.message}`);
          results[i] = null;
        }
      }
    }),
  );
  return results;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', middot: '·' };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

const strip = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Visible text lines of an HTML fragment, scripts and styles removed. */
const textLines = (html) =>
  decode(
    html
      .replace(/<(script|style|svg|noscript)[^>]*>[\s\S]*?<\/\1>/g, '')
      .replace(/<[^>]+>/g, '\n'),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const digits = (s) => {
  const n = Number(String(s ?? '').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** "18 120 000 AED" → 18120000, "1.35M" → 1350000 */
function parsePrice(s) {
  if (!s) return null;
  const m = String(s).match(/([\d.,\s]+)\s*(m|million|k)?/i);
  if (!m) return null;
  let n = Number(m[1].replace(/[\s,]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  const unit = (m[2] || '').toLowerCase();
  if (unit.startsWith('m')) n *= 1_000_000;
  if (unit === 'k') n *= 1_000;
  return Math.round(n);
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (_, p, c) => p + c.toUpperCase()).replace(/\bJvc\b/g, 'JVC').replace(/\bJvt\b/g, 'JVT').replace(/\bJlt\b/g, 'JLT').replace(/\bDifc\b/g, 'DIFC');

async function sitemapUrls(name) {
  const { text } = await fetchText(`${SITE}/${name}-sitemap.xml`);
  return [...text.matchAll(/<loc><!\[CDATA\[([^\]]+)\]\]><\/loc>/g)].map((m) => m[1]);
}

/* -------------------------------------------------------------------------- */
/*  Areas — canonical community names                                         */
/* -------------------------------------------------------------------------- */

/* First match wins, title before description. Names match /data/areas.ts where a guide exists. */
const GAZETTEER = [
  ['Palm Jebel Ali', ['palm jebel ali', 'palm jebelali']],
  ['Palm Jumeirah', ['palm jumeirah', 'the palm', 'shoreline', 'golden mile', 'frond', 'fairmont', 'st. regis', 'st regis', 'seven palm', 'palm tower', 'oceana', 'tiara', 'one palm', 'balqis', 'serenia', 'palm views', 'palm']],
  ['Jumeirah Beach Residence', ['jbr', 'jumeirah beach residence', 'the walk', 'sadaf', 'bahar', 'murjan', 'rimal', 'amwaj', 'shams']],
  ['Dubai Harbour', ['emaar beachfront', 'beachfront', 'marina vista', 'sunrise bay', 'beach vista', 'grand bleu', 'dubai harbour', 'seapoint', 'bayview']],
  ['Bluewaters Island', ['bluewaters']],
  ['Dubai Marina', ['dubai marina', 'marina gate', 'cayan', 'princess tower', 'marina promenade', 'silverene', 'marina', 'elite residence', 'torch']],
  ['Jumeirah Lake Towers', ['jlt', 'jumeirah lake towers', 'jumeirah lakes towers']],
  ['Downtown Dubai', ['downtown', 'burj khalifa', 'boulevard', 'opera', 'burj royale', 'act one', 'grande']],
  ['DIFC', ['difc', 'index tower', 'liberty house']],
  ['Business Bay', ['business bay', 'aykon', 'canal', 'peninsula', 'paramount', 'executive towers', 'bay square']],
  ['City Walk', ['city walk']],
  ['Safa Park', ['safa park']],
  ['Dubai Hills Estate', ['dubai hills', 'park heights', 'collective', 'socio']],
  ['Mohammed Bin Rashid City', ['mbr city', 'mohammed bin rashid', 'sobha hartland', 'hartland', 'district one', 'district 11', 'meydan', 'creek vistas', '350 riverside']],
  ['Dubai Creek Harbour', ['creek harbour', 'creek beach', 'dubai creek', 'creek rise', 'creek gate', 'harbour gate']],
  ['Dubai Maritime City', ['maritime city', 'chelsea residences']],
  ['Dubai Islands', ['dubai islands', 'sunset bay']],
  ['JVC', ['jvc', 'jumeirah village circle']],
  ['Jumeirah Village Triangle', ['jvt', 'jumeirah village triangle']],
  ['Arabian Ranches', ['arabian ranches']],
  ['Damac Hills 2', ['damac hills 2', 'damac hills-2', 'akoya']],
  ['Damac Hills', ['damac hills', 'damac hills-1']],
  ['Damac Lagoons', ['damac lagoons', 'lagoons']],
  ['Arjan', ['arjan']],
  ['Al Barari', ['al barari']],
  ['Dubailand', ['majan', 'dubailand', 'dlrc', 'samana']],
  ['International City', ['international city']],
  ['Dubai Science Park', ['science park']],
  ['Villanova', ['villanova']],
  ['Al Furjan', ['al furjan', 'furjan']],
  ['Town Square', ['town square']],
  ['Dubai South', ['dubai south', 'emaar south', 'expo']],
  ['Dubai Sports City', ['sports city']],
  ['Motor City', ['motor city']],
  ['Al Jaddaf', ['jaddaf']],
  ['Dubai Silicon Oasis', ['silicon oasis']],
  ['Discovery Gardens', ['discovery gardens']],
  ['Al Barsha', ['al barsha', 'barsha']],
  ['The Valley', ['the valley']],
  ['Tilal Al Ghaf', ['tilal al ghaf']],
  ['Jumeirah', ['madinat jumeirah', 'jumeirah 1', 'jumeirah 2', 'jumeirah 3', 'la mer', 'jumeirah bay', 'umm suqeim']],
];

function inferArea(...texts) {
  for (const raw of texts) {
    const hay = (raw || '').toLowerCase();
    for (const [name, keys] of GAZETTEER) {
      if (keys.some((k) => new RegExp(`(?<![a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`).test(hay))) return name;
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Buildings — the most precise location a listing names                     */
/* -------------------------------------------------------------------------- */

/*
 * [display name, pattern, community]. `$1` in the name is the first capture.
 * Checked before the community gazetteer: a listing that names its building
 * ("Silverene Tower A, Dubai Marina") is placed by the building, not by the
 * first community word in its text ("…views of Palm Jumeirah").
 */
const BUILDINGS = [
  /* Palm Jumeirah */
  ['Golden Mile $1', /\bgolden mile (\d{1,2})\b/i, 'Palm Jumeirah'],
  ['$1, Shoreline Apartments', /\b(al (?:khus?h?kar|das|dabas|tamr|haseer|hallawi|hamri|msalli|nabat|sarrood|shahla|basri|anbara|habool|sultana|khudrawi)|abu keibal|jash (?:hamad|falqa))\b/i, 'Palm Jumeirah'],
  ['Marina Residence $1', /\bmarina residences? (\d)\b/i, 'Palm Jumeirah'],
  ['Azure Residences', /\bazure(?: residences)?\b/i, 'Palm Jumeirah'],
  ['The Palm Tower', /\bthe palm tower\b/i, 'Palm Jumeirah'],
  ['Serenia Residences', /\bserenia\b/i, 'Palm Jumeirah'],
  ['Oceana', /\boceana\b/i, 'Palm Jumeirah'],
  ['Fairmont Palm Residence $1', /\bfairmont(?: the)?(?: palm)? residences? (north|south)\b/i, 'Palm Jumeirah'],
  ['The 8', /\bthe 8\b/i, 'Palm Jumeirah'],
  ['One Crescent', /\bone crescent\b/i, 'Palm Jumeirah'],
  ['NH Collection Dubai The Palm', /\bnh collection\b/i, 'Palm Jumeirah'],
  ['Cheval Maison The Palm', /\bcheval maison\b/i, 'Palm Jumeirah'],
  ['Seven Palm', /\bseven palm\b/i, 'Palm Jumeirah'],
  ['Tiara Residences', /\btiara\b/i, 'Palm Jumeirah'],
  ['Balqis Residence', /\bbalqis\b/i, 'Palm Jumeirah'],
  /* Palm Jebel Ali */
  ['Frond $1, Palm Jebel Ali', /\bfrond ([a-p])\b[^.]{0,20}palm jebel ali/i, 'Palm Jebel Ali'],
  /* JBR */
  ['Murjan', /(?<!al )\bmurjan\b/i, 'Jumeirah Beach Residence'],
  ['Al Bateen Residences', /\bal bateen\b/i, 'Jumeirah Beach Residence'],
  ['FIVE Luxe', /\bfive luxe\b/i, 'Jumeirah Beach Residence'],
  ['$1', /\b((?:sadaf|bahar|rimal|amwaj|shams) \d)\b/i, 'Jumeirah Beach Residence'],
  /* Dubai Marina */
  ['Al Murjan Tower', /\bal murjan\b/i, 'Dubai Marina'],
  ['The Waves Tower $1', /\b(?:the )?waves tower(?: ([ab])\b)?/i, 'Dubai Marina'],
  ['Silverene Tower $1', /\bsilverene(?: tower)?(?: ([ab])\b)?/i, 'Dubai Marina'],
  ['Sparkle Tower $1', /\bsparkle towers?(?: (\w)\b)?/i, 'Dubai Marina'],
  ['Marina Diamond $1', /\bmarina diamond (\d)\b/i, 'Dubai Marina'],
  ['Princess Tower', /\bprincess tower\b/i, 'Dubai Marina'],
  ['DAMAC Heights', /\bdamac heights\b/i, 'Dubai Marina'],
  ['No. 9', /\bno\.? ?9\b/i, 'Dubai Marina'],
  ['Marina Gate', /\bmarina gate\b/i, 'Dubai Marina'],
  ['Cayan Tower', /\bcayan\b/i, 'Dubai Marina'],
  ['Elite Residence', /\belite residence\b/i, 'Dubai Marina'],
  /* Dubai Harbour / Emaar Beachfront */
  ['DAMAC Bay $1', /\bdamac bay(?: (\d))?\b/i, 'Dubai Harbour'],
  ['Sunrise Bay', /\bsunrise bay\b/i, 'Dubai Harbour'],
  ['$1', /\b(beach vista|marina vista|grand bleu|seapoint|bayview|beach isle|palace beach residence)\b/i, 'Dubai Harbour'],
  /* Business Bay */
  ['Aykon City', /\baykon city\b/i, 'Business Bay'],
  ['Mayfair $1', /\bmayfair (residency|tower)\b/i, 'Business Bay'],
  ['Peninsula', /\bpeninsula\b/i, 'Business Bay'],
  ['East Heights $1', /\beast heights (\d)\b/i, 'Business Bay'],
  ['Canal Heights', /\bcanal heights\b/i, 'Business Bay'],
  ['Binghatti Aquarise', /\baquarise\b/i, 'Business Bay'],
  ['Executive Towers', /\bexecutive towers?\b/i, 'Business Bay'],
  /* DIFC */
  ['DAMAC Park Towers', /\bpark towers\b/i, 'DIFC'],
  ['Burj Daman', /\bburj daman\b/i, 'DIFC'],
  ['Index Tower', /\bindex tower\b/i, 'DIFC'],
  /* Downtown */
  ['Dunya Tower', /\bdunya tower\b/i, 'Downtown Dubai'],
  ['Society House', /\bsociety house\b/i, 'Downtown Dubai'],
  ['Burj Royale', /\bburj royale\b/i, 'Downtown Dubai'],
  /* Mohammed Bin Rashid City */
  ['$1 Riverside Crescent, Sobha Hartland II', /\b(\d{3}) riverside crescent\b/i, 'Mohammed Bin Rashid City'],
  ['Azizi Riviera', /\bazizi riviera\b/i, 'Mohammed Bin Rashid City'],
  /* Dubai Hills Estate */
  ['Park Heights', /\bpark heights\b/i, 'Dubai Hills Estate'],
  /* JVC / JVT / JLT */
  ['Helvetia Residences', /\bhelvetia\b/i, 'JVC'],
  ['Dana Tower', /\bdana tower\b/i, 'JVC'],
  ['Cloud Tower', /\bcloud tower\b/i, 'Jumeirah Village Triangle'],
  ['Seven City', /\bseven city\b/i, 'Jumeirah Lake Towers'],
  ['Saba $1', /\bsaba (\d)\b/i, 'Jumeirah Lake Towers'],
  /* Other communities */
  ['Binghatti Hills', /\bbinghatti hills\b/i, 'Dubai Science Park'],
  ['Binghatti Stars', /\bbinghatti stars\b/i, 'Dubai Silicon Oasis'],
  ['Silicon Gates $1', /\bsilicon gates? (\d)\b/i, 'Dubai Silicon Oasis'],
  ['Farhad Azizi Residence', /\bfarhad azizi\b/i, 'Al Jaddaf'],
  ['Petalz by Danube', /\bpetalz\b/i, 'International City'],
  ['Samana Park Meadows', /\bpark meadows\b/i, 'Dubailand'],
  ['Samana Barari Lagoons', /\bbarari lagoons\b/i, 'Dubailand'],
  ['Seventh Heaven', /\bseventh heaven\b/i, 'Al Barari'],
  ['Mykonos, DAMAC Lagoons', /\bmykonos\b/i, 'Damac Lagoons'],
  ['Lagoon Views $1', /\blagoon views (\d+)\b/i, 'Damac Lagoons'],
  ['ELO $1', /\belo (\d)\b/i, 'Damac Hills 2'],
  ['Violet $1', /\bviolet (\d)\b/i, 'Damac Hills 2'],
  ['Richmond', /\brichmond\b/i, 'Damac Hills'],
  ['Greenview $1', /\bgreenviews? (\d)\b/i, 'Dubai South'],
  ['La Rosa $1', /\bla rosa (\d)\b/i, 'Villanova'],
  ['Holland Gardens', /\bholland gardens\b/i, 'Town Square'],
  ['Garden 2', /\bgardens? 2\b(?=[^.]{0,12}arjan)/i, 'Arjan'],
  ['Madinat Jumeirah Living', /\bmadinat jumeirah living\b/i, 'Jumeirah'],
  ['Chelsea Residences', /\bchelsea\b/i, 'Dubai Maritime City'],
  ['Sunset Bay', /\bsunset bay\b/i, 'Dubai Islands'],
  ['Cotier House', /\bcotier house\b/i, 'Dubai Islands'],
];

/* DRP's sign-off names its own office, not the property */
const SIGN_OFF = /(?:your trusted real estate partner|dubai rapid properties)[^.]{0,40}located in palm jumeirah[^.]*\.?/gi;

/** Earliest building named in the title, then the text: { building, area } or null. */
function inferBuilding(title, text) {
  for (const hay of [title, text.replace(SIGN_OFF, '')]) {
    let best = null;
    for (const [name, re, area] of BUILDINGS) {
      const m = hay.match(re);
      if (m && (!best || m.index < best.index)) {
        const building = name.replace('$1', m[1] ? titleCase(m[1]) : '').replace(/\s+,/, ',').trim();
        best = { index: m.index, building, area };
      }
    }
    if (best) return { building: best.building, area: best.area };
  }
  return null;
}

/* Words too common in listing copy ("marina views", "palm-shaped") to place a property on their own */
const VAGUE = new Set(['palm', 'marina', 'canal', 'lagoons', 'beachfront', 'the walk', 'boulevard', 'grande', 'opera', 'collective', 'expo', 'the palm', 'frond', 'downtown', 'burj khalifa', 'meydan']);

/** The community mentioned first, title before text, ignoring vague words. */
function inferAreaEarliest(title, text) {
  for (const raw of [title, text.replace(SIGN_OFF, '')]) {
    const hay = (raw || '').toLowerCase();
    let best = null;
    for (const [name, keys] of GAZETTEER) {
      for (const k of keys) {
        if (VAGUE.has(k)) continue;
        const m = new RegExp(`(?<![a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`).exec(hay);
        if (m && (!best || m.index < best.index)) best = { index: m.index, name };
      }
    }
    if (best) return best.name;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Developers + unit types read from project text                            */
/* -------------------------------------------------------------------------- */

const DEVELOPERS = [
  ['Emaar', /\bemaar\b/i], ['DAMAC', /\bdamac\b/i], ['Sobha Realty', /\bsobha\b/i], ['Nakheel', /\bnakheel\b/i],
  ['Meraas', /\bmeraas\b/i], ['OMNIYAT', /\bomniyat\b/i], ['Ellington', /\bellington\b/i], ['Binghatti', /\bbinghatti\b/i],
  ['Samana', /\bsamana\b/i], ['Danube', /\bdanube\b/i], ['Azizi', /\bazizi\b/i], ['Select Group', /\bselect group\b/i],
  ['Imtiaz', /\bimtiaz\b/i], ['Aldar', /\baldar\b/i], ['Arada', /\barada\b/i], ['Object 1', /\bobject ?1\b/i],
  ['Reportage', /\breportage\b/i], ['Taraf', /\btaraf\b/i], ['Beyond', /\bbeyond developments?\b/i], ['Nshama', /\bnshama\b/i],
  ['Dubai Properties', /\bdubai properties\b/i], ['Wasl', /\bwasl\b/i], ['Expo City Dubai', /\bexpo city dubai\b/i],
  ['Tiger Group', /\btiger\b/i], ['Leos', /\bleos\b/i], ['Pantheon', /\bpantheon\b/i],
  ['Prestige One', /\bprestige one\b/i], ['Iman Developers', /\biman developers\b/i], ['Aqua Properties', /\baqua properties\b/i],
  ['Peace Homes', /\bpeace homes\b/i], ['Condor', /\bcondor\b/i], ['Vincitore', /\bvincitore\b/i], ['Zoya', /\bzoya\b/i],
  ['Deyaar', /\bdeyaar\b/i], ['Al Habtoor', /\bal habtoor\b/i], ['Majid Al Futtaim', /\bmajid al futtaim\b/i],
  ['Eagle Hills', /\beagle hills\b/i], ['H&H', /\bh&h\b/i], ['Mag', /\bmag (?:property|lifestyle|developments?)\b/i],
  ['SOL Properties', /\bdeveloped by sol\b|\bsol properties\b/i], ['Acube Developments', /\bacube\b/i],
  ['Mr. Eight Development', /\bmr\.? eight\b/i], ['AHS Properties', /\bahs properties\b/i], ['AMIS Development', /\bamis development\b/i],
  ['Dar Global', /\bdar global\b/i], ['Swank Development', /\bswank\b/i], ['Valores', /\bvalores\b/i],
  ['Evera Development', /\bevera\b/i], ['Chaimaa Holding', /\bchaimaa\b/i],
];
const inferDeveloper = (text) => (DEVELOPERS.find(([, re]) => re.test(text)) || [null])[0];

/** "Wadi Al Safa 3 is an emerging area…" → "Wadi Al Safa 3" (short proper-noun lead only). */
function leadingPlace(text) {
  const m = text?.match(/^((?:The )?(?:[A-Z][\w']*|\d+)(?: (?:[A-Z][\w']*|\d+)){0,3})(?:,| is\b)/);
  return m ? m[1] : null;
}

function inferUnits(text) {
  const t = text.toLowerCase();
  const types = [];
  if (/apartment|\bflats?\b|duplex|\bloft|\bstudios?\b/.test(t)) types.push('Apartment');
  if (/penthouse|sky palace|sky villa/.test(t)) types.push('Penthouse');
  if (/townhouse|town house/.test(t)) types.push('Townhouse');
  if (/\bvillas?\b|mansion/.test(t)) types.push('Villa');
  const beds = new Set();
  if (/\bstudios?\b/.test(t)) beds.add(0);
  for (const m of t.matchAll(/(?<![\d.])((?:\d\s*(?:,|&|and|to|-|–)?\s*)+)\s*(?:bed(?:room)?s?|br|bhk)\b/g)) {
    const nums = m[1].match(/\d/g)?.map(Number) ?? [];
    if (/to|-|–/.test(m[1]) && nums.length === 2) for (let n = nums[0]; n <= nums[1]; n++) beds.add(n);
    else nums.forEach((n) => n >= 1 && n <= 9 && beds.add(n));
  }
  /* "Residences" alone says nothing about the unit type; default to apartments */
  return { types: types.length ? types : ['Apartment'], bedrooms: [...beds].sort((a, b) => a - b) };
}

function inferPaymentPlan(text) {
  const m = text.match(/(\d{2})\s*[/:]\s*(\d{2})(?:\s*[/:]\s*(\d{2}))?\s*(?:payment|pp\b|plan)/i) || text.match(/payment plan[^.]{0,40}?(\d{2})\s*[/:]\s*(\d{2})/i);
  if (!m) return null;
  const parts = m.slice(1).filter(Boolean).map(Number);
  return parts.reduce((a, b) => a + b, 0) === 100 ? parts.join('/') : null;
}

/* -------------------------------------------------------------------------- */
/*  1. Listings                                                               */
/* -------------------------------------------------------------------------- */

const BOILERPLATE = /^Discover an Array of Property Options/i;

async function importListings() {
  const urls = (await sitemapUrls('drp_pf_property')).filter((u) => u.includes('/properties/'));
  console.log(`Listings: ${urls.length} pages`);
  const rows = await pool(urls, 8, async (url) => {
    const { text: s } = await fetchText(url);
    if (!s.includes('properties-features')) return null;
    const head = s.match(/<span class="orange-title[^"]*"[^>]*>([\s\S]*?)<\/span>\s*<h2 class="h2[^"]*"[^>]*>([\s\S]*?)<span class="amount[^"]*">([\s\S]*?)<\/span>/);
    if (!head) return null;
    const rawType = strip(head[1]).toLowerCase();
    const title = strip(head[2]);
    const counts = [...s.slice(s.indexOf('properties-features')).slice(0, 3000).matchAll(/<span class="count">([\s\S]*?)<\/span>/g)].map((m) => strip(m[1]));
    const fields = Object.fromEntries([...s.matchAll(/<h4 class="h4">([\s\S]*?)<\/h4>\s*<p class="p">([\s\S]*?)<\/p>/g)].map((m) => [strip(m[1]), strip(m[2])]));
    const full = s.match(/properties__detail__item--full">([\s\S]*?)<\/div>\s*<div class="properties__detail__item properties__detail__item--listing/);
    const description = full
      ? [...full[1].matchAll(/<(?:p|li|h\d)[^>]*>([\s\S]*?)<\/(?:p|li|h\d)>/g)].map((m) => strip(m[1])).filter((p) => p && !BOILERPLATE.test(p))
      : [];
    const facilities = s.match(/<h4 class="h4">Other Facilities<\/h4>([\s\S]*?)<\/div>/);
    const features = facilities ? [...facilities[1].matchAll(/<(?:li|span|p)[^>]*>([\s\S]*?)<\/(?:li|span|p)>/g)].map((m) => strip(m[1])).filter(Boolean) : [];
    const agent = s.match(/agent-card__type">\s*Agent\s*<\/span>\s*<h4 class="h4">([\s\S]*?)<\/h4>/);
    // The page also shows agent photos and similar listings; keep only the
    // gallery, i.e. the listing folder that appears most often.
    const allImages = [...new Set([...s.matchAll(/data-src="(https:\/\/static\.shared\.propertyfinder\.ae\/media\/images\/listing\/[^"]+)"/g)].map((m) => m[1]))];
    const folder = (u) => u.split('/listing/')[1].split('/')[0];
    const tally = {};
    for (const u of allImages) tally[folder(u)] = (tally[folder(u)] ?? 0) + 1;
    const own = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const images = allImages.filter((u) => folder(u) === own);
    const published = (s.match(/"datePublished":"([^"]+)"/) || [])[1] ?? null;
    const slug = url.replace(/\/$/, '').split('/').pop();
    const text = description.join(' ');
    const place = inferBuilding(title, text);
    const beds = /studio/i.test(counts[0] ?? '') ? 0 : digits(counts[0]) ?? (/studio/i.test(title) ? 0 : null);
    const type =
      rawType === 'villa' ? 'Villa'
      : rawType === 'townhouse' ? 'Townhouse'
      : rawType === 'shop' || rawType === 'office' ? 'Commercial'
      : /penthouse/i.test(title) ? 'Penthouse'
      : 'Apartment';
    const furnished = /\bunfurnished\b/i.test(text) ? 'Unfurnished' : /\b(?:fully |semi[- ])?furnished\b/i.test(title + ' ' + text) ? 'Furnished' : null;
    return {
      slug,
      ref: fields['Reference no.'] ?? null,
      permit: fields['Permit Number'] ?? null,
      title,
      offering: (fields.Purpose ?? '').toLowerCase() === 'sale' ? 'buy' : 'rent',
      price: digits(head[3]),
      type,
      area: place?.area ?? inferAreaEarliest(title, text) ?? 'Dubai',
      building: place?.building ?? null,
      beds,
      baths: digits(counts[1]),
      size: digits(counts[2]),
      completion: /off\s*plan/i.test(fields.Completion ?? '') ? 'Off-Plan' : 'Ready',
      furnishing: furnished,
      listedAt: published ? published.slice(0, 10) : null,
      agent: agent ? titleCase(strip(agent[1])) : null,
      images,
      description,
      features,
      sourceUrl: url,
    };
  });
  /* Sorted so re-runs only diff when the content changes */
  return rows.filter((r) => r && r.price && r.images.length).sort((a, b) => a.slug.localeCompare(b.slug));
}

/* -------------------------------------------------------------------------- */
/*  2. Projects + 3. construction progress                                    */
/* -------------------------------------------------------------------------- */

function parseProjectPage(s) {
  const lines = textLines(s);
  const after = (label) => {
    const i = lines.indexOf(label);
    return i >= 0 ? lines[i + 1] : null;
  };
  const between = (start, end) => {
    const i = lines.indexOf(start);
    if (i < 0) return [];
    const j = lines.indexOf(end, i + 1);
    return lines.slice(i + 1, j > i ? j : undefined);
  };
  const handover = after('Handover');
  const highlightsRaw = between('Project Highlights', 'REGISTER YOUR INTEREST');
  const highlights = [];
  for (let i = 0; i + 1 < highlightsRaw.length; i += 2) highlights.push({ title: titleCase(highlightsRaw[i]), text: highlightsRaw[i + 1] });
  const main = s.split('Gallery Preview')[1] ?? '';
  const gallery = [...new Set([...main.slice(0, 60000).matchAll(/src="(https:\/\/dubairapidproperties\.com\/wp-content\/uploads\/[^"]+\.(?:webp|jpe?g|png))"/g)].map((m) => m[1]))]
    .filter((u) => !/-\d+x\d+\.\w+$/.test(u) && !/logo|map/i.test(u));
  return {
    location: after('Location'),
    startingPrice: parsePrice(after('Starting Price')),
    handoverYear: /^\d{4}$/.test(handover ?? '') ? Number(handover) : null,
    highlights,
    about: between('Project general facts', 'Location description and benefits').filter((l) => l.length > 60).slice(0, 6),
    locationText: between('Location description and benefits', 'Gallery Preview').filter((l) => l.length > 60).slice(0, 4),
    gallery,
  };
}

async function importProjects() {
  const [posts, collections, locations, handovers] = await Promise.all([
    wpAll('projects?_fields=id,slug,date,modified,link,title,featured_media,project_collection,project_location,handover,price_range'),
    wpAll('project_collection?_fields=id,name'),
    wpAll('project_location?_fields=id,name'),
    wpAll('handover?_fields=id,name'),
  ]);
  const name = (list) => Object.fromEntries(list.map((t) => [t.id, decode(t.name)]));
  const C = name(collections), L = name(locations), H = name(handovers);
  const constructionId = Number(Object.keys(C).find((id) => /construction/i.test(C[id])));

  /* Featured images, 100 ids per request */
  const mediaIds = [...new Set(posts.map((p) => p.featured_media).filter(Boolean))];
  const media = {};
  for (let i = 0; i < mediaIds.length; i += 100) {
    const { text } = await fetchText(`${API}/media?include=${mediaIds.slice(i, i + 100).join(',')}&per_page=100&_fields=id,source_url`);
    for (const m of parseJson(text)) media[m.id] = m.source_url;
  }

  const forSale = posts.filter((p) => p.project_collection.some((c) => c !== constructionId));
  console.log(`Projects: ${forSale.length} for sale, ${posts.length - forSale.length} construction/other`);

  const projects = (
    await pool(forSale, 8, async (p) => {
      const { text: s } = await fetchText(p.link);
      const page = parseProjectPage(s);
      const name = decode(p.title.rendered);
      const summary = (s.match(/<meta name="description" content="([^"]+)"/) || [])[1];
      const allText = [name, summary, ...page.highlights.map((h) => `${h.title} ${h.text}`), ...page.about].join(' ');
      const units = inferUnits(allText);
      const locName = p.project_location.map((id) => L[id]).find(Boolean) ?? page.location;
      const specific = !!locName && !/^dubai$/i.test(locName.trim());
      return {
        slug: p.slug,
        name,
        collections: p.project_collection.map((id) => C[id]).filter(Boolean),
        /* DRP's own Location field decides; the text is used only when it just says "Dubai" */
        area: specific
          ? inferArea(locName) ?? titleCase(locName)
          : inferArea(name) ??
            inferAreaEarliest(`${name}. ${summary ?? ''}`, page.about.join(' ')) ??
            leadingPlace(page.locationText[0]) ??
            inferAreaEarliest(page.locationText[0] ?? '', '') ??
            'Dubai',
        location: locName ? titleCase(locName) : null,
        developer: inferDeveloper(allText),
        summary: summary ? decode(summary) : page.about[0] ?? '',
        startingPrice: page.startingPrice,
        handoverYear: page.handoverYear ?? (p.handover.map((id) => Number(H[id])).filter(Boolean).sort()[0] || null),
        paymentPlan: inferPaymentPlan(allText),
        propertyTypes: units.types,
        bedrooms: units.bedrooms,
        highlights: page.highlights,
        about: page.about,
        locationText: page.locationText,
        image: media[p.featured_media] ?? page.gallery[0] ?? null,
        gallery: page.gallery,
        launchedAt: p.date.slice(0, 10),
        sourceUrl: p.link,
      };
    })
  )
    .filter((p) => p && p.image)
    /* Some projects were published twice; keep the newest post */
    .sort((a, b) => b.launchedAt.localeCompare(a.launchedAt) || a.slug.localeCompare(b.slug))
    .filter((p, i, all) => all.findIndex((x) => x.name === p.name) === i);

  /* Construction progress cards: base page, then /page/2/, /page/3/ … */
  const construction = [];
  const byId = Object.fromEntries(posts.map((p) => [String(p.id), p]));
  for (let page = 1; page < 30; page++) {
    const url = page === 1 ? `${SITE}/construction-updates/` : `${SITE}/construction-updates/page/${page}/`;
    let s;
    try {
      ({ text: s } = await fetchText(url, 1));
    } catch {
      break;
    }
    const cards = s.split('<div data-elementor-type="loop-item"').slice(1);
    let found = 0;
    for (const card of cards) {
      const id = (card.match(/e-loop-item-(\d+) /) || [])[1];
      const title = (card.match(/<h3 class="elementor-heading-title elementor-size-default">([^<%]+)<\/h3>/) || [])[1];
      const progress = (card.match(/aria-valuenow="([\d.]+)"/) || [])[1];
      if (!id || !title || progress === undefined || construction.some((c) => c.id === id)) continue;
      found++;
      const loc = (card.match(/fa-map-marker-alt"><\/i>\s*<\/span>\s*<span class="elementor-icon-list-text"><span>([^<]+)<\/span>/) || [])[1];
      const post = byId[id];
      construction.push({
        id,
        slug: post?.slug ?? slugify(title),
        name: titleCase(decode(title).trim()),
        area: inferArea(loc, title) ?? (loc ? titleCase(decode(loc)) : 'Dubai'),
        location: loc ? titleCase(decode(loc)) : null,
        progress: Math.round(Number(progress) * 10) / 10,
        image: (post && media[post.featured_media]) || (card.match(/<img[^>]+src="([^"]+)"/) || [])[1] || null,
        updated: (post?.modified ?? '').slice(0, 10) || null,
      });
    }
    if (!found && page > 1) break;
  }
  console.log(`Construction updates: ${construction.length}`);
  return { projects, construction };
}

/* -------------------------------------------------------------------------- */
/*  4. Team                                                                   */
/* -------------------------------------------------------------------------- */

async function importTeam() {
  const urls = await sitemapUrls('drp_teams');
  const rows = await pool(urls, 6, async (url) => {
    const { text: s } = await fetchText(url);
    const name = decode((s.match(/<title>([^<]+)<\/title>/) || [])[1] ?? '').replace(/\s*-\s*DRP\s*$/, '').trim();
    const main = (s.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] ?? s;
    const lines = textLines(main);
    const i = lines.indexOf(name);
    if (!name || i < 0) return null;
    const role = lines[i + 1];
    const bio = [];
    for (const l of lines.slice(i + 2)) {
      if (l === '-->' || /^(get in touch|contact|send|call)/i.test(l)) break;
      bio.push(l);
    }
    const photo = [...main.matchAll(/src="(https:\/\/dubairapidproperties\.com\/wp-content\/uploads\/[^"]+\.(?:jpe?g|png|webp))"/gi)]
      .map((m) => m[1])
      .find((u) => !/drp-(white|black)|aed-symbol|logo/i.test(u));
    return { slug: url.replace(/\/$/, '').split('/').pop(), name, role, bio, photo: photo ?? null, sourceUrl: url };
  });
  return rows.filter((r) => r && r.photo).sort((a, b) => a.slug.localeCompare(b.slug));
}

/* -------------------------------------------------------------------------- */
/*  4. Maps — query Google by building / project, keep only pins that check out */
/* -------------------------------------------------------------------------- */

/* Communities DRP sells in outside Dubai */
const EMIRATE = { 'Al Marjan Island': 'Ras Al Khaimah', 'Ghadeer Al Tayr': 'Abu Dhabi' };
/* How Google writes some communities in its place labels */
const PLACE_ALIASES = {
  'Mohammed Bin Rashid City': ['mbr city', 'mohammed bin rashid', 'meydan'],
  'Palm Jumeirah': ['nakhlat jumeira', 'palm jumeirah'],
  'Jumeirah Beach Residence': ['jumeirah beach residence', 'jbr'],
  'Dubai Islands': ['dubai islands', 'nakhlat deira'],
  JVC: ['jumeirah village circle', 'jvc'],
};
const MAX_KM = 6;

const uae = (area) => `${EMIRATE[area] ?? 'Dubai'}, United Arab Emirates`;

/** { pin: [lat, lng], label } for a single Google result, { multi: true } for several, null for none. */
async function googlePlace(query) {
  const url = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  try {
    const { text } = await fetchText(url);
    if (text.includes('categorical-search-results')) return { multi: true };
    const pin = text.match(/\[(-?\d+\.\d{4,}),(-?\d+\.\d{4,})\]/);
    if (!pin) return null;
    const label = [...text.matchAll(/"([^"\\]{6,160}?)"/g)].map((m) => m[1]).find((n) => / - |, /.test(n) && !n.startsWith('http') && !n.includes('United Arab Emirates')) ?? '';
    return { pin: [Number(pin[1]), Number(pin[2])], label };
  } catch {
    return null;
  }
}

const km = ([a, b], [c, d]) => {
  const r = (x) => (x * Math.PI) / 180;
  const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

/**
 * Adds `map: { query, exact }` to each item. The building (or project) query is
 * kept when Google finds several matching buildings, or one that lies within
 * MAX_KM of the community or is labelled with it. Otherwise the map shows the
 * community and says so.
 */
async function placeOnMap(items, queryFor) {
  const centres = new Map();
  const centre = async (area) => {
    if (!centres.has(area)) centres.set(area, (await googlePlace(`${area}, ${uae(area)}`))?.pin ?? null);
    return centres.get(area);
  };
  let fallbacks = 0;
  await pool(items, 6, async (item) => {
    const area = item.area;
    const community = { query: area === 'Dubai' ? 'Dubai, United Arab Emirates' : `${area}, ${uae(area)}`, exact: false };
    const query = queryFor(item);
    if (!query) return void (item.map = community);
    const found = await googlePlace(query);
    let ok = !!found?.multi;
    if (found?.pin) {
      const c = await centre(area);
      const names = (PLACE_ALIASES[area] ?? [area.toLowerCase()]).concat(area.toLowerCase());
      ok = (c && km(found.pin, c) <= MAX_KM) || names.some((n) => found.label.toLowerCase().includes(n));
    }
    item.map = ok ? { query, exact: true } : community;
    if (!ok) fallbacks++;
  });
  return fallbacks;
}

const placeName = (l) =>
  l.building && !l.building.toLowerCase().includes(l.area.toLowerCase()) ? `${l.building}, ${l.area}` : l.building;
const listingQuery = (l) => (l.building ? `${placeName(l)}, ${uae(l.area)}` : null);
const projectQuery = (p) => `${p.name}, ${p.area === 'Dubai' ? '' : `${p.area}, `}${uae(p.area)}`;

/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(OUT, { recursive: true });
  const write = (file, data) => writeFile(new URL(file, OUT), `${JSON.stringify(data, null, 1)}\n`);
  const read = async (file) => JSON.parse(await readFile(new URL(file, OUT), 'utf8'));

  /* --maps-only re-checks the maps for the content already imported */
  if (process.argv.includes('--maps-only')) {
    const listings = await read('listings.json');
    const projects = await read('projects.json');
    console.log(`Maps: ${await placeOnMap(listings, listingQuery)} listing and ${await placeOnMap(projects, projectQuery)} project maps fall back to the community`);
    await write('listings.json', listings);
    await write('projects.json', projects);
    return;
  }

  const listings = await importListings();
  const listingFallbacks = await placeOnMap(listings, listingQuery);
  await write('listings.json', listings);
  console.log(`  → ${listings.length} listings (${listingFallbacks} maps show the community)`);

  const { projects, construction } = await importProjects();
  const projectFallbacks = await placeOnMap(projects, projectQuery);
  await write('projects.json', projects);
  await write('construction.json', construction);
  console.log(`  → ${projects.length} projects (${projectFallbacks} maps show the community), ${construction.length} construction updates`);

  const team = await importTeam();
  await write('team.json', team);
  console.log(`  → ${team.length} team members`);

  await write('meta.json', { source: SITE, importedAt: new Date().toISOString() });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
