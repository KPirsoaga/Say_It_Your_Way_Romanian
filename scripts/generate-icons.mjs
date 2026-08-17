import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'public/favicon.svg'));

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
];

for (const { name, size } of sizes) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(root, 'public', name), buf);
  console.log(`Generated ${name}`);
}

// Maskable icon with safe zone padding
const maskable = await sharp(svg)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: '#1C2A23' })
  .resize(512, 512)
  .png()
  .toBuffer();
writeFileSync(join(root, 'public/pwa-maskable-512x512.png'), maskable);
console.log('Generated pwa-maskable-512x512.png');
