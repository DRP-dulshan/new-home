/**
 * Dubai Land Department sales figures (data/market/dld.json, refreshed by
 * scripts/sync-dld.mjs). Server components only: the summary is large, so
 * pass the small pieces a page needs, never the whole file, to the client.
 */

import dld from '@/data/market/dld.json';
import dldAreas from '@/data/market/dld-areas.json';

export type MonthFigure = { month: string; sales: number; medianPsf: number | null };
export type MarketSummary = {
  sales: number;
  medianPsf: number | null;
  medianPrice: number | null;
  offPlanShare: number | null;
  months: MonthFigure[];
};
export type DldSale = { date: string; beds: number | null; type: string; sqft: number; price: number; offPlan: boolean };
export type BuildingSales = { name: string; area: string; sales: number; medianPsf: number | null; recent: DldSale[] };

type AreaMapping = { areas?: string[]; alsoBuildingsIn?: string[] };

const data = dld as unknown as {
  source: string;
  updatedAt: string;
  from: string;
  to: string;
  dubai: MarketSummary;
  areas: Record<string, MarketSummary>;
  buildings: Record<string, Omit<BuildingSales, 'name'>>;
};

export const dldPeriod = { from: data.from, to: data.to, updatedAt: data.updatedAt };
export const dubaiMarket = data.dubai;

/** Registered sales in one of the site's areas, when DLD has enough of them */
export const areaMarket = (area: string): MarketSummary | null => data.areas[area] ?? null;

/* ---------- Matching a listing's building to DLD's project names ---------- */

/** Words that say nothing about which building it is */
const FILLER = new Set(['the', 'tower', 'towers', 'residence', 'residences', 'building', 'by', 'at', 'of', 'and', 'in', 'dubai', 'phase', 'apartments']);

const ROMAN: Record<string, string> = { i: '1', ii: '2', iii: '3', iv: '4', v: '5' };

const words = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((w) => w && !FILLER.has(w))
    /* "Park Heights II" is building 2 */
    .map((w) => ROMAN[w] ?? w);

const isNumber = (w: string) => /^\d+$/.test(w);

/**
 * How well a DLD project name fits a building name, or 0. Every word of the
 * shorter name must appear in the longer one ("Golden Mile 9" fits "GOLDEN
 * MILE"; "Grand Bleu Tower 1" fits "Grand Bleu Tower interiors by Elie Saab"),
 * and building numbers may not disagree ("Azizi Riviera 19" is not "… 32",
 * "Park Heights 1" is not "Park Heights II").
 */
function fit(building: string[], project: string[]) {
  const named = (ws: string[]) => ws.filter((w) => !isNumber(w) && w.length > 1);
  if (!named(building).length || !named(project).length) return 0;
  const [short, long] = building.length <= project.length ? [building, project] : [project, building];
  if (!named(short).every((w) => long.includes(w))) return 0;
  const nb = building.filter(isNumber);
  const np = project.filter(isNumber);
  if (nb.length && np.length && !nb.some((n) => np.includes(n))) return 0;
  /* At least half the building's own name must be in the project's: "Cheval Maison The Palm" is not "The Palm Tower" */
  const shared = building.filter((w) => project.includes(w)).length;
  if (shared / building.length < 0.5) return 0;
  return shared / Math.max(building.length, project.length);
}

const mappingFor = (area: string): AreaMapping | undefined => (dldAreas as Record<string, AreaMapping>)[area];

/** DLD's recent sales in a listing's building, matched by name within the listing's area */
export function buildingSales(building: string | null, area: string): BuildingSales | null {
  const mapping = mappingFor(area);
  if (!building || !mapping) return null;
  const inArea = new Set([...(mapping.areas ?? []), ...(mapping.alsoBuildingsIn ?? [])]);
  const target = words(building);
  let best: { name: string; score: number; sales: number } | null = null;
  for (const [name, b] of Object.entries(data.buildings)) {
    if (!inArea.has(b.area)) continue;
    const score = fit(target, words(name));
    if (score && (!best || score > best.score || (score === best.score && b.sales > best.sales))) {
      best = { name, score, sales: b.sales };
    }
  }
  return best ? { name: best.name, ...data.buildings[best.name] } : null;
}

/* ---------- Formatting ---------- */

export const formatAed = (n: number) => `AED ${n.toLocaleString('en-US')}`;

/** "Jan 2026" */
export const monthLabel = (month: string, style: 'short' | 'long' = 'short') =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: style, year: 'numeric', timeZone: 'UTC' });

/** "12 Sep 2026" */
export const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Building names in DLD's register are often all capitals */
export const tidyName = (name: string) =>
  name === name.toUpperCase() ? name.toLowerCase().replace(/\b([a-z])/g, (c) => c.toUpperCase()) : name;
