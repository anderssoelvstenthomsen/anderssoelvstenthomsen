# Anders Sølvsten Thomsen — Sanity Studio

Standalone Studio the client uses to manage the site. Deploys to
`https://anderssoelvstenthomsen.sanity.studio`. The Next.js site (repo root)
reads published content at build time and rebuilds on publish.

Project: `0twae3lh` · dataset: `production`

## Content types

- **Project** — `category` (Clients / Editorial / Art Direction), `title`, `slug`,
  optional `client` subtitle, `date` (sorts newest→oldest), optional `cover`, and a
  `Gallery` image array with a **batch multi-image uploader** (select many at once;
  uploads in batches of 5 to stay under rate limits).
- **Motion** — `title`, `video` (uploaded file), optional `poster`, `date`.
- **Site Settings** (singleton) — homepage hero video (uploaded file) + featured
  projects, plus the About bio/lists and Contact details.
- **Media** — the `sanity-plugin-media` asset library (browse/manage all uploads).

## Setup

```bash
cd studio
npm install
cp .env.example .env        # already contains the project id
```

The dataset must exist and allow the Studio origin. In the Sanity dashboard
(manage.sanity.io → project `0twae3lh`):
- API → CORS origins: add `http://localhost:3333` and `https://anderssoelvstenthomsen.sanity.studio`.
- Datasets: ensure `production` exists and is **public** (so the static site can read it without a token).

## Run / deploy

```bash
npm run dev       # local Studio at http://localhost:3333
npm run deploy    # hosts it at anderssoelvstenthomsen.sanity.studio
```

## One-time migration (import current site content)

Seeds Projects, Motion (poster + title/date), and Site Settings from `../public/assets`.

```bash
npm run migrate   # = sanity exec scripts/migrate.ts --with-user-token
```

Uploads all gallery **images** and **motion videos** to Sanity and creates every
document. Run it **once** — documents use stable IDs (`createOrReplace`), but assets
would be re-uploaded on a repeat run.

### Re-running only Motion

If you already ran `migrate` before videos were included (they were created without a
video), refresh just the Motion docs — this deletes the existing Motion documents and
recreates them with the uploaded video files (leaving images/projects untouched):

```bash
npm run migrate:motion
```

## Ordering (drag to reorder)

Projects (per category) and Motion are **drag-to-reorder** lists in the Studio, powered
by `@sanity/orderable-document-list`. The site renders them in whatever order you set by
dragging. The `date` field is kept for reference but no longer auto-sorts — drag is the
source of truth. The homepage's featured row is the top of the ordered lists.

- `npm run migrate:order` seeds the order **newest → oldest** from each item's `date`
  (undated items sink to the bottom). Run it once; after that, just drag.
- New documents are added at the **bottom** of their list — drag them up to place them.

## Making edits appear on the live site

The site is a static export. Add a **Sanity webhook** (dashboard → API → Webhooks)
pointing at your Cloudflare Pages **Deploy Hook** URL, triggering on create/update/delete
for `production`. Publishing then rebuilds the site (~1–2 min).

Also set these env vars in **Cloudflare Pages** so the site reads from Sanity:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=0twae3lh
NEXT_PUBLIC_SANITY_DATASET=production
```

Until those are set, the site falls back to the media/data committed in the repo.

## Video

Motion clips and the homepage hero are uploaded as normal Sanity file assets and
served from `cdn.sanity.io`, played with a plain `<video>`. Keep clips compressed
(they're already ≤25 MB each) to stay within your plan's asset bandwidth.
