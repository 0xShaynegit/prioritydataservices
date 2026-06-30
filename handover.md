# Priority Data Services — Handover

**Date:** 30 June 2026  
**Status:** Build complete. Polish session done. GitHub pushed. Awaiting Cloudflare Pages deployment.

## What's Done

✓ 12-page website (all in root directory)  
✓ Vanilla HTML/CSS/JS (zero frameworks)  
✓ Desktop sticky nav + mobile hamburger (720px breakpoint)  
✓ Services dropdown on desktop (hover, z-index 300, overflow visible)  
✓ Company name visible on mobile nav bar  
✓ Premium galleries (clip-path comparison sliders, editorial grids)  
✓ 6 before/after comparison sliders on homepage  
✓ All 7 service cards fully clickable with cursor label on desktop  
✓ All images WebP, semantic naming, natural aspect ratios  
✓ Local WOFF2 fonts (Archivo + Instrument Serif)  
✓ SEO complete (titles, descriptions, OG images, schema, internal linking)  
✓ Favicon suite (transparent, iOS icon)  
✓ Animations (RAF ticker, stamp rotation, scroll reveals, stat counters)  
✓ sitemap.xml + robots.txt  
✓ GitHub repo pushed (main branch)  

## Repo

**GitHub:** https://github.com/0xShaynegit/prioritydataservices  
**Branch:** main  
**Last commit:** 382a9ee — Replace switch with dusty-pc before/after

## Files

```
C:\1myguy\projects\PriorityDataServices/
├── index.html                                  (homepage)
├── audits-reports.html
├── data-centre-decontamination.html
├── zinc-whisker-remediation.html
├── post-construction-decontamination.html
├── ceiling-void-cleaning.html
├── technical-restoration.html
├── internal-equipment-decontamination.html
├── electrical-electronic-equipment-cleaning.html
├── office-equipment-cleaning.html
├── commercial-kitchen-remediation.html
├── equipment-and-products.html
├── style.css
├── app.js
├── sitemap.xml
├── robots.txt
├── .gitignore
├── fonts/
│   ├── Archivo-Regular.woff2
│   ├── Archivo-Black.woff2
│   ├── InstrumentSerif-Regular.woff2
│   └── InstrumentSerif-Italic.woff2
└── images/
    ├── favicon.ico, favicon.png, apple-touch-icon.png
    ├── priority-data-services-og-share.webp
    └── [65+ WebP images, semantic named]
```

## Key Patterns

**Sticky Nav**
- Ticker is static (first element in body, scrolls away)
- Masthead: `position: sticky; top: 0; z-index: 90; overflow: visible`
- overflow-x: clip is on `.hero` only — NOT on html or body (kills sticky)
- Ticker must NOT wrap masthead in DOM or overflow:clip breaks sticky

**Dropdown**
- Opens on hover: `.nav-item--dropdown:hover .nav-dropdown__menu`
- `top: 100%` flush (no gap) + `padding-top: 0.75rem` inside menu keeps hover live
- `z-index: 300` to clear masthead (z:90) and mobile nav (z:99)
- Dropdown link hover must explicitly set `color: var(--paper)` — parent `.masthead__nav a:hover` sets navy which bleeds in

**Mobile Navigation**
- Hamburger visible below 720px, company name stays on nav bar
- Drawer: `position: fixed; inset: 0; z-index: 99; padding: 6rem`
- Auto-closes on link tap, body overflow hidden when open

**Ticker**
- RAF loop: 0.18px/ms desktop, 0.12px/ms mobile (detected at 720px)
- Static in DOM (no sticky/fixed), scrolls away naturally
- Must be sibling of masthead, NOT parent — nesting it breaks sticky

**Clickable Service Cards**
- All 7 service cards are `<a>` tags with class `service--link`
- `cursor: none` on hover-capable devices only (`@media (hover: hover)`)
- Cursor label: fixed div, follows mousemove, fades in/out
- `@media (hover: none)` hides cursor label on touch/mobile
- No nested `<a>` inside service titles (invalid HTML)

**Before/After Gallery (homepage)**
- 6 sliders: network switch, workstation, power supply, motherboard, fire damage, dusty PC
- clip-path: `inset(0 X% 0 0)` on before image, JS drag updates X
- Natural image dimensions, no forced aspect-ratio

**CSS**
- OKLCH colour space (custom properties in :root)
- Responsive: 920px, 720px, 560px breakpoints
- `@media (hover: none)` for touch-only states

## Service Card Map (homepage #04 fixed)

| No | Title | Page |
|----|-------|------|
| 01 | Data Centre Decontamination | data-centre-decontamination.html |
| 02 | Zinc Whisker Remediation | zinc-whisker-remediation.html |
| 03 | Post-Construction Decontamination | post-construction-decontamination.html |
| 04 | Electrical & Electronic Equipment | electrical-electronic-equipment-cleaning.html |
| 05 | Ceiling Void Cleaning | ceiling-void-cleaning.html |
| 06 | Technical Restoration | technical-restoration.html |
| 07 | Commercial Kitchen Remediation | commercial-kitchen-remediation.html |

## Next Steps

**Cloudflare Pages Deployment**
1. Create new Pages project in Cloudflare dashboard
2. Point DNS: `www.prioritydataservices.com.au` → Cloudflare
3. Connect GitHub: 0xShaynegit/prioritydataservices
4. Build command: none (static HTML)
5. Deploy & go live

**No build step required.** All assets self-contained in repo root.

## Known Issues

None. Site is production-ready.

## Session Fixes (30 June 2026)

- Service #04 replaced (was duplicate Technical Restoration link)
- Hero title reduced 10% across all breakpoints
- Ticker moved to absolute top of DOM on all 12 pages
- Sticky nav fixed: overflow-x:clip removed from html/body
- Dropdown fixed: gap removed, hover stays live, text visible on hover
- All 7 service cards converted to full-width clickable links
- Cursor label added (desktop only, touch hidden)
- 3 new before/after sliders added to homepage gallery
- Company name visible on mobile nav bar (not in drawer)

## Archive

Everything archived to `_archive/` — nothing deleted. All reversible via git.

---

**Ready to ship. Awaiting Cloudflare Pages deployment.**
