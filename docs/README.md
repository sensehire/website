# SenseHire — Marketing Website

A hyper-futuristic, premium, enterprise-grade marketing website for **SenseHire**, the AI hiring &
interview platform. Built as a **zero-build static site** (semantic HTML + CSS + vanilla JS, no
dependencies) so it can be hosted live by simply serving this folder.

The design language (brand purple `#7338A5` → teal `#04C1B8`, Inter / JetBrains Mono, glassmorphism,
glow accents, dark-first theming) mirrors the live product so the site feels like a natural extension
of the app. No customer data, credentials, internal IDs, logs, or screenshots from the product are used.


cd /Users/sh/workspace/sh/sh-poc/website && python3 -m http.server 8099
http://localhost:8099

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — pain-first hero with **interactive 3-view product preview** (Command Center / Live AI Interview / Analytics), trusted-by, animated stats, **"Sound familiar?" pain section**, before→after solution, feature highlights (clickable cards), **role-based benefit switcher** (4 tabs), how-it-works timeline (animated connector), explainable-AI split, ROI cards + calculator teaser, consolidated "Built for enterprise. Loved by teams." trust section, testimonials, FAQ, urgency-framed final CTA |
| `platform.html` | Platform overview — capability pillars, modules, mid-page demo CTA, role-based workspaces, architecture, before/after ROI |
| `features.html` | Full feature deep-dives (commercial + end-user benefits) and role-based use cases (tabs) + why-choose-us |
| `pricing.html` | Plans with monthly/annual toggle, comparison table, **interactive ROI calculator** (`#calculator` — 3 sliders → hours/cost/FTE saved, illustrative model footnoted), and grouped FAQ (commercial / technical / end-user / security) |
| `security.html` | Security, trust, compliance, responsible AI, and the integrations ecosystem grid |
| `company.html` | About, vision, principles, customer success / testimonials |
| `contact.html` | Book-a-demo / contact-sales lead form with validation, ARIA live-region announcements + success state, pain-based interest qualification |
| `404.html` | Friendly on-brand not-found page |

## v2 interaction layer

- **Interactive hero preview** — tab-switchable dashboard views (reuses the accessible tab engine).
- **Accessible tabs everywhere** — `ui.js` adds `tablist/tab/tabpanel` roles, `aria-controls`/`aria-labelledby`, roving tabindex, and Arrow/Home/End keyboard navigation at runtime.
- **ROI calculator** — pure vanilla JS (`ui.js initCalculator`), model stated on-page, no data leaves the browser.
- **Pointer-tracked card spotlight** — subtle radial highlight following the cursor (hover-capable devices only, disabled under reduced motion).
- **Primary-button shine sweep** — CSS-only micro-interaction.
- **Sticky mobile CTA bar** — appears after ~70vh of scroll, hides at the footer; on every page except `contact.html` (the destination) and `404.html`.
- **Focus-trapped mobile drawer** — `role="dialog"`, Tab-cycle containment, Escape to close, focus returned to the menu button.
- **Stat glow pulse** — counters pulse once on completion (`reveal.js` → `.count-done`).

## Structure

```
website/
├── *.html                     # pages (shared header/footer inline per page → no layout shift)
├── assets/
│   ├── css/  tokens.css        # design tokens — light/dark CSS variables
│   │         base.css          # reset, typography, layout, backgrounds, scroll-reveal
│   │         components.css    # all components (nav, cards, hero, pricing, FAQ, forms, footer…)
│   │         fonts.css         # @font-face — self-hosted Inter + JetBrains Mono (no CDN)
│   ├── js/   theme.js          # theme toggle + persistence (localStorage `sensehire-site-theme`)
│   │         nav.js            # sticky header + mobile drawer + active link
│   │         reveal.js         # IntersectionObserver scroll-reveal + animated counters
│   │         ui.js             # pricing toggle, use-case tabs, grouped FAQ accordion
│   │         form.js           # demo form validation + success state
│   ├── fonts/ *.woff2          # self-hosted Inter + JetBrains Mono webfonts + OFL.txt (SIL OFL)
│   └── img/  logo-mark.svg, favicon.svg, og-image.svg,
│             sensehire-wordmark.svg, sensehire-mark.svg
├── .nojekyll                   # GitHub Pages: serve every file verbatim (harmless elsewhere)
├── robots.txt, sitemap.xml
└── README.md
```

## Run / preview locally

No build step and nothing to install. The commands below are **only** an optional convenience for
previewing over `http://` — they are **not** required to host or run the site:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static file server works (`npx serve`, `php -S`, Nginx, etc.). You can also just double-click
`index.html` to open it from disk — see "Local / offline" below.

## Deploy

**Zero tooling required.** There is no build step, framework, bundler, or runtime — no Node, no
Python, no server-side code. The fonts are bundled locally (Inter + JetBrains Mono, self-hosted under
`assets/fonts/`), so the site makes **no external network calls** and renders identically offline,
air-gapped, or behind a network that blocks the Google Fonts CDN. To go live, upload the contents of
`website/` to any static host:

- **GitHub Pages** — push to a repo and serve from the root. `.nojekyll` is included so every file is
  served verbatim (add a `CNAME` for a custom domain).
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder or connect the repo; no build command needed.
- **S3 / Nginx / Apache / any CDN** — upload the folder and set `index.html` as the default document,
  `404.html` as the error document.
- **Local / offline** — double-click `index.html`. The 7 content pages use relative asset paths, so
  they render straight from `file://`; `404.html` uses root-absolute paths and is designed to be served
  from a domain root (where a host maps it as the error document).

## Themes

- Dark-first; respects the visitor's OS `prefers-color-scheme` on first visit.
- The header toggle switches themes and persists the choice in `localStorage` under
  `sensehire-site-theme`. A tiny inline `<head>` script applies the saved theme **before paint**
  (no flash of the wrong theme).

## Customization notes

- **Brand tokens** live in `assets/css/tokens.css` (single source of truth for colors/spacing/motion).
- **Sign-in link** points to `https://app.sensehire.ai/login` as a placeholder — update the `href`
  in each page's header/footer to your real app URL (or the demo environment) before going live.
- **Canonical / Open Graph / sitemap URLs** use `https://sensehire.ai` as a placeholder domain (in each
  page's `<head>` meta and in `sitemap.xml` / `robots.txt`). These are metadata hints only — they cause
  no runtime network calls — but update them to your real domain before public launch for correct SEO
  and social previews.
- **Stats, logos, testimonials, and pricing are illustrative placeholders** and are labeled as such
  on the pages; replace with verified figures before public launch.
- **The demo form is front-end only** (validation + confirmation state) and does not transmit data.
  Wire the `submit` handler in `assets/js/form.js` to your CRM/endpoint (e.g. HubSpot, Salesforce,
  or a serverless function) to capture real leads.
- Replace `og-image.svg` with a rasterized `og-image.png` (1200×630) if you need maximum social-preview
  compatibility — some crawlers don't render SVG Open Graph images.

## Accessibility & performance

- Semantic landmarks, skip link, visible focus styles, ARIA on the menu/theme toggle/accordion/switch.
- Strong contrast in both themes (token values mirror the app's contrast-tuned overrides).
- `prefers-reduced-motion` disables animations and reveal transitions.
- No external runtime dependencies — fonts are self-hosted (`assets/fonts/`, SIL OFL), so the site
  loads with **zero** third-party network calls.
- Media carry intrinsic `width`/`height` to avoid layout shift.
