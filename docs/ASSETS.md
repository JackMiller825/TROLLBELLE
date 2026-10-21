# Assets — exact uploaded-design matching

All assets are in `/public/images` and in `../all-assets`. The assets archive has **47 PNG files**. The `ASSET-MANIFEST.json` lists every filename, dimensions and kind.

## Screenshot-extracted reference assets (20)

- `ref-hero-lettering.png`: exact brush-lettered main title from uploaded design
- `ref-header-crown.png`: header brand crown
- `ref-live-stats-title.png`: hand-lettered live stats ribbon
- `ref-story-title.png`, `ref-buy-title.png`, `ref-tokenomics-title.png`, `ref-roadmap-title.png`: exact section headings
- `who-1.png` through `who-5.png`: borderless story doodles (shown inside CSS hand-drawn card frames on the site)
- `buy-1.png` through `buy-4.png`: borderless how-to-buy doodles (same framed card treatment)
- `ref-story-card-01.png` … `05.png` and `ref-buy-card-01.png` … `04.png`: legacy full polaroid exports (kept in the folder; the live site uses the `who-*` / `buy-*` set)
- `ref-graffiti-crown.png`, `ref-graffiti-star.png`, `ref-graffiti-heart.png`, `ref-footer-heart.png`: black/transparent hand doodles

## High-resolution supplemental assets (27)

Existing Trollbelle graphics include `trollbelle-hero-transparent.png`, `trollbelle-logo-1024.png`, `trollbelle-banner-1500x500.png`, `trollbelle-telegram-1100x520.png`, isolated five `trollbelle-story-0*.png`, four `trollbelle-buy-0*.png`, tokenomics, roadmap, community, loading and six small doodle accessories. Useful for future enhancements without introducing colorful artwork.

## Rules

Keep all foreground colors strictly black or white; transparent backgrounds are permitted. The uploaded reference is separate and is not a reusable page-background asset. Never regenerate whole-screen art and use it as one giant background in place of HTML. Keep mobile aspect ratios and crop safety in mind.

Filenames stay stable. On GitHub Pages the site is served under `/TROLLBELLE`, and Next.js prefixes those same `/images` and `/reference` paths at build time. Do not rename assets to include the repository name.
