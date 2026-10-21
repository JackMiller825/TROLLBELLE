'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, Copy, Menu, X } from 'lucide-react';
import { site, uniswapUrl, dexscreenerUrl } from '@/lib/site';
import { fetchMarket, formatChange, formatDollar, formatPrice, type MarketSnapshot } from '@/lib/market';
import { showToast } from '@/lib/toast';
import Motion from '@/components/Motion';

const P = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/`;

const story = [
  { title: 'the deleted file', text: 'She was just a deleted file... or so they thought.', alt: 'A deleted meme file on an old desktop computer' },
  { title: 'out of the monitor', text: 'But Trollbelle glitched out and escaped.', alt: 'Trollbelle peeking out of a broken computer screen' },
  { title: 'on the internet', text: 'Now she roams the internet...', alt: 'Trollbelle grinning while working on a laptop' },
  { title: 'a trail of memes', text: '...leaving a trail of memes, chaos and good vibes.', alt: 'Trollbelle with a spray can and graffiti doodles' },
  { title: 'her playground', text: 'The internet is her playground now.', alt: 'The globe with a doodled crown' },
];

const buySteps = [
  { title: 'get a wallet', text: 'Download MetaMask or Rabby wallet from the official provider. Write the recovery phrase on paper. Do not show it to anyone, not even trollbelle.', file: 'ref-buy-card-01.png', w: 657, h: 648 },
  { title: 'get some ETH', text: 'Buy ETH on an exchange and send it to your Ethereum wallet. Keep ETH for network gas.', file: 'ref-buy-card-02.png', w: 747, h: 645 },
  { title: 'swap on Uniswap', text: 'Open official Uniswap, select Ethereum and verify the exact contract address before swapping.', file: 'ref-buy-card-03.png', w: 756, h: 651 },
  { title: 'hold & troll', text: 'Make memes and enjoy the community. Memecoins can lose all their value.', file: 'ref-buy-card-04.png', w: 720, h: 651 },
];

const phases: Array<{ name: string; items: Array<{ text: string; done?: boolean }> }> = [
  {
    name: 'troll',
    items: [
      { text: 'draw the creature', done: true },
      { text: 'this site goes live', done: true },
      { text: '1,000 holders on the timeline' },
    ],
  },
  {
    name: 'belle',
    items: [
      { text: 'fair launch on ethereum' },
      { text: 'dexscreener paid, trending' },
      { text: 'meme army in every comment' },
    ],
  },
  {
    name: 'la',
    items: [
      { text: 'five deleted files return' },
      { text: 'cex? maybe. memes first.' },
      { text: 'troll belle forever' },
    ],
  },
];

function IconArt({
  file,
  alt = '',
  className = '',
  draggable = false,
}: {
  file: string;
  alt?: string;
  className?: string;
  draggable?: boolean;
}) {
  return (
    <Image
      unoptimized
      draggable={draggable}
      className={className}
      src={P + file}
      alt={alt}
      width={900}
      height={900}
      priority={className.includes('mascot-img')}
    />
  );
}

function FramedArt({
  file,
  alt,
  width,
  height,
  sizes = '(min-width: 861px) 28vw, 75vw',
}: {
  file: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
}) {
  return (
    <div className="card__img">
      <Image unoptimized className="boil" src={P + file} alt={alt} width={width} height={height} sizes={sizes} loading="lazy" />
    </div>
  );
}

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span className="ch" key={`${i}-${ch}`}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </>
  );
}

/** Slice widths (% of wordmark) for ref-hero-lettering.png — sum = 100 */
const HERO_LETTER_WIDTHS = [11, 10, 12, 9, 9, 11, 10, 9, 9, 10];

function HeroTitleLetters({ word, image }: { word: string; image?: boolean }) {
  let offset = 0;
  const letters = Array.from(word.toUpperCase());

  return (
    <span className="hero-title-line">
      {letters.map((ch, i) => {
        const w = image ? (HERO_LETTER_WIDTHS[i] ?? Math.round(100 / letters.length)) : undefined;
        const sliceOffset = offset;
        if (w) offset += w;
        return (
          <span
            className="hero-title-letter ht-l"
            key={`${i}-${ch}`}
            style={
              image && w
                ? ({ '--w': w, '--offset': sliceOffset } as CSSProperties)
                : undefined
            }
            aria-hidden={image ? true : undefined}
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="hero-title-letter__img" src={`${P}ref-hero-lettering.png`} alt="" />
            ) : (
              ch
            )}
          </span>
        );
      })}
    </span>
  );
}

function NavIconX() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

function NavIconTelegram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11 21 4l-3 16-6-5-3 4v-6l9-8" />
    </svg>
  );
}

function NavIconChart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 19 9 12l4 4 8-10" />
      <path d="M16 6h5v5" />
    </svg>
  );
}

function Social({
  href,
  children,
  label,
  soon = 'that link drops at launch',
  className = '',
}: {
  href: string | null;
  children: ReactNode;
  label?: string;
  soon?: string;
  className?: string;
}) {
  return href
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>
    : <button type="button" className={`inactive-link ${className}`.trim()} data-soon={soon} aria-label={label}>{children}</button>;
}

function BuyLink({ className, children }: { className?: string; children: ReactNode }) {
  if (uniswapUrl) {
    return <a className={className} href={uniswapUrl} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <a className={className} href="#buy">{children}</a>;
}

function ageLabel(ts?: number | null) {
  if (typeof ts !== 'number' || !Number.isFinite(ts)) return '—';
  const diff = Math.max(0, Date.now() - ts);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${Math.max(1, Math.floor(diff / 60000))}m`;
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header nav" id="top">
      <nav aria-label="Main navigation" className="top-nav">
        <a className="nav__brand" href="#top" onClick={close} aria-label="Back to top">
          <IconArt file="ref-header-crown.png" className="nav__crown" />
          <span>{site.ticker}</span>
        </a>
        <div className={`nav-center${open ? ' shown' : ''}`}>
          <a href="#stats" onClick={close}>stats</a>
          <a href="#story" onClick={close}>story</a>
          <a href="#buy" onClick={close}>how to buy</a>
          <a href="#roadmap" onClick={close}>troll-map</a>
        </div>
        <div className="nav__tools">
          <Social href={site.x} label="X" soon="X link drops at launch" className="icon-btn"><NavIconX /></Social>
          <Social href={site.telegram} label="Telegram" soon="telegram opens at launch" className="icon-btn"><NavIconTelegram /></Social>
          <Social href={dexscreenerUrl} label="DexScreener" soon="chart drops at launch" className="icon-btn"><NavIconChart /></Social>
          <BuyLink className="btn btn--solid nav__buy">buy {site.ticker.toLowerCase()}</BuyLink>
          <button type="button" className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const [copied, setCopied] = useState(false);
  const [copyFail, setCopyFail] = useState(false);
  const doCopy = useCallback(async () => {
    if (!site.tokenAddress) return;
    try {
      await navigator.clipboard.writeText(site.tokenAddress);
      setCopied(true);
      setCopyFail(false);
      showToast('CA copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyFail(true);
      showToast('Copy failed. Select the address manually.');
    }
  }, []);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-heading">
      <div className="hero__copy">
        <div className="hero__hello">
          <div className="eyes" aria-hidden="true"><span /><span /></div>
          <span className="bubble">psst… hey</span>
          <span className="note note--a" aria-hidden="true">♪</span>
        </div>
        {site.name.toLowerCase() === 'trollbelle' ? (
          <div className="exact-hero-title">
            <HeroTitleLetters word="TROLLBELLE" image />
            <h1 className="sr-only" id="hero-heading">TROLLBELLE</h1>
          </div>
        ) : (
          <h1 id="hero-heading" className="alternate-hero-title">
            <HeroTitleLetters word={site.name} />
          </h1>
        )}
        <svg className="underline" viewBox="0 0 420 18" aria-hidden="true">
          <path d="M4 11 C 70 2, 150 16, 220 8 S 340 16, 416 5" />
        </svg>
        <p className="hero-subtitle">
          the punk troll girl who escaped a deleted file<br /> and turned the internet into her playground.
        </p>
        <div className="contract-box" role="group" aria-label="Official contract address">
          <span>CA:</span>
          <code>{site.tokenAddress || 'dropping at launch...'}</code>
          <button
            type="button"
            aria-disabled={!site.tokenAddress}
            aria-label={site.tokenAddress ? 'Copy contract address' : 'Contract not available yet'}
            onClick={() => {
              if (!site.tokenAddress) { showToast('CA drops at launch'); return; }
              doCopy();
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <em>copy</em>
          </button>
        </div>
        {copyFail && <span role="status" className="copy-error">Copy failed. Please select the address manually.</span>}
        <div className="hero__cta">
          <BuyLink className="btn btn--solid">buy on uniswap</BuyLink>
          <Social href={dexscreenerUrl} soon="chart drops at launch" className="btn">dexscreener</Social>
          <Social href={site.x} soon="X link drops at launch" className="btn">follow on x</Social>
          <Social href={site.telegram} soon="telegram opens at launch" className="btn">telegram</Social>
        </div>
      </div>
      <div className="hero__art">
        <div className="left-doodle" aria-hidden="true">same<br />internet<br />different<br />problems<br /><b>☺</b></div>
        <div className="hero__mascot" id="mascot-parallax">
          <div className="mascot-pivot" id="mascot">
            <IconArt
              className="mascot-img"
              file="trollbelle-hero-transparent.png"
              alt="Trollbelle with her famous grin, twin ponytails, spray paint and huge boots"
            />
          </div>
        </div>
        <div className="sticker sticker--light right-doodle" aria-hidden="true">100%<br />troll</div>
        <div className="sticker sticker--dark" aria-hidden="true">0%<br />chill</div>
        <span className="note note--b" aria-hidden="true">♪</span>
        <span className="note note--c" aria-hidden="true">♪</span>
      </div>
      <a className="scroll-hint" href="#stats">scroll<span aria-hidden="true">↓</span></a>
    </section>
  );
}

function Stats() {
  const [result, setResult] = useState<MarketSnapshot>({ status: 'unlaunched' });
  useEffect(() => {
    if (!site.tokenAddress) return;
    let active = true;
    async function update() {
      const next = await fetchMarket(site.tokenAddress as string);
      if (active) setResult(next);
    }
    update();
    const timer = setInterval(update, 30000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  useEffect(() => {
    if (result.status === 'live') window.dispatchEvent(new Event('troll-live'));
  }, [result.status]);

  const live = result.status === 'live';
  const buys = result.transactions24h?.buys ?? 0;
  const sells = result.transactions24h?.sells ?? 0;
  const total = buys + sells;
  const buyPct = total ? (buys / total) * 100 : 0;
  const pill = !site.tokenAddress ? 'waiting' : result.status === 'live' ? 'live' : result.status === 'unavailable' ? 'unavailable' : 'indexing';
  const dash = '—';
  const changes: Array<['5m' | '1h' | '6h', number | null | undefined]> = [
    ['5m', result.priceChange?.m5],
    ['1h', result.priceChange?.h1],
    ['6h', result.priceChange?.h6],
  ];

  return (
    <section className="section stats" id="stats" aria-labelledby="stats-heading">
      <div className="section__head stats__head">
        <h2 className="section__title" id="stats-heading" aria-label="live troll-stats"><Chars text="live troll-stats" /></h2>
        <span className={`pill${live ? ' is-live' : ''}`}><i />{pill}</span>
      </div>
      <div className="token-id">
        <IconArt file="ref-header-crown.png" className="token-id__mark" alt="" />
        <div>
          <strong>{site.name.toLowerCase()}</strong>
          <span>{site.ticker} · ethereum · uniswap</span>
        </div>
      </div>
      <div className="stats-panel stat-grid">
        <article className="stat tilt">
          <span>price</span>
          <strong>{live ? formatPrice(result.priceUsd) : dash}</strong>
          <small>{live ? `${formatChange(result.priceChange?.h24)} 24h` : `${dash} 24h`}</small>
        </article>
        <article className="stat tilt">
          <span>market cap</span>
          <strong>{live ? formatDollar(result.marketCap) : dash}</strong>
          <small>fdv {live ? formatDollar(result.fdv) : dash}</small>
        </article>
        <article className="stat tilt">
          <span>liquidity</span>
          <strong>{live ? formatDollar(result.liquidityUsd) : dash}</strong>
          <small>on ethereum</small>
        </article>
        <article className="stat tilt">
          <span>volume 24h</span>
          <strong>{live ? formatDollar(result.volume24h) : dash}</strong>
          <small>1h {live ? formatDollar(result.volume1h) : dash}</small>
        </article>
        <article className="stat stat--wide tilt">
          <span>txns 24h</span>
          <div className="tx__track" aria-hidden="true"><span style={{ width: live && total ? `${buyPct}%` : '0%' }} /></div>
          <div className="tx__foot"><span>buys <b>{live ? buys : dash}</b></span><span>sells <b>{live ? sells : dash}</b></span></div>
        </article>
        <article className="stat tilt">
          <span>price change</span>
          <div className="chg-list">
            {changes.map(([label, value]) => (
              <div className="chg" key={label}><span>{label}</span><b>{live ? formatChange(value) : dash}</b></div>
            ))}
          </div>
        </article>
        <article className="stat tilt">
          <span>age</span>
          <strong>{live ? ageLabel(result.pairCreatedAt) : dash}</strong>
          <small>since first troll</small>
        </article>
      </div>
      <p className="stat-note">
        numbers pulled straight from dexscreener · auto-refresh every 30s · {result.lastUpdated ? `updated ${new Date(result.lastUpdated).toLocaleTimeString()}` : 'not updated yet'}
        . holder count is not available from this feed.
      </p>
      <p className="sr-only">
        {live
          ? 'Market metrics are from DexScreener. Holder count is unavailable from this data source.'
          : site.tokenAddress
            ? 'DexScreener market data is not available yet.'
            : 'Contract has not been configured; market values are intentionally empty.'}
      </p>
    </section>
  );
}

function Story() {
  return (
    <section className="screen story" id="story" aria-labelledby="story-heading">
      <div className="story__pin">
        <div className="story__track" id="story-track">
          <article className="panel panel--intro">
            <h2 className="section__title story-title" id="story-heading" aria-label="who is trollbelle?">
              <span className="line"><Chars text="who is" /></span>
              <span className="line"><Chars text="trollbelle?" /></span>
            </h2>
            <p>a short documentary in five doodles.<br />keep scrolling →</p>
          </article>
          {story.map((item, i) => (
            <article className="panel panel--card card tilt" key={item.title}>
              <FramedArt
                file={`ref-story-card-0${i + 1}.png`}
                alt={`${String(i + 1).padStart(2, '0')} — ${item.text}`}
                width={[582, 588, 561, 567, 612][i]}
                height={[756, 762, 762, 759, 762][i]}
              />
              <h3 className="sr-only">{item.title}</h3>
              <p className="sr-only">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Buy() {
  return (
    <section className="section buy" id="buy" aria-labelledby="buy-heading">
      <div className="section__head">
        <div>
          <h2 className="section__title" id="buy-heading" aria-label="how to buy"><Chars text="how to buy" /></h2>
          <p className="section__kicker">it&apos;s simple. stop overthinking.</p>
        </div>
      </div>
      <div className="steps">
        {buySteps.map((step, i) => (
          <article className="step card tilt" key={step.title}>
            <FramedArt
              file={step.file}
              alt={`${i + 1} ${step.title}. ${step.text}`}
              width={step.w}
              height={step.h}
            />
            <h3 className="sr-only">{step.title}</h3>
            <p className="sr-only">{step.text}</p>
          </article>
        ))}
      </div>
      <svg className="buy-arrow boil" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="buy-arrow__path" d="M20 80 C 160 10, 300 110, 480 60 S 800 10, 960 70" />
        <path className="buy-arrow__head" d="M930 50 L962 72 L926 86" />
      </svg>
    </section>
  );
}

function Tokenomics() {
  const rows: Array<[string, string]> = [
    ['supply', '1B'],
    ['tax', '0%'],
    ['lp', 'burnt'],
    ['ownership', 'renounced'],
  ];
  return (
    <section className="section tokenomics" id="tokenomics" aria-labelledby="tokenomics-heading">
      <div className="section__head">
        <h2 className="section__title" id="tokenomics-heading" aria-label="troll-nomics"><Chars text="troll-nomics" /></h2>
      </div>
      <div className="tokenomics__wrap">
        <div className="pie">
          <svg viewBox="0 0 300 300" aria-hidden="true">
            <path
              className="pie__ring boil"
              d="M150 20c74-2 132 56 130 132-2 72-60 128-132 126C76 276 20 220 22 150 24 78 80 22 150 20z"
            />
            <path
              className="pie__fill"
              d="M150 60c50 0 90 40 90 90s-40 90-90 90-90-40-90-90 40-90 90-90z"
              pathLength={1}
            />
          </svg>
          <div className="pie__label">
            <span className="pie__pct-ticket" aria-label="100 percent">
              <span className="pie__pct">0</span><span className="pie__pct-sym">%</span>
            </span>
            <span className="pie__hand">for the hand</span>
          </div>
        </div>
        <ul className="facts">
          {rows.map(([name, value]) => (
            <li className="card tilt" key={name}><span>{name}</span><b>{value}</b></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="section roadmap" id="roadmap" aria-labelledby="roadmap-heading">
      <div className="section__head">
        <h2 className="section__title" id="roadmap-heading" aria-label="troll-map"><Chars text="troll-map" /></h2>
      </div>
      <div className="phases">
        {phases.map((phase) => (
          <article className="phase card tilt" key={phase.name}>
            <h3>
              phase <em>{phase.name}</em>
            </h3>
            <ul>
              {phase.items.map((item) => (
                <li className={item.done ? 'done' : undefined} key={item.text}>
                  {item.text}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Outro() {
  return (
    <div className="outro-shell">
      <footer className="outro" id="outro">
        <div className="outro__big" aria-hidden="true">
          <span>TROLL</span>
          <span>BELLE</span>
        </div>
        <div className="outro__peek">
          <span
            className="outro__peek-face"
            style={{ backgroundImage: `url(${P}trollbelle-hero-transparent.png)` }}
            role="img"
            aria-label="Trollbelle face"
          />
        </div>
        <h2 className="sr-only">Trollbelle</h2>
        <div className="outro__cta">
          <BuyLink className="btn btn--solid outro__buy">buy {site.ticker.toLowerCase()}</BuyLink>
          <div className="outro__row">
            <Social href={site.x} soon="X link drops at launch" className="btn">x / twitter</Social>
            <Social href={site.telegram} soon="telegram opens at launch" className="btn">telegram</Social>
            <Social href={dexscreenerUrl} soon="chart drops at launch" className="btn">dexscreener</Social>
          </div>
        </div>
        <p className="risk-footnote">
          $TROLLBELLE is a memecoin with no intrinsic value or expectation of financial return.
          no team promises, no roadmap guarantees — just a doodle with a grin.
          Crypto assets may lose all value. not financial advice. DYOR.
        </p>
        <p className="outro__copy">© 2026 {site.ticker} · drawn with a mouse, one-handed</p>
      </footer>
    </div>
  );
}

function MarqueeLine() {
  return <>TROLLBELLE <b>✸</b> punk princess <b>✸</b> deleted file <b>✸</b> infinite chaos <b>✸</b> good trolls only <b>✸</b> </>;
}

function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track" id="marquee">
          <div className="marquee__group"><MarqueeLine /></div>
          <div className="marquee__group"><MarqueeLine /></div>
        </div>
      </div>
    </div>
  );
}

export default function Site() {
  const [comparison, setComparison] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setComparison(params.get('compare') === '1');
  }, []);
  return (
    <>
      <Motion />
      <div className="site-shell">
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Stats />
          <Story />
          <Buy />
          <Tokenomics />
          <Roadmap />
          <Outro />
        </main>
      </div>
      {comparison && (
        <div className="comparison-overlay" aria-hidden="true">
          <Image unoptimized src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/reference/REFERENCE_FULLPAGE_1055x1491.png`} alt="" width={1055} height={1491} />
        </div>
      )}
    </>
  );
}
