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
| [`services.ts`](data/services.ts) | Holiday homes (incl. Book a Stay), property management, furnishings, DRP Furnishing (`/drp-furnishing`), fit-out |
| [`developers.ts`](data/developers.ts) | `/off-plan/developers` (Developer Network): developer logos from each developer's own site, in `/public/developers/` |
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

## Real content from the current DRP website

`npm run import:drp` ([`scripts/import-drp-content.mjs`](scripts/import-drp-content.mjs))
reads the public pages and WordPress API of dubairapidproperties.com and writes
[`data/imported/`](data/imported). The data files read those JSON files, so re-running
the script and rebuilding refreshes the site.

| File | What it holds |
| --- | --- |
| `listings.json` | Every DRP Property Finder listing: title, price, specs, gallery, description, features, DLD permit, agent. Commercial units are skipped on the site. |
| `projects.json` | Off-plan projects: starting price, handover year, collections, highlights, about and location copy, gallery. |
| `construction.json` | Construction progress from DRP's status reports (the latest figure per project is shown). |
| `team.json` | Names, roles, bios and office portraits. |

Details the old site does not publish, so the new one infers or leaves out:

- **Location.** Neither the old site nor the listings carry coordinates. A listing is placed by
  the building it names, from the `BUILDINGS` list in the import script (96 of 101 do), then by
  the first community it mentions. A project uses DRP's own Location field, falling back to its
  name and text only when that field just says "Dubai". Add a row to `BUILDINGS` when a new
  building appears.
- **Maps.** Every listing and project page embeds a Google map searched by building (or
  project name) and community, with an *Open in Google Maps* link. Listings without a named
  building say the pin marks the community.
- Unit types and bedrooms are read from each project's text.
- **Developer** is named on 46 of 77 projects; the rest show the area only.
- **Payment plans** are not published, so cards and project pages hide them. The
  homepage Off-Plan tab shows unit types in their place.
- **Furnishing** appears only when the listing text says so.
- Construction updates and sale projects rarely share a name, so only matching rows
  link through to a project page.

## Placeholder content (replace before launch)

| Area | Status |
| --- | --- |
| Client reviews (6) | **Placeholder** — invented quotes and names. Replace with real Google reviews. |
| "Rated 4.9 on Google" | **Placeholder** — confirm the live rating. |
| Area guides (12) | **Placeholder** figures — price per sq ft, yields and drive times. |
| News articles (7) | **Placeholder** — written in DRP's voice, not real posts. |
| Team lines | Each card on `/about#team` opens a profile at `/about/team/[slug]` with the full bio, contact buttons, the person's own listings and an enquiry form. The short card line paraphrases the bio. Delia Cuadrante has no bio on the old site, so her profile shows one line about the office. No direct phone numbers or emails are published, so contact goes through the office. |
| Office hours | **Placeholder** — not published on the current site. |
| Construction tracker hero | **Placeholder** — Unsplash photo. |
| Careers hero | **Placeholder** — Unsplash office photo; replace with the DRP team group photo taken in front of the office. The application form logs its payload (CV name, size and type only); the file itself needs a multipart upload endpoint. |
| Holiday Homes URL | **Placeholder** — `HOLIDAY_HOMES_URL` in `data/external.ts` points at the current DRP site's holiday-home page. The internal `/holiday-homes/*` pages still build but are no longer linked from the site. |
| Holiday homes, packages, fees | **Placeholder** — stays, nightly rates, furnishing package prices and management fees. |
| Mortgage calculator | Real formula; fee and rate defaults are estimates to confirm with DRP's mortgage partners. |
| Market report | **Placeholder** figures; the form promises an email, no PDF is attached yet. |
| Legal pages | **Template wording** — must be reviewed by DRP's legal advisors. |
| Car fleet | One car, the VGV U70 Pro. The hero is DRP's own branded car; the 13 gallery photos in `/public/images/car-fleet/` are **temporary** manufacturer press shots. Replace them with DRP's exterior and interior photos (same file names, or edit `data/carFleet.ts`) and confirm the seat count (5 or 7). |
| Developer logos | 21 of 28 developers have their official logo. Meraas, Azizi, Wasl and Dar Global block automated downloads, and Zoya, Valores and Evera have no official site found, so these 7 show their name until a logo is added in `data/developers.ts`. |
| Partner logos (10) | **Placeholder wordmarks** — see [`/public/partners/README.md`](public/partners/README.md) to swap in SVGs. |
| Photography | Listings, projects, team, fit-out and interior photos are DRP's own; heroes and section images elsewhere are Unsplash stock or DRP office photos. Swap for DRP shoots. |

Real content already in place: contact details, office address, logos, favicon,
the hero Vimeo video, all listings, off-plan projects, construction progress, the team,
and all navigation labels.

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
