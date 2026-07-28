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
- Deploy: manual GitHub Actions workflows → Docker image (Vault secrets) → VPS Docker Swarm.

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

- `app/pages/[...slug].vue` — all content pages; renders `views/BasePostView.vue` or
  `views/AuthorView.vue`. `app/pages/go/` — affiliate redirect pages.
- `app/components/post/RuntimeTemplateLayout.vue` compiles post HTML from the DB at runtime —
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
- Images are Cloudinary public IDs rendered via `<NuxtImg provider="cloudinary">`.
  Known debt: cloud name `duhutcvan` is hardcoded in `app/components/layout/IntroLayout.vue`
  and `app/views/BasePostView.vue` — parametrize when templating for a new site.
- No auth/JWT anywhere: inactive (`isActive: false`) and deleted posts are 404 for everyone.
- env vars: see `.env.example` (MONGO_URI, DB_NAME, SITE_URL, DOMAIN_NAME, CANONICAL_DOMAIN,
  CLOUDINARY_CLOUD_NAME, CACHE_PURGE_SECRET).

## Commit messages

Follow `docs/commit-message.md`: present tense; title starts with an emoji, under 72 chars;
body is a bullet list, each line starting with a different emoji, explaining what/why.
