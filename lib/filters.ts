/**
 * Facet filtering shared by the off-plan and ready-property explorers.
 * A facet is a named group of options plus a test that says whether an item
 * matches any of the selected option ids.
 */

export type FacetOption = { id: string; label: string };

export type Facet<T> = {
  key: string;
  label: string;
  /** Single-choice facets replace the selection instead of adding to it. */
  single?: boolean;
  options: FacetOption[];
  test: (item: T, selected: string[]) => boolean;
  /** Labels ids that are valid but not listed as options, e.g. an exact price range from the search bar. */
  describe?: (id: string) => string | null;
};

export type Selection = Record<string, string[]>;

export const emptySelection = <T,>(facets: Facet<T>[]): Selection =>
  Object.fromEntries(facets.map((f) => [f.key, []]));

export const matchesAll = <T,>(item: T, facets: Facet<T>[], sel: Selection) =>
  facets.every((f) => !sel[f.key]?.length || f.test(item, sel[f.key]));

export const uniqueSorted = (values: string[]) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b));

export const asOptions = (values: string[]): FacetOption[] =>
  values.map((v) => ({ id: v, label: v }));

/** Shared bedroom facet options. Ids match the search bars' `beds` param. */
export const bedroomOptions = [
  { id: 'studio', label: 'Studio', test: (b: number) => b === 0 },
  { id: '1', label: '1 Bed', test: (b: number) => b === 1 },
  { id: '2', label: '2 Bed', test: (b: number) => b === 2 },
  { id: '3', label: '3 Bed', test: (b: number) => b === 3 },
  { id: '4', label: '4 Bed', test: (b: number) => b === 4 },
  { id: '5-plus', label: '5+ Bed', test: (b: number) => b >= 5 },
];

export type PriceBand = { id: string; label: string; min?: number; max?: number };

export const inBand = (price: number, b: PriceBand) =>
  price >= (b.min ?? 0) && price < (b.max ?? Infinity);

/* ---------------------------------------------------------------------------
   Exact price range from the search bars (?min=…&max=…). It travels through
   the price facet as one id, "range-3000000-4000000" ("up" = no maximum), so
   it filters precisely and shows as a single removable chip.
--------------------------------------------------------------------------- */

export const rangeId = (min?: number, max?: number) => `range-${min ?? 0}-${max ?? 'up'}`;

export function parseRange(id: string): { min: number; max: number } | null {
  const m = /^range-(\d+)-(\d+|up)$/.exec(id);
  return m ? { min: Number(m[1]), max: m[2] === 'up' ? Infinity : Number(m[2]) } : null;
}

/** 3_000_000 → "3M", 150_000 → "150K", 1_500_000 → "1.5M" */
export const compactAed = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${+(n / 1_000).toFixed(1)}K` : String(n);

export function rangeLabel(id: string, suffix = '') {
  const r = parseRange(id);
  if (!r) return null;
  const text =
    r.min && r.max !== Infinity
      ? `AED ${compactAed(r.min)} – ${compactAed(r.max)}`
      : r.min
        ? `AED ${compactAed(r.min)}+`
        : r.max !== Infinity
          ? `Up to AED ${compactAed(r.max)}`
          : 'Any price';
  return `${text}${suffix}`;
}

/** Both ends inclusive: "up to 4M" includes a 4M listing. */
export const inRange = (price: number, id: string) => {
  const r = parseRange(id);
  return !!r && price >= r.min && price <= r.max;
};

/** The search bar's ?min / ?max as a price-facet selection. */
export const priceSelection = (min?: number, max?: number) => (min || max ? [rangeId(min, max)] : []);

/** A price facet over preset bands that also accepts an exact range. */
export function priceFacet<T>(label: string, bands: PriceBand[], price: (item: T) => number, suffix = ''): Facet<T> {
  return {
    key: 'price',
    label,
    options: bands.map(({ id, label: l }) => ({ id, label: l })),
    test: (item, sel) =>
      sel.some((id) => {
        const band = bands.find((b) => b.id === id);
        return band ? inBand(price(item), band) : inRange(price(item), id);
      }),
    describe: (id) => rangeLabel(id, suffix),
  };
}
