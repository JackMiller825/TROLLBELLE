'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Check, Copy, Menu, X } from 'lucide-react';
import { site, uniswapUrl, dexscreenerUrl } from '@/lib/site';
import { fetchMarket, formatDollar, formatPrice, type MarketSnapshot } from '@/lib/market';

const P = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/`;
const story = [
  {title:'the deleted file',text:'She was just a deleted file... or so they thought.',alt:'A deleted meme file on an old desktop computer'},
  {title:'out of the monitor',text:'But Trollbelle glitched out and escaped.',alt:'Trollbelle peeking out of a broken computer screen'},
  {title:'on the internet',text:'Now she roams the internet...',alt:'Trollbelle grinning while working on a laptop'},
  {title:'a trail of memes',text:'...leaving a trail of memes, chaos and good vibes.',alt:'Trollbelle with a spray can and graffiti doodles'},
  {title:'her playground',text:'The internet is her playground now.',alt:'The globe with a doodled crown'},
];
const buySteps = [
  {title:'get a wallet',text:'Download MetaMask or Rabby wallet from the official provider. Keep your secret recovery phrase offline.'},
  {title:'get some ETH',text:'Buy ETH on an exchange and send it to your Ethereum wallet. Keep ETH for network gas.'},
  {title:'swap on Uniswap',text:'Open official Uniswap, select Ethereum and verify the exact contract address before swapping.'},
  {title:'hold & troll',text:'You’re in. Make memes and enjoy the community. Memecoins can lose all their value.'},
];

function IconArt({file,alt='',className=''}:{file:string;alt?:string;className?:string}){
 return <Image unoptimized className={className} src={P+file} alt={alt} width={900} height={900}/>;
}
function Social({href,children}:{href:string|null;children:ReactNode}) {
 return href?<a href={href} target="_blank" rel="noopener noreferrer">{children}</a>:<span className="inactive-link" title="Official link will be added when confirmed">{children}</span>;
}
function Stats(){
 const [result,setResult]=useState<MarketSnapshot>({status:'unlaunched'});
 useEffect(()=>{
  if(!site.tokenAddress)return;
  let active=true;
  async function update(){
   const d=await fetchMarket(site.tokenAddress as string);
   if(active)setResult(d);
  }
  update();const timer=setInterval(update,30000);return()=>{active=false;clearInterval(timer)};
 },[]);
 const live=result.status==='live';
 const metrics=[
  {label:'MARKET CAP',value:live?formatDollar(result.marketCap):'--'},
  {label:'HOLDERS',value:'--'},
  {label:'LIQUIDITY',value:live?formatDollar(result.liquidityUsd):'--'},
  {label:'PRICE',value:live?formatPrice(result.priceUsd):'--'},
 ];
 return <section className="stats-section" id="stats" aria-labelledby="stats-heading">
  <h2 className="stats-title" id="stats-heading">{live?<>LIVE STATS <span>(LIVE)</span></>:<IconArt file="ref-live-stats-title.png" alt="LIVE STATS (SOON)"/>}</h2>
  <div className="stats-panel">{metrics.map(m=><div className="metric" key={m.label}><span>{m.label}</span><strong>{m.value}</strong></div>)}</div>
  <p className="sr-only">{live?'Market metrics are from DexScreener. Holder count is unavailable from this data source.':site.tokenAddress?'DexScreener market data is not available yet.':'Contract has not been configured; market values are intentionally empty.'}</p>
 </section>
}
function Header(){
 const [open,setOpen]=useState(false);
 const close=()=>setOpen(false);
 return <header className="header" id="top"><nav aria-label="Main navigation" className="top-nav">
  <a className="crown-home" href="#top" aria-label="Back to top"><IconArt file="ref-header-crown.png"/></a>
  <a className="brand-link" href="#top" onClick={close}>{site.ticker}</a>
  <button type="button" className="menu-button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(o=>!o)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
  <div className={'nav-center '+(open?'shown':'')}>
   <a href="#stats" onClick={close}>stats</a><a href="#story" onClick={close}>story</a><a href="#buy" onClick={close}>how to buy</a><a href="#roadmap" onClick={close}>troll-map</a>
  </div>
  <div className="nav-social"><Social href={site.x}><span className="social-x" aria-label="X">𝕏</span></Social><Social href={site.telegram}><span className="social-telegram" aria-label="Telegram">➤</span></Social><span className="eth-diamond" title="Ethereum">◇</span></div>
 </nav></header>
}
function Hero(){
 const [copied,setCopied]=useState(false);
 const [copyFail,setCopyFail]=useState(false);
 const doCopy=useCallback(async()=>{
  if(!site.tokenAddress)return;
  try{await navigator.clipboard.writeText(site.tokenAddress);setCopied(true);setCopyFail(false);setTimeout(()=>setCopied(false),1500)}
  catch{setCopyFail(true)}
 },[]);
 return <section className="hero" aria-labelledby="hero-heading">
  <div className="left-doodle" aria-hidden>same<br/>internet<br/>different<br/>problems<br/><b>☺</b></div>
  {site.name.toLowerCase()==='trollbelle'?<div className="exact-hero-title"><IconArt file="ref-hero-lettering.png" alt=""/><h1 className="sr-only" id="hero-heading">TROLLBELLE</h1></div>:<h1 id="hero-heading" className="alternate-hero-title">{site.name.toUpperCase()}</h1>}
  <IconArt className="hero-crown" file="ref-graffiti-crown.png"/>
  <div className="hero-subtitle">the punk troll girl who escaped a deleted file<br/>and turned the internet into her playground.</div>
  <div className="contract-box" role="group" aria-label="Official contract address">
   <span>CA:</span><code>{site.tokenAddress||'dropping at launch...'}</code><button type="button" disabled={!site.tokenAddress} onClick={doCopy} aria-label={site.tokenAddress?'Copy contract address':'Contract not available yet'}>{copied?<Check size={23}/>:<Copy size={23}/>}</button>
  </div>
  {copyFail&&<span role="status" className="copy-error">Copy failed. Please select the address manually.</span>}
  <div className="hero-character"><IconArt file="trollbelle-hero-transparent.png" alt="Trollbelle with her famous grin, twin ponytails, spray paint and huge boots"/></div>
  <div className="right-doodle" aria-hidden>troll<br/>everything<br/>belongs<br/>to everyone<br/>♡</div>
  <IconArt className="hero-star" file="ref-graffiti-star.png"/>
  <Stats/>
 </section>
}
function Story(){return <section className="story-section" id="story" aria-labelledby="story-heading">
 <div className="section-heading story-heading"><IconArt file="ref-story-title.png" className="ribbon story-ribbon"/><h2 className="sr-only" id="story-heading">Story</h2><p>deleted file.<br/>infinite chaos.</p><span aria-hidden className="understroke">──────</span></div>
 <div className="story-grid">{story.map((s,i)=><article className="card-frame" key={s.title}><Image unoptimized src={`${P}ref-story-card-${String(i+1).padStart(2,'0')}.png`} alt={`${String(i+1).padStart(2,'0')} — ${s.text}`} width={600} height={800} /><div className="sr-only"><h3>{s.title}</h3><p>{s.text}</p></div></article>)}</div>
 </section>}
function Buy(){return <section className="buy-section" id="buy" aria-labelledby="buy-heading">
 <div className="section-heading buy-heading"><IconArt file="ref-buy-title.png" className="ribbon buy-ribbon"/><h2 className="sr-only" id="buy-heading">How to buy</h2><span className="scribble-star" aria-hidden>✱</span><p>it&apos;s simple.<br/>stop overthinking. ☺</p></div>
 <div className="buy-grid">{buySteps.map((s,i)=><article key={s.title} className="card-frame"><Image unoptimized src={`${P}ref-buy-card-${String(i+1).padStart(2,'0')}.png`} alt={`${i+1} ${s.title}. ${s.text}`} width={660} height={560}/><div className="sr-only"><h3>{s.title}</h3><p>{s.text}</p></div></article>)}</div>
 <div className="buy-links"><Social href={uniswapUrl}>↗ {uniswapUrl?'OPEN UNISWAP':'UNISWAP LINK AFTER LAUNCH'}</Social><span>double-check the CA. never share your seed phrase.</span></div>
 </section>}
function TokenomicsRoadmap(){
 const rows=[['TOTAL SUPPLY',site.supply],['BUY/SELL TAX',site.tax],['LAUNCH TYPE',site.launchType],['LP',site.liquidity],['OWNERSHIP',site.ownership]];
 return <div className="lower-grid">
  <section className="tokenomics-section" id="tokenomics" aria-labelledby="tokenomics-heading"><div className="lower-title"><IconArt file="ref-tokenomics-title.png"/><h2 className="sr-only" id="tokenomics-heading">Troll-nomics</h2><span aria-hidden>♡</span></div><div className="token-table">{rows.map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</div><p className="disclosure">* Pending on-chain verification until launch.</p></section>
  <section className="roadmap-section" id="roadmap" aria-labelledby="roadmap-heading"><div className="lower-title"><IconArt file="ref-roadmap-title.png"/><h2 className="sr-only" id="roadmap-heading">Troll-map</h2><span aria-hidden>✱</span></div>
   <div className="road-dots" aria-hidden><span>1</span><span className="dash"></span><span>2</span><span className="dash"></span><span>3</span></div>
   <div className="road-cols"><div><div className="road-emoji" aria-hidden>♧</div><h3>PHASE 1<br/>LAUNCH</h3><p>• website & memes<br/>• transparent token info<br/>• community begins</p></div><div><div className="road-emoji" aria-hidden>▥</div><h3>PHASE 2<br/>EXPAND</h3><p>• more memes<br/>• community events<br/>• organic growth</p></div><div><div className="road-emoji" aria-hidden>◎</div><h3>PHASE 3<br/>MORE CHAOS</h3><p>• new stories<br/>• collaborations<br/>• fun experiments</p></div></div>
  </section>
 </div>;
}
function Footer(){return <footer className="footer"><div className="footer-links"><a href="#top" className="footer-crown">♛</a><Social href={site.x}><span className="footer-symbol">𝕏</span> TWITTER/X</Social><Social href={site.telegram}><span className="footer-symbol">➤</span> TELEGRAM</Social><span><span className="footer-symbol">◇</span> ETHEREUM</span><Social href={dexscreenerUrl}><span className="footer-symbol">◈</span> DEXSCREENER</Social><span className="good-trolls">GOOD<br/>TROLLS<br/>ONLY ♡</span></div><p className="risk-footnote">$TROLLBELLE is a fictional meme brand. No returns are promised. Crypto assets may lose all value. Contract, liquidity and ownership status must be independently verified.</p></footer>}
export default function Site(){
 const [comparison,setComparison]=useState(false);
 useEffect(()=>{const params=new URLSearchParams(window.location.search);setComparison(params.get('compare')==='1')},[]);
 return <><div className="site-shell"><Header/><main><Hero/><Story/><Buy/><TokenomicsRoadmap/></main><Footer/></div>{comparison&&<div className="comparison-overlay" aria-hidden><Image unoptimized src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/reference/REFERENCE_FULLPAGE_1055x1491.png`} alt="" width={1055} height={1491}/></div>}</>;
}
