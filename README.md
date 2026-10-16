# Dinner Menu

A personal household web app: a visual library of the meals we know how to make.
Browse, search, and filter — and flip a per-meal switch for "I have everything to
make this right now." Works on laptop, phone, and iPad.

## Stack

- **React + Vite + Mantine** (dark, warm/amber theme)
- **localStorage** on each device, seeded from **`public/menu.json`**, which ships with the
  site. There is no backend.

## Run locally

```bash
npm install
npm run dev
```

`dev/sample-menu.json` holds 24 made-up meals for trying the UI. Load it with **Import a
file…** in edit mode. It isn't published, so never copy it over `public/menu.json`.

## Publishing the menu

Every device shows the menu published with the site, `public/menu.json`. To change it:

1. Turn on **Edit mode** and make your changes.
2. Choose **Export menu.json** in the *Publish the menu* panel.
3. Replace `public/menu.json` in the repo with the exported file, commit, and push. The
   site redeploys in about a minute.

A device picks up a newly published menu when it has no meals yet, or when it follows the
published menu and nothing on it has changed since that menu was exported. A device keeps
its own copy instead when it already had meals before `menu.json` existed, or after
**Import a file…**. **Use the published menu** puts it back on the published one.

## How it works

- **Edit mode** (header switch) reveals the add/edit controls and the publish panel.
  It's a soft, no-auth convention — turn it on only on your own devices. The ready
  switches work without it.
- **Cards** show one line per meal; tap one for its ingredients and notes. Ready meals
  sort first, and **Pick for me** chooses at random among the ready meals that match
  the current filters.
- **Data model:** name, optional category (emoji icon), ingredients (one per
  line), prep/cook notes, and the `ready` boolean.
- The data layer lives in [`src/data/`](src/data): `localRepository.js` reads and writes
  this device's copy, and `menuFile.js` handles export, import, and `menu.json`.

## Deploy

Live at <https://dinner-menu.nineafterten.com>, built and served by Cloudflare from GitHub on
every push to `main`. See [`DEPLOY.md`](DEPLOY.md).
