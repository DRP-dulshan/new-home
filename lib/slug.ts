/**
 * "Dubai Marina" → "dubai-marina", "5+" → "5-plus". Matches the query strings
 * the hero and Section 02 search bars build, so listing pages can read them.
 */
export const toSlug = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
