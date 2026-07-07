import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
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
        theme_color: '#1f1300',
        background_color: '#1a1206',
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
