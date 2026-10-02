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

/** Bands that overlap a [min, max) range read from a search query string. */
export const bandsForRange = (bands: PriceBand[], min?: number, max?: number) =>
  bands.filter((b) => (b.max ?? Infinity) > (min ?? 0) && (b.min ?? 0) < (max ?? Infinity));
