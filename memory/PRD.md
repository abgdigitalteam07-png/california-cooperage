# California Cooperage Static Site — PRD

## Original Problem Statement
Host a static HTML prototype (`california-cooperage-prototype.html` + `cc-assets/`) publicly, as-is (no React/Next.js). Over time the scope grew to include: HubSpot form embed, `<model-viewer>` 3D viewers, real SPA routing with virtual pageviews (GTM/HubSpot), UTM persistence across routes, and full SEO (SSG pre-render, `sitemap.xml`, `robots.txt`, JSON-LD structured data).

## Tech Stack (locked — DO NOT convert to a framework)
- Vanilla HTML/CSS/JS SPA (`/app/frontend/index.html`)
- Node.js SSG pre-render step (`/app/frontend/build-static.js`)
- Custom Node.js server (`/app/frontend/server.js`) using `serve-handler` for case-sensitive 301 redirects
- Backend: FastAPI stub only, exists solely to satisfy platform health checks

## Architecture
```
/app/frontend/
├── index.html            # Master SPA template (client-side routing, styles, JS)
├── build-static.js       # SSG: emits /cr1/, /cr2/, /cr3/, /warranty/, /find-a-dealer/ + sitemap.xml
├── server.js             # 301 uppercase→lowercase + serve-handler
├── serve.json            # SPA fallback + headers
├── package.json          # prestart runs build-static.js
└── cc-assets/            # images, WebP, .glb 3D models
```

## Completed (through 2026-02)
- Static hosting + backend stub for deployment
- Content edits across all pages (dimensions, weights, Balboa Controls copy)
- HubSpot form embed (portalId `358916`) with custom CSS overrides
- `<model-viewer>` 3D viewers with 360° rotation
- Lifestyle image swaps (CR1/CR2/CR3 cards)
- Google Tag Manager (`GTM-NMQSF99X`) + HubSpot tracking
- SPA routing via `history.pushState` with virtual pageviews for GTM/HubSpot
- UTM persistence via `sessionStorage` across route changes
- SSG pre-render: per-route `<title>`, description, canonical, OG/Twitter tags
- Lowercase URL enforcement (`/CR1` → 301 → `/cr1`)
- JSON-LD structured data: Organization, Product, BreadcrumbList, FAQPage
- **[2026-02] Product `offers` block** — added PriceOnRequest semantics (Offer + PriceSpecification + seller) on `/cr1`, `/cr2`, `/cr3`. Fixes Google Rich Results Test validation. Verified by testing agent (23/23 checks pass).
- **[2026-02] Cloudflare Pages `_redirects` file** — build-static.js now emits `/app/frontend/_redirects` (20 rules) so that production Cloudflare Pages CDN can (a) 301 uppercase product slugs to lowercase and (b) explicitly serve `/cr1`, `/cr2`, `/cr3`, `/warranty`, `/find-a-dealer` from their `<slug>/index.html` pre-render (previously fell through to home shell via SPA fallback, hiding the offers block). 301 rules ordered above 200 rewrites per Cloudflare first-match-wins. Verified by testing agent (39/39 checks pass, including regression suite).

## Backlog (P1/P2)
- P1: HubSpot dashboard-side UTM hidden fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) — requires user action in HubSpot UI (agent already writes UTMs into the form via `sessionStorage`)
- P2: Add `aggregateRating` / `review` schema once real customer reviews exist (would replace or complement `PriceOnRequest`)
- P2: Consider real pricing tiers in JSON-LD when dealer network exposes MSRP

## Integrations
- HubSpot Forms (portalId `358916`) — user-side portal config
- Google Tag Manager (`GTM-NMQSF99X`)

## Test Credentials
N/A (public static site, no auth)

## Critical Notes for Future Agents
- **Never** convert to React/Next.js. Everything lives in `index.html` (master) + `build-static.js` (SSG).
- Content or JSON-LD changes MUST be made in `index.html` or `build-static.js`, then `node build-static.js` must run (auto-runs via `prestart`).
- Always verify deploy via `curl <preview>/cr1 | grep '<needle>'` — the previous handoff falsely claimed the `offers` block was live when it wasn't.
