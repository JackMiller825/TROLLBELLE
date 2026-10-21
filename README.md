# TROLLBELLE — screenshot-faithful Next.js site

**Design source:** `../design-reference/REFERENCE_FULLPAGE_1055x1491.png` (also served at `/reference/REFERENCE_FULLPAGE_1055x1491.png`). This site is intentionally a close layout recreation of that image—not an alternative redesign.

## Quick start

1. Install **Node.js 22 LTS**.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add official values. **Do not invent CA, X or Telegram links.**
4. `npm run dev` then open <http://localhost:3000>.
5. Use `START-TROLLBELLE.cmd` for Windows, or run the commands above.
6. `npm run check` and `npm run build` must both pass before deployment.

## Exact reference fidelity

Reference dimensions: **1055 × 1491**. The single-page site is white with black ink only. At 1055px it matches the reference composition: horizontal navigation, large brush-lettered **TROLLBELLE**, Punk Princess on the right, hand-sketched contract box, four live-stats fields, five story doodle cards, four illustrated buy cards, tokenomics/roadmap in two columns, and minimalist footer.

The project includes high-resolution isolated hero artwork and 19 extracted reference assets, including actual illustrated and hand-lettered cards. The reference PNG is **not** being used as an entire site background. Major text, data, buttons and links are real elements.

**Important trade-off:** for maximum visual fidelity, **story cards and buy cards are raster images** that include their handwritten text. This text is not individually editable in the displayed image. Their equivalent content is available as text in `components/Site.tsx` for accessibility; regenerate/recreate individual card art if you change the brand name or wording.

### Visual comparison mode

Open `http://localhost:3000/?compare=1` at **1055px viewport width**. This displays a 40%-opacity reference image above the page as a noninteractive overlay for alignment QA. The overlay is intentionally absent on the normal page.

### Monochrome rules

- All finished artworks are black and white, with transparent alpha when appropriate.
- No red accents, gradients, grey shadows or modern cards.
- Keep rough uneven border art and hand-lettered tone.
- Do not introduce visual sections that aren't in the reference.
- On mobile: hamburger nav, large hero, sideways-scrollable story panels, two-column buy guide, stacked tokenomics and roadmap.

## Settings

Edit `.env.local` and restart the dev server:

- `NEXT_PUBLIC_TOKEN_NAME` / `NEXT_PUBLIC_TOKEN_TICKER`: visible brand name; hero raster title switches to HTML when name differs from Trollbelle.
- `NEXT_PUBLIC_TOKEN_ADDRESS`: only a valid 42-character Ethereum contract enables copy, Uniswap, DexScreener and market feed.
- `NEXT_PUBLIC_X_URL`, `NEXT_PUBLIC_TELEGRAM_URL`: HTTPS external URLs only.
- `NEXT_PUBLIC_TOTAL_SUPPLY`, `NEXT_PUBLIC_BUY_SELL_TAX`, `NEXT_PUBLIC_LAUNCH_TYPE`, `NEXT_PUBLIC_LP_STATUS`, `NEXT_PUBLIC_OWNERSHIP_STATUS`: actual verified disclosures before publication.

**Warning on renaming:** Some screenshot-faithful story and buy-card PNGs still contain the word **TROLLBELLE**. Replace these card assets and the logo/banner when changing to another brand; HTML heading substitution alone is insufficient.

## Market stats

After a valid contract is configured, the page reads DexScreener in the browser about once every 30 seconds. Pair selection still requires the Ethereum chain and the exact token address, then keeps the highest-liquidity match and shows price, market cap, and liquidity. **Holder count remains unavailable** (DexScreener doesn't provide it in the pair response). Before launch, every numerical market metric displays dashes. The read is client-side because the live site is a static GitHub Pages export and cannot host a Next.js API route.

Tokenomics fields are **planned/unverified placeholders**, never claims of on-chain LP burn or renunciation. Verify facts with public explorers and contracts prior to showing stronger wording.

## Structure

- `app/page.tsx`: route.
- `components/Site.tsx`: exactly matched section layout and functional controls.
- `app/globals.css`: layout at reference size and responsive breakpoints.
- `lib/market.ts`: DexScreener pair selection and browser market fetch.
- `lib/site.ts`: token/site config and safe external links.
- `public/images/`: 47 reusable image assets.
- `public/reference/`: uploaded pixel-accurate full-page reference for alignment only.
- `scripts/check-assets.mjs`, `scripts/check-config.mjs`: local smoke checks.
- `HELP.md`: feature map and workflows.
- `docs/ASSETS.md`: file map and image usage.

## Live site

The repository publishes to GitHub Pages on every push to `main`:

https://jackmiller825.github.io/TROLLBELLE/

The Pages workflow builds a static export with `NEXT_PUBLIC_BASE_PATH=/TROLLBELLE`. Local `npm run dev` stays at http://localhost:3000 with no base path. `npm run build` writes the static site to `out/`.

## Verification status

- Image presence and key config checks pass (`npm run check`).
- `npm run build` produces a static export in `out/` with Next.js 15.5.28.
- Market numbers stay blank until a valid Ethereum contract is configured.

## Rights and safety

Trollface has a commercial copyright/licensing history. Verify permissions to use likenesses before commercial deployment. The screenshot is your supplied design source; other projects' assets should not be copied. Do not fabricate token activity, liquidity statuses, addresses or user counts. Memecoins carry high risk and no guaranteed returns.
