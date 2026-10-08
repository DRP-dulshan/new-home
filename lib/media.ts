/** Helper so Unsplash URLs stay readable and consistently sized. */
export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** DRP's own photography library (about-1.jpg … about-14.jpg on the live site). */
export const drpPhoto = (n: number) =>
  `/media/2023/02/about-${n}.jpg`;
