/** Phone helpers shared by every form with a Phone / WhatsApp field. */

/** Dial codes offered beside the phone field. UAE first and selected by default. */
export const DIAL_CODES = [
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+974', country: 'Qatar' },
  { code: '+965', country: 'Kuwait' },
  { code: '+973', country: 'Bahrain' },
  { code: '+968', country: 'Oman' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+1', country: 'United States / Canada' },
  { code: '+91', country: 'India' },
  { code: '+92', country: 'Pakistan' },
  { code: '+7', country: 'Russia / Kazakhstan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+41', country: 'Switzerland' },
  { code: '+31', country: 'Netherlands' },
  { code: '+961', country: 'Lebanon' },
  { code: '+20', country: 'Egypt' },
  { code: '+86', country: 'China' },
  { code: '+61', country: 'Australia' },
  { code: '+27', country: 'South Africa' },
];

export const DEFAULT_DIAL = '+971';

/**
 * Returns the number in E.164 form, or null if it does not look valid.
 * A number typed with its own "+" or "00" prefix overrides the dial code.
 */
export function normalisePhone(dial: string, raw: string): string | null {
  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+') || trimmed.startsWith('00')) {
    if (trimmed.startsWith('00')) digits = digits.slice(2);
    return /^\d{8,15}$/.test(digits) ? `+${digits}` : null;
  }

  digits = digits.replace(/^0+/, '');
  if (dial === '+971') {
    if (digits.startsWith('971') && digits.length > 9) digits = digits.slice(3);
    /* Mobiles are 5X XXX XXXX, landlines a one-digit area code plus seven */
    return /^(5\d{8}|[2-9]\d{7})$/.test(digits) ? `+971${digits}` : null;
  }
  return /^\d{6,14}$/.test(digits) ? `${dial}${digits}` : null;
}

/** Validation message for a phone field, or undefined when it is valid. */
export function phoneError(dial: string, raw: string): string | undefined {
  if (!raw.trim()) return 'Please enter a phone or WhatsApp number.';
  if (!normalisePhone(dial, raw))
    return dial === '+971'
      ? 'Please enter a valid UAE number, e.g. 50 123 4567.'
      : 'Please enter a valid phone number.';
  return undefined;
}
