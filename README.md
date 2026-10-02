# Dubai Rapid Properties — Homepage Demo

A client-presentation demo of a new DRP homepage. Next.js 14 (App Router),
TypeScript, Tailwind CSS, Framer Motion, Embla Carousel.

```bash
npm install
npm run dev
```

## Editing content

Every page reads its copy, images and form steps from a typed file in [`/data`](data). No copy
is hard-coded in components. Search `/data` for `DEMO PLACEHOLDER` to find everything that
needs real content before launch.

| File | Drives |
| --- | --- |
| [`homepage.ts`](data/homepage.ts) | Homepage sections, contact details, footer, shared `searchData` |
| [`navigation.ts`](data/navigation.ts) | Header mega-menu and full-screen menu |
| [`properties.ts`](data/properties.ts) | `/properties`, `/properties/[slug]`, homepage Buy / Rent tabs |
| [`offPlan.ts`](data/offPlan.ts) | `/off-plan`, `/off-plan/[slug]`, construction tracker, homepage Off-Plan tab |
| [`areas.ts`](data/areas.ts) | `/areas`, `/areas/[slug]` |
| [`news.ts`](data/news.ts) | `/news`, `/magazine/[slug]`, homepage news carousel |
| [`leadPages.ts`](data/leadPages.ts) | `/list-your-property`, `/property-valuation`, the `LeadForm` config types |
| [`services.ts`](data/services.ts) | Holiday homes (incl. Book a Stay), property management, furnishings, interior design, fit-out |
| [`ecosystem.ts`](data/ecosystem.ts) | `/ecosystem`, mortgage calculator, company formation, partner network, owner portal |
| [`company.ts`](data/company.ts) | `/about` (incl. the `#team` grid), `/careers`, `/contact` |
| [`carFleet.ts`](data/carFleet.ts) | `/ecosystem/car-fleet` |
| [`legal.ts`](data/legal.ts) | `/privacy`, `/terms` |
| [`external.ts`](data/external.ts) | `HOLIDAY_HOMES_URL` — the separate Holiday Homes website the nav, footer and tiles link out to |

**Forms.** Every enquiry form is a `LeadForm` driven by a `steps` array (choice cards, area
search, free text, contact details with optional message and checkbox). Submissions are
logged to the console; wire `submitLead` in `components/LeadForm.tsx` (marked `TODO`) to the
CRM. The contact form, Book a Stay request and owner sign-in carry their own `TODO`s.

**Search.** The hero and Section 02 search bars build query strings that `/properties` and
`/off-plan` read on load (`q` area, `type`, `beds`, `min` / `max`, `handover`), so a homepage
search lands on a filtered list. Both explorers share `components/filters/FilterExplorer.tsx`.

## Placeholder content (replace before launch)

| Area | Status |
| --- | --- |
| Client reviews (6) | **Placeholder** — invented quotes and names. Replace with real Google reviews. |
| "Rated 4.9 on Google" | **Placeholder** — confirm the live rating. |
| Ready listings (16) | The four sale listings marked `REAL` are DRP's own; their descriptions, features and references, and all other listings, are placeholders. |
| Off-plan projects (12) | **Placeholder** — names, prices, handover dates, payment plans, construction progress and launch dates. Replace with the real project database. |
| Area guides (12) | **Placeholder** figures — price per sq ft, yields and drive times. |
| News articles (7) | **Placeholder** — written in DRP's voice, not real posts. |
| Team (8) | **Placeholder** — invented names, roles, lines and Unsplash portraits on `/about#team`. Replace with real DRP team photos from the IT team. |
| Careers hero | **Placeholder** — Unsplash office photo; replace with the DRP team group photo taken in front of the office. The application form logs its payload (CV name, size and type only); the file itself needs a multipart upload endpoint. |
| Holiday Homes URL | **Placeholder** — `HOLIDAY_HOMES_URL` in `data/external.ts` points at the current DRP site's holiday-home page. The internal `/holiday-homes/*` pages still build but are no longer linked from the site. |
| Holiday homes, packages, fees | **Placeholder** — stays, nightly rates, furnishing package prices and management fees. |
| Mortgage calculator | Real formula; fee and rate defaults are estimates to confirm with DRP's mortgage partners. |
| Market report | **Placeholder** figures; the form promises an email, no PDF is attached yet. |
| Legal pages | **Template wording** — must be reviewed by DRP's legal advisors. |
| Car fleet (6 vehicles) | **Placeholder** — Unsplash stock photos that do not match the listed models. Swap for real DRP vehicle photography. |
| Partner logos (10) | **Placeholder wordmarks** — see [`/public/partners/README.md`](public/partners/README.md) to swap in SVGs. |
| Photography | Unsplash stock, plus DRP's own office photos. Swap for DRP shoots. |

Real content already in place: contact details, office address, logos, favicon,
the hero Vimeo video, the four real sale listings, and all navigation labels.

## Structure

```
app/                  every route the site links to, each a full page
components/           Header, Footer, Hero, homepage sections, LeadForm, PageHero
components/sections/  reusable page sections (IntroSplit, FeatureGrid, ProcessSteps,
                      FaqList, StatStrip, ImageText, PackageCards, FormSection, CtaBand)
components/filters/   FilterExplorer — sticky facet bar, chips, mobile sheet, sorting
components/{properties,offplan,news,holiday,ecosystem,company,legal}/
                      page-specific components
components/nav/       DesktopNav (mega menu), MegaPanel, FullMenu
components/ui/        Reveal, ArrowLink, SectionHeading, CountUp, SmartLink, formStyles
data/                 content files (see table above)
lib/                  filters, slug and media helpers
```

Detail pages (`/properties/[slug]`, `/off-plan/[slug]`, `/areas/[slug]`, `/magazine/[slug]`)
prerender one page per item in their data file; unknown slugs return a 404.
