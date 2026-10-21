# TROLLBELLE HELP — keep synchronized with every feature change

## 1. Navigation

The page is seven full-viewport scenes: hero, live stats (`#stats`), story (`#story`), how to buy (`#buy`), troll-nomics (`#tokenomics`), troll-map (`#roadmap`), and a black outro. The floating nav links scroll to stats, story, how to buy, and troll-map. The brand scrolls to the top. On small screens the links sit in a menu. Each scene is one screen tall on desktop, so scrolling moves you into the next scene. The story scene stays pinned while its five doodles slide sideways.

## 2. Hero and branding

The brush wordmark PNG is a crop of the uploaded reference; the standalone hero girl is a reusable transparent PNG. For a different name, configure `NEXT_PUBLIC_TOKEN_NAME` and `NEXT_PUBLIC_TOKEN_TICKER` in `.env.local`, and then re-letter the screenshot-based story/buy images still referencing Trollbelle.

## 3. Contract address

Before a valid CA is configured: visible label reads “dropping at launch...”; copy is disabled; no Uniswap or DexScreener links appear active. After configuring `NEXT_PUBLIC_TOKEN_ADDRESS=0x...` (40 hexadecimal characters), copy uses the clipboard API. If clipboard access is blocked, a visible error appears.

## 4. Stats

The stats scene is its own screen. Markets are fetched in the browser from the DexScreener API, selected by Ethereum chain and token CA; updates ~30 seconds. When a pair is live it shows price, market cap, liquidity, volume, transactions, price change and age. Holder data remains **unavailable**. Prior to launch every number stays a dash and the badge reads “waiting”. There is no server route: GitHub Pages only serves the static export.

## 5. Story

“Who is trollbelle?” fills one screen. On desktop the scene pins and five framed doodles (`who-1.png` … `who-5.png`) slide sideways inside hand-drawn cards as you scroll. On a phone, swipe the row. Captions are on the art; text equivalents live in `components/Site.tsx`.

## 6. Buying guide

One screen: a large title, four framed Ethereum doodles (`buy-1.png` … `buy-4.png`), and a hand-drawn arrow that draws on as the scene arrives. Steps stay MetaMask/Rabby, ETH, Uniswap, and hold & troll. The wallet step’s screen-reader text still mentions writing the recovery phrase on paper.

## 7. Troll-nomics & Troll-map

Each one is its own screen. The black ring is labeled **100% / for the hand**. The rows read supply **1B**, tax **0%**, lp **burnt**, ownership **renounced**. There is no launch row. The map’s only checked boxes are “draw the creature” and “website is up”.

## 8. Social/footer

External links are disabled until valid HTTPS URLs are configured. Footer contains a cryptocurrency risk disclaimer.

## 9. Visual checking

Reference source: `/reference/REFERENCE_FULLPAGE_1055x1491.png`. `/?compare=1` still lays that poster over the page at 40% opacity and freezes motion. The live page is no longer that short poster: it is seven screens, so the overlay will not line up with every scene. Never use the full-page reference image as a production background.

## 10. Development commands

`npm install` → `npm run dev` → `npm run check` → `npm run build`. On Windows, run `START-TROLLBELLE.cmd` after Node.js installation.

Pushing the `main` branch publishes the static site. After the **Publish GitHub Pages** workflow finishes, open https://jackmiller825.github.io/TROLLBELLE/ . The workflow sets the base path to `/TROLLBELLE`, and artwork `src` values include that prefix because the static image tags do not add it on their own. A local build without that variable is served from `/`.

## 11. Known limits

The exported reference exact-card images contain baked text; only other text and token fields are editable. Market holders are blank. Live numbers appear only after a real Ethereum contract is configured and DexScreener has indexed an Ethereum pair. The browser must be allowed to call `api.dexscreener.com`.

## 12. Motion

The page uses the same motion language as a hand-drawn launch site: a draw-on loader, smooth scrolling through seven full screens, a pinned sideways story, a velocity-sensitive marquee, titles that pop letter by letter, a draw-on ring and arrow, scroll-in cards, pointer tilt, a following ink cursor on desktop, click bursts, and a small toast when a launch link is still closed. The nav floats and tucks away while you scroll down. The mascot eases in, floats, leans toward the pointer, and squishes when clicked. The speech bubble cycles lines.

`prefers-reduced-motion` is not used to switch the show off, because some Windows setups report that whenever animation effects are disabled and it would hide the whole motion design. Add `?reduce=1` to turn motion off. Open `/?compare=1` to freeze motion for a still comparison with the reference drawing.
