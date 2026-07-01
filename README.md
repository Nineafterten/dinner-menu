# Dinner Menu

A personal household web app: a visual library of the meals we know how to make.
Browse, search, and filter — and flip a per-meal switch for "I have everything to
make this right now." Works on laptop, phone, and iPad.

## Stack

- **React + Vite + Mantine** (dark, warm/amber theme)
- **Supabase** (hosted Postgres + realtime) for multi-device sync
- Falls back to **localStorage** when Supabase isn't configured, so it runs
  immediately on a single device.

## Run locally

```bash
npm install
npm run dev
```

The header shows a **Local** or **Synced** badge so you always know which
backend is active.

## Turn on multi-device sync (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (Settings → API).
4. Restart `npm run dev`. The badge should now read **Synced**.

## How it works

- **Edit mode** (header switch) reveals the add/edit controls and the ready
  toggles. It's a soft, no-auth convention — turn it on only on your own
  devices. Everyone else sees a clean read-only menu.
- **Data model:** name, optional category (emoji icon), ingredients (one per
  line), prep/cook notes, and the `ready` boolean.
- The data layer lives in [`src/data/`](src/data): `repository.js` picks
  `supabaseRepository` or `localRepository` — everything else is backend-agnostic.

## Deploy

Static build (`npm run build`) → any free static host (Vercel/Netlify). Set the
two `VITE_SUPABASE_*` env vars in the host's dashboard.
