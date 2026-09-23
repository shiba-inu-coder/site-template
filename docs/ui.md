# UI & theme

Everything visual in this template is driven by a manifest that a **different program
writes in** — the AppsPro panel patches `app/assets/css/tailwind.css` from a brand manifest
before the image is built, and everything else about a particular site (menu, footer, texts,
logo, language, favicon, theme) arrives at runtime from that site's own database. See "Site
config from DB". A class picked by feel rather than by role does not just look wrong here;
it puts a brand's call-to-action colour on an article heading.

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

Text on a surface may use the 100 shade when 200 does not have the contrast — the bonus
amount in `PostCasinoRatingBonus.vue` is `text-ui-accent-soft` (default `accent-100`) for
exactly that reason. Family first, shade second.

## Light and dark

The site is light or dark **per brand**, chosen by the operator in the panel. It arrives
either from the database (`settings.uiTheme.mode`) or, when the site has no theme record
yet, from `seo.conf.ts`'s `site.theme` baked into the image; `app/plugins/ui-theme.ts` puts the
winner on `<html data-theme>` and emits the matching `<meta name="color-scheme">` — the meta
is not decoration, without it scrollbars, autofill and native controls stay dark on a light
page. See "Runtime theme" below.

What flips is only the **neutral layer**:

| Token                   | Role                                                 |
| ----------------------- | ---------------------------------------------------- |
| `text-surface-text`     | body text — never write `text-white` again           |
| `text-surface-muted`    | secondary text                                       |
| `bg-surface-raised`     | a tile that must contrast with the page (logo chips) |
| `text-surface-on-brand` | text lying on `bg-active-*` / `bg-accent-*`          |

`surface-on-brand` is the one that is easy to get wrong. A CTA button's label sits on a
**brand** colour, not on the page, so it is contrasted against `active`, not against the
ground — writing `bg-active-200 text-surface-text` there gives dark-on-dark the moment the
site is light. Its value is the inverse of `surface-text`, and it flips with the theme for
the same reason.

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
`text-accent-100`, never `text-surface-text` directly.** Which brand or neutral token
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

| Token              | Default       | Role                               |
| ------------------ | ------------- | ---------------------------------- |
| `ui-page-bg`       | `primary-300` | page/layout background             |
| `ui-header-bg`     | `primary-300` | `HeaderLayout`, its dropdown panel |
| `ui-footer-bg`     | `primary-200` | footer background                  |
| `ui-footer-bg-alt` | `primary-300` | footer copyright line              |

| Token               | Default       | Role                                              |
| ------------------- | ------------- | ------------------------------------------------- |
| `ui-card-bg`        | `primary-100` | `PostGridCards` boxed card, error page background |
| `ui-card-border`    | `primary-300` | card border, bonus-icon border                    |
| `ui-card-title`     | `accent-200`  | `PostGridCards` item title                        |
| `ui-panel-bg`       | `primary-200` | rating/bonus card body, drawer, FAQ/pros-cons box |
| `ui-panel-border`   | `primary-300` | panel/drawer/biography border                     |
| `ui-input-bg`       | `primary-100` | form input background                             |
| `ui-input-border`   | `primary-100` | form input border, small logo/divider borders     |
| `ui-highlight-bg`   | `active-100`  | no consumer (see below)                           |
| `ui-highlight-text` | `primary-300` | no consumer (see below)                           |

| Token           | Default            | Role                                                 |
| --------------- | ------------------ | ---------------------------------------------------- |
| `ui-heading`    | `accent-200`       | `#article h1`–`h6`, eyebrow labels, gift/bonus icons |
| `ui-text`       | `surface-text`     | body text                                            |
| `ui-muted`      | `surface-muted`    | secondary text (breadcrumb chevron, card hint)       |
| `ui-link`       | `active-200`       | inline links, outline-button text/border             |
| `ui-link-hover` | `active-300`       | hover/focus target for `ui-link`                     |
| `ui-cta-bg`     | `active-200`       | solid CTA background (`PostButtonRef` solid)         |
| `ui-cta-hover`  | `active-300`       | hover/focus target for `ui-cta-bg`                   |
| `ui-cta-text`   | `surface-on-brand` | text/icon sitting on `ui-cta-bg`                     |

| Token                 | Default            | Role                                                                                           |
| --------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `ui-table-head-bg`    | `primary-300`      | `PostDataTable` head row                                                                       |
| `ui-table-head-text`  | `surface-text`     | `PostDataTable` head row text                                                                  |
| `ui-table-row`        | `primary-200`      | even data-table row                                                                            |
| `ui-table-row-alt`    | `primary-300`      | odd row, row divider                                                                           |
| `ui-table-row-border` | `primary-100`      | data-table outer border                                                                        |
| `ui-badge-bg`         | `accent-200`       | author/position badge background                                                               |
| `ui-badge-text`       | `surface-on-brand` | text on `ui-badge-bg`                                                                          |
| `ui-marker`           | `accent-200`       | `#article` list markers, author avatar ring, `data-h2`/`data-bg`/hero decor                    |
| `ui-accent-strong`    | `accent-300`       | rating score, entity ribbon cutout                                                             |
| `ui-accent-soft`      | `accent-100`       | bonus amount (needs the lighter shade for contrast — same reason as the old `text-accent-100`) |

Two families exist only because the code did: `ui-highlight-*` was `PostButtonRef`'s `soft`
variant, and nothing reads it since that variant went. The token stays because the panel's
scheme editor writes it, and dropping it is an edit on both sides. `ui-accent-strong`/`ui-accent-soft` split
`accent-300`/`accent-100` out from `ui-heading` (`accent-200`) the same way the brand family
itself splits by shade — same hue, different weight, independently tunable later.

### `/* UI scheme */` is additive, not a second patcher contract

The block lives in `:root`, under the nine brand colours, behind its own anchor comment. It
is **not** read by `appspro/server/helpers/brand-apply/patch-tailwind-css.js` — that patcher
only touches `/* Primary */`/`/* Accent */`/`/* Active */`, `--radius-primary`,
`--font-primary` and `--font-heading`, all still exactly where the "`:root` is a contract"
section below describes. Renaming or reordering a `ui-*` line does not break brand apply. It
does break the site the moment a component's class stops matching a declared token, the same
way a typo in any Tailwind class would — there is no separate machine check for that yet.

Every `--color-ui-*` value is a `var(--color-<family>-<shade>)` or `var(--color-surface-*)`
reference, never a literal hex — that's what makes the scheme swappable later without
touching the nine brand values themselves. `:root[data-theme="light"]` is untouched by this
layer: `ui-text`/`ui-muted`/`ui-cta-text` resolve through `surface-*`, which is what already
flips with the theme.

### `settings.uiTheme`

The full per-site theme form (`shared/utils/ui-theme.ts`, mirrored by the admin panel) has
twelve axes, and all of them are read now: `colors`, `scheme`, `type`, `geometry` and
`variants` (see "Shortcodes") by the components and the runtime `:root`, `frame`, `decor`,
`accents` and the non-family parts of `type`/`geometry` as `data-*` attributes on the page
root (see "Frame"):

```ts
UiTheme = {
  templateId, templateName, mode: "dark" | "light",
  colors: { primary, active, accent } × { 300, 200, 100 },
  scheme: { [uiToken]: "primary-200" | "surface-text" | "#hex" }, // ~31 keys, see table above
  type: { display: { family, weight?, case?, tracking? }, body: { family }, scale?, h1Align? },
  geometry: { radius, borders?, shadow?, density? },
  variants: { toc?, gridCards?, faq?, buttonRef? }, // see "Shortcodes"
  frame: { headerInverted?, heroStyle?, bands? }, // hero/sidebar/width/sticky moved to the post's own `frame`, see "Frame"
  decor: { h2?, bg?, img?, btn? }, accents: { badge? }, // see "Frame"
  updatedAt,
}
```

`resolveScheme(theme)` turns `scheme` into `Record<uiToken, hex>` — a ref starting with
`primary-`/`active-`/`accent-` reads `theme.colors`, one starting with `surface-` reads a
fixed dark/light neutral pair (the same values as `:root`/`:root[data-theme="light"]`), and
anything else (a `#hex`) passes through unchanged. `themeToCssVars(theme)` wraps
`resolveScheme`'s output plus `--radius-primary`/`--font-primary`/`--font-heading` in one
`:root { … }` string — **no `--shadow-*`**: shadow utilities compile to a literal at build
time (see below), so a runtime CSS variable for it would do nothing, the same reason the
brand patcher never patched one. An axis the record does not carry is left out of that
string rather than written empty, so a half-filled theme cannot blank a value the image
already has. `DEFAULT_UI_THEME_DARK`/`DEFAULT_UI_THEME_LIGHT` are the template's current look
expressed in this shape — the panel's starting point for a new theme, not what the site
falls back to: a site with no record renders from the CSS in its own image (see "Runtime
theme").

Storage: `models/schemas/UiTheme.ts`, embedded as `Setting.uiTheme`. `scheme` and `variants`
are their own sub-schemas with `strict: false` — the known keys are declared (so a real typo
still shows up in review), but an unrecognised one is kept rather than silently dropped,
because the panel and this image don't always deploy in the same breath. `frame`, `decor`
and `accents` are `Mixed` — their fields are read by CSS, not by the schema, and declaring
them twice would only mean migrating twice. `setting.repository.ts` `getPublic()` returns
`uiTheme` alongside `redirectsRoutes`, `brand`, `layout` and `strings`.

## Site config from DB

**Nothing about a particular site lives in this repository any more.** The menu, the footer,
every interface string, the logo, the favicon, the brand slug and the language arrive from
that site's `settings` document; `seo.conf.ts` is the template's neutral default underneath
them — empty name, `lang: "en"`, English strings, empty menus. Editing a brand in the panel is
a write into Mongo plus a `settings` cache purge: no commit, no image, no deploy. The live
preview (`ui-manifest`, see "Preview protocol" below) writes into that same state directly,
bypassing the public settings route and its cache entirely.

Three subdocuments carry it (`server/adapters/repository/mongodb/models/schemas/`):

| Field              | Schema       | Holds                                                                                                     |
| ------------------ | ------------ | --------------------------------------------------------------------------------------------------------- |
| `settings.brand`   | `Brand.ts`   | `name`, `lang`, `brandSlug`, `logo {src,alt,width,height}`, `favicon {src}`, `imgRoundCorner`             |
| `settings.layout`  | `Layout.ts`  | `header {items, cta}`, `footer {title, body, links, legalLogos, paymentLogos}`, `breadcrumbs {homeLabel}` |
| `settings.strings` | `Strings.ts` | the whole `seoConfig.translates` tree                                                                     |

`Strings.ts` declares **no** keys and is `strict: false` on purpose: the key set is the
panel's (`seo-conf-defaults.js`), it grows there, and the site's image does not redeploy in
the same breath — an unknown key is kept, not dropped. `HeaderItem` in `Layout.ts` references
itself through a separate `.add()` because Mongoose cannot reference a schema inside its own
literal.

**`useSiteConfig()` is the only way a component reads any of this.** It is a `computed` over
`buildSiteConfig(seoConfig, settings)` (`shared/utils/site-config.ts`, pure, no Nuxt), and it
returns the template's own shape — `site`, `logo`, `favicon`, `img`, `layout`, `translates` —
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
fallback; the brand's own pair comes from `uiTheme.type` as a Google Fonts link written by
the plugin. Nothing in `nuxt.config.ts` is patched per site any more.

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
falls back to the brand baked into `tailwind.css` by the AppsPro patcher, to
`seo.conf.ts`'s `site.theme` for the mode, and to the build's own Inter. That is the state every
site is in until an operator saves a theme for it, so the fallback is the normal path, not
an error path.

Two details that look like noise and are not:

- `<style id="ui-theme">` is pushed with **`tagPriority: 65`**. unhead sorts head tags by
  weight, and both `<link rel="stylesheet">` and `<style>` weigh 60, ties broken by
  registration order — the plugin registers before the bundle's own CSS, so at the default
  weight the runtime `:root` would land _above_ `tailwind.css` and lose the cascade to it.
  65 puts it after every stylesheet and before the preloads (70).
- **The font link is written by hand.** `@nuxt/fonts` scans CSS at build time and knows
  nothing about a family that arrives from Mongo, so the plugin emits two `preconnect`s and
  one `<link rel="stylesheet">` to Google Fonts covering both families (`type.display` and
  `type.body`) in a single request. `vitalizer.disableStylesheets` cannot eat it: that
  option only strips `css` entries from the build manifest and never touches head tags.

`useUiTheme()` is where a component asks about the theme: `theme` (the record or `null`),
`mode`, `cssVars`, `fontsHref`, `contrast`, `variantFor(key)` (the block-variant lookup, see
"Shortcodes"), `frame` (the frame a component has to branch on — who draws the H1, whether
the sidebar column exists at all) and `frameAttrs` (the `data-*` attributes for the page
root, see "Frame"). `setTheme()` replaces the theme in state; the head is described as a
getter, so the style tag, `data-theme`, the font link and the attributes all repaint without
a reload. `isPreview`, `panelOrigins` and `notifyPanel(message)` are the same preview-bridge
plumbing the plugin uses for `ui-ready`/`ui-contrast`.

### Preview protocol

The panel previews a theme by embedding the site and talking to it over `postMessage`.

| Message                             | Direction    | When                                                                                                                             |
| ----------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `{ type: "ui-ready" }`              | site → panel | once, on mount                                                                                                                   |
| `{ type: "ui-theme", theme }`       | panel → site | on every change the operator makes                                                                                               |
| `{ type: "ui-manifest", settings }` | panel → site | on every manifest field edit, debounced — merges `brand`/`layout`/`strings` into state, leaves `uiTheme`/`redirectsRoutes` alone |
| `{ type: "ui-contrast", report }`   | site → panel | after each applied theme, from `contrastReport`                                                                                  |

Two gates, both required: the URL carries `?preview=` (the same query the staging pass
already uses) **and** `event.origin` is listed in `runtimeConfig.public.PANEL_ORIGINS`, a
comma-separated env value (`.env` locally, the site's Vault record in production, so adding
a panel domain needs no rebuild). Without them a message is dropped: an unlisted origin —
or the live URL of the same page — must not be able to repaint a production site. An empty
`PANEL_ORIGINS` accepts nothing, which is the right default for a site nobody previews.

## Frame

**The page around the article is a set of variants, not a fixed layout** — except for the
header, the breadcrumbs and the footer, which have one look each and no theme key (see below).
Four of the frame axes — `hero`, `sidebar`, `width`, `sticky` — live on the **post**
(`IPost.frame`, `shared/types/post.ts`), not the theme: every page picks its own, and a post
with no `frame` at all gets the same defaults the site drew before this existed.
`heroStyle`/`headerInverted`/`bands` stay in `uiTheme.frame` — brand-level, one per site, like
`decor`/`type`/`geometry`. `resolvePageFrame(theme, postFrame)`
(`shared/utils/ui-theme.ts`) merges the two sources into one `UiFrame`, dropping a value that
isn't one of the axis's own — old data from another era, a typo — rather than let it reach the
CSS; `useUiTheme().frameAttrs` then turns the merged result into `data-*` attributes on the
page root — `<div id="site">` in `layouts/default.vue` **and in `error.vue`**, because a 404 is
not drawn by the layout and would otherwise lose the frame.

| Attribute              | Axis                           | Values                                                          | Without a value |
| ---------------------- | ------------------------------ | --------------------------------------------------------------- | --------------- |
| `data-scale`           | `uiTheme.type.scale`           | `compact` / `regular` / `display`                               | `regular`       |
| `data-h1`              | `uiTheme.type.h1Align`         | `left` / `center`                                               | `left`          |
| `data-density`         | `uiTheme.geometry.density`     | `tight` / `regular` / `airy`                                    | `regular`       |
| `data-borders`         | `uiTheme.geometry.borders`     | `0` / `1` / `2`                                                 | `1`             |
| `data-shadow`          | `uiTheme.geometry.shadow`      | `none` / `soft` / `glow`                                        | `none`          |
| `data-width`           | **post** `frame.width`         | `narrow` / `wide`                                               | `wide`          |
| `data-header-inverted` | `uiTheme.frame.headerInverted` | `true` / `false`                                                | `false`         |
| `data-hero`            | **post** `frame.hero`          | `none` / `band` / `photo`                                       | `none`          |
| `data-hero-style`      | `uiTheme.frame.heroStyle`      | `radial`…`flat` (seven, see below)                              | `none`          |
| `data-sidebar`         | **post** `frame.sidebar`       | `none` / `toc` / `toc-offer`                                    | `none`          |
| `data-bands`           | `uiTheme.frame.bands`          | `true` / `false`                                                | `false`         |
| `data-sticky`          | **post** `frame.sticky`        | `none` / `bar` / `button`                                       | `none`          |
| `data-h2`              | `uiTheme.decor.h2`             | `none`/`underline`/`left-rule`/`dot`/`gradient`/`number`/`line` | `none`          |
| `data-bg`              | `uiTheme.decor.bg`             | `flat` / `radial` / `dots` / `grid` / `stripes`                 | `flat`          |
| `data-img`             | `uiTheme.decor.img`            | `rounded` / `framed` / `square` / `tilt`                        | `rounded`       |
| `data-btn`             | `uiTheme.decor.btn[]`          | space-joined subset of `pill skew gradient`                     | none            |
| `data-badge`           | `uiTheme.accents.badge`        | `pill` / `square`                                               | `pill`          |

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
  or button is an edit in the panel's header constructor. `frame.headerInverted` stays: it is
  a colour (white neutral over a brand surface), not a layout. A `frame.header` still stored
  in an older theme record is not read.
- **Hero** — `HeroLayout.vue`, rendered by `BasePostView.vue` above the sections when the
  post's own `frame.hero !== "none"`. Breadcrumbs, the date line, the first section's H1, the author
  line (`PostBiographyWriter` with `compact`) and a CTA move into it; with `hero: "photo"`
  the lead's `text-image` picture moves too. **What moves is decided once**, in
  `useHeroContent()`, and `PostSections.vue` reads the same decision — it drops the first
  section's H1 and renders its body with the moved markers removed
  (`shared/utils/shortcode-markers.ts`), or the author and the picture would appear twice.
  `heroStyle` is seven branches of background in CSS; `skew` lays its ribbon with a
  pseudo-element, and `solid` is the one branch that redefines `--color-ui-*` locally.
- **Sidebar** — `AsideLayout.vue`, `md+` only, from the post's own `frame.sidebar`. The
  article's own table of contents, or one
  assembled from the section titles when the article has no `table-content` block, plus the
  offer card under `toc-offer`. The in-flow table of contents is hidden on desktop when a
  sidebar exists (`.toc-block` in the axes block) and stays in the page on a phone, where
  there is no sidebar at all.
- **Bands** — `PostSections.vue` puts `band` on every second section (the lead is never
  banded). No `calc(50% - 50cqw)` is needed here: sections already sit at full width and the
  band is an ordinary block around the centred column. Bands and a sidebar are not meant to
  be combined, and no preset does.
- **Sticky CTA** — `StickyCtaLayout.vue`, phone only, `bar` (bonus line plus button) or
  `button`, from the post's own `frame.sticky`. It **replaced `BonusLayout.vue`**, the
  floating gift that used to sit in the corner of every page; a page with no `frame.sticky`
  now shows nothing there.
- **Breadcrumbs** — `BreadcrumbsLayout.vue`, one look: text links (`ui-link`) separated by a
  chevron, the current page as plain `ui-text` with no link. The first crumb is always the
  home page labelled with the brand name, `site.name`: the server takes that label from the
  home page's `breadcrumbTitle`, and the panel leaves it empty there. `breadcrumbTitle` and
  `layout.breadcrumbs.homeLabel` only answer on a template no brand has been applied to. The
  BreadcrumbList schema.org carries the same labels.
- **Footer** — `FooterLayout.vue`, one look, no logo: a text column (`layout.footer.body`, the
  disclaimer HTML the brand run generates) beside a links column (`layout.footer.links`), a
  row of badges under them (`layout.footer.legalLogos` — 18+, GamCare, the licence; Cloudinary
  public ids through `NuxtImg`), and the copyright line. That line is `layout.footer.title`,
  which the panel assembles as "domain © year rights" when a brand is applied, so its year is
  the year of the last apply; a site with no brand record gets `© <year> <DOMAIN_NAME>`.

The offer behind the sidebar card and the sticky bar is `usePageOffer()`: there is no "offer"
record in an article, so it is assembled from what the page already has — the banner's casino
(logo, title, bonus text) — and falls back to `layout.header.cta`.

`CtaButtonLayout.vue` is the one button those three places use. It exists because
`PostButtonRef` is always an external affiliate link and cannot render an internal
`nuxt-link`, which `layout.header.cta.link` may well be.

## `:root` is a contract, not a stylesheet

`app/assets/css/tailwind.css` is parsed by
`appspro/server/helpers/brand-apply/patch-tailwind-css.js`, which throws rather than guesses.
This is about the nine brand values only — the `/* UI scheme */` block a few lines below them
is a **different, additive** layer the patcher never reads; see "UI tokens" above. The
patcher needs, verbatim:

- the literal `:root {`, and the block closed by a `\n}`;
- the comments `/* Primary */`, `/* Accent */`, `/* Active */`, each followed by its three
  `--color-<family>-<shade>:` declarations;
- `--radius-primary:`, `--font-primary:` and `--font-heading:` **exactly once** each.

Renaming a comment, reordering the families or adding a second `--radius-primary` does not
break the site — it breaks _brand apply_, in production, for every site at once. The
contract is pinned by `appspro/tests/server/helpers/patch-tailwind-css.test.js`; the patcher
is a pure function and also runs under bare node against this checkout.

The nine values live **only** in `:root`. The `@theme reference` block above declares the
same names so Tailwind generates `bg-primary-200` and friends, and `reference` is what stops
Tailwind from emitting its own copy — with a plain `@theme` (or `@theme inline`) the output
contained `--color-primary-300: var(--color-primary-300)`, a declaration referring to itself,
which only rendered because unlayered CSS outranks `@layer theme`.

**Shadows are not brand data and cannot be.** Tailwind v4's shadow utilities resolve the
theme value into the rule at build time — `.shadow-primary` compiles to
`--tw-shadow: <literal>`, never `var(--shadow-primary)` — so overwriting the variable does
nothing. The manifest used to carry a `shadowPrimary` knob that could never have worked; it
is gone. `--shadow-primary` is one template token holding the card glow. Radius has no such
problem (`border-radius: var(--radius-primary)`), which is why it stays patchable.

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
brand corner, and what `accents.badge` toggles) and `rounded-*-none` (a corner squared off
where a panel meets its header).

Article headings — `#article h1…h6` — keep their own ramp of hardcoded rem values, because
folding a 2rem → 1.3rem sequence into the nine steps would either distort it or force the
scale to grow again. They do take `--font-heading`.

`BasePostView.vue` opens with `mt-18` — an offset for the fixed header in
`HeaderLayout.vue`, and the only one: the header has a single height. Changing the header's
padding silently breaks the gap under it.

Z-index has no scale yet; the values in use are `z-20` (the hero's content over its
decorations, the back-to-top button), `z-30` (the sticky CTA), `z-50` (the fixed header) and
`z-[999]` (a drawer). Pick from those rather than inventing a fifth.

## Fonts

Two families: `--font-primary` on the layout root and `--font-heading` on `#article h1…h6`
plus the two largest text steps (a rating score and a bonus sum read as headings and are set
like them). A brand with one font gets the same family in both — the manifest's `fontHeading`
is optional and the patcher falls back.

`@nuxt/fonts` carries **one** family, Inter, and it is the template's fallback, not the
brand's font: the pair a themed site actually uses arrives from `uiTheme.type` as a Google
Fonts link written by `app/plugins/ui-theme.ts` at runtime.

`defaults.weights` in `nuxt.config.ts` is **one list for every family**, so the patcher writes
the union of both fonts' weights. Declaring the heading font with the same name but a heavier
weight is a supported way to ask for that weight.

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
  class="h-auto w-auto max-h-9 max-w-[200px] object-contain"
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
the last one by prop only). **A CTA inside another block passes no `variant` at all** — left alone the
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

| Block              | The one view                                                                  | Modifiers                                     |
| ------------------ | ----------------------------------------------------------------------------- | --------------------------------------------- |
| `data-table`       | a text table; icons in a cell and buttons in the last column are cell content | `density`, `head`, `striped`                  |
| `text-image`       | picture and text, see below                                                   | `imgSide`                                     |
| `pros-cons`        | two columns, one on a phone                                                   | —                                             |
| `biography-writer` | a card: photo 96px on the left, then name, position, about                    | a `compact` **prop** — the hero's author line |
| `contact-us`       | title, subtitle (`translates.contacts.title`/`subtitle`), the form            | — (no record)                                 |

A modifier is not a variant: it stacks on top of whichever view is drawn, and it lives on the
record rather than in the theme, because two tables in the same article legitimately want
different densities. `compact` on the author block is a prop for the same kind of reason —
it is a place on the page (the hero's line under the H1), not something the theme chooses.

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

The header, the breadcrumbs and the footer have no key here: each has one look, see "Frame".

**The table of contents' accordion is `<details>`/`<summary>`** — no script, closed until
clicked, and the links are in the HTML either way. The sidebar (`AsideLayout.vue`) renders
the same component, so the theme's `toc` reaches it too. Neither view numbers the items.

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

The axes a variant does **not** read: `geometry.borders`/`shadow`, `decor.img`/`btn` and
`accents.badge` arrive as `data-*` attributes on the page root, so a component must not
hardcode a border, a shadow or a button shape where those are meant to reach it.

**A `data-table` cell is its own second runtime-compile surface.** `row[column.name]` goes
through `PostDataTableRuntime.vue` the same way the article body goes through
`RuntimeTemplateLayout.vue` — same `sanitizeRuntimeTemplate`, its own small component map
(`Image` → `PostDataTableImg.vue`, plus `RefLink`, `RefLinkBtn`). `Image`'s `inline` prop
swaps the default centered 70px block for a 20px icon sitting in the text flow
(`inline-flex`, `align-middle`, margin on the right), for a cell that reads as an icon next
to a name rather than an icon above one. It has to be written as a bare attribute
(`<div is="vue:Image" name="…" inline>`), never `:inline="true"` — `sanitizeRuntimeTemplate`
strips only `v-*`/`:prop`/`@event`/`#slot` attributes, so a literal one survives untouched.

`PostTextImage.vue` (`text-image` marker, `textImages` shortcode) has one layout and one
position field, `imgSide`. `left`/`right` put the picture in one of two equal columns on
desktop, `top`/`bottom` keep a single column with the picture first or last. On a phone
there is always one column, and a picture from the side goes above the text. `full` is what
the panel wrote while the position was a modifier of the variants — one column, picture
first — and is read as `top`; any other unknown value falls back to `right`. Because
`@config` only scans `.vue` files, the grid-column map, the order map and the `sizes` map for
`NuxtImg` are literal objects keyed by side — **every variant's classes are literal for the
same reason**, which is why a component carries a `Record<variant, string>` map instead of
building a class from the stored value.

A record with no `img` at all — text-only, or an old block whose picture lives in the body
HTML instead — collapses the grid to a single column rather than leaving an empty second one
next to the text. `imgHint` is still stored and no longer drawn: the only view that rendered
it went with the variants.

`safeHTMLWrap`'s second argument, `extraTags`, extends the sanitiser's tag allowlist
(DOMPurify's `ADD_TAGS`) for one call site without loosening it everywhere. `PostTextImage.vue`
passes `p`/`em`/`u`/`s`/`sup`/`sub`/`blockquote` because its `text` carries real paragraphs —
without `p` on the allowlist DOMPurify unwraps the tag instead of keeping it.

`.article-img*` in `tailwind.css` is an unrelated, older legacy: floated figures baked directly
into article body HTML rather than a shortcode record. It renders through the article's own
HTML, not through `PostTextImage.vue`, and stays as-is.

## Sections

A post written in the AppsPro constructor arrives as `sections[]` — an ordered list where each
entry is an H2 with everything under it (`uid`, `title`, `body` **without** its own `<h2>`,
plus `layout`). `BasePostView.vue` forks on `sections?.length`: with sections it renders
`PostSections.vue` and **drops the global `max-w-7xl` wrapper**, without them it keeps the old
single `RuntimeTemplateLayout` over `content`. Both fields are always populated — the panel
also assembles the sections into flat HTML — so a site that has not been rebuilt yet keeps
rendering the same article from `content` and notices nothing.

Every section renders inside the same `CONTAINER` wrapper no matter what `layout.width` says —
`PostSections.vue` stopped reading `section.layout` altogether, and with it went the
`container`/`full` branch and the inline `style="padding:…"`. `CONTAINER` carries its own
horizontal padding again (`px-2.5 md:px-4 xl:px-0`), the same values `BasePostView.vue`'s
legacy `content` path has always used. The old full-bleed trick (`100vw`, negative margins)
still exists only in the panel's fallback HTML, where the markup lives inside the shared
container and has to fight its way out — not on this path.

Section bodies go through the same `RuntimeTemplateLayout`, so shortcodes work untouched:
`shortcodesConfig` sits on the post as a whole and `uniqId` addresses a block across the
entire article, not within one section.

**`shared/utils/section-style.ts` is a mirror of `appspro/shared/utils/article-sections.js`.**
Colours, padding, margin and radius are emitted as an inline `style`, never as classes: the
values come out of Mongo, and `@config` means a class assembled at runtime is never compiled.
`layout.padding` is an object (`{top,right,bottom,left}`, px) rather than the four presets it
used to be — a record written before that change still stores a preset string
(`none`/`sm`/`md`/`lg`), and `normalizeSectionLayout` converts it to px on the way in so old and
new records render the same way. The outer margin (`margin.top`/`bottom`, gap from the
neighbouring sections) is written as `margin-top`/`margin-bottom` specifically, never the
`margin` shorthand — the panel's own fallback HTML relies on `margin-left` for its "full width"
escape trick, and the shorthand would zero that out if it ever landed on the same element. A
brand token becomes `color-mix(in srgb, var(--color-primary-200) 40%, transparent)` rather than
a resolved colour, so repainting the brand repaints articles that were written long before. If
that formula changes on one side and not the other, the same article renders differently
depending on which of the two paths drew it.

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
record (`MONGO_URI`, `DOMAIN_NAME`, `CACHE_PURGE_SECRET`, `PANEL_ORIGINS`, …).
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
