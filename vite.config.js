import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// Cloudflare Workers Builds names the commit in WORKERS_CI_COMMIT_SHA; local builds ask git.
function commitSha() {
  if (process.env.WORKERS_CI_COMMIT_SHA) return process.env.WORKERS_CI_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return null
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_COMMIT__: JSON.stringify(commitSha()),
    __APP_BUILT_AT__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Non-hashed static files to precache alongside the built assets.
      includeAssets: ['plate.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Dinner Menu',
        short_name: 'Dinner Menu',
        description: 'The meals we know how to make.',
        theme_color: '#f6f0e4',
        background_color: '#f6f0e4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Let the service worker run in `npm run dev` so it can be verified.
      devOptions: { enabled: true, type: 'module' },
    }),
  ],
  server: {
    // Honor a PORT env var (used by the preview harness) when present.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
