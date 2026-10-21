import fs from 'node:fs';
import path from 'node:path';
const dir=path.join(process.cwd(),'public','images');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'ASSET-MANIFEST.json'),'utf8'));
let failures=0;
for(const entry of manifest.assets){
 const p=path.join(dir,entry.file);
 if(!fs.existsSync(p)||fs.statSync(p).size<100){console.error('FAIL: missing or empty',entry.file);failures++}
 else if(fs.readFileSync(p).subarray(1,4).toString('ascii')!=='PNG'){console.error('FAIL: not a PNG',entry.file);failures++}
}
const mustHave=['ref-hero-lettering.png','ref-live-stats-title.png','ref-story-card-01.png','ref-buy-card-04.png','trollbelle-hero-transparent.png','trollbelle-logo-1024.png'];
for(const f of mustHave) if(!fs.existsSync(path.join(dir,f))){console.error('FAIL: required asset',f);failures++}
console.log(`${manifest.assets.length} artwork entries checked: ${failures?'FAILED':'OK'}`);
process.exit(failures?1:0);
