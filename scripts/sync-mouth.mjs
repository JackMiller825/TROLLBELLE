import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = process.cwd();
const src = path.join(root, '..', 'new-assets', 'mouth.png');
const dst = path.join(root, 'public', 'images', 'trollbelle-mouth.png');

if (!fs.existsSync(src)) {
  console.error('FAIL: missing', src);
  process.exit(1);
}
fs.copyFileSync(src, dst);
const hash = createHash('sha256').update(fs.readFileSync(dst)).digest('hex').slice(0, 12);
console.log('OK: synced trollbelle-mouth.png from new-assets/mouth.png', hash);
