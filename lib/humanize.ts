/**
 * "palm-jebel-ali" → "Palm Jebel Ali". Used by the demo placeholder routes.
 * Defensive: anything that is not a non-empty string returns "" rather than
 * throwing, so a bad or missing route param can never crash a build.
 */
export function humanize(slug: unknown): string {
  if (typeof slug !== 'string' || slug.trim().length === 0) return '';

  return slug
    .split('-')
    .filter(Boolean)
    .map((word) =>
      /^(and|the|of|a|in|on|with|for|to)$/i.test(word)
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
    .replace(/\b(Drp|Br|Uae|Difc|Jbr|Jvc|H1)\b/gi, (m) => m.toUpperCase());
}
