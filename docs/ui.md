# UI & theme

Everything visual in this template is driven by a manifest that a **different program
writes in** — the AppsPro panel patches `app/assets/css/tailwind.css`, `nuxt.config.ts` and
`seo.conf.ts` from a brand manifest before the image is built. A class picked by feel rather
than by role does not just look wrong here; it puts a brand's call-to-action colour on an
article heading.

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

The site is light or dark **per brand**, chosen by the operator in the panel and carried in
`seoConfig.site.theme`. `app.vue` puts it on `<html data-theme>` and emits the matching
`<meta name="color-scheme">` — the meta is not decoration, without it scrollbars, autofill
and native controls stay dark on a light page.

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

| Token              | Default       | Role                                          |
| ------------------ | ------------- | --------------------------------------------- |
| `ui-page-bg`       | `primary-300` | page/layout background, floating promo banner |
| `ui-header-bg`     | `primary-300` | `HeaderLayout`, its dropdown panel            |
| `ui-footer-bg`     | `primary-200` | footer links row                              |
| `ui-footer-bg-alt` | `primary-300` | footer bottom row (title + logo)              |

| Token               | Default       | Role                                                 |
| ------------------- | ------------- | ---------------------------------------------------- |
| `ui-card-bg`        | `primary-100` | `PostGridCards` boxed card, error page background    |
| `ui-card-border`    | `primary-300` | card border, bonus-icon border                       |
| `ui-card-title`     | `accent-200`  | `PostGridCards` item title                           |
| `ui-panel-bg`       | `primary-200` | rating/bonus card body, drawer, FAQ/pros-cons box    |
| `ui-panel-border`   | `primary-300` | panel/drawer/biography border                        |
| `ui-input-bg`       | `primary-100` | form input background                                |
| `ui-input-border`   | `primary-100` | form input border, small logo/divider borders        |
| `ui-highlight-bg`   | `active-100`  | `PostButtonRef` soft variant, table-of-contents tint |
| `ui-highlight-text` | `primary-300` | `PostButtonRef` soft variant text                    |

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
| `ui-table-head-bg`    | `primary-300`      | `PostDataTable` head row, table-of-contents trigger                                            |
| `ui-table-head-text`  | `surface-text`     | `PostDataTable` head row text                                                                  |
| `ui-table-row`        | `primary-200`      | even data-table row                                                                            |
| `ui-table-row-alt`    | `primary-300`      | odd row, row divider                                                                           |
| `ui-table-row-border` | `primary-100`      | data-table outer border                                                                        |
| `ui-badge-bg`         | `accent-200`       | author/position badge background                                                               |
| `ui-badge-text`       | `surface-on-brand` | text on `ui-badge-bg`                                                                          |
| `ui-marker`           | `accent-200`       | `#article` ordered/unordered list markers                                                      |
| `ui-accent-strong`    | `accent-300`       | rating score, entity ribbon cutout                                                             |
| `ui-accent-soft`      | `accent-100`       | bonus amount (needs the lighter shade for contrast — same reason as the old `text-accent-100`) |

Two families exist only because the code did: `ui-highlight-*` is `PostButtonRef`'s `soft`
variant (and the table-of-contents' tinted panel, at `/10` opacity) — a real fifth shade
combination, not a duplicate of `ui-cta-*`. `ui-accent-strong`/`ui-accent-soft` split
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
twelve axes; this stage implements four of them — `colors`, `scheme`, `type` (font family
only) and `geometry.radius`. The rest (`frame`, `variants`, `decor`, `accents`, the
non-family parts of `type` and `geometry`) exist in the type so a later stage doesn't need a
migration, but nothing reads or writes them yet:

```ts
UiTheme = {
  templateId, templateName, mode: "dark" | "light",
  colors: { primary, active, accent } × { 300, 200, 100 },
  scheme: { [uiToken]: "primary-200" | "surface-text" | "#hex" }, // ~31 keys, see table above
  type: { display: { family, weight?, case?, tracking? }, body: { family }, scale?, h1Align? },
  geometry: { radius, borders?, shadow?, density? },
  frame: {…}, variants: {…}, decor: {…}, accents: {…}, // reserved for 4c/4e
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
brand patcher never patched one. `DEFAULT_UI_THEME_DARK`/`DEFAULT_UI_THEME_LIGHT` are the
template's current look expressed in this shape — what a site falls back to before an
operator has customised anything in the panel.

Storage: `models/schemas/UiTheme.ts`, embedded as `Setting.uiTheme`. `scheme` and `variants`
are their own sub-schemas with `strict: false` — the known keys are declared (so a real typo
still shows up in review), but an unrecognised one is kept rather than silently dropped,
because the panel and this image don't always deploy in the same breath. `setting.repository.ts`
`getPublic()` returns `uiTheme` alongside `redirectsRoutes`/`headerLinks`.

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

Three radii are deliberately off the scale and should stay: `rounded-full` (a circle, not a
brand corner), `rounded-*-none` (a corner squared off where a panel meets its header) and the
two `rounded-*-xs` on the bonus banner's tucked close button.

Article headings — `#article h1…h6` — keep their own ramp of hardcoded rem values, because
folding a 2rem → 1.3rem sequence into the nine steps would either distort it or force the
scale to grow again. They do take `--font-heading`.

`BasePostView.vue` opens with `mt-18` — an undocumented offset for the fixed header in
`HeaderLayout.vue`. Changing the header's padding silently breaks the gap under it.

Z-index has no scale yet; the values in use are `z-20`, `z-30`, `z-50`, `z-998` and
`z-[999]`. Pick from those rather than inventing a sixth.

## Fonts

Two families, both from Google Fonts via `@nuxt/fonts`: `--font-primary` on the layout root
and `--font-heading` on `#article h1…h6`. A brand with one font gets the same family in
both — the manifest's `fontHeading` is optional and the patcher falls back.

`defaults.weights` in `nuxt.config.ts` is **one list for every family**, so the patcher writes
the union of both fonts' weights. Declaring the heading font with the same name but a heavier
weight is a supported way to ask for that weight.

## Logos

Brand logos are square badges and long wordmarks alike, so nothing renders them at a fixed
width. `seoConfig.logo` carries the file's own `width`/`height`, and
`app/utils/logo-size.ts` turns a target height — and a width ceiling — into the pair that
fits both:

```ts
<NuxtImg
  provider="cloudinary"
  v-bind="logoSize(36, 200)"
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
`target="_blank"`, `rel="nofollow noopener"`, `data-id="ref_link"` — plus the four variants
(`solid`, `outline`, `soft`, `link`). Never copy its class string into a template; that copy
in `PostCasinoRatingCard.vue` is how `easy-in-out` (a typo for `ease-in-out`, silently
disabling the easing) survived in two places at once. It cannot render an internal
`nuxt-link`, which is the one legitimate reason to hand-roll a button — colour that from the
`outline` variant when you do.

Other things worth reusing before writing them again: `BreadcrumbsLayout` (also emits the
BreadcrumbList schema.org), `PostShowOnScroll` (scroll-reveal slot wrapper),
`ButtonFastUpLayout`, `PostProsConsBase`, and the global `<svg-icon name="client/star" />`
registered by nuxt-svg-sprite-icon.

## Strings

**Every user-facing string comes from `seo.conf.ts`.** The site's language is set per brand;
nothing is hardcoded in a template. The template's own defaults are English placeholders — a
site gets its real texts when the brand manifest is applied.

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
shortcode means touching both repositories, and the props must agree: `button-ref` currently
offers a `wrapper-class` attribute in the panel that `PostButtonRef` has no prop for, and the
two disagree on the default `size`.

**A marker can outlive its config entry.** Guard for it — `PostTextImage.vue` shows the
pattern. Most shortcode components do not, and will throw on a stale marker.

`PostTextImage.vue` (`text-image` marker, `textImages` shortcode) is the one with a real
layout to get right: two columns on desktop (image left or right, 33 % or 50 % of the row via
`imgColumn`), one column on mobile (image ordered top or bottom via `imgMobileSide`), or a
single full-width column (`imgSide: "full"`) with the image always first, above the text.
Because `@config` only scans `.vue` files, both the grid-column map (`${imgSide}-${imgColumn}`
→ `md:grid-cols-[1fr_2fr]` and friends) and the `sizes` map for `NuxtImg` are written out as
literal objects in the component, the same way `PostGridCards.vue` already does.

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
  `PostFAQItem.vue` is a commented-out accordion with its state still declared.
- **`settings.headerLinks`** is fetched from Mongo through the repository and the composable
  and read by nobody — the header renders `seoConfig.layout.header.items` instead. Left alone
  because the model is shared with the admin service.
- **Missing shortcode guards** in nine components (see above).
- **`pages/index.vue` and `pages/[...slug].vue`** are the same forty lines twice.
- **Lint escape hatches.** `@typescript-eslint/no-unused-vars`, `vue/no-v-html` and
  `vue/multi-word-component-names` are off in `eslint.config.mjs`, which is why the dead
  emits and variables above survive review.
