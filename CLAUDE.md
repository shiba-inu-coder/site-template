# CLAUDE.md

## Project

Сasino affiliate site — a standalone Nuxt 4 SSR app.
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
npm test           # node --test over tests/*.test.ts
node scripts/perf-smoke.mjs <url> [--expect-priority]  # image rules on a live page's SSR
```

- **After every release** that reaches the test site, run `perf-smoke` against it with
  `--expect-priority` (`docs/release.md`, "After the deploy"). A non-zero exit means an image
  rule broke on a real page: two priority images, a lazy LCP, a preload that disagrees with its
  `<img>`, missing dimensions, a candidate wider than its file.

- Tests cover pure functions — `shared/` plus `server/lib/cache-generations.ts`, written
  without Nitro imports so the purge races can be tested — no DB, no network, no components.
  Templates and class names are checked by `npm run build` alone, and
  `tests/theme-css-layers.test.ts` also reads the built `entry.css` when `.output` exists, so
  `npm run build && npm test` is the full check.
- `npm install` requires `legacy-peer-deps` (set in `.npmrc`). Vite is overridden to `rolldown-vite`.
  The flag also means npm never installs optional peers on its own: `zod` is one for
  `nuxt-schema-org`, needed only by its `@nuxt/content` integration, so it is not in
  `dependencies` — wiring `@nuxt/content` in means adding `zod` back.
  `unhead` is the opposite case: it IS in `dependencies`, pinned to the version Nuxt ships.
  nuxt-schema-org picks its bundled schema.org plugin by Nuxt's unhead major, and that plugin
  imports `unhead` from the root `node_modules`. A plugin for the wrong major does not fail —
  the `ld+json` tag goes out empty. Bumping Nuxt means bumping `unhead` with it;
  `tests/schema-org-unhead.test.ts` catches a mismatch.
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
- `server/middleware/` — Nitro loads these alphabetically, and `post-redirect.ts` compares
  `event.path` as-is, so it has to run AFTER normalization or a redirect configured with a
  trailing slash never matches a request without one. `10.` / `20.` prefixes pin that order:
  `10.url-normalize.ts` (lowercase + trailing slash 301), then `20.post-redirect.ts` (301
  redirects from DB). `robots.ts` and `sitemap.ts` (served from DB settings) don't depend on
  the order and keep plain names.
- `server/lib/app-cache.ts` — Nitro cached functions (groups `posts`/`settings`) on fs
  storage `fsApp` (`./app-cache` in prod), TTL 1 year. Invalidation happens ONLY via the
  purge endpoint — content edits in admin without a purge stay stale. A purge bumps a
  generation before it clears storage (`server/lib/cache-generations.ts`), so a Mongo read
  already in flight cannot write the old value back; a read that kept meeting purges answers
  `volatile`, and then the API and the SSR page both go out with `no-store`. See
  `docs/ui.md`, "Cache purge".

### Client

- `app/pages/[...slug].vue` and `app/pages/index.vue` — all content pages; both render
  `views/BasePostView.vue`. Affiliate redirects are a Nitro route, `server/routes/go/[...slug].ts`.
- `app/components/layout/RuntimeTemplateLayout.vue` compiles post HTML from the DB at runtime —
  `vue.runtimeCompiler: true` in nuxt.config is REQUIRED; removing it silently breaks every post body.
  Stored HTML goes through `compileSafeTemplate` (`shared/utils/safe-runtime-template.ts`), never
  `compile` from `vue`: a binding left in the HTML would run on the server during SSR. See
  `docs/ui.md`, "Shortcodes".
- `app/plugins/api.ts` — thin `$api()` / `$apiAbort()` wrapper around `$fetch` (no auth).
- SVG icons: `app/assets/icons/` → one sprite file by the local module `modules/svg-sprite`
  (written to gitignored `app/assets/icons-gen/`, shipped as `/_nuxt/icons.<hash>.svg`).
  `<svg-icon name="client/star">` renders `<use href="…/icons.<hash>.svg#client-star">` in SSR,
  so icons draw without JS and nothing is inserted at runtime. The sprite is parsed as XML, not
  HTML: one malformed icon file blanks every icon on the site.

### Conventions & gotchas

- `components: false` — no component auto-import; import components explicitly.
- Auto-imports from `shared/` are load-bearing: `EntityModel`, `PostCategory`, `buildURL`,
  `I*` types are used WITHOUT imports. Never "clean up" `shared/types/index.ts`.
- All UI strings/branding come from `useSiteConfig()` — never from `seo.conf.ts` directly
  and never hardcoded. That composable merges the site's own `settings.brand/layout/strings`
  over `seo.conf.ts`, which is only the template's neutral English default. See
  `docs/ui.md`, "Site config from DB".
- Trailing slashes everywhere (`site.trailingSlash`, NuxtLink `trailingSlash: "append"`,
  url_normalize 301) — keep all three in sync.
- Images are Cloudinary public IDs. Logos and icons render via `<NuxtImg provider="cloudinary">`;
  article pictures (`text-image`, the hero photo, grid cards) are a plain `<img>` whose URLs
  @nuxt/image still builds. Four rules there, see `docs/ui.md`, "Images": dimensions come from
  the data, at most one priority image per page (`resolvePriorityImage`), candidates and
  `sizes` only from the generator (`useResponsiveImage` + `imageSizes`, whose numbers mirror
  the components' paddings and gaps), and no block hardcodes `loading`. Raw URLs
  (schema.org logo, CSS background) are built with `getCloudinaryBaseUrl(CLOUDINARY_CLOUD_NAME)` —
  never hardcode the cloud name. `logo.src` carries no file extension: Cloudinary `f_auto`
  serves whatever format was uploaded (svg/webp/png/jpg).
- The favicon is a Cloudinary public id in `settings.brand.favicon.src`, and
  `app/plugins/ui-theme.ts` turns it into `<link rel="icon">` — only when it is set. The
  brandless template declares no icon and has no `public/favicon.ico`: browsers still hit
  `/favicon.ico` themselves and get a 404, which is fine. Do not commit one.
- The theme's font pair never reaches the browser from Google. `@nuxt/fonts` self-hosts only
  the build-time Inter; the pair from `uiTheme.type` is fetched by the server
  (`server/lib/theme-fonts.ts`, cached in `fsApp`), its gstatic URLs rewritten to
  `/_theme-fonts/…` (a Nitro route that downloads each woff2 once per node), and
  `app/plugins/ui-theme.ts` inlines the `@font-face` rules into the SSR HTML — not into the
  payload. A `<link>` to Google appears only as a fallback: the server could not get the
  CSS, or the panel preview changed the font live. The fallback face under each theme
  family (`size-adjust` against local Arial/Times/Courier) is built from
  `server/lib/font-metrics.json`, generated by `node scripts/font-metrics.mjs` from the
  `@capsizecss/metrics` devDependency — bump the package, rerun the script, commit the table.
  See `docs/ui.md`, "Fonts".
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
  These nine values come from the site's `uiTheme.colors` at runtime, so a misplaced family
  puts a brand's button colour on a heading. Body text is `text-surface-text`, never `text-white`
  — that token is what flips between the light and dark themes.
- **Sizes come from `text-step-1` … `text-step-9`** (1 is the largest), radii from
  `rounded-primary`. Not `text-sm`/`rounded-lg`.
- **`:root` in `tailwind.css` holds the template's neutral defaults, not a brand.** A site's
  colours, radius, fonts and `ui-*` scheme reach the page only through `themeToCssVars`
  (`shared/utils/ui-theme.ts`) in `<style id="ui-theme">`. The defaults sit in `@layer theme`
  and the theme tag is unlayered, which is the only reason the brand survives a lazily loaded
  `entry.css`; a theme variable declared on a root selector outside a layer brings the
  flip back (`tests/theme-css-layers.test.ts`). A variable a component or a
  runtime style reads by name has to be written there too, or a themed site shows the slate
  default under its brand. A `ui-*` line renamed in `:root` is renamed in `UI_TOKENS` as well.
- **`@config` disables Tailwind's source detection.** Only the globs in `tailwind.config.js`
  are scanned, so a class name built in a `.ts` file or coming from Mongo never compiles.
  Spell runtime-chosen classes out as literals.

## Commit messages

Follow `docs/commit-message.md`: present tense; title starts with an emoji, under 72 chars;
body is a bullet list, each line starting with a different emoji, explaining what/why.
