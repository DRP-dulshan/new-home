# Dubai Rapid Properties — Homepage Demo

A client-presentation demo of a new DRP homepage. Next.js 14 (App Router),
TypeScript, Tailwind CSS, Framer Motion, Embla Carousel.

```bash
npm install
npm run dev
```

## Editing content

Both search bars — the hero's and Section 02's — read their areas, bedroom counts and price
scales from a single `searchData` export, so they never drift apart.

**The header menu lives in [`/data/navigation.ts`](data/navigation.ts)** as a typed array.
Six top-level items (plus Home away from `/`); everything else lives inside the mega-menu
panels. Each section carries `columns` — one titled group of links per panel column — and an
optional `promo` for the right-hand feature card. `label` is the full title (mobile accordion
heading), `shortLabel` the condensed desktop label. The Header renders entirely from that file.

**All copy, links, images, listings, articles and reviews live in one file:
[`/data/homepage.ts`](data/homepage.ts).** No copy is hard-coded in components.

The two lead-generation pages (`/list-your-property`, `/property-valuation`) read their copy,
hero images and form steps from [`/data/leadPages.ts`](data/leadPages.ts). Each form is a
`steps` array rendered by `components/LeadForm.tsx`, so steps can be added, removed or
reordered there without touching the component.

Search that file for `DEMO PLACEHOLDER` to find everything that needs real
content before launch.

## Placeholder content (replace before launch)

| Area | Status |
| --- | --- |
| Client reviews (6) | **Placeholder** — invented quotes and names. Replace with real Google reviews. |
| "Rated 4.9 on Google" | **Placeholder** — confirm the live rating. |
| Off-plan projects (12) | **Placeholder** — invented project names, prices, handover dates, payment plans and launch dates in [`/data/offPlan.ts`](data/offPlan.ts). They drive `/off-plan` (Latest Launches carousel + filterable grid), the homepage off-plan tab and the `/off-plan/[slug]` stubs. Replace with the real project database. |
| Car fleet (6 vehicles) | **Placeholder** — Unsplash stock photos that do not match the listed models, in [`/data/carFleet.ts`](data/carFleet.ts). Swap for real DRP vehicle photography and confirm models/specs. |
| Rental listings (4) | **Placeholder** — realistic Dubai rents, but invented. Marked `DEMO PLACEHOLDERS` in the data file. |
| News articles (7) | **Placeholder** — realistic titles/excerpts/dates written in DRP's voice, but not real posts. Links point at `/magazine/...`. |
| Partner logos (10) | **Placeholder wordmarks** — see [`/public/partners/README.md`](public/partners/README.md) to swap in SVGs. |
| H1 2026 market report | **Placeholder** — tile links to `/market-report`, no PDF attached. |
| Photography | Unsplash stock, plus DRP's own photos for the specialist tile and contact panel. Swap for DRP shoots. |
| Contact form | Client-side validation and success state only — **no backend**. Wire `onSubmit` in `components/ContactSection.tsx` to a CRM/endpoint. |
| Lead forms (`/list-your-property`, `/property-valuation`) | Multi-step form, client-side validation and success state only — **no backend**. The payload is logged to the console; wire `submitLead` in `components/LeadForm.tsx` (marked `TODO`) to a CRM/endpoint. Hero photos are Unsplash placeholders. |
| Placeholder routes (33) | **Placeholder** — every internal link resolves to a stub page (title, one line, back to home) so nothing 404s in the demo. Replace with the real pages as they are built. |
| Mega-menu promo cards (3) | **Placeholder** — Unsplash imagery and copy for the Off-Plan, Areas and Holiday Homes panels. |
| Hero search | Fully wired: tabs, typeahead, Beds and Price Range all build a real query string and navigate. The destinations (`/properties`, `/off-plan`) are not built in this demo, so they 404. |
| Selected Properties search bar | Now wired too: the third and fourth fields change with the active tab (Bedrooms/Handover, Price Range/Rent (Yearly)/Starting Price) and Search builds the same query string as the hero. |

Real content already in place: contact details, office address, logos, favicon,
the hero Vimeo video, the four ready listings, and all navigation labels.

## Structure

```
app/            layout + homepage, plus a stub page for every menu route
components/     Header, Hero, PartnerMarquee, Solutions, SolutionTile,
                ExploreProperties, PropertyCard, NewsCarousel, TrustSection,
                ReviewsCarousel, ContactSection, Footer, WhatsAppFloat
components/nav/ DesktopNav (mega menu), MegaPanel, MobileMenu (accordions)
components/ui/  Reveal, ArrowLink, SectionHeading, CountUp, SmartLink,
                PlaceholderPage
data/           homepage.ts   ← page content
                navigation.ts ← header menu
```

Every route the site links to now exists as a stub page, so no link 404s during
a presentation. Listing, project, area and article detail pages are served by
dynamic `[slug]` routes that prerender the known demo slugs.
