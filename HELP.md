# TROLLBELLE HELP — keep synchronized with every feature change

## 1. Navigation

The header links scroll within **one page**: Stats (`#stats`), Story (`#story`), How to Buy (`#buy`), and Troll-map (`#roadmap`). The brand and crown scroll to the top. On small screens the links are in a responsive menu.

## 2. Hero and branding

The brush wordmark PNG is a crop of the uploaded reference; the standalone hero girl is a reusable transparent PNG. For a different name, configure `NEXT_PUBLIC_TOKEN_NAME` and `NEXT_PUBLIC_TOKEN_TICKER` in `.env.local`, and then re-letter the screenshot-based story/buy images still referencing Trollbelle.

## 3. Contract address

Before a valid CA is configured: visible label reads “dropping at launch...”; copy is disabled; no Uniswap or DexScreener links appear active. After configuring `NEXT_PUBLIC_TOKEN_ADDRESS=0x...` (40 hexadecimal characters), copy uses the clipboard API. If clipboard access is blocked, a visible error appears.

## 4. Stats

Markets are fetched in the browser from the DexScreener API, selected by Ethereum chain and token CA; updates ~30 seconds. Displays market cap, liquidity and price when live. Holder data remains **unavailable** without a suitable trustworthy data source. Prior to launch all metrics remain dashes. There is no server route: GitHub Pages only serves the static export.

## 5. Story

Five separate portrait reference-image cards rendered in one desktop row and horizontally scrollable on mobile. See `ref-story-card-01.png` ... `05.png`. The text is part of the images; accessible text equivalents are in `components/Site.tsx`.

## 6. Buying guide

Four image cards (`ref-buy-card-01.png` ... `04.png`) preserve the hand-drawn Ethereum wallet, ETH, Uniswap and “Hold & Troll” images. Do not link an arbitrary swap before CA verification. Seed phrase safety guidance is included in accessible descriptions.

## 7. Troll-nomics & Troll-map

The table and roadmap use editable HTML over screenshot-matched headings. Default tokenomics include **PLANNED** supply/tax, but LP and ownership statuses say **NOT VERIFIED** until independently checked. Roadmap text is illustrative, not a promise.

## 8. Social/footer

External links are disabled until valid HTTPS URLs are configured. Footer contains a cryptocurrency risk disclaimer.

## 9. Visual checking

Reference source: `/reference/REFERENCE_FULLPAGE_1055x1491.png`. At 1055px viewport, visit `/?compare=1` and compare underlay/overlay for element size and position. Never use the full-page reference image as a production background.

## 10. Development commands

`npm install` → `npm run dev` → `npm run check` → `npm run build`. On Windows, run `START-TROLLBELLE.cmd` after Node.js installation.

Pushing the `main` branch publishes the static site. After the **Publish GitHub Pages** workflow finishes, open https://jackmiller825.github.io/TROLLBELLE/ . The workflow sets the base path to `/TROLLBELLE`, and artwork `src` values include that prefix because the static image tags do not add it on their own. A local build without that variable is served from `/`.

## 11. Known limits

The exported reference exact-card images contain baked text; only other text and token fields are editable. Market holders are blank. Live numbers appear only after a real Ethereum contract is configured and DexScreener has indexed an Ethereum pair. The browser must be allowed to call `api.dexscreener.com`.
