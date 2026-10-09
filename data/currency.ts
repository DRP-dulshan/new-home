/**
 * Indicative exchange rates for showing prices in a visitor's currency.
 * AED is pegged to the US dollar; EUR and GBP move, so update them now and
 * then. Prices are always agreed in AED.
 */
export const currencies = [
  { code: 'AED', symbol: 'AED', perUnit: 1 },
  { code: 'USD', symbol: 'USD', perUnit: 3.6725 },
  { code: 'EUR', symbol: 'EUR', perUnit: 4.3 },
  { code: 'GBP', symbol: 'GBP', perUnit: 4.95 },
] as const;

export type CurrencyCode = (typeof currencies)[number]['code'];

/** AED amount in the chosen currency, e.g. "AED 2,500,000" or "≈ USD 680,735" */
export function formatIn(aed: number, code: CurrencyCode) {
  const c = currencies.find((x) => x.code === code) ?? currencies[0];
  const value = Math.round(aed / c.perUnit);
  return `${c.code === 'AED' ? '' : '≈ '}${c.symbol} ${value.toLocaleString('en-US')}`;
}
