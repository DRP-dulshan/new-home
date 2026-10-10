#!/usr/bin/env node
/**
 * Summarises Dubai Land Department's registered residential sales into
 * data/market/dld.json: price per sq ft and sales by month for each area on
 * the site, and the latest sales in each building. Listing and area pages
 * read it at build time.
 *
 * Source: DLD open data (dubailand.gov.ae → Open Data → Real Estate Data),
 * which serves the current year's transactions without a key.
 *
 *   npm run sync:dld            refresh if the summary is over 20 hours old
 *   DLD_SYNC_FORCE=1            refresh now
 *
 * Runs before every build. A full refresh takes about a minute, so the hourly
 * rebuilds reuse the summary until it is a day old. If DLD fails or returns
 * too little, the current summary stays and the build carries on.
 */

import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

// Node's built-in fetch only honours HTTPS_PROXY when NODE_USE_ENV_PROXY is set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(child.status ?? 1);
}

const ENDPOINT = 'https://gateway.dubailand.gov.ae/open-data/transactions';
const OUT = new URL('../data/market/dld.json', import.meta.url);
const AREAS = new URL('../data/market/dld-areas.json', import.meta.url);
const PAGE = 5000;
const MAX_AGE_HOURS = 20;
const RECENT_PER_BUILDING = 8;
const SQFT_PER_SQM = 10.7639;

const log = (...a) => console.log('[dld-sync]', ...a);

/** Homes only: no offices, shops, hotel rooms or land */
const HOME_TYPES = /^(flat|villa|residential|hotel apartment|residential flats|residential \/ .*|stacked townhouses)$/i;

async function page(from, to, skip) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: 'https://dubailand.gov.ae',
          Referer: 'https://dubailand.gov.ae/',
        },
        body: JSON.stringify({
          P_FROM_DATE: from,
          P_TO_DATE: to,
          P_GROUP_ID: '1', // sales
          P_IS_OFFPLAN: '',
          P_IS_FREE_HOLD: '',
          P_AREA_ID: '',
          P_USAGE_ID: '1', // residential
          P_PROP_TYPE_ID: '',
          P_TAKE: String(PAGE),
          P_SKIP: skip ? String(skip) : '',
          P_SORT: 'TRANSACTION_NUMBER_ASC',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      return body.response?.result ?? [];
    } catch (err) {
      if (attempt >= 4) throw new Error(`${from}–${to} from ${skip}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

/** mm/dd/yyyy, as DLD's API takes dates */
const usDate = (d) =>
  `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}/${d.getUTCFullYear()}`;

/** The last twelve months, a month per request so they run side by side. DLD serves what it has (the current year). */
function months(today) {
  const out = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1));
    const end = i === 0 ? today : new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0));
    out.push([usDate(start), usDate(end)]);
  }
  return out;
}

async function allSales(today) {
  const rows = [];
  await Promise.all(
    months(today).map(async ([from, to]) => {
      for (let skip = 0; ; skip += PAGE) {
        const batch = await page(from, to, skip);
        rows.push(...batch);
        if (batch.length < PAGE) break;
      }
    }),
  );
  return rows;
}

const median = (values) => {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return Math.round(s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2);
};

const bedsOf = (rooms) => {
  if (/studio/i.test(rooms ?? '')) return 0;
  const n = Number.parseInt(rooms ?? '', 10);
  return Number.isFinite(n) ? n : null;
};

/** Sales count, median AED per sq ft and the off-plan share, overall and by month */
function summarise(sales) {
  const byMonth = new Map();
  for (const s of sales) {
    const m = s.date.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m).push(s);
  }
  return {
    sales: sales.length,
    medianPsf: median(sales.map((s) => s.psf)),
    medianPrice: median(sales.map((s) => s.price)),
    offPlanShare: sales.length ? Math.round((sales.filter((s) => s.offPlan).length / sales.length) * 100) / 100 : null,
    months: [...byMonth.keys()].sort().map((month) => {
      const list = byMonth.get(month);
      return { month, sales: list.length, medianPsf: median(list.map((s) => s.psf)) };
    }),
  };
}

async function main() {
  const previous = JSON.parse(await readFile(OUT, 'utf8').catch(() => 'null'));
  const ageHours = previous?.updatedAt ? (Date.now() - Date.parse(previous.updatedAt)) / 36e5 : Infinity;
  if (ageHours < MAX_AGE_HOURS && !process.env.DLD_SYNC_FORCE) {
    log(`summary is ${ageHours.toFixed(1)} hours old — keeping it.`);
    return;
  }

  const today = new Date();
  const started = Date.now();
  const raw = await allSales(today);
  log(`${raw.length} residential sales from DLD in ${Math.round((Date.now() - started) / 1000)}s`);

  const sales = [];
  for (const r of raw) {
    const sqft = Number(r.ACTUAL_AREA ?? r.PROCEDURE_AREA) * SQFT_PER_SQM;
    const price = Number(r.TRANS_VALUE);
    if (!HOME_TYPES.test(r.PROP_SB_TYPE_EN ?? '') || !(sqft > 100) || !(price > 50_000)) continue;
    const psf = price / sqft;
    /* Leave out what is almost certainly a typing error in the register */
    if (psf < 150 || psf > 25_000) continue;
    sales.push({
      date: String(r.INSTANCE_DATE).slice(0, 10),
      area: r.AREA_EN,
      building: r.PROJECT_EN?.trim() || null,
      price,
      sqft: Math.round(sqft),
      psf,
      beds: bedsOf(r.ROOMS_EN),
      offPlan: r.IS_OFFPLAN === 1,
      type: /villa|townhouse/i.test(r.PROP_SB_TYPE_EN) ? 'Villa' : 'Apartment',
    });
  }

  /* A partial answer would replace good figures with thin ones */
  if (sales.length < 1000 || (previous?.sales && sales.length < previous.sales * 0.5)) {
    log(`only ${sales.length} usable sales (${previous?.sales ?? 0} before) — keeping the current summary.`);
    return;
  }

  const mapping = JSON.parse(await readFile(AREAS, 'utf8'));
  const areas = {};
  const buildingAreas = new Set();
  for (const [site, { areas: dld = [], alsoBuildingsIn = [] }] of Object.entries(mapping)) {
    if (site === '_') continue;
    dld.forEach((a) => buildingAreas.add(a));
    alsoBuildingsIn.forEach((a) => buildingAreas.add(a));
    const inArea = sales.filter((s) => dld.includes(s.area));
    if (inArea.length >= 20) areas[site] = summarise(inArea);
  }

  /* The latest sales in each named building, in the areas the site covers */
  const buildings = {};
  for (const s of sales) {
    if (!s.building || !buildingAreas.has(s.area)) continue;
    (buildings[s.building] ??= { area: s.area, list: [] }).list.push(s);
  }
  const buildingSummaries = Object.fromEntries(
    Object.entries(buildings)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, { area, list }]) => {
        list.sort((a, b) => b.date.localeCompare(a.date));
        return [
          name,
          {
            area,
            sales: list.length,
            medianPsf: median(list.map((s) => s.psf)),
            recent: list
              .slice(0, RECENT_PER_BUILDING)
              .map((s) => ({ date: s.date, beds: s.beds, type: s.type, sqft: s.sqft, price: s.price, offPlan: s.offPlan })),
          },
        ];
      }),
  );

  const dates = sales.map((s) => s.date).sort();
  const summary = {
    source: 'Dubai Land Department open data — registered residential sales',
    updatedAt: today.toISOString(),
    from: dates[0],
    to: dates[dates.length - 1],
    sales: sales.length,
    dubai: summarise(sales),
    areas,
    buildings: buildingSummaries,
  };
  await writeFile(OUT, `${JSON.stringify(summary)}\n`);
  log(
    `wrote ${sales.length} sales ${summary.from} → ${summary.to}: ${Object.keys(areas).length} areas, ${Object.keys(buildingSummaries).length} buildings`,
  );
}

main().catch((err) => {
  /* Never fail the build over the sync: the site keeps its last figures */
  log(`sync failed, keeping the current summary: ${err.message}`);
});
