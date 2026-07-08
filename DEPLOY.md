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

## Continuous deploys from GitHub

Repo: <https://github.com/Nineafterten/dinner-menu-app> · Site: `dinner-menu-app`.

One-time link (needs your GitHub OAuth, so it's a UI step):

1. Netlify → **dinner-menu-app** site → **Site configuration → Build & deploy →
   Continuous deployment**.
2. **Link repository** → authorize GitHub → pick `Nineafterten/dinner-menu-app`.
3. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`, Node 22)
   — accept the defaults. Env vars are already set on the site.

After that, every push to `main` builds and deploys automatically. (Builds take
~5s; the 300 free build-minutes/month is effectively unreachable for this app.)

### Kill switch (build-usage peace of mind)

Same page — **Build & deploy → Continuous deployment**:

- **Stop builds** — pauses all automatic builds. Pushes to GitHub no longer
  trigger deploys and consume **zero** build minutes. The current live site
  stays up untouched. Re-enable anytime. This is the main kill switch.
- **Locked publish / "Stop auto publishing"** (Deploys tab) — builds still run
  but nothing goes live until you manually publish.
- Manual deploys still work regardless via `netlify deploy --build --prod`.

Check usage anytime: Netlify → **Team → Usage** (build minutes, bandwidth).
Free tier: 300 build min/month, 100 GB bandwidth/month.

## Notes

- **HTTPS is automatic** on Netlify — that's what makes the PWA installable
  ("Add to Home Screen") and lets the service worker run.
- The service worker uses `autoUpdate`; `netlify.toml` marks `sw.js` and the
  manifest as non-cacheable so new deploys are picked up promptly.
