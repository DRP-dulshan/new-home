# Partner logos

Drop monochrome **white** SVG logos here, e.g. `emaar.svg`, `nakheel.svg`.

Then reference them in `/data/homepage.ts`:

```ts
export const partners: Partner[] = [
  { name: 'Emaar', logo: '/partners/emaar.svg' },
  ...
];
```

`PartnerMarquee` renders the image when `logo` is set and falls back to the
letter-spaced wordmark when it is not — no component changes needed.
