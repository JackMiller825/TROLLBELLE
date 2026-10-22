import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const dir=path.join(process.cwd(),'public','images');
const mouthSrc=path.join(process.cwd(),'..','new-assets','mouth.png');
const mouthDst=path.join(dir,'trollbelle-mouth.png');
if(fs.existsSync(mouthSrc)&&fs.existsSync(mouthDst)){
 const h=(p)=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(h(mouthSrc)!==h(mouthDst)){console.error('FAIL: trollbelle-mouth.png must match ../new-assets/mouth.png (run npm run sync:mouth)');process.exit(1)}
}
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'ASSET-MANIFEST.json'),'utf8'));
let failures=0;
for(const entry of manifest.assets){
 const p=path.join(dir,entry.file);
 if(!fs.existsSync(p)||fs.statSync(p).size<100){console.error('FAIL: missing or empty',entry.file);failures++}
 else if(fs.readFileSync(p).subarray(1,4).toString('ascii')!=='PNG'){console.error('FAIL: not a PNG',entry.file);failures++}
}
const mustHave=['ref-hero-lettering.png','ref-live-stats-title.png','who-1.png','who-5.png','buy-1.png','buy-4.png','trollbelle-hero-transparent.png','trollbelle-logo-1024.png','trollbelle-mouth.png'];
for(const f of mustHave) if(!fs.existsSync(path.join(dir,f))){console.error('FAIL: required asset',f);failures++}
console.log(`${manifest.assets.length} artwork entries checked: ${failures?'FAILED':'OK'}`);
process.exit(failures?1:0);
