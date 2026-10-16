# Deploying Dinner Menu

Static Vite app served by a Cloudflare Worker named `dinner-menu` at
<https://dinner-menu.nineafterten.com>. Cloudflare builds it from GitHub on every push to
`main`: build command `npm run build`, deploy command `npx wrangler deploy`.
`wrangler.jsonc` serves `dist/` with a single-page-app fallback.

- **GitHub repo:** <https://github.com/Nineafterten/dinner-menu> (renamed from
  `dinner-menu-app` on 13 Oct 2026; GitHub redirects the old name)

## Data

There is no backend and no build variables. Each browser keeps its menu in localStorage and
takes the published menu from `public/menu.json`, served at `/menu.json` (see the README's
*Publishing the menu*). `public/_headers` marks it non-cacheable so a republish shows up on
the next load. The service worker doesn't precache it, so offline devices keep their copy.

## Service worker and manifest

The PWA service worker uses `autoUpdate`. `public/_headers` (copied into `dist/`) marks
`sw.js` and `manifest.webmanifest` as non-cacheable, so new deploys are picked up promptly,
and gives the manifest its `application/manifest+json` type. HTTPS on the custom domain is
what makes the app installable ("Add to Home Screen").

## The old Netlify address

`home-dinner-menu.netlify.app` only redirects. `netlify-redirect/` was deployed once with
`netlify deploy --prod --no-build --dir netlify-redirect --site home-dinner-menu`:

- `_redirects` sends every path to the new address. The rule isn't forced, so the file
  below is served instead of redirected.
- `sw.js` replaces the old service worker on that address: it clears the caches,
  unregisters, and reloads open pages, so an app installed from the old address follows
  the redirect instead of running a stale offline copy. Reinstall from the new address.

## Local development

```bash
npm run dev                          # Vite, with the service worker enabled
npm run build && npx wrangler dev    # the production build as Cloudflare serves it
```
