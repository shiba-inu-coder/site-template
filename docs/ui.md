# UI & theme

Everything visual in this template is driven by data that a **different program writes
in** — the AppsPro panel writes a site's palette, fonts, menu, footer, texts, logo, language,
favicon and theme into that site's own database, and all of it arrives at runtime. The image
itself carries only the template's neutral defaults. See "Site config from DB" and "Runtime
theme". A class picked by feel rather than by role does not just look wrong here; it puts a
brand's call-to-action colour on an article heading.

## The three colour families

| Family    | What it is for                                                                 | Where it comes from                                                                      |
| --------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `primary` | surfaces — page background, header, footer, cards, inputs, dividers            | the dominant background of the brand's own site                                          |
| `active`  | **interaction** — CTA buttons, links, hovers, focus, the selected tab          | **the colour of the brand's own "Register" button**                                      |
| `accent`  | **static brightness** — badges, ribbons, article headings, list markers, promo | the brand's second bright colour; **invented** (hue shifted 30–40°) if the site has none |

If a thing responds to the pointer it is `active`. If it is merely loud it is `accent`.
Everything the content sits _on_ is `primary`.

The scale is **inverted** from stock Tailwind: **300 is the darkest**, 200 is the base as it
appears on the brand's site, 100 is the lightest.

**Base is 200. A hover moves one step, and only one.** For `active` and `accent` that step
goes toward 300 (darker): `bg-active-200 hover:bg-active-300`. For `primary` — a surface —
it goes toward 100, because a surface lifts when you point at it:
`bg-primary-200 hover:bg-primary-100`. Starting from a neutral base (inherited body text)
the step lands on 200: `hover:text-active-200`.

Three things that are always bugs, and all three were in this repo:

- a hover that changes family (`bg-active-200 hover:bg-accent-300`);
- a hover equal to its base (`bg-accent-200 hover:bg-accent-200`);
- a hover that skips a step (`bg-active-300 hover:bg-active-100`).

Text on a surface may use the 100 shade when 200 does not have the contrast. Family first,
shade second. The rating score, the entity ribbon and the bonus amount follow the headings
(`ui-heading`) rather than a shade of their own.

## Light and dark

The site is light or dark **per brand**, chosen by the operator in the panel. It arrives
either from the database (`settings.uiTheme.mode`) or, when the site has no theme record
yet, from `seo.conf.ts`'s `site.theme` baked into the image; `app/plugins/ui-theme.ts` puts the
winner on `<html data-theme>` and emits the matching `<meta name="color-scheme">` — the meta
is not decoration, without it scrollbars, autofill and native controls stay dark on a light
page. See "Runtime theme" below.

The mode no longer colours a single element. **Text colour comes from the scheme, not from the
mode**: `html { color: var(--color-ui-text) }`, and every component reads a `ui-*` token
(`text-ui-text`, `text-ui-cta-text`, …). The `--color-surface-*` variables
(`text`/`muted`/`raised`/`on-brand`) and `:root[data-theme="light"]` still exist, but only for
three things: `color-scheme` and native controls, a site with no theme record, and a stored
scheme that still points at `surface-*` (`resolveScheme` resolves those by the theme's mode). A
`text-surface-*` class in a component is a bug — it ignores both the scheme and the operator's
"Основной текст" (`tests/theme-color-source.test.ts` fails on it).

A CTA button's label sits on a **brand** colour, not on the page, so it takes `ui-cta-text`,
contrasted against `ui-cta-bg`, never `ui-text`.

`active` and `accent` do **not** flip: a brand's CTA colour works on either ground. `primary`
does not flip either, because it is already the brand's own surface ramp — a light brand's
manifest carries light primaries. That is the one thing to get right: **`theme.mode` and the
`primary` ramp must agree**, or you get dark text on a dark page. The panel's mode selector
fills a neutral ramp for you; edit the hexes afterwards if the brand's ground is tinted.

Status colours are neither brand nor theme — green means "yes" and red means "no" on any
site, so `text-status-positive`, `text-status-negative` and `text-status-warning` are plain
literals in `@theme`.

The stock Tailwind palette — `text-blue-500`, `text-slate-200`, `border-slate-600` — is
**not allowed**: it moves with neither the brand nor the theme. The repo is currently free
of it, and of raw `rgb()`/hex inside components.

`shared/constants/ui-presets.ts` exports a single neutral entry, `blank` — the same colours
a site with no theme record falls back to (`DEFAULT_UI_THEME_DARK`), just carrying its own
`templateId`/`templateName`. Every real look comes from the operator painting the brand by
hand in the panel's template editor; this repo ships no gallery of ready-made looks and no
switcher of its own.

## UI tokens

**A component is coloured only by a `ui-*` token — never `bg-primary-200`, never
`text-accent-100`, never `text-surface-*`.** Which brand or neutral token
stands behind each `ui-*` one is decided in exactly one place, the `/* UI scheme */` block
in `:root` below — components don't know or care that `bg-ui-cta-bg` happens to resolve to
`active-200` today. That indirection is the whole point: from stage 6 the panel rewrites the
scheme per site (a CTA that resolves to `accent-200` instead, a card that borrows the page
background), and every component using `ui-cta-bg` repaints without a template touched.
**The brand/surface scale is taken directly by nobody except the scheme's own defaults.**

The defaults below reproduce, token for token, what every component had hardcoded before
this layer existed — this was a pure refactor, not a redesign. A default is written as the
brand or surface ref it resolves to, the same string `shared/utils/ui-theme.ts` uses in
`scheme[token]`.

| Token              | Default       | Role                                                                  |
| ------------------ | ------------- | --------------------------------------------------------------------- |
| `ui-page-bg`       | `primary-300` | page/layout background                                                |
| `ui-header-bg`     | `primary-300` | `HeaderLayout`, its dropdown panel                                    |
| `ui-header-text`   | `ui-text`     | text, headings, links and borders inside `.site-header` (see "Frame") |
| `ui-footer-bg`     | `primary-200` | footer background                                                     |
| `ui-footer-bg-alt` | `primary-300` | footer copyright line                                                 |
| `ui-footer-text`   | `ui-text`     | footer text and the copyright line                                    |

| Token             | Default       | Role                                              |
| ----------------- | ------------- | ------------------------------------------------- |
| `ui-card-bg`      | `primary-100` | `PostGridCards` boxed card, error page background |
| `ui-card-border`  | `primary-300` | card border, bonus-icon border                    |
| `ui-card-title`   | `accent-200`  | `PostGridCards` item title                        |
| `ui-panel-bg`     | `primary-200` | rating/bonus card body, drawer, FAQ/pros-cons box |
| `ui-panel-border` | `primary-300` | panel/drawer/biography border                     |
| `ui-input-bg`     | `primary-100` | form input background                             |
| `ui-input-border` | `primary-100` | form input border, small logo/divider borders     |

| Token           | Default      | Role                                                                                                       |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `ui-heading`    | `accent-200` | `#article h1`–`h6`, eyebrow labels, gift/bonus icons, rating score, ribbon, mini-review tint, bonus amount |
| `ui-text`       | `#0f172a`    | body text — `html { color }`, so article text, FAQ, table cells, captions                                  |
| `ui-link`       | `active-200` | inline links, outline-button text/border                                                                   |
| `ui-link-hover` | `active-300` | hover/focus target for `ui-link`                                                                           |
| `ui-cta-bg`     | `active-200` | solid CTA background (`PostButtonRef` solid)                                                               |
| `ui-cta-hover`  | `active-300` | hover/focus target for `ui-cta-bg`                                                                         |
| `ui-cta-text`   | `#ffffff`    | text/icon sitting on `ui-cta-bg`                                                                           |

| Token                 | Default        | Role                                                                                  |
| --------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `ui-table-head-bg`    | `primary-300`  | `PostDataTable` head row                                                              |
| `ui-table-head-text`  | `#0f172a`      | `PostDataTable` head row text                                                         |
| `ui-table-row`        | `primary-200`  | even data-table row                                                                   |
| `ui-table-row-alt`    | `primary-300`  | background of every second row and card                                               |
| `ui-table-row-border` | `primary-100`  | data-table outer border, the divider between rows and between a card's cells          |
| `ui-table-btn-bg`     | `ui-cta-bg`    | the button in a data-table cell (`PostButtonRef` variant `table`)                     |
| `ui-table-btn-hover`  | `ui-cta-hover` | its hover/focus background                                                            |
| `ui-table-btn-text`   | `ui-cta-text`  | its label                                                                             |
| `ui-marker`           | `accent-200`   | `#article` list markers and numbers, author avatar ring, outline of the `glow` shadow |
| `ui-h2-decor`         | `accent-200`   | `data-h2` decor: underline, dot, number, line, second colour of the gradient          |

`ui-h2-decor` was split off `ui-marker`, and `ui-header-text`, `ui-footer-text` and the three
`ui-table-btn-*` came later (1.16.0). **A stored scheme without a key does not get the default —
it inherits the older key** (`SCHEME_INHERIT`, `shared/utils/ui-theme.ts`; the panel keeps the
same map), so a site whose operator recoloured the text or the CTA does not repaint itself after
an update:

| Key                                                   | Inherits                            |
| ----------------------------------------------------- | ----------------------------------- |
| `h2-decor`                                            | `marker`                            |
| `header-text`, `footer-text`                          | `text`                              |
| `table-btn-bg` / `table-btn-hover` / `table-btn-text` | `cta-bg` / `cta-hover` / `cta-text` |

**`header-text` was removed once and came back.** Records written before commit 028bc8e carry
`"header-text": "auto"` — a value `resolveRef` cannot turn into a colour. Any ref that gives no
colour (`"auto"`, a shade the theme lacks, an unknown `surface-*`) counts as an absent key, so
such a record reads as "the header takes `text`" exactly as it did. The scheme also used to
carry `highlight-*`, `badge-*`, `muted`, `accent-strong`, `accent-soft`; a stored theme that
still has them resolves fine, the loop in `resolveScheme` never looks at them.

### `/* UI scheme */` is the default wiring, the runtime theme overrides it

The block lives in `:root`, under the nine brand colours, behind its own anchor comment.
Renaming a `ui-*` line here without renaming it in `UI_TOKENS` (`shared/utils/ui-theme.ts`)
breaks the themed site — `themeToCssVars` would write a variable nothing reads — and renaming
it without renaming the component class breaks every site, the same way a typo in any
Tailwind class would. There is no separate machine check for either yet.

Every `--color-ui-*` default is a `var(--color-<family>-<shade>)` reference, a `var()` of the
older `ui-*` it inherits, or one of three literals taken from the light "Пустой" preset —
`ui-text` and `ui-table-head-text` `#0f172a`, `ui-cta-text` `#ffffff`. They are literals, not
`surface-*`, so the mode never picks a colour; the same three are in `DEFAULT_UI_SCHEME`.

### `settings.uiTheme`

The full per-site theme form (`shared/utils/ui-theme.ts`, mirrored by the admin panel) has
ten axes, and all of them are read now: `colors`, `scheme`, `type`, `geometry` and
`variants` (see "Shortcodes") by the components and the runtime `:root`, and `decor` plus
the non-family parts of `type`/`geometry` as `data-*` attributes on the page root (see
"Frame"). `frame` carries one axis, `width`, for the whole site; `sticky` lives on the
**post**. Header inversion, hero, sidebar, section bands and the badge shape variant were
removed outright, not moved anywhere else (see "Frame"):

```ts
UiTheme = {
  templateId, templateName, mode: "dark" | "light",
  colors: { primary, active, accent } × { 300, 200, 100 },
  scheme: { [uiToken]: "primary-200" | "#hex" }, // 30 keys, see tables above; old records may still say "surface-text"
  type: { display: { family, weight?, tracking? }, body: { family, weight? } },
  geometry: { radius, borderWidth?, blockGap?, paragraphGap? }, // old records: borders 0/1/2
  variants: { toc?, gridCards?, faq?, buttonRef? }, // see "Shortcodes"
  decor: { h2?, firstSection? }, // see "Frame" and "Sections"
  frame?: { width? }, // see "Frame"
  updatedAt,
}
```

`resolveScheme(theme)` turns `scheme` into `Record<uiToken, hex>` — a ref starting with
`primary-`/`active-`/`accent-` reads `theme.colors`, one starting with `surface-` (an old record)
reads a fixed dark/light neutral pair by the theme's mode, and anything else (a `#hex`) passes
through unchanged. A ref that gives no colour is an absent key: it inherits (`SCHEME_INHERIT`),
then falls to `DEFAULT_UI_SCHEME`. `themeToCssVars(theme)` wraps the nine
brand colours themselves (`--color-<family>-<shade>`), `resolveScheme`'s output, plus
`--radius-primary`/`--font-primary`/`--font-heading` /
`--font-body-weight`/`--font-heading-weight`/`--font-heading-tracking`/`--block-gap`/
`--paragraph-gap`/`--ui-border-width` in one
`:root { … }` string. **The nine brand colours are not redundant with the `ui-*` layer**:
a section's own `mode: "color"` background (`var(--color-primary-200)`, see "Sections") and the few
classes still on a brand family directly (`bg-active-200` in `PaginationDots.vue`) read
them by name, and without this line they would get the template's neutral slate from
`tailwind.css` under a brand's text colour. **No `--shadow-*`**: shadow utilities compile to
a literal at build time (see below), so a runtime CSS variable for it would do nothing. An
axis the record does not carry is left out of that
string rather than written empty, so a half-filled theme cannot blank a value the image
already has. `DEFAULT_UI_THEME_DARK`/`DEFAULT_UI_THEME_LIGHT` are the template's current look
expressed in this shape — the panel's starting point for a new theme, not what the site
falls back to: a site with no record renders from the CSS in its own image (see "Runtime
theme").

Storage: `models/schemas/UiTheme.ts`, embedded as `Setting.uiTheme`. `scheme` and `variants`
are their own sub-schemas with `strict: false` — the known keys are declared (so a real typo
still shows up in review), but an unrecognised one is kept rather than silently dropped,
because the panel and this image don't always deploy in the same breath. `decor` is
`Mixed` — its fields are read by CSS, not by the schema, and declaring them twice would
only mean migrating twice. `frame` and `accents` used to be `Mixed` sub-documents here too;
both were dropped from the schema outright, not just left unused. `setting.repository.ts`
`getPublic()` returns `uiTheme` alongside `redirectsRoutes`, `brand`, `layout` and `strings`.

## Site config from DB

**Nothing about a particular site lives in this repository any more.** The menu, the footer,
every interface string, the logo, the favicon, the brand slug and the language arrive from
that site's `settings` document; `seo.conf.ts` is the template's neutral default underneath
them — empty name, `lang: "en"`, English strings, empty menus. Editing a brand in the panel is
a write into Mongo plus a `settings` cache purge: no commit, no image, no deploy. The live
panel does not talk to the page while the operator edits: it shows a staging slot (below) or the
published site.

Three subdocuments carry it (`server/adapters/repository/mongodb/models/schemas/`):

| Field              | Schema       | Holds                                                                                                                                                          |
| ------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `settings.brand`   | `Brand.ts`   | `name`, `lang`, `brandSlug`, `logo {src,alt,width,height}`, `favicon {src}`, `imgRoundCorner`, `banner {path,alt,width,height}` (общий баннер, необязательный) |
| `settings.layout`  | `Layout.ts`  | `header {items, cta}`, `footer {title, body, links, legalLogos, paymentLogos}`, `breadcrumbs {homeLabel}`                                                      |
| `settings.strings` | `Strings.ts` | the whole `seoConfig.translates` tree                                                                                                                          |

`Strings.ts` declares **no** keys and is `strict: false` on purpose: the key set is the
panel's (`seo-conf-defaults.js`), it grows there, and the site's image does not redeploy in
the same breath — an unknown key is kept, not dropped. `HeaderItem` in `Layout.ts` references
itself through a separate `.add()` because Mongoose cannot reference a schema inside its own
literal.

**`useSiteConfig()` is the only way a component reads any of this.** It is a `computed` over
`buildSiteConfig(seoConfig, settings)` (`shared/utils/site-config.ts`, pure, no Nuxt), and it
returns the template's own shape — `site`, `logo`, `favicon`, `banner`, `img`, `layout`, `translates` —
so a component does not know or care which layer answered. `settings.brand` is flat in the
database and is unfolded into `site`/`logo`/`img` by that one function.

Two rules inside the merge, both deliberate:

- **An empty value never overrides a template default.** The panel writes settings in
  pieces, and a half-filled record would otherwise blank a button's label into an empty
  string — the same reason `themeToCssVars` leaves an unset axis out instead of writing it
  empty.
- **The result always has the full shape**, whatever `seo.conf.ts` happens to be. Until the
  panel stops rewriting that file from its own fixed template, a key added here can vanish
  from it, and `config.favicon.src` must not throw on such a file.

**A staging slot also shows the panel's unpublished draft.** `settings.draft` holds the same
four parts — `brand`, `layout`, `strings`, `uiTheme` — and the panel writes it in `draft.*`
paths while «Опубликовать» writes the live fields and drops it. Only a container started with
`NUXT_SETTINGS_DRAFT=true` (the slot service in `main-server/stack.staging.yml`) lays it over
the published record, in `resolvePublicSettings` (`shared/utils/site-config.ts`), after the
settings cache: brand, layout and strings deep, by the same "empty does not override" rule, so
a partial draft brand without a logo keeps the published logo; the theme whole, because the
panel writes it as one key. `draft` itself never leaves the server — not with the flag, not
without it. Production and the slot read one database, which is why the draft is a layer and
not a copy.

What is left in the repository: the neutral defaults themselves, and `site.theme` — the
light/dark mode a site falls back to when it has no `uiTheme` record. That one is a property
of the image, not of the site, which is why `settings.brand` has no field for it.

The load is `app/plugins/ui-theme.ts`, the same awaited fetch that brings the theme, so the
menu is in the SSR HTML rather than arriving with hydration. The plugin also emits
`<html lang>` from `brand.lang` and `<link rel="icon">` from `brand.favicon.src` — a
Cloudinary public id, built into a URL with `getCloudinaryBaseUrl`. **There is no
`public/favicon.ico`** and none should be added: a brandless template declares no icon,
browsers ask for `/favicon.ico` anyway and get a 404, which is fine.

`@nuxt/fonts` in `nuxt.config.ts` carries one neutral family (Inter) as the template's
fallback; the brand's own pair comes from `uiTheme.type`, fetched from Google by the server
and inlined by the plugin (see "Fonts"). Nothing in `nuxt.config.ts` is patched per site any
more.

## Runtime theme

**The theme reaches a running site from its own database, not from the image it was built
into.** `app/plugins/ui-theme.ts` (`enforce: "pre"`) awaits
`/api/v1/public/settings/settings` before the first render and puts the whole public answer
into `useState("settings")` — the state `useSettings()` wraps and `useUiTheme()` reads.
Repainting a site is an edit in the panel plus a `settings` cache purge; no rebuild, no
redeploy. The fetch is awaited on purpose: `layouts/default.vue` used to fire the same
request without `await`, so SSR rendered whatever it had and the answer arrived too late to
matter.

The plugin also owns `<html lang>`, `<html data-theme>` and `<meta name="color-scheme">`.
They used to sit in `nuxt.config.ts`, where they could only ever carry what the build
machine knew; a plugin runs for `error.vue` as well, so the 404 page stays themed — which
was the reason they were not in `app.vue` to begin with.

**A site without `uiTheme` renders exactly as before.** An empty or half-filled record is
not a theme: `isUiThemeConfigured` demands a `mode` and all nine colours, and anything less
falls back to the template's neutral palette in `tailwind.css`'s own `:root`, to
`seo.conf.ts`'s `site.theme` for the mode, and to the build's own Inter. That is the state every
site is in until an operator saves a theme for it, so the fallback is the normal path, not
an error path.

Two details that look like noise and are not:

- **The theme wins by layer, not by position.** `<style id="ui-theme">` is unlayered and
  the template's defaults sit in `@layer theme`, so the theme beats them wherever the tags
  end up. Position used to decide it: with the defaults unlayered too, the later of two
  equal `:root` rules won — and a lazily hydrated block (FAQ, pros/cons, grid cards)
  carries `entry.css` in its chunk's dependencies, so Vite's loader appended a `<link>` to
  the end of `<head>` on scroll and the brand flipped back to the slate defaults. The tag
  is still pushed with `tagPriority: 65` (after the stylesheets at 60, before the preloads
  at 70), but nothing depends on that order any more.
- **The theme's fonts are self-hosted at runtime, not at build.** `@nuxt/fonts` scans CSS
  at build time and knows nothing about a family that arrives from Mongo, and a
  `<link rel="stylesheet">` to Google Fonts was a render-blocking request to a third
  domain (~800 ms in Lighthouse). So the server fetches the `@font-face` rules itself and
  the plugin inlines them as `<style id="ui-theme-fonts">`; the page makes no request to
  Google at all. How, and when the old link comes back as a fallback: "Fonts".

### Cache purge

The public settings and posts are Nitro cached functions (`server/lib/app-cache.ts`, fs
storage `fsApp`, a year's TTL), and the panel's purge endpoint is the only thing that
invalidates them. A purge has to survive a read that is already in flight: Nitro writes
the resolver's result to storage _after_ the `await`, so a Mongo read started before the
purge used to write the old value back into the file the purge had just deleted — for a
year. `server/lib/cache-generations.ts` closes that:

- **A purge bumps a generation first, then clears storage.** Each cache key carries a boot
  id and the generations captured _before_ the call (`all`, plus `settings` or the post's
  own); a late write lands under the old key and nothing reads it again. `all` bumps a
  generation shared by every key, including keys that did not exist yet. A restart gets a
  new boot id, so files from before it are never reused.
- **A read that saw a purge retries.** After the call, the captured generations are
  compared with the current ones; changed means read again, three attempts at most. If
  purges kept coming through all three, the request gets the last value it read, marked
  `volatile` — a page without a theme would be worse than a possibly stale one, so no 503.
  That value is not stored under the current generation. A database error with no
  successful read at all is an ordinary error.
- **`volatile` is never cached on the way out.** The API answer keeps its body and adds
  `X-App-Cache-State: volatile`, `Cache-Control: no-store` and `X-Accel-Expires: 0` (nginx
  honours both; it ignores only `Set-Cookie`). SSR reads that header off the internal
  settings and post responses (`useVolatilePageMark`) and puts the same two cache headers
  on the HTML. None of this deletes what nginx already holds — clearing nginx is still
  `cache_clear.sh`'s job.

The guarantee is per process. Getting a purge to every container is the purge caller's
problem, not this module's.

`useUiTheme()` is where a component asks about the theme: `theme` (the record or `null`),
`mode`, `cssVars`, `fontsHref`, `contrast`, `variantFor(key)` (the block-variant lookup, see
"Shortcodes"), `frame` (`{ width, sticky }`, see "Frame") and `frameAttrs` (the `data-*` attributes for the page
root, see "Frame"). `setTheme()` replaces the theme in state; the head is described as a
getter, so the style tag, `data-theme`, the font link and the attributes all repaint without
a reload. Nothing in the repository calls it: the page has no channel to the panel (no
`postMessage`, no `PANEL_ORIGINS`), and a theme change reaches a visitor through the
database and a `settings` purge.

## Frame

**The page around the article is a set of variants, not a fixed layout** — except for the
header, the breadcrumbs and the footer, which have one look each and no theme key (see below).
Two frame axes are left. `width` is one for the whole site and lives in the theme
(`uiTheme.frame.width`, set in the panel's "Кастомизация"); `sticky` is per page and lives on
the **post** (`IPost.frame.sticky`, `shared/types/post.ts`). There is no hero and no sidebar:
the page is always breadcrumbs, the date line and one column of sections, and a table of
contents is only the `table-content` block in the text. Posts written for sites below v1.11.0
still carry `frame.hero`/`sidebar`/`width` in the database — the panel keeps them on save for
those sites — and this template does not read them. `headerInverted`, `heroStyle` and `bands`
are long gone too: header text is its own scheme token, `ui-header-text`, and sections are
never banded. `resolvePageFrame(theme, postFrame)` (`shared/utils/ui-theme.ts`) takes the
width from the theme and sticky from the post, dropping a value that isn't one of the axis's
own — old data, a typo — rather than let it reach the CSS; `useUiTheme().frameAttrs` then
turns the result into `data-*` attributes on the page root — `<div id="site">` in
`layouts/default.vue` **and in `error.vue`**, because a 404 is not drawn by the layout and
would otherwise lose the frame.

| Attribute     | Axis                    | Values                                                          | Without a value |
| ------------- | ----------------------- | --------------------------------------------------------------- | --------------- |
| `data-width`  | `uiTheme.frame.width`   | `narrow` / `wide`                                               | `wide`          |
| `data-sticky` | **post** `frame.sticky` | `none` / `bar` / `bar-float` / `button`                         | `none`          |
| `data-h2`     | `uiTheme.decor.h2`      | `none`/`underline`/`left-rule`/`dot`/`gradient`/`number`/`line` | `none`          |

There is no `data-hero`, `data-sidebar`, `data-header-inverted`, `data-hero-style`,
`data-bands`, `data-badge`, `data-borders`, `data-shadow` or `data-section-bg-width`
attribute any more, and nothing in `tailwind.css` selects on them.

**Border width is a variable, not an attribute.** `themeToCssVars` writes
`--ui-border-width` from `geometry.borderWidth` (`"0"` or a length in px/rem/em; anything else
is not written), and for a record from before 1.16.0 from `geometry.borders` — `0`/`1`/`2` →
`0`/`1px`/`2px`. One rule in `tailwind.css` applies it:
`#site #article :is(.border-ui-card-border, .border-ui-panel-border, .border-ui-input-border)`
takes `border-width: var(--ui-border-width, revert-layer)`. The `revert-layer` fallback is the
point: without the variable the rule rolls back to the utility layer, so a `border` stays 1px
and a `border-2` stays 2px, exactly as the component wrote it. Elements that carry a border on
one side only (`border-b`, `border-x-2` — the drawers, the bonus-card divider) are excluded by
`:not([class*="border-…"])`: `border-width` would draw them a frame on every side. **There is
no shadow axis.** A card's glow is the template's own `shadow-primary`, which cannot be
repainted at runtime (see below); `geometry.shadow` in an old record is not read.

**An axis nothing carries is not written as an attribute at all**, and the `/* UI axes */`
block in `tailwind.css` only ever styles a _deviation_ — so a page with no frame and a site
with no theme render exactly what they rendered before this existed. That is the rule to keep
when adding a value: never write the default branch.

That block is plain CSS on purpose. `@config` turns off Tailwind's source scanning, so a
class assembled at runtime is never compiled — an attribute selector is not a class and is
not scanned. Its selectors hang off the **utility classes the components already carry**
(`.bg-ui-card-bg`, `.border-ui-panel-border`, `[data-id="ref_link"]`), because there is no
`.card`/`.panel` vocabulary in this template. The cost is honest: a component that stops
using one of those classes silently drops out of the axis instead of breaking.

Where the frame parts are drawn:

- **Header** — `HeaderLayout.vue`, one look: `layout.header.items` in three groups by
  `position` (left / centre / right), each item drawn by `HeaderNavItem.vue`. "Logo on the
  left, login and register on the right" is what the items say, not a variant — another page
  or button is an edit in the panel's header constructor. There is no `headerInverted` axis
  any more: `.site-header` takes its text from its own scheme token, `ui-header-text` — `color`
  on the header, with `--color-ui-heading`, `--color-ui-link` and the `color-mix` borders and
  input background inside it remapped onto the same token. A dark header on a light site is
  one colour pick in the panel; nothing chooses a contrasting colour on its own, and the pair
  `header-text`/`header-bg` is in the panel's contrast block. A `frame.header`/
  `frame.headerInverted` still stored in an older theme record is not read.
  **On a phone the header is one row and never wider than the screen.** Nothing is hidden:
  below `md` the buttons lose most of their side padding (`px-4` instead of `px-7`), gaps
  drop to `gap-2`, and an empty group is `max-md:empty:hidden` so it does not cost a gap.
  The logo is what gives way — its link is `min-w-0` and the picture's cap is
  `max-w-[min(100%,200px)]`, so it shrinks into whatever the buttons leave (≈70 px at 320
  with two Ukrainian buttons). The buttons are `whitespace-nowrap` and do not shrink, so a
  label never breaks mid-word; putting `min-w-0` on the groups instead would let them shrink
  under their buttons and the logo would be drawn over them. Labels long enough to fill
  the row alone still overflow — that is data to shorten in the panel.
  The header is `sticky top-0`, not `fixed`: it keeps its own height in the flow, so nothing
  below it needs a top offset. A `fixed` header plus `mt-18` on `#article` drifted — the real
  header is 80 px with the default buttons and changes with a brand's items and the fluid
  font size, so the date line slid 8 px under it.
- **Sticky CTA** — `StickyCtaLayout.vue`, phone only, `bar` (bonus line plus button) or
  `button`, from the post's own `frame.sticky`. It **replaced `BonusLayout.vue`**, the
  floating gift that used to sit in the corner of every page; a page with no `frame.sticky`
  now shows nothing there. `bar-float` is `bar` detached from the screen edge: inset by
  `0.5rem`, rounded, with a border and a shadow. The back-to-top button is `fixed` too and
  would sit under the bar, so `tailwind.css` lifts `.site-fast-up` above it per `data-sticky`
  value; the footer gets matching bottom padding.
- **Breadcrumbs** — `BreadcrumbsLayout.vue`, one look: text links (`ui-link`) separated by a
  chevron, the current page as plain `ui-text` with no link. The first crumb is always the
  home page labelled with the brand name, `site.name`: the server takes that label from the
  home page's `breadcrumbTitle`, and the panel leaves it empty there. `breadcrumbTitle` and
  `layout.breadcrumbs.homeLabel` only answer on a template no brand has been applied to. The
  BreadcrumbList schema.org carries the same labels.
  Breadcrumbs and the "last updated" line are one component, `PostMetaLayout.vue` (crumbs
  first, date under them), drawn by `BasePostView.vue` above the sections. `BreadcrumbsLayout` carries no outer
  margin; the parent sets it.
- **Heading → first block** — a shortcode that opens a section body right under its H1/H2
  loses its top `--block-gap` (`tailwind.css`, next to `.shortcode`), so the heading's own
  20 px is the distance, the same as for a paragraph. Between two blocks `--block-gap` stays.
- **Footer** — `FooterLayout.vue`, one look, a single centered column
  (`flex flex-col items-center gap-6`): the logo (`siteConfig.logo` through the same `logoSize`
  helper as the header — see "Logos" below — but with its own, larger ceiling, 50 px high and
  240 px wide against the header's 36/200; lazy-loaded, since it always sits below the fold;
  skipped with no text fallback when the site has none), the text (`layout.footer.body`, the disclaimer HTML the brand run generates,
  left-aligned inside the centered column), a row of badges (`layout.footer.legalLogos` — 18+,
  GamCare, the licence; Cloudinary public ids through `NuxtImg`), a row of links
  (`layout.footer.links`), and the copyright line. The footer's text is `ui-footer-text`; links
  keep `ui-link`. The copyright line keeps its own `bg-ui-footer-bg-alt`
  strip below the column, text centred; it is `layout.footer.title`, which the panel assembles
  as "domain © year rights" when a brand is applied, so its year is the year of the last apply
  — a site with no brand record gets `© <year> <DOMAIN_NAME>`.

The offer behind the sticky bar is `usePageOffer()`: there is no "offer"
record in an article, so it is assembled from what the page already has — the banner's casino
(logo, title, bonus text) — and falls back to `layout.header.cta`.

`CtaButtonLayout.vue` is the one button those three places use. It exists because
`PostButtonRef` is always an external affiliate link and cannot render an internal
`nuxt-link`, which `layout.header.cta.link` may well be.

## `:root` holds the template's defaults, the brand arrives at runtime

Nothing rewrites `app/assets/css/tailwind.css` per site any more: the panel's patcher that
used to write a brand's nine colours, radius and fonts into this file before a build is gone,
and a site's palette now reaches `:root` only through `themeToCssVars` (see
"`settings.uiTheme`" and "Runtime theme"). The nine values in the file are the template's
neutral slate — what a site with no theme record renders, nothing more. A variable read
directly by a component or a runtime style (`--color-primary-200` under a section's own
background) therefore has to be written by `themeToCssVars` too, or a themed site silently
shows that slate under its own brand.

The nine values are declared **only** in `:root`, and that `:root` — with its light-theme
twin `:root[data-theme="light"]` — sits inside `@layer theme`. Unlayered CSS outranks any
layer, so the runtime `<style id="ui-theme">` beats these defaults whatever order the
stylesheets load in (see "Runtime theme"). `tests/theme-css-layers.test.ts` holds that line:
every variable `themeToCssVars` writes may appear on a root selector in `tailwind.css`, and
in the built `entry.css`, only inside `@layer` or `@theme`. The `@theme reference` block
above declares the same names so Tailwind generates `bg-primary-200` and friends, and
`reference` is what stops Tailwind from emitting its own copy — with a plain `@theme` (or
`@theme inline`) the output contained `--color-primary-300: var(--color-primary-300)`, a
declaration referring to itself.

**Shadows are not brand data and cannot be.** Tailwind v4's shadow utilities resolve the
theme value into the rule at build time — `.shadow-primary` compiles to
`--tw-shadow: <literal>`, never `var(--shadow-primary)` — so overwriting the variable does
nothing. The manifest used to carry a `shadowPrimary` knob that could never have worked; it
is gone. `--shadow-primary` is one template token holding the card glow. Radius has no such
problem (`border-radius: var(--radius-primary)`), which is why the runtime theme can
override it. What the theme writes there goes through `resolveRadius`: old records carry a
token like `var(--radius-xl)`, but the bundle declares only `--radius-lg`, so a token from
Tailwind's scale (`none`, `xs` … `4xl`, `full`) is written as its literal, a plain CSS length
(`0`, `12px`, `50%`) passes as is, and anything else writes no line at all.

## Tailwind v4 traps in this repository

**`@config` turns off automatic source detection.** Because `tailwind.css:2` loads
`tailwind.config.js`, only these globs are scanned:

```
./app/app.vue  ./app/error.vue  ./app/components/**/*.vue
./app/pages/**/*.vue  ./app/layouts/**/*.vue  ./app/views/**/*.vue
```

A class name assembled in a `.ts` file, in a composable, or coming out of Mongo **is never
compiled**. Inside a `.vue` file the `<script>` block is scanned, which is why the ternary in
`PostCasinoReviewSafety.vue` works. When a class has to be chosen at runtime, spell every
variant out as a literal — `PostTextImage.vue` and `PostGridCards.vue` already do, and both
carry a comment saying why.

**There is no dark-mode variant.** No `dark:` appears in the repo and none should — the theme
is chosen per site in `:root[data-theme="light"]`, not per element.

**`@apply` is used nowhere.** Do not start.

## Scales

|               | Use                                                              | Not                                                      |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| Font size     | `text-step-1` … `text-step-9` (**1 is the largest**)             | `text-sm`, `text-xl`, `text-[18px]`                      |
| Radius        | `rounded-primary` (and `rounded-t-primary`, `rounded-b-primary`) | `rounded-lg`, `rounded-2xl`, `rounded-4xl`, `rounded-md` |
| Transition    | `transition duration-500 ease-in-out`                            | `duration-300`, `duration-400`                           |
| Padding block | `p-primary-1`                                                    | hand-built `py-3.5 px-2`                                 |
| Container     | `px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto`                | a new `max-w-*` per page                                 |

The size scale is called `step` and not `primary` on purpose: `text-primary-3` (a size) and
`text-primary-300` (a colour) differed by one character and both were valid.

Two radii are deliberately off the scale and should stay: `rounded-full` (a circle, not a
brand corner — the writer avatar, the back-to-top button, the pagination dots) and
`rounded-*-none` (a corner squared off where a panel meets its header).

Article headings — `#article h1…h6` — keep their own ramp of hardcoded rem values, because
folding a 2rem → 1.3rem sequence into the nine steps would either distort it or force the
scale to grow again. They do take `--font-heading`.

Nothing under the header carries a top offset: it is `sticky`, not `fixed`, and keeps its
own height in the flow (see "Frame").

Z-index has no scale yet; the values in use are `z-20` (the back-to-top button), `z-30` (the sticky CTA), `z-50` (the sticky header) and
`z-[999]` (a drawer). Pick from those rather than inventing a fifth.

## Fonts

Two families: `--font-primary` on the layout root and `--font-heading` on `#article h1…h6`
plus the two largest text steps (a rating score and a bonus sum read as headings and are set
like them). A brand with one font gets the same family in both: the panel writes it into
`type.body` and `type.display` alike. A record without `type.display` writes no
`--font-heading` line at all (`themeToCssVars`), and headings stay on the template's Inter —
they do not fall back to the body font.

`@nuxt/fonts` carries **one** family, Inter, and it is the template's fallback, not the
brand's font: it self-hosts at build time (`/_fonts/`) and knows nothing about the pair a
themed site actually uses, which arrives from `uiTheme.type` at runtime. That pair is
self-hosted at runtime instead, and the browser never talks to Google:

- **One address, one calculation.** `themeFontsHref(theme)` (`shared/utils/ui-theme.ts`)
  builds the css2 URL for both families plus the heading weight; `useUiTheme()`'s
  `fontsHref` and the server both call it, so they cannot disagree about which fonts the
  page needs.
- **The server fetches the CSS.** `/api/v1/public/settings/theme-fonts` reads the cached
  public settings, asks Google for that URL with a desktop Chrome `User-Agent` (without one
  css2 answers with whole TTFs instead of `unicode-range`-split woff2), and keeps only
  `@font-face` blocks whose every `url()` points at a gstatic font file, rewritten to
  `/_theme-fonts/<path>` (`rewriteFontFaceUrls`, `shared/utils/theme-fonts.ts`). The
  endpoint takes no input from the client, so it cannot be used to fetch anything but the
  site's own fonts. The result is a Nitro cached function on `fsApp` keyed by the URL, for a
  year; a failure is never cached there, and the same URL is not retried for a minute, so an
  unreachable Google costs one timeout, not one per page render. A `purge all` drops the
  entry too — it is refetched on the next render.
- **The plugin inlines it into the SSR HTML only.** `app/plugins/ui-theme.ts` puts the CSS
  into `<style id="ui-theme-fonts">` and deliberately keeps it out of the payload: for a CJK
  family it is hundreds of kilobytes, and state would ship it twice. On the client the style
  entry is empty and the server's tag stays where it is — unhead only removes tags it put
  there itself on the client. What does go into state is the URL whose faces are inlined
  (`useState("ui-theme-fonts-href")`).
- **The old link is a fallback.** When the theme's URL differs from the inlined one — the
  server could not get the CSS — the plugin
  emits the Google `preconnect`s and `<link rel="stylesheet">` exactly as before.
  `vitalizer.disableStylesheets` cannot eat that link: it only strips `css` entries from the
  build manifest.
- **Files come through `/_theme-fonts/[...path]`.** Only paths shaped like gstatic's
  (`s/<family>/v<n>/<name>[.<n>].woff2`, `isThemeFontPath`) are accepted. A file already on
  disk (`fsApp`, `theme-fonts:` keys — outside what a purge clears) is served as is, because
  HTML in nginx's cache may still name a previous theme's file; a new one is downloaded
  only if the current theme's CSS names it, so the route is not a proxy to all of
  fonts.gstatic.com. Every file is checked against its WOFF2 header length before it is
  stored or served — a file read while another request is still writing it would otherwise
  go out as `immutable` for a year. `url-normalize` skips the prefix, so a font path is
  never lowercased.

A family name goes through `normalizeFontFamily` on both of its ways out. Records hold both
a bare name (`Raleway`) and a ready CSS value (`"Raleway", sans-serif`); the second, taken as
is, made the Google Fonts request `family="Raleway",+sans-serif` and got a 400. So the name
is cut at the first comma and unquoted; the CSS variable gets it back quoted with a
`sans-serif` fallback — unquoted, `Source Sans 3` or `Exo 2` makes the whole `font-family`
invalid — and the link gets bare names, deduplicated after normalization. A name outside
letters, digits and spaces is dropped rather than escaped: it lands in a `<style>` and in a
URL, and the whole Google Fonts catalogue (1946 families) fits that set.

The same examples — font names, radius, hex parsing, the font link and a full
`themeToCssVars` output — live in `tests/fixtures/theme-parity.json`, and the panel keeps an
identical copy: it builds its preview with mirrored functions, and the two must not drift.
An example changes in both repositories at once.

`defaults.weights` in `nuxt.config.ts` covers only the build-time Inter; nothing patches it per
site any more. The theme pair's weights are `GOOGLE_FONT_WEIGHTS` plus `type.display.weight`
and `type.body.weight`, and loading them is only half of it: `themeFontsHref` adds those
weights so the _file_ is fetched, and `--font-heading-weight` (`themeToCssVars`, `h1…h6`'s
`font-weight`) and `--font-body-weight` (`html { font-weight: var(--font-body-weight, 400) }`;
`#article p` inherits it instead of pinning 400) are what actually _set_ them — a theme with a
weight the Google Fonts request didn't carry would render the browser's synthetic-bold
fallback instead. The body weight is written only when it is an integer from 100 to 900, so a
site without one stays at 400. Letter-spacing
has no separate loading step: `--font-heading-tracking` is a raw CSS value passed straight
through from `type.display.tracking` into `letter-spacing`.

## Logos

Brand logos are square badges and long wordmarks alike, so nothing renders them at a fixed
width. The logo (from `useSiteConfig()`) carries the file's own `width`/`height`, and
`app/utils/logo-size.ts` turns a target height — and a width ceiling — into the pair that
fits both. The logo is passed in rather than read inside, because that file is not a
composable and its callers already hold the resolved config:

```ts
<NuxtImg
  provider="cloudinary"
  v-bind="logoSize(siteConfig.logo, 36, 200)"
  class="h-auto w-auto max-h-9 max-w-[min(100%,200px)] object-contain"
  …
/>
```

**Both limits are load-bearing, and so is the CSS next to them.** A wordmark that clears the
height still tears the header apart sideways, so `maxWidth` scales the height back down
instead. And the numbers in the manifest are a claim, not a measurement — when they disagree
with the actual file the computed pair is wrong, which is exactly how a logo once rendered
twice the height of the header. `max-h`/`max-w` + `object-contain` are the floor under that:
the attributes still hold the aspect ratio against CLS, the classes cap what can be drawn.

The same helper feeds the schema.org `ImageObject` in `BasePostView.vue` — the Cloudinary
`h_` in that URL is taken from the helper's result, not written by hand, or a width-capped
logo would declare sizes the fetched image does not have.

An empty `logo.src` is a normal state: that is the template before a brand is applied. The
header, the footer and the schema.org `publisher` all skip the image entirely rather than
render a broken one.

## Images

**Article pictures — the `text-image` block, grid cards — are a plain `<img>`,
not `<NuxtImg>`.** @nuxt/image still builds every URL (`useResponsiveImage()`,
`app/composables/useResponsiveImage.ts`, over `useImage()`); what it no longer decides is the
candidate set and `sizes`, because it gets both wrong here. It writes the descriptor it asked
for, not the width of the file: `w_2560` of a 1344 px original is 2560 px of upscaled blur,
advertised as `2560w`. And its `sizes` prop understands only `px`/`vw` per breakpoint, so the
real slot — `calc(100vw - 32px)` inside the container — cannot be said at all. Logos and small
icons stay on `NuxtImg`.

Four rules:

- **Dimensions come from the data.** The panel writes the file's own `width`/`height` into
  `img` when it uploads (`PostShortcodeImage`; optional in `TextImage.ts` and `GridCard.ts`),
  and the block passes them as attributes — that is what holds the space before the file
  arrives. A record without them renders as it always did; nothing is fetched to find out.
  The exception is a vertical grid card: its `aspect-video` box holds the space already and
  the picture is `object-contain`ed into it, so the original's dimensions say nothing there.
  A horizontal card and the `image` variant get them.
- **At most one priority image per page.** `resolvePriorityImage`
  (`shared/utils/priority-image.ts`) picks it once: the banner's picture when the page has one — its own or the site's shared one, `resolveHeroImage` (`place: "hero"`, rendered by `PostHeroLayout` or the brand's `Hero.vue`; the lead then gets none), otherwise the lead's first `text-image` that has a picture, **if it is on the first screen**
  — no more than `FIRST_SCREEN_TEXT` (300) characters of text above it, a `button-ref` or an
  author card counted at their height, and any other block above it (a table of contents, a
  table, cards) pushes it off. `bottom` puts the picture under the block's own text, so that
  text counts too; an orphaned marker counts for nothing. A post without sections is searched
  in `content`. No candidate is a normal answer — the LCP is text, and there is no preload.
  The chosen block gets `loading="eager"` + `fetchpriority="high"` and puts the preload into
  the head itself (`usePriorityImagePreload`) from the very attributes its `<img>` carries, so
  `imagesrcset`/`imagesizes` cannot drift from the picture. NuxtImg's `preload` prop is not
  used for this: it builds its own set.
- **Candidates and `sizes` come only from the generator.** `candidateWidths`
  (`shared/utils/image-candidates.ts`) cuts the 320…2560 ladder at the original's width and
  offers the original itself last; with no width on record the ladder stops at 1920. Every
  candidate carries `c_limit`: a width on record is the panel's claim, and a wrong one must not
  upscale either. `imageSizes(role, layout)` (`shared/utils/image-sizes.ts`) returns the slot
  as a `calc()` per breakpoint range, and **its numbers are the components' own classes** —
  `CONTAINER`'s padding, `data-width="narrow"`'s 52rem, `p-primary-1` of a section with a
  background, the grid gaps, a horizontal card's 36 %. A padding or a gap changed in
  `PostSections`, `PostTextImage` or `PostGridCards` is changed there too, or `sizes` quietly
  asks for the wrong file. A section's background reaches the block through
  `RuntimeTemplateLayout`'s `imageLayout` prop (`IMAGE_LAYOUT_KEY`); a body rendered without
  it takes the page's layout.
- **A block never hardcodes `loading`.** It takes `imageLoading(isPriority)` — lazy for all but
  the one. Chrome is outside the rule: the header logo loads eagerly, the footer logo is `lazy`.

A grid-cards record with a numeric `imgWidth`/`imgHeight` — a size the operator typed by hand
— keeps the old 1x/2x pair built from those numbers: that is a transformation someone asked
for, not the size of the file. A section's own background image is a CSS `background-image`
with no `srcset`, so it gets one `w_1920,c_limit`.

`node scripts/perf-smoke.mjs <url> [--expect-priority]` checks a live page against these
rules from the **SSR response**, not the DOM after load: at most one `fetchpriority="high"`
(exactly one with the flag), not `lazy`, one image preload with the same `srcset`/`sizes`,
numeric `width`/`height` wherever the post's data API knows the original (outside an
`aspect-*` box), every descriptor equal to its file's `w_` and no candidate wider than the
original. It exits non-zero when any rule is broken, and it runs after every release
(`docs/release.md`). Whether the chosen picture really is the LCP is a browser's question,
not the script's.

## Components

`components: false` in `nuxt.config.ts` — **there is no auto-import.** Every component is
imported by explicit path: `#rc/components/...` across folders, `./components/X.vue` for a
widget's own private parts. Utils too: `#rc/utils/logo-size`.

Naming follows the folder: `components/post/Post*`, `components/layout/*Layout`, and a
compound widget keeps its private pieces in its own `components/` subfolder (`PostFAQ/PostFAQ.vue`
plus `PostFAQ/components/PostFAQItem.vue`).

**`PostButtonRef` is the only button.** It carries the affiliate contract — `useFakeRefLink`,
`target="_blank"`, `rel="nofollow noopener"`, `data-id="ref_link"` — plus its variants
(`outline` and `solid`, and `link` for a button that reads as text inside a table cell —
the last one by prop only; and `table`, the button of a data-table cell, coloured by its own
`ui-table-btn-*` tokens and set only by `PostDataTableRefLinkBtn` — it is not in the list a
theme or a record can pick from). **A CTA inside another block passes no `variant` at all** — left alone the
button asks the theme, which is the whole point of `variants.buttonRef`; pass one only where
the button is chrome rather than a call to action. Never copy its class string into a template; that copy
in `PostCasinoRatingCard.vue` is how `easy-in-out` (a typo for `ease-in-out`, silently
disabling the easing) survived in two places at once. It cannot render an internal
`nuxt-link`, which is the one legitimate reason to hand-roll a button — colour that from the
`outline` variant when you do.

Other things worth reusing before writing them again: `BreadcrumbsLayout` (also emits the
BreadcrumbList schema.org), `PostShowOnScroll` (scroll-reveal slot wrapper),
`ButtonFastUpLayout`, `PostProsConsBase`, and the global `<svg-icon name="client/star" />`
registered by nuxt-svg-sprite-icon.

## Strings

**Every user-facing string comes from `useSiteConfig().translates`** — the site's own
`settings.strings`, with `seo.conf.ts` as the English default under it. The site's language is
set per brand; nothing is hardcoded in a template.

`translates.entity` holds the labels of a casino card (licence, min deposit, payout speed,
the plain `yes`/`no` of a boolean row). They are shared by the rating widgets, the bonus
cards and both mini-reviews, so a new label belongs in that block **and** in
`appspro/shared/constants/brand-info-schema.js` — a key the manifest does not carry never
reaches a real site.

## Shortcodes

Article bodies arrive as HTML from Mongo and are compiled at runtime
(`vue.runtimeCompiler: true`, which is load-bearing). A marker looks like
`<div class="shortcode" is="vue:text-image" uniq-id="…">` and is resolved by the component map
in `app/components/layout/RuntimeTemplateLayout.vue` — Vue camelises `vue:text-image` into the
key `TextImage`.

**Stored HTML is compiled only through `compileSafeTemplate`**
(`shared/utils/safe-runtime-template.ts`), never through `compile` from `vue`. A binding in the
HTML is an expression the compiler runs — on the server during SSR, with the Vault token and the
site's database in the same process. `compileSafeTemplate` parses the HTML with Vue's own parser
and drops every directive, interpolation, `on*`/`srcdoc` attribute and `javascript:`/`vbscript:`
URL from the tree before codegen; `{{`/`}}` in text are collapsed to single braces first, so they
stay text. It is the same parser that compiles the result — a regex over the source disagrees with
it about where a tag ends (`title=">"`), and that disagreement is the bypass. A marker survives
because it is static attributes only.

The registry on the other side lives in `appspro/shared/constants/shortcodes.js`. Adding a
shortcode means touching both repositories, and the props must agree: `button-ref` still
offers a `wrapper-class` attribute in the panel that `PostButtonRef` has no prop for, and the
two disagree on the default `size`.

**A marker can outlive its config entry.** Guard for it — `PostTextImage.vue` shows the
pattern. Most shortcode components do not, and will throw on a stale marker.

### Variants

**A variant is a different layout, never a different colour.** Colour comes only from the
`ui-*` tokens above, which is what lets any variant live under any brand: the operator picks
`faq: accordion` once for the site and every article's FAQ folds up, in whatever palette the
theme carries. A variant that needed its own colour would be a second theme.

**Four blocks have a variant; every other block has one view.** A block without a variant
reads neither `variant` from its record nor a key from `uiTheme.variants` — whatever an older
panel or an older theme left there is simply not looked at.

| Block           | `variants.*` key | Values (default first)                       | Modifiers, not variants                     |
| --------------- | ---------------- | -------------------------------------------- | ------------------------------------------- |
| `grid-cards`    | `gridCards`      | `image-caption`, `image`, `image-title-text` | `horizontal`, `cardsPerRowDesktop`          |
| `table-content` | `toc`            | `list`, `accordion`                          | —                                           |
| `faq`           | `faq`            | `list`, `accordion`                          | —                                           |
| `button-ref`    | `buttonRef`      | `outline`, `solid`                           | `size`; `link` is a prop, not a theme value |

| Block              | The one view                                                                  | Modifiers                                   |
| ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------- |
| `data-table`       | a text table; icons in a cell and buttons in the last column are cell content | `density`, `head`, `striped`, `mobileCards` |
| `text-image`       | picture and text, see below                                                   | `imgSide`, `imgWidth`, `imgHeight`          |
| `pros-cons`        | two columns, one on a phone                                                   | —                                           |
| `biography-writer` | a card: photo 96px on the left, then name, position, about                    | —                                           |
| `contact-us`       | title, subtitle (`translates.contacts.title`/`subtitle`), the form            | — (no record)                               |

A modifier is not a variant: it stacks on top of whichever view is drawn, and it lives on the
record rather than in the theme, because two tables in the same article legitimately want
different densities.

**The default comes from the theme, one block overrides it.** A block with a variant
resolves `entry.data.variant ?? uiTheme.variants.<key> ?? <the block's own default>` through
`pickVariant` (`shared/utils/block-variant.ts`), which takes the **first candidate the block
can actually draw** — not the first non-empty one. That is deliberate: what is stored may be
a value from an older epoch, a variant that was removed, or a typo, and none of those may
leave a block unrendered. A removed value (`toc: steps`, `faq: chat`, `buttonRef: soft`) is
not translated — it falls through to the theme and then to the default.

**`grid-cards` is the exception: it translates instead.** `"1"` → `image-caption`, and
`"2"`, `text`, `offer`, `horizontal` → `image-title-text` are applied to both the record and
the theme before the variant is picked (`shared/utils/grid-cards-layout.ts`); `horizontal`
also turns the flag below on. Those values are in live posts and in saved themes alike, and
none of them is migrated.

**`horizontal` is a modifier on the record** (`data.horizontal`), not a variant: it puts the
picture in a 36 % column to the left of the text, for `image-caption` and
`image-title-text`. `image` has no text to put beside the picture and ignores it.

**The image box in `image-caption` and `image-title-text` is a fixed `aspect-video` (16:9)
with `object-contain`, not `object-cover`.** Every card in a row lands the same height
regardless of the source image's own ratio, and a near-square cover (a game thumbnail) is
never cropped in half — the letterboxing on the sides shows the card's own `bg-ui-card-bg`.
That is the vertical layout only: with `horizontal` the 36 % column has no ratio of its own,
and the picture keeps `object-cover` there (`imgFitClass`). `image` has no box and keeps
`object-cover` on its own picture.

The header, the breadcrumbs and the footer have no key here: each has one look, see "Frame".

**The table of contents' accordion is `<details open>`/`<summary>`** — no script, open
until the reader folds it, and the links are in the HTML either way. Neither view numbers the
items, and on desktop the block takes the whole column (no `max-w`). **FAQ items are open
too**: every question of both views, not only the first; the answer stays in the DOM under
`v-show` when the reader folds it.

**Every prop a block reads is optional.** A record written before this stage carries no
`variant`, no `horizontal`, no `density` — and has to render. That is why the Mongoose
schemas default them rather than requiring them, and why the components fall back rather
than branch on presence.

**A field the site stopped reading stays in its schema while the panel still writes it** —
`variant` on data-table, pros-cons, biography-writer and text-image, `imgColumn`/
`imgMobileSide` on text-image, `logo`/`score`/`bonus` on grid cards. The database is shared,
and the models have to stay compatible with the panel's.

**A new variant is two edits, not one.** The component's literal class map here, and the
enum the panel offers the operator — a variant the panel cannot write is a variant nobody
will ever see.

The axes a variant does **not** read: the border width arrives as `--ui-border-width` (see
"Frame"), so a component must not hardcode a width on a `border-ui-card-border`,
`border-ui-panel-border` or `border-ui-input-border` frame beyond the plain `border` /
`border-2` class it carries.

**A `data-table` cell is its own second runtime-compile surface.** `row[column.name]` goes
through `PostDataTableRuntime.vue` the same way the article body goes through
`RuntimeTemplateLayout.vue` — same `compileSafeTemplate`, its own small component map
(`Image` → `PostDataTableImg.vue`, plus `RefLink`, `RefLinkBtn`). `Image`'s `inline` prop
swaps the default centered 70px block for an icon sitting in the text flow
(`inline-flex`, `align-middle`, margin on the right), for a cell that reads as an icon next
to a name rather than an icon above one. Its size is the table's, not the picture's: the
record's `imageWidth`/`imageHeight` reach the cell through `DATA_TABLE_IMAGE_SIZE_KEY`
(`dataTableImageSize`, `shared/utils/data-table-image-size.ts`). Both empty — height 40,
width by proportion; one side set — the other follows the proportion; both set — a fixed
frame with the file contained whole (`object-contain`). Values are clamped to 12–400. It has to be written as a bare attribute
(`<div is="vue:Image" name="…" inline>`), never `:inline="true"` — `compileSafeTemplate`
drops every `v-*`/`:prop`/`@event`/`#slot` attribute, so only a literal one survives.

`Image`'s `logo` flag (a bare attribute too) puts the picture in a fixed 120×60 frame: the
file is contained whole and centred (`object-contain`, both `max-*-full`), asked from
Cloudinary at height 120 for a retina screen. A square logo stands 60×60 in the middle, a wide
one takes the frame's width, and the column is the same in every row with the space held before
the file loads. The frame needs no size from the file — a casino card does not store one. A
cell with `logo` and no `inline` is the only thing it changes; old records render as before.

**`mobileCards` turns the same table into cards below `sm`.** The flag lives on the record
(an unchecked table is untouched; the schema declares it or Mongoose strips it on read).
`PostDataTableGrid.vue` does it with classes alone — one DOM for both views, since a
conditional render would disagree at hydration: the head is hidden, a row is a bordered block,
a cell is "label left, value right" with the label from `data-label` through
`before:content-[attr(data-label)]`. What a cell is comes from its template
(`dataTableCellKind`, `shared/utils/data-table-cell.ts`): a `logo` image and a `ref-link-btn`
stand full width with no label (the button's `<a>` takes the whole card), a column without a
title has no label either. Cells keep the column order; nothing is moved. The divider between
a card's rows (and between rows on desktop) is `ui-table-row-border`, the colour of the card's
own frame: it used to be `ui-table-row-alt`, which is also the background of every second
card, so on those cards the line was the colour of the ground and could not be seen. The
classes are literal for the same `@config` reason as everywhere.

A header item of kind `ref` carries its own casino in `link` (`/go/<slug>/`); an empty `link`
falls back to the site's `brandSlug` as before.

`PostTextImage.vue` (`text-image` marker, `textImages` shortcode) has one layout and one
position field, `imgSide`. `left`/`right` put the picture in one of two equal columns on
desktop, `top`/`bottom` keep a single column with the picture first or last. On a phone
there is always one column, and a picture from the side goes above the text. `full` is what
the panel wrote while the position was a modifier of the variants — one column, picture
first — and is read as `top`; any other unknown value falls back to `right`
(`resolveTextImageSide`, `shared/utils/text-image.ts` — the priority image reads the side
too). Because `@config` only scans `.vue` files, the grid-column map and the order map are
literal objects keyed by side — **every variant's classes are literal for the same reason**,
which is why a component carries a `Record<variant, string>` map instead of building a class
from the stored value. `sizes` is not a map any more: a side picks a role (`left`/`right` a
half, `top`/`bottom` the whole column), and `imageSizes` does the rest (see "Images").

`imgWidth`/`imgHeight` are strings, not numbers: a count of pixels (`"320"`, `"320px"`) or
`"auto"`, and anything that is not a count reads as `auto` (`parsePixelSize`,
`shared/utils/pixel-size.ts` — grid cards read theirs through it too). `auto`/`auto` is the
old picture: the column's full width, height by proportion. A width alone sets that width
(never wider than the column on a phone, centred in its column when narrower) and asks Cloudinary for 1x/2x of it — the
transformation someone asked for, like grid cards' own size — instead of the width ladder. A
height alone keeps the full column width and crops by height (`object-cover`). Both: a
fixed pair, cropped (`fit: cover`), and the proportion survives a shrink on a phone through
`aspect-ratio`. A record older than v1.13.0 has neither field, which is `auto`.

A record with no `img` at all — text-only, or an old block whose picture lives in the body
HTML instead — collapses the grid to a single column rather than leaving an empty second one
next to the text. `imgHint` is still stored and no longer drawn: the only view that rendered
it went with the variants.

`safeHTMLWrap`'s second argument, `extraTags`, extends the sanitiser's tag allowlist
(DOMPurify's `ADD_TAGS`) for one call site without loosening it everywhere. `PostTextImage.vue`
passes `p`/`em`/`u`/`s`/`sup`/`sub`/`blockquote` because its `text` carries real paragraphs —
without `p` on the allowlist DOMPurify unwraps the tag instead of keeping it.

Attributes are fixed for every call: `href`, `rel`, `target`. `rel` is there because the
panel's generator marks links to other hosts `noopener noreferrer nofollow`, and the leading
paragraphs of a section move into the Text + Image block — without `rel` on the list the
same link would be nofollow in the body and dofollow in the block. `href` passes only
http(s) and relative URLs, so a `mailto:` link keeps its text and loses the address.

`.article-img*` in `tailwind.css` is an unrelated, older legacy: floated figures baked directly
into article body HTML rather than a shortcode record. It renders through the article's own
HTML, not through `PostTextImage.vue`, and stays as-is.

## Sections

A post written in the AppsPro constructor arrives as `sections[]` — an ordered list where each
entry is an H2 with everything under it (`uid`, `title`, `body` **without** its own `<h2>`,
plus `layout`).

**A heading's `id` is `anchor || uid`, through `sectionAnchorId`
(`shared/utils/section-anchor.ts`)** — `PostSections` and the
`table-content` block both read it. `anchor` is a readable id the panel issues per section
(`betonred-login` instead of `s3`); `uid` stays the panel's internal key and never changes.
The panel builds the flat `content` and the table-of-contents entries by the same rule, so
a template that knows `anchor` and a panel that writes it have to ship together: the panel
gates anchor generation on this template's version, and an older site keeps answering
with `uid`. `BasePostView.vue` forks on `postNeedsContent` (`shared/utils/post-content.ts`):
with sections it renders `PostSections.vue` and **drops the global `max-w-7xl` wrapper**,
without them (no field, or an empty list) it keeps the old single `RuntimeTemplateLayout` over
`content`. The panel writes both fields — it also assembles the sections into flat HTML — so a
site on an older image keeps rendering the same article from `content`.

**The public post answer carries `content` only for a post without sections.**
`withoutUnusedContent` drops it in `PostUsecase` before the value is cached, for the preview
path too: a page with sections never reads it, and in `__NUXT_DATA__` it was a second copy of
the article next to `sections[].body`. The fork above, `resolvePriorityImage` and the server
ask the same `postNeedsContent`, so they cannot disagree about which post needs it — and
anything new that reads `content` gets `undefined` on a page with sections. The cache key and
the purge are untouched; a value cached before a deploy is never read again anyway (a restart
gets a new boot id, see "Cache purge").

**A section's background comes from `layout.mode`, read on every render.** `"site"` means
"as the theme says", and the theme says something only about the **first** section — the one
with the H1 (`index === 0`): it takes `decor.firstSection` whole, its `width` too (the section's
own `width` is not consulted, since the operator picked "as the site" precisely to inherit it).
Every other section in `"site"` mode has no background; the old "background of all sections by
default" (`decor.sectionBg`, `--ui-section-bg`) is gone and a stored one is not read. `"none"`
suppresses the first section's block as well — background, colours and padding together. `"color"`/`"image"` carry the
section's own background and its own `width`. `width: "full"` paints the background on the
wrapper **outside** `CONTAINER`, edge to edge, no rounding; `width: "container"` paints it on
the `<section>` itself, **inside** `CONTAINER`, with `rounded-primary` and the `p-primary-1`
padding block. **A container box also gets a vertical margin (`my-6`), a full-width band does
not**: rounded boxes set edge to edge — a theme whose default is "in a container" puts one
under every section — read as a single slab with notches at the seams, while bands meeting
edge to edge is exactly what a full-width stripe is for. That decision — mode and width in,
which element carries the background and whether it gets the gap out — is
`resolveSectionBg` (`shared/utils/section-style.ts`, tested); `PostSections.vue` only maps its
`target` onto literal class strings, because `@config` never scans a `.ts` file (see "Tailwind
v4 traps"). `CONTAINER` itself is unconditional either way — its own horizontal padding
(`px-2.5 md:px-4 xl:px-0`) is the same `BasePostView.vue`'s legacy `content` path has always
used, and a section with no background at all (mode `"none"`, or `"site"` with nothing in
`firstSection`) renders exactly as it did before this axis existed.

**`decor.firstSection`** is `{ mode: "none"|"color"|"image", width, bg: { token, hex, opacity },
image: { path, overlay }, padding: { top, bottom }, heading, text }`. `none` or an empty record
is "nothing set": no background, colours or padding, whatever the other fields still hold.
`bg.token` and `heading`/`text` are a palette token (`primary-200`) or a hex — anything else is
dropped, because the value lands in a `style` attribute. `heading` and `text` do not paint the
section: they redefine `--color-ui-heading` and `--color-ui-text` (plus `color`) inline on its
`<section>`, the same device as `.site-header`, so the H1 and every `text-ui-text` inside take
them; empty means "as on the rest of the site". `padding.top`/`bottom` are pixels clamped to
0–200 and replace the vertical part of `p-primary-1` only — inline on the element that carries
the background (the band wrapper or the box), and on the `<section>` itself when there is no
background; the horizontal padding stays. `resolveSectionBg` returns all of it
(`target`, `style`, `gap`, `vars`, `padding`) and `sectionElementStyles` says which element
gets which string.

Section bodies go through the same `RuntimeTemplateLayout`, so shortcodes work untouched:
`shortcodesConfig` sits on the post as a whole and `uniqId` addresses a block across the
entire article, not within one section.

**Only the first section's body hydrates at once.** Every body below it is
`RuntimeTemplateLayout` behind `defineLazyHydrationComponent("visible")`: the server renders it
in full, as before, and the client compiles it when its section comes into view — hydration
used to compile the whole article in one long task. The first stays eager because it is the
first screen: the priority image is in it, never in a later section
(`resolvePriorityImage` reads only the lead). The headings are outside the lazy part, so an
anchor or the table of contents lands on a section that has not hydrated yet, and it hydrates
there. A block inside a lazy body keeps its own `visible` strategy on top — it wakes when both
it and its section are in view. A client-side navigation renders everything at once; lazy
hydration only exists on the first load.

**`shared/utils/section-style.ts`'s `normalizeSectionLayout` fills in every field a record
written before an axis existed does not carry** — `mode` defaults to `"site"`, the same
"operator never touched this" meaning an absent `sectionImageLayout`/`resolvePageFrame` field
carries elsewhere. `sectionBackgroundColor`/`sectionBackgroundImage` are what `resolveSectionBg`
builds the inline style from, and they mirror `appspro`'s own `ArticleSection.js`/`section-bg.js` — but only
the narrow shape (`mode`, `width`, `bg.token`, `image.{path,alt,overlay}`) the panel's per-section
form writes. `sectionStyle`, the older function combining colour, image, padding, margin and
radius into one inline `style`, has no caller left in this repository: the panel dropped
`padding`/`margin`/`radius`/`hex`/`opacity` from its own mirror when it brought `layout` back,
and nothing writes them from the operator-facing form any more. A record from that earlier era
can still carry them, and `normalizeSectionLayout` still parses them without throwing, but
nothing on this page reads the result. A brand token in `bg.token` becomes
`var(--color-primary-200)` rather than a resolved colour, so repainting the brand repaints
sections that were coloured long before — which only works because `themeToCssVars` writes the
nine brand variables at runtime (see "`settings.uiTheme`"); without them the variable is the
template's slate. Darkening an image
background is the same `color-mix` device, but against `--color-ui-page-bg` rather than a brand
token — a flat black overlay would read as a foreign smudge on a light theme, where the page
(and the section text sitting on it) is already light.

## Template sync

**A site repo is created "from template" on GitHub and is disconnected from
this repo from that moment on** — there is no fork relationship, no upstream
remote, nothing GitHub tracks. `sync_site_template.yml` (shipped in this
template, so every new site repo gets it automatically; an existing repo has
it added by the panel) is the only thing that reconnects the two: dispatched
with a `template_ref` tag, it checks out that tag of `shiba-inu-coder/site-template`
and `rsync -a --delete`s it over the site repo, committing the result only if
something actually changed. There is no exclude list beyond `.git` and the
checkout's own working directory — **sync overwrites everything**, on the
premise that a site carries no code of its own (see "Site config from DB"
above). If that ever stops being true and a site gains its own `site/`
directory, this workflow's `--exclude` list and this paragraph both need it.

**What survives a sync**: nothing in the repository — only what lives outside
it. That is exactly the split "Site config from DB" describes: the site's
`settings` document in Mongo (brand, layout, strings, theme) and its Vault
record (`MONGO_URI`, `DOMAIN_NAME`, `CACHE_PURGE_SECRET`, …).
A sync touches neither.

Cutting a release (bumping `TEMPLATE_VERSION`/`package.json`, tagging) is
`docs/release.md`. `sync_site_template.yml` needs `secrets.TEMPLATE_TOKEN` on
the site repo — a read-only PAT scoped to this repo, provisioned by the panel
(`GITHUB_TEMPLATE_TOKEN` in its own Vault record); wiring that secret up is a
later stage, not part of what this section documents.

**Checking what actually runs in production**: `/api/v1/public/settings/settings`
answers with `templateVersion`, read from this repo's own `TEMPLATE_VERSION`
file at build time (`nuxt.config.ts`, baked into `runtimeConfig` — the
runtime image never carries the raw file, only `.output` and `package.json`).
Comparing that value against the tag a site was last synced to is how the
panel tells a stale deploy from a stale sync.

## Known debt

Real, found, deliberately not fixed yet:

- **Six shortcodes are commented out** in `RuntimeTemplateLayout.vue` — both rating widgets,
  both bonus widgets and both mini-reviews — while their schemas and configs stay alive in
  both repositories. A large part of the styled surface is currently unreachable.
- **Triplicated components.** `PostCasinoListLogos` exists three times, `PostEntityRibbon`
  twice (byte-identical), and `PostCasinoRatingCard` / `PostBookmakerRatingCard` differ by
  about fifteen lines. Every fix has to be applied two or three times or the copies drift.
- **Dead files.** `common/PaginationDots.vue`, `PostProsCons/PostProsConsEntity.vue` and
  `PostCasinoReviewCard/PostCasinoReviewCard.vue` are imported by nothing.
- **Missing shortcode guards** in nine components (see above).
- **`pages/index.vue` and `pages/[...slug].vue`** are the same forty lines twice.
- **Lint escape hatches.** `@typescript-eslint/no-unused-vars`, `vue/no-v-html` and
  `vue/multi-word-component-names` are off in `eslint.config.mjs`, which is why the dead
  emits and variables above survive review.
