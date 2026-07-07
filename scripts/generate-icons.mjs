// Rasterizes assets/icon-master.svg into the PNG icons the PWA manifest and iOS
// need. Re-run with `npm run icons` after editing the master SVG.
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(resolve(root, 'assets/icon-master.svg'))

const targets = [
  { size: 192, file: 'public/pwa-192x192.png' },
  { size: 512, file: 'public/pwa-512x512.png' },
  { size: 512, file: 'public/maskable-512x512.png' },
  { size: 180, file: 'public/apple-touch-icon.png' },
]

for (const { size, file } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(resolve(root, file))
  console.log(`✓ ${file} (${size}×${size})`)
}
