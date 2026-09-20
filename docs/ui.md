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
| `ui-footer-bg`     | `primary-200` | footer links row                   |
| `ui-footer-bg-alt` | `primary-300` | footer bottom row (title + logo)   |

| Token               | Default       | Role                                              |
| ------------------- | ------------- | ------------------------------------------------- |
| `ui-card-bg`        | `primary-100` | `PostGridCards` boxed card, error page background |
| `ui-card-border`    | `primary-300` | card border, bonus-icon border                    |
| `ui-card-title`     | `accent-200`  | `PostGridCards` item title                        |
| `ui-panel-bg`       | `primary-200` | rating/bonus card body, drawer, FAQ/pros-cons box |
| `ui-panel-border`   | `primary-300` | panel/drawer/biography border                     |
| `ui-input-bg`       | `primary-100` | form input background                             |
| `ui-input-border`   | `primary-100` | form input border, small logo/divider borders     |
| `ui-highlight-bg`   | `active-100`  | `PostButtonRef` soft variant                      |
| `ui-highlight-text` | `primary-300` | `PostButtonRef` soft variant text                 |

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
| `ui-table-head-bg`    | `primary-300`      | `PostDataTable` head row, `compare` card header, `prosCons: table` header                      |
| `ui-table-head-text`  | `surface-text`     | `PostDataTable` head row text                                                                  |
| `ui-table-row`        | `primary-200`      | even data-table row                                                                            |
| `ui-table-row-alt`    | `primary-300`      | odd row, row divider                                                                           |
| `ui-table-row-border` | `primary-100`      | data-table outer border                                                                        |
| `ui-badge-bg`         | `accent-200`       | author/position badge background                                                               |
| `ui-badge-text`       | `surface-on-brand` | text on `ui-badge-bg`                                                                          |
| `ui-marker`           | `accent-200`       | `#article` list markers, stars, `ranking` top row, the rule/stripe of `toc`/`quote`/`stripe`   |
| `ui-accent-strong`    | `accent-300`       | rating score, entity ribbon cutout                                                             |
| `ui-accent-soft`      | `accent-100`       | bonus amount (needs the lighter shade for contrast — same reason as the old `text-accent-100`) |

Two families exist only because the code did: `ui-highlight-*` is `PostButtonRef`'s `soft`
variant — a real fifth shade combination, not a duplicate of `ui-cta-*`. `ui-accent-strong`/`ui-accent-soft` split
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
  variants: { gridCards?, dataTable?, textImage?, faq?, … }, // see "Shortcodes"
  frame: { header?, headerInverted?, hero?, heroStyle?, sidebar?, bands?, width?, sticky? },
  decor: { h2?, bg?, img?, btn? }, accents: { badge?, big? }, // see "Frame"
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
a write into Mongo plus a `settings` cache purge: no commit, no image, no deploy.

Three subdocuments carry it (`server/adapters/repository/mongodb/models/schemas/`):

| Field              | Schema       | Holds                                                                                                             |
| ------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `settings.brand`   | `Brand.ts`   | `name`, `lang`, `brandSlug`, `logo {src,alt,width,height}`, `favicon {src}`, `imgRoundCorner`                     |
| `settings.layout`  | `Layout.ts`  | `header {items, topbar, cta}`, `footer {title, body, links, legalLogos, paymentLogos}`, `breadcrumbs {homeLabel}` |
| `settings.strings` | `Strings.ts` | the whole `seoConfig.translates` tree                                                                             |

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
plumbing the plugin uses for `ui-ready`/`ui-contrast`, exposed so `VariantPicker` (see "`/ui`
page" below) can reuse it instead of duplicating the origin check; `previewAttached` and
`markPreviewAttached()` track whether the panel answered `ui-ready` with `ui-attach`, and
`setVariant(group, key, value)` is what a picker click actually calls.

### Preview protocol

The panel previews a theme by embedding the site and talking to it over `postMessage`.

| Message                              | Direction    | When                                                       |
| ------------------------------------ | ------------ | ---------------------------------------------------------- |
| `{ type: "ui-ready" }`               | site → panel | once, on mount                                             |
| `{ type: "ui-attach" }`              | panel → site | reply to `ui-ready` — this is what "live connection" means |
| `{ type: "ui-theme", theme }`        | panel → site | on every change the operator makes                         |
| `{ type: "ui-contrast", report }`    | site → panel | after each applied theme, from `contrastReport`            |
| `{ type: "ui-variant", key, value }` | site → panel | a `VariantPicker` click, on any page — see "`/ui` page"    |

Two gates, both required: the URL carries `?preview=` (the same query the staging pass
already uses) **and** `event.origin` is listed in `runtimeConfig.public.PANEL_ORIGINS`, a
comma-separated env value (`.env` locally, the site's Vault record in production, so adding
a panel domain needs no rebuild). Without them a message is dropped: an unlisted origin —
or the live URL of the same page — must not be able to repaint a production site. An empty
`PANEL_ORIGINS` accepts nothing, which is the right default for a site nobody previews.
`ui-variant` carries no `group` (`variants.*` vs `frame.*`) — the panel already knows which
axis each `key` belongs to from its own theme editor (6a), and the site's own local apply
(`setVariant`) gets it from the picker's own config instead of guessing from the key name.

## Frame

**The page around the article is a set of variants, not a fixed layout.** Which one a site
draws comes from `uiTheme.frame`/`decor`/`type`/`geometry`, and it reaches the CSS as
`data-*` attributes on the page root — `<div id="site">` in `layouts/default.vue` **and in
`error.vue`**, because a 404 is not drawn by the layout and would otherwise lose the frame.
`useUiTheme().frameAttrs` builds the object; the template just `v-bind`s it.

| Attribute                       | Axis                            | Values                                                          | Without a theme |
| ------------------------------- | ------------------------------- | --------------------------------------------------------------- | --------------- |
| `data-scale`                    | `type.scale`                    | `compact` / `regular` / `display`                               | `regular`       |
| `data-h1`                       | `type.h1Align`                  | `left` / `center`                                               | `left`          |
| `data-density`                  | `geometry.density`              | `tight` / `regular` / `airy`                                    | `regular`       |
| `data-borders`                  | `geometry.borders`              | `0` / `1` / `2`                                                 | `1`             |
| `data-shadow`                   | `geometry.shadow`               | `none` / `soft` / `glow`                                        | `none`          |
| `data-width`                    | `frame.width`                   | `narrow` / `wide`                                               | `wide`          |
| `data-header`                   | `frame.header`                  | `classic` / `centered` / `compact` / `two-row` / `search`       | `classic`       |
| `data-header-inverted`          | `frame.headerInverted`          | `true` / `false`                                                | `false`         |
| `data-hero` / `data-hero-style` | `frame.hero`, `frame.heroStyle` | `none`/`band`/`photo`; `radial`…`flat`                          | `none`          |
| `data-sidebar`                  | `frame.sidebar`                 | `none` / `toc` / `toc-offer`                                    | `none`          |
| `data-bands`                    | `frame.bands`                   | `true` / `false`                                                | `false`         |
| `data-sticky`                   | `frame.sticky`                  | `none` / `bar` / `button`                                       | `none`          |
| `data-h2`                       | `decor.h2`                      | `none`/`underline`/`left-rule`/`dot`/`gradient`/`number`/`line` | `none`          |
| `data-bg`                       | `decor.bg`                      | `flat` / `radial` / `dots` / `grid` / `stripes`                 | `flat`          |
| `data-img`                      | `decor.img`                     | `rounded` / `framed` / `square` / `tilt`                        | `rounded`       |
| `data-btn`                      | `decor.btn[]`                   | space-joined subset of `pill skew gradient`                     | none            |
| `data-badge`                    | `accents.badge`                 | `pill` / `square`                                               | `pill`          |

**An axis the record does not carry is not written as an attribute at all**, and the
`/* UI axes */` block in `tailwind.css` only ever styles a _deviation_ — so a site with no
theme renders exactly what it rendered before this existed. That is the rule to keep when
adding a value: never write the default branch.

That block is plain CSS on purpose. `@config` turns off Tailwind's source scanning, so a
class assembled at runtime is never compiled — an attribute selector is not a class and is
not scanned. Its selectors hang off the **utility classes the components already carry**
(`.bg-ui-card-bg`, `.border-ui-panel-border`, `[data-id="ref_link"]`), because there is no
`.card`/`.panel` vocabulary in this template. The cost is honest: a component that stops
using one of those classes silently drops out of the axis instead of breaking.

Where the frame parts are drawn:

- **Header** — `HeaderLayout.vue`, five literal branches. `classic` is what the header always
  was (three groups by `position`); the other four regroup the same items by role
  (logo / CTA / the rest), because "logo above the menu" is not something `position` can say.
  `two-row` shows `layout.header.topbar`, `search` posts a GET form to `/search/` — the
  template ships no such page, so that variant is for a site that has one. `HeaderNavItem.vue`
  is untouched by any of it.
- **Hero** — `HeroLayout.vue`, rendered by `BasePostView.vue` above the sections when
  `frame.hero !== "none"`. Breadcrumbs, the date line, the first section's H1, the lead's
  rating strip, the author line (forced to `inline`) and a CTA move into it; with
  `hero: "photo"` the lead's `text-image` picture moves too. **What moves is decided once**,
  in `useHeroContent()`, and `PostSections.vue` reads the same decision — it drops the first
  section's H1 and renders its body with the moved markers removed
  (`shared/utils/shortcode-markers.ts`), or the strip and the picture would appear twice.
  `heroStyle` is seven branches of background in CSS; `skew` lays its ribbon with a
  pseudo-element, and `solid` is the one branch that redefines `--color-ui-*` locally.
- **Sidebar** — `AsideLayout.vue`, `md+` only. The article's own table of contents, or one
  assembled from the section titles when the article has no `table-content` block, plus the
  offer card under `toc-offer`. The in-flow table of contents is hidden on desktop when a
  sidebar exists (`.toc-block` in the axes block) and stays in the page on a phone, where
  there is no sidebar at all.
- **Bands** — `PostSections.vue` puts `band` on every second section (the lead is never
  banded). No `calc(50% - 50cqw)` is needed here: sections already sit at full width and the
  band is an ordinary block around the centred column. Bands and a sidebar are not meant to
  be combined, and no preset does.
- **Sticky CTA** — `StickyCtaLayout.vue`, phone only, `bar` (bonus line plus button) or
  `button`. It **replaced `BonusLayout.vue`**, the floating gift that used to sit in the
  corner of every page; a site with no theme now shows nothing there.
- **Breadcrumbs** — `BreadcrumbsLayout.vue`: `slash` (what it always drew), `pills`, `back`
  (one link to the parent section). The BreadcrumbList schema.org is emitted by all three.
- **Footer** — `FooterLayout.vue`: `columns`, `minimal`, `centered`, `disclaimer`.

The offer behind the sidebar card and the sticky bar is `usePageOffer()`: there is no "offer"
record in an article, so it is assembled from what the page already has — the banner's casino
(logo, title, bonus text) and the rating strip's score — and falls back to `layout.header.cta`.

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
`HeaderLayout.vue`. Changing the header's padding silently breaks the gap under it, and the
two taller header variants have to say so by hand: `#site[data-header="two-row"] #article`
and `[data-header="centered"]` push that margin further down in the axes block.

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
(`solid`, `outline`, `soft`, `block`, and `link` for a button that reads as text inside a
table cell). **A CTA inside another block passes no `variant` at all** — left alone the
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
offers a `wrapper-class` attribute in the panel that `PostButtonRef` has no prop for — the
`block` variant is what replaces it — and the two disagree on the default `size`.

**A marker can outlive its config entry.** Guard for it — `PostTextImage.vue` shows the
pattern. Most shortcode components do not, and will throw on a stale marker.

### Variants

**A variant is a different layout, never a different colour.** Colour comes only from the
`ui-*` tokens above, which is what lets any variant live under any brand: the operator picks
`faq: chat` once for the site and every article's FAQ becomes a chat, in whatever palette the
theme carries. A variant that needed its own colour would be a second theme.

**The default comes from the theme, one block overrides it.** Every component resolves
`entry.data.variant ?? uiTheme.variants.<key> ?? <the block's own default>` through
`pickVariant` (`shared/utils/block-variant.ts`), which takes the **first candidate the block
can actually draw** — not the first non-empty one. That is deliberate: what is stored may be
a value from an older epoch (`gridCards` still holds `"1"` and `"2"` on live sites), a
variant that was removed, or a typo, and none of those may leave a block unrendered. The
block's own default is the first value in the table below, and for most blocks it is what
the template already drew. **`toc: box` is the exception**: the collapsible panel behind a
"Show table of contents" button is not one of the five variants, so the list now stands
open — a visible change on every site that has no theme yet. **`footer: columns` is the
second one**: the footer used to be a single stack (legal logos, text, links row, title) and
the default variant lays the same content out in columns.

The last two rows are the frame's, not a block's: neither breadcrumbs nor the footer has a
record in an article, so only the theme can choose for them.

| Block              | `variants.*` key | Values (default first)                                                      | Modifiers, not variants                 |
| ------------------ | ---------------- | --------------------------------------------------------------------------- | --------------------------------------- |
| `grid-cards`       | `gridCards`      | `text`, `image-caption`, `image-title-text`, `horizontal`, `image`, `offer` | `cardsPerRowDesktop`                    |
| `data-table`       | `dataTable`      | `classic`, `ranking`, `rows`, `compare`, `key-value`                        | `density`, `head`, `striped`            |
| `text-image`       | `textImage`      | `split`, `overlay`, `card`, `caption`, `banner`                             | `imgSide`, `imgColumn`, `imgMobileSide` |
| `faq`              | `faq`            | `list`, `accordion`, `numbered`, `grid`, `chat`                             | —                                       |
| `pros-cons`        | `prosCons`       | `two-col`, `stacked`, `merged`, `scoreboard`, `table`                       | —                                       |
| `table-content`    | `toc`            | `box`, `rule`, `pills`, `columns`, `steps`                                  | —                                       |
| `biography-writer` | `biography`      | `card`, `inline`, `banner`, `centered`, `signature`                         | a `variant` **prop** forces one         |
| `contact-us`       | `contact`        | `card`, `plain`, `split`                                                    | — (theme only, no record)               |
| `button-ref`       | `buttonRef`      | `solid`, `outline`, `soft`, `block`                                         | `size`                                  |
| `rating-strip`     | `ratingStrip`    | `strip`, `scorecard`, `bars`, `chips`                                       | —                                       |
| `breadcrumbs`      | `breadcrumbs`    | `slash`, `pills`, `back`                                                    | — (frame, no record)                    |
| footer             | `footer`         | `columns`, `minimal`, `centered`, `disclaimer`                              | — (frame, no record)                    |

A modifier is not a variant: it stacks on top of whichever one is chosen, and it lives on the
record rather than in the theme, because two tables in the same article legitimately want
different densities while both stay `classic`. `PostBiographyWriter` is the one that also
takes a `variant` **prop**, which beats both record and theme — the author line under an H1
is always `inline`, whatever the site's full-size variant is.

**`grid-cards` keeps a legacy translation, not an enum.** `"1"` → `image-caption` and `"2"`
→ `image-title-text` are applied before the variant is resolved: those two values are what
the panel wrote for years, and they are still in every live post.

**Every prop a variant reads is optional.** A record written before this stage carries no
`variant`, no `logo`/`score`/`bonus`, no `density` — and has to render. That is why the
Mongoose schemas default them to `""`/`true` rather than requiring them, and why the
components fall back rather than branch on presence.

**Shapes.** `rating-strip` is a **singleton** — one per article, stored next to `faq` and
`tableContent` as an object rather than an array, and read straight from `usePost()` instead
of by `uniqId`.

| Shortcode      | Data                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `rating-strip` | `score` (0–5), `facts: [{ label, value }]` — at most 4; for `bars` the `value` is a number 0–5 |

The caps are enforced in the component (`slice`), not in the panel: a record written by an
older panel, or by hand, must not be able to break the row.

**A new variant is three edits, not one.** The component's literal class map here, a row in
the `/ui` fixture page, and the enum the panel offers the operator — a variant the panel
cannot write is a variant nobody will ever see, and a variant missing from `/ui` is one
nobody checks after a theme change.

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

`PostTextImage.vue` (`text-image` marker, `textImages` shortcode) is where the side/column
modifiers do real work, under the `split` and `card` variants: two columns on desktop (image
left or right, 33 % or 50 % of the row via `imgColumn`), one column on mobile (image ordered
top or bottom via `imgMobileSide`), or a single full-width column (`imgSide: "full"`) with
the image always first, above the text. The other three variants are one column by
construction, and `caption` is the one that renders `imgHint`.
Because `@config` only scans `.vue` files, both the grid-column map (`${imgSide}-${imgColumn}`
→ `md:grid-cols-[1fr_2fr]` and friends) and the `sizes` map for `NuxtImg` are written out as
literal objects in the component — **every variant's classes are literal for the same
reason**, which is why each component carries a `Record<variant, string>` map instead of
building a class from the stored value.

The record predates that grid, so the component defaults defensively rather than trusting what
is stored: an `imgSide` outside `left`/`right`/`full` falls back to `right`, a missing
`imgColumn` to `"50"`, a missing/invalid `imgMobileSide` to `"top"`. A record with no `img` at
all — text-only, or an old block whose picture lives in the body HTML instead — collapses the
grid to a single column rather than leaving an empty second one next to the text.

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

Because there is no outer container, `layout.width` means what it says: a `container` section
gets a wrapping `<div>` with the container classes around the whole `<section>` (background
included), a `full` one leaves that wrapper off and puts the same container classes on the
`<section>`'s _inside_ instead, so the background goes edge-to-edge while the text stays in the
column. No `100vw`, no negative margin, no sideways scroll — those exist only in the panel's
fallback HTML, where the markup lives inside the shared container and has to fight its way out.
The container classes themselves carry no horizontal padding any more — a section's own
`padding.left`/`right` (px, operator-set) is what insets it, and inline `style="padding:…"`
would silently win over a `px-*` class sitting on the same element regardless of source order.

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

## `/ui` page

**`/ui` is the site's own UI library** — one demo article that exercises every shortcode in
every variant, so a theme (a preset or a real `settings.uiTheme` record) can be checked
without a real post. `app/pages/ui.vue` is a static route, so `[...slug].vue`'s catch-all
never sees it; it renders the same `BasePostView` a real page does, over a fixture instead of
a fetch.

- **`app/fixtures/demo-post.ts`** (`buildDemoPost({ lorem })`) is the only data source. It
  has two halves in one `sections[]`: the first seven sections are a normal article — one
  instance of each block, no `variant` of its own, so the whole thing renders however the
  active theme's `variants.*`/`frame.*` say to (this is the part that answers "what does a
  real page look like under this theme"). The rest are `lib-*` sections, one per shortcode,
  each with every variant value **forced** on the marker (`marker("data-table", { variant:
"ranking" })`) so all of them are visible at once regardless of what the theme picked. A
  typography section (`h1`–`h6`, a list, `.app-link`, a legacy `.article-img--right` figure)
  and a coloured section background sit right after the article, exercising
  `shared/utils/section-style.ts` the same way.
- **Marker names are the PascalCase key in `RuntimeTemplateLayout.vue`'s `components` map,
  kebab-cased — not always the short label this doc uses elsewhere.** Vue's own component
  resolver (`resolveAsset`/`resolve` in `@vue/runtime-core`) only tries three spellings for an
  `is="vue:x"` marker: the literal string, `camelize(x)`, and `capitalize(camelize(x))`. That
  is why the pros/cons marker has to be `vue:pros-cons-post` (→ `ProsConsPost`) and not
  `vue:pros-cons`, even though the "Shortcodes" table above calls the block `pros-cons` for
  readability. Get this wrong and the block silently fails to resolve — Vue warns to the
  console and renders nothing, there is no build-time check for it.
- **Four singleton blocks — `rating-strip`, `table-content`, `faq`, `contact-us`** — had no
  way to force a variant before this page: they read the theme and their own (singleton, not
  `uniqId`-keyed) record only. Showing all of a singleton's variants side by side needed the
  same escape hatch `PostBiographyWriter` already had for its `inline` hero placement, so each
  of those four components now also takes an optional `variant` prop that wins over both the
  record and the theme (`pickVariant(VARIANTS, default, forcedVariant, ownRecordVariant,
variantFor(key))`). It is additive — every existing call site that does not pass the prop
  behaves exactly as before.
- **`?preview=`** is the same query the staging pass and the runtime-theme plugin already
  gate on — presence is enough, the value is never checked. **`?preset=<id>`** looks `id` up in
  `shared/constants/ui-presets.ts` (`UI_PRESETS`, 14 entries, `findUiPreset`) and applies it
  with `setTheme()`, overriding whatever `settings.uiTheme` loaded; drop the param and the
  page shows the site's real theme (or the template default, if it has none yet) — that is
  what makes `/ui` with no query the site's UI library rather than just a preset gallery.
  `shared/constants/ui-presets.ts` is a straight port of the approved mockup's `PRESETS` array
  (`plans/…/1e.макеты-14-пресетов.html`) into the real `UiTheme` shape — same 14 themes, same
  keys, `resolveScheme`'s own `DEFAULT_UI_SCHEME` filling in every token a preset does not
  override. **`?lorem=1`** swaps the fixture's Russian copy for standard (Latin) lorem ipsum —
  same structure, longer paragraphs — to check line length and rhythm independent of language.
- **The panelling picker.** `app/components/layout/VariantPicker.vue` renders a small fixed-style
  chip (deliberately outside the theme — always dark, always legible, the same reasoning as
  "status colours are neither brand nor theme") over a block on hover, one dot per option, with
  the current one filled; a click calls `useUiTheme().setVariant(group, key, value)`, which
  patches the theme locally and sends `{ type: "ui-variant", key, value }` to the panel (see
  "Preview protocol" above). It only draws when `previewAttached` is true — a bare `?preview=`
  with nothing on the other end of the `postMessage` channel shows no chip, on `/ui` or any
  real page. `shared/constants/ui-variant-options.ts` (`UI_VARIANT_PICKERS`) is the label/option
  table it reads from — one entry per shortcode plus `header`/`hero`/`sticky` (`frame.*`) and
  `footer`/`breadcrumbs` (`variants.*`, no record of their own). The picker is wired at the
  point each block actually renders: the ten shortcodes get it as a wrapper inserted into
  `RuntimeTemplateLayout.vue`'s `components` map (so a marker's own SFC is untouched), while
  `HeaderLayout.vue` and `StickyCtaLayout.vue` — both `position: fixed` — carry it inside their
  own root instead of an outer wrapper, because a non-fixed wrapper around a fixed element
  drifts away from it the moment the page scrolls and `group-hover` stops firing where the
  element actually is.
- **Contrast report.** A fixed corner panel on `/ui` only, reading `useUiTheme().contrast`
  (the same `contrastReport(resolveScheme(theme))` the panel gets over `ui-contrast`) and
  colouring each pair by WCAG threshold — red under 4.5, yellow under 7.
- **Robots, four layers, all load-bearing:** (1) no `?preview=` → `ui.vue` throws
  `createError({ statusCode: 404 })` before anything renders — a real HTTP 404, not just the
  error page's look; (2) `server/middleware/ui-robots-tag.ts` sets `X-Robots-Tag: noindex,
nofollow` on any request to `/ui` or `/ui/`, with or without `?preview=`, independent of
  what the page itself does; (3) `server/middleware/robots.ts` appends its own `User-agent: *
/ Disallow: /ui` group after whatever `settings.robotsTXT` holds, so an operator's free-text
  robots rules can never reopen it; (4) the sitemap is generated from the database
  (`/api/v1/public/seo/sitemap/`) with `excludeAppSources: true` in `nuxt.config.ts`, so a
  template route with no post behind it cannot appear there by construction — nothing to add
  for `/ui` specifically.
- **Keeping it current is not optional.** The rule already stated in "Shortcodes" applies
  here literally: a new variant is three edits, and this fixture is one of them. Adding a
  variant to a component's own `VARIANTS` array without adding its row to the matching `lib-*`
  section in `demo-post.ts` (and, if the block should be pickable, an entry in
  `ui-variant-options.ts`) leaves a variant nobody will ever see after a theme change until
  someone happens to write a record that uses it.

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
- **`contact: split` has nothing to put in its left column.** The mock-up wants the
  editorial contacts there (e-mail, Telegram, reply time); `seo.conf.ts` carries no such
  keys, and `appspro/server/helpers/brand-apply/render-seo-conf.js` rewrites that file from
  a fixed template, so adding them here alone would lose them on the next brand apply. The
  column currently shows `site.name` and nothing else until both sides carry the keys.
- **Missing shortcode guards** in nine components (see above).
- **`pages/index.vue` and `pages/[...slug].vue`** are the same forty lines twice.
- **Lint escape hatches.** `@typescript-eslint/no-unused-vars`, `vue/no-v-html` and
  `vue/multi-word-component-names` are off in `eslint.config.mjs`, which is why the dead
  emits and variables above survive review.
