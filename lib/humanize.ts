/** "palm-jebel-ali" → "Palm Jebel Ali". Used by the demo placeholder routes. */
export function humanize(slug: string) {
  return slug
    .split('-')
    .map((word) =>
      /^(and|the|of|a|in|on|with|for|to)$/i.test(word)
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ')
    .replace(/\b(Drp|Br|Uae|Difc|Jbr|Jvc|H1)\b/gi, (m) => m.toUpperCase());
}
