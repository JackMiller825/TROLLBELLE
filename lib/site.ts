export const isAddress = (v: string | undefined | null): v is string =>
  Boolean(v && /^0x[a-fA-F0-9]{40}$/.test(v));

const candidate = process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim() || "";

function social(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch { return null; }
}

export const site = {
  name: process.env.NEXT_PUBLIC_TOKEN_NAME?.trim() || 'Trollbelle',
  ticker: process.env.NEXT_PUBLIC_TOKEN_TICKER?.trim() || '$TROLLBELLE',
  tokenAddress: isAddress(candidate) ? candidate : null,
  x: social(process.env.NEXT_PUBLIC_X_URL),
  telegram: social(process.env.NEXT_PUBLIC_TELEGRAM_URL),
  supply: process.env.NEXT_PUBLIC_TOTAL_SUPPLY?.trim() || 'PLANNED: 1,000,000,000',
  tax: process.env.NEXT_PUBLIC_BUY_SELL_TAX?.trim() || 'PLANNED: 0%',
  liquidity: process.env.NEXT_PUBLIC_LP_STATUS?.trim() || 'NOT VERIFIED',
  ownership: process.env.NEXT_PUBLIC_OWNERSHIP_STATUS?.trim() || 'NOT VERIFIED',
  launchType: process.env.NEXT_PUBLIC_LAUNCH_TYPE?.trim() || 'TO BE CONFIRMED',
};

export const uniswapUrl = site.tokenAddress
  ? `https://app.uniswap.org/swap?chain=ethereum&outputCurrency=${encodeURIComponent(site.tokenAddress)}`
  : null;
export const dexscreenerUrl = site.tokenAddress
  ? `https://dexscreener.com/ethereum/${site.tokenAddress}`
  : null;

export const chapters = [
  { title: 'the deleted file', line: 'the internet tried to delete a joke. the joke remembered.', image: '/images/trollbelle-story-01.png', alt: 'Trollbelle sees her face on an old computer' },
  { title: 'oops. she escaped.', line: 'the file had ponytails. and absolutely no manners.', image: '/images/trollbelle-story-02.png', alt: 'Trollbelle climbs out of a broken computer monitor' },
  { title: 'the first prank', line: 'she painted a smile. the whole timeline lost its mind.', image: '/images/trollbelle-story-03.png', alt: 'Trollbelle spray-paints a huge grin on a wall' },
  { title: 'the chart incident', line: 'somebody showed her a chart. she drew a smile on it.', image: '/images/trollbelle-story-04.png', alt: 'Trollbelle sketches a smile onto a crypto chart' },
  { title: 'the last laugh', line: 'they tried to stop her. she asked: problem, darling?', image: '/images/trollbelle-story-05.png', alt: 'Trollbelle sits on a mountain of broken computers' },
];

export const howToBuy = [
  { title: 'get a wallet', desc: 'Install MetaMask or Rabby from its official website. Back up your recovery phrase offline and never share it.', image: '/images/trollbelle-buy-01-wallet.png' },
  { title: 'get some ETH', desc: 'Buy ETH through a reputable exchange, send it to your Ethereum wallet, and leave a little ETH for network gas.', image: '/images/trollbelle-buy-02-eth.png' },
  { title: 'swap on Uniswap', desc: 'Open the official Uniswap app. Check the Ethereum network and verify the exact contract address before swapping.', image: '/images/trollbelle-buy-03-uniswap.png' },
  { title: 'join the joke', desc: 'Keep your wallet safe, consider the risks, and enjoy the memes. Tokens can lose all their value.', image: '/images/trollbelle-buy-04-join.png' },
];
