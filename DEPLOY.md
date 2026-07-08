# Deploying Dinner Menu

Static Vite app hosted on **Netlify** (Nineafterten team). No serverless
functions — the browser talks to Supabase directly.

## Required environment variables

Set these on the Netlify **site** (Site config → Environment variables) so the
cloud build can inline them. They're the same values as your local `.env`:

| Variable                 | Value                                  |
| ------------------------ | -------------------------------------- |
| `VITE_SUPABASE_URL`      | `https://<your-ref>.supabase.co`       |
| `VITE_SUPABASE_ANON_KEY` | your `sb_publishable_…` key            |

> Vite inlines `VITE_*` at build time, so a change requires a rebuild/redeploy.
> The publishable key is safe to ship in client code; the **secret** key must
> never be set here.

## First-time setup (CLI)

```bash
netlify link            # or: netlify sites:create --name dinner-menu
netlify env:set VITE_SUPABASE_URL "https://<your-ref>.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "sb_publishable_…"
```

## Deploy

```bash
netlify deploy --build --prod
```

This runs `npm run build` (in Netlify's cloud, using the env vars above) and
publishes `dist`.

## Continuous deploys from GitHub (later)

Once the repo is on GitHub, connect it in the Netlify UI (Site config → Build &
deploy → Link repository). Build command `npm run build`, publish dir `dist` —
already declared in `netlify.toml`. Every push to the default branch then
deploys automatically. Remember to add the two env vars to the site if the
site was created fresh from GitHub rather than linked from this folder.

## Notes

- **HTTPS is automatic** on Netlify — that's what makes the PWA installable
  ("Add to Home Screen") and lets the service worker run.
- The service worker uses `autoUpdate`; `netlify.toml` marks `sw.js` and the
  manifest as non-cacheable so new deploys are picked up promptly.
