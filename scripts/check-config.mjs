import fs from 'node:fs';
const site=fs.readFileSync('lib/site.ts','utf8');
const api=fs.readFileSync('lib/market.ts','utf8');
const ui=fs.readFileSync('components/Site.tsx','utf8');
const rules=[
 ['Ethereum contract validation',/isAddress\(candidate\)/.test(site)],
 ['No live swap link before CA',/site\.tokenAddress\s*\?/.test(site)],
 ['DexScreener Ethereum pair selection',/chainId\).*ethereum/.test(api)],
 ['Wallet-secret warning',/recovery phrase/.test(ui)],
 ['Contract copy',/navigator\.clipboard\.writeText/.test(ui)],
 ['Five matching story cards',/ref-story-card-/.test(ui)],
 ['Four matching how-to-buy cards',/ref-buy-card-/.test(ui)],
 ['B/W visual reference path',/REFERENCE_FULLPAGE_1055x1491/.test(ui)],
 ['Financial disclaimer',/Crypto assets may lose all value/.test(ui)],
];
for(const [n,ok] of rules)console.log(ok?'PASS':'FAIL',n);
process.exit(rules.every(x=>x[1])?0:1);
