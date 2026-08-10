# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

German-language casino affiliate site (mafia-casinode.de) — a standalone Nuxt 4 SSR app.
Content (posts, casinos, bookmakers, settings) lives in a shared MongoDB managed by a
separate admin service; this app only READS the DB. The codebase is a template meant to be
reused for other affiliate sites. SEO is a first-class concern (sitemap, schema.org,
trailing slashes, Core Web Vitals via nuxt-vitalizer).

## Commands

```bash
npm run dev        # dev server on http://localhost:3000 (needs .env with MONGO_URI)
npm run build      # production build; vue-tsc type check runs as part of it
npm run lint       # eslint + prettier --write
npm run lintfix    # eslint --fix + prettier
```

- No test suite exists.
- `npm install` requires `legacy-peer-deps` (set in `.npmrc`). Vite is overridden to `rolldown-vite`.
- Deploy: GitHub Actions builds the image with **no build args** → VPS Docker Swarm.
  `docker/entrypoint.mjs` reads the site's Vault record at container start and exports every
  key as `NUXT_*` before importing Nitro; on an unreachable Vault it falls back to the cached
  copy in `RUNTIME_CONFIG_CACHE`. A new runtime value is therefore two edits — the
  `runtimeConfig` line here and the Vault record — and no rebuild. See README, "Deploy".

## Architecture

Standard Nuxt 4 layout: `app/` (client), `server/` (Nitro), `shared/` (auto-imported
types/constants/utils). Aliases: `#sg` → `server/`, `#rc` → `app/`.

### Server: controller → usecase → repository

- `server/adapters/repository/mongodb/` — Mongoose repositories (post, setting, casino,
  bookmaker) + 10 models + subdocument schemas in `models/schemas/`. All DB access goes
  through repositories. Models must stay schema-compatible with the admin service (shared DB!).
- `server/{posts,seo,settings}/` — per-domain controller/usecase/composition (`index.ts`).
- `server/routes/api/v1/public/` — public read-only API: posts by slug, settings, sitemap
  feed, `/go/` ref-link resolution, mock comments.
- `server/routes/api/v1/system/cache/purge.post.ts` — cache purge endpoint for the admin
  service, protected by `x-cache-purge-secret` header (env `CACHE_PURGE_SECRET`, fail-closed).
- `server/middleware/` — `url_normalize.ts` (lowercase + trailing slash 301), `robots.ts`
  and `sitemap.ts` (served from DB settings), `post-redirect.ts` (301 redirects from DB).
- `server/lib/app-cache.ts` — Nitro cached functions (groups `posts`/`settings`) on fs
  storage `fsApp` (`./app-cache` in prod), TTL 1 year. Invalidation happens ONLY via the
  purge endpoint — content edits in admin without a purge stay stale.

### Client

- `app/pages/[...slug].vue` and `app/pages/index.vue` — all content pages; both render
  `views/BasePostView.vue`. Affiliate redirects are a Nitro route, `server/routes/go/[...slug].ts`.
- `app/components/layout/RuntimeTemplateLayout.vue` compiles post HTML from the DB at runtime —
  `vue.runtimeCompiler: true` in nuxt.config is REQUIRED; removing it silently breaks every post body.
- `app/plugins/api.ts` — thin `$api()` / `$apiAbort()` wrapper around `$fetch` (no auth).
- SVG icons: `app/assets/icons/` compiled to sprites by nuxt-svg-sprite-icon (`<svg-icon>`).

### Conventions & gotchas

- `components: false` — no component auto-import; import components explicitly.
- Auto-imports from `shared/` are load-bearing: `EntityModel`, `PostCategory`, `buildURL`,
  `I*` types are used WITHOUT imports. Never "clean up" `shared/types/index.ts`.
- All UI strings/branding (German) come from `seo.conf.ts` — do not hardcode.
- Trailing slashes everywhere (`site.trailingSlash`, NuxtLink `trailingSlash: "append"`,
  url_normalize 301) — keep all three in sync.
- Images are Cloudinary public IDs rendered via `<NuxtImg provider="cloudinary">`. Raw URLs
  (schema.org logo, CSS background) are built with `getCloudinaryBaseUrl(CLOUDINARY_CLOUD_NAME)` —
  never hardcode the cloud name. `logo.src` carries no file extension: Cloudinary `f_auto`
  serves whatever format was uploaded (svg/webp/png/jpg).
- No auth/JWT anywhere: inactive (`isActive: false`) and deleted posts are 404 for everyone.
- env vars: see `.env.example` (MONGO_URI, DB_NAME, SITE_URL, DOMAIN_NAME, CACHE_PURGE_SECRET).
  `.env` is for local dev only — in the container the same values come from Vault. The one
  exception is `CLOUDINARY_CLOUD_NAME`: `@nuxt/image` bakes the provider baseURL into the
  build, so it lives in `shared/constants/base.ts` and cannot be changed at runtime.

## UI & theme

Read `docs/ui.md` before touching anything visual — `app/assets/css/tailwind.css`, any
component's classes, or a new page. The three rules that break things silently:

- **Colour by role, not by eye.** `primary` = surfaces, `active` = anything interactive
  (CTA, links, hover, focus), `accent` = static brightness (badges, ribbons, article
  headings). The scale is inverted: 300 is darkest, 200 is the base, hover moves one step.
  These nine values are written in by the AppsPro brand patcher, so a misplaced family puts
  a brand's button colour on a heading. Body text is `text-surface-text`, never `text-white`
  — that token is what flips between the light and dark themes.
- **Sizes come from `text-step-1` … `text-step-9`** (1 is the largest), radii from
  `rounded-primary`. Not `text-sm`/`rounded-lg`.
- **`:root` in `tailwind.css` is a contract with that patcher**, comments included. It throws
  on a renamed anchor, a reordered family, or a second `--radius-primary` — in production,
  for every site. Run the patcher over the file after editing it.
- **`@config` disables Tailwind's source detection.** Only the globs in `tailwind.config.js`
  are scanned, so a class name built in a `.ts` file or coming from Mongo never compiles.
  Spell runtime-chosen classes out as literals.

## Commit messages

Follow `docs/commit-message.md`: present tense; title starts with an emoji, under 72 chars;
body is a bullet list, each line starting with a different emoji, explaining what/why.
