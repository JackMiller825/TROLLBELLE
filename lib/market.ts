export interface MarketSnapshot {
  status: 'live' | 'unlaunched' | 'unavailable';
  lastUpdated?: string;
  priceUsd?: string;
  priceChange?: Partial<Record<'m5' | 'h1' | 'h6' | 'h24', number | null>>;
  marketCap?: number | null;
  fdv?: number | null;
  liquidityUsd?: number | null;
  volume24h?: number | null;
  volume1h?: number | null;
  transactions24h?: { buys: number; sells: number } | null;
  pairCreatedAt?: number | null;
  pairUrl?: string;
  message?: string;
}

export const formatDollar = (v: number | null | undefined) =>
  typeof v === 'number' && Number.isFinite(v)
    ? '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: v < 1 ? 4 : 0, notation: v > 999999 ? 'compact' : 'standard' }).format(v)
    : '—';

export const formatPrice = (s: string | undefined) => {
  if (!s) return '—';
  const n=Number(s);
  if (!Number.isFinite(n) || n <= 0) return '—';
  if (n < 0.000001) return '$' + n.toExponential(3);
  if (n < 0.01) return '$' + n.toFixed(8).replace(/0+$/,'').replace(/\.$/,'');
  return '$'+n.toLocaleString('en-US',{maximumFractionDigits:6});
};
export const formatChange = (v: number | null | undefined) =>
  typeof v === 'number' && Number.isFinite(v) ? `${v > 0 ? '+' : ''}${v.toFixed(2)}%` : '—';

export const formatAge = (ts: number | null | undefined) => {
  if (typeof ts !== 'number' || !Number.isFinite(ts)) return '—';
  const diff=Math.max(0,Date.now()-ts);
  const hours=Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff/60000)}m`;
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours/24)}d`;
};

type DexPair = {
  chainId?: string;
  priceUsd?: string;
  priceChange?: Partial<Record<'m5' | 'h1' | 'h6' | 'h24', number | null>>;
  marketCap?: number | null;
  fdv?: number | null;
  liquidity?: { usd?: number | null };
  volume?: { h24?: number | null; h1?: number | null };
  txns?: { h24?: { buys?: number; sells?: number } };
  pairCreatedAt?: number | null;
  url?: string;
  baseToken?: { address?: string };
  quoteToken?: { address?: string };
};

/** Read the highest-liquidity Ethereum pair from a DexScreener token response. */
export function snapshotFromDex(data: { pairs?: DexPair[] }, address: string): MarketSnapshot {
  const pairs = Array.isArray(data?.pairs) ? data.pairs : [];
  const matched = pairs.filter((p) =>
    String(p.chainId).toLowerCase() === 'ethereum' &&
    [p.baseToken?.address, p.quoteToken?.address].some((v) => String(v || '').toLowerCase() === address.toLowerCase()));
  const best = matched.sort((a, b) => Number(b.liquidity?.usd || 0) - Number(a.liquidity?.usd || 0))[0];
  if (!best) return { status: 'unlaunched', message: 'No Ethereum pair indexed yet' };
  const change = best.priceChange;
  return {
    status: 'live',
    lastUpdated: new Date().toISOString(),
    priceUsd: best.priceUsd,
    priceChange: {
      m5: change?.m5 ?? null,
      h1: change?.h1 ?? null,
      h6: change?.h6 ?? null,
      h24: change?.h24 ?? null,
    },
    marketCap: best.marketCap ?? null,
    fdv: best.fdv ?? null,
    liquidityUsd: best.liquidity?.usd ?? null,
    volume24h: best.volume?.h24 ?? null,
    volume1h: best.volume?.h1 ?? null,
    transactions24h: best.txns?.h24 ? { buys: best.txns.h24.buys || 0, sells: best.txns.h24.sells || 0 } : null,
    pairCreatedAt: best.pairCreatedAt ?? null,
    pairUrl: best.url || undefined,
  };
}

/**
 * Browser-safe market read. GitHub Pages cannot host the Next.js route, so the
 * page calls DexScreener directly and applies the same Ethereum pair rules.
 */
export async function fetchMarket(address: string): Promise<MarketSnapshot> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`DexScreener HTTP ${response.status}`);
    const data = await response.json() as { pairs?: DexPair[] };
    return snapshotFromDex(data, address);
  } catch {
    return { status: 'unavailable', message: 'Market feed temporarily unavailable' };
  } finally {
    clearTimeout(timeout);
  }
}
