import type {
  UiColors,
  UiDecor,
  UiFrame,
  UiGeometry,
  UiScheme,
  UiTheme,
  UiThemeMode,
  UiTypeAxis,
} from "#shared/utils/ui-theme";
import { DEFAULT_UI_SCHEME } from "#shared/utils/ui-theme";

/**
 * Пять семейств оформления из утверждённого макета
 * `plans/2026-09-20/1.макеты-5-семейств.html` (`FAMILIES`) — то, что
 * оператор выбирает в редакторе шаблона панели (appspro-site-templates).
 * `/ui/?preset=<id>` подставляет один пресет поверх темы из базы, ничего не
 * записывая. Тёмный и светлый близнец внутри семьи отличаются только
 * `colors`/`scheme`/`headerInverted` — остальные оси (`type`/`geometry`/
 * `frame`/`variants`/`decor`) общие на семью, отсюда форма ниже: `RawFamily`
 * с общими осями плюс `dark`/`light`-полюса, и `buildPreset(family, mode)`
 * собирает итоговую тему из обоих. Мокап называет токены схемы короче
 * настоящей формы (`footer-alt`, `table-border`) — здесь они переименованы в
 * `footer-bg-alt` и `table-row-border`, как и у прежних 14 пресетов; `v.table`
 * в мокапе — это `dataTable`. `gridCards` мокап ни к одной семье не
 * привязывает — пресеты его не задают и получают дефолт компонента (`text`).
 */

const LIGHT_SCHEME_BASE: Partial<UiScheme> = {
  "page-bg": "primary-100",
  "header-bg": "primary-100",
  "card-bg": "primary-100",
  "card-border": "primary-300",
  "panel-bg": "primary-200",
  "panel-border": "primary-300",
  "table-row": "primary-100",
  "table-row-alt": "primary-200",
  "table-row-border": "primary-300",
  "input-bg": "primary-100",
  "footer-bg": "accent-300",
  "footer-bg-alt": "accent-200",
};

// Светлый двойник без семейных переопределений (neon-violet-light,
// ember-light, guru-red) — тот же набор, что мокап зовёт `LIGHT_TWIN`.
const LIGHT_TWIN_SCHEME: Partial<UiScheme> = {
  ...LIGHT_SCHEME_BASE,
  heading: "accent-300",
  "card-title": "accent-300",
  link: "active-300",
  "link-hover": "accent-300",
  "cta-bg": "active-200",
  "cta-hover": "active-300",
  "cta-text": "#ffffff",
  "table-head-bg": "accent-300",
  "table-head-text": "#ffffff",
  "badge-bg": "active-200",
  "badge-text": "#ffffff",
  marker: "active-200",
};

interface RawFamilyBranch {
  id: string;
  label: string;
  headerInverted: boolean;
  colors: UiColors;
  scheme: Partial<UiScheme>;
}

interface RawFamily {
  key: string;
  original: UiThemeMode;
  font: {
    display: string;
    body: string;
    weight: number;
    tracking?: string;
    upper?: boolean;
  };
  radius: string;
  scale: NonNullable<UiTypeAxis["scale"]>;
  h1: NonNullable<UiTypeAxis["h1Align"]>;
  density: NonNullable<UiGeometry["density"]>;
  borders: NonNullable<UiGeometry["borders"]>;
  shadow: NonNullable<UiGeometry["shadow"]>;
  header: NonNullable<UiFrame["header"]>;
  hero: NonNullable<UiFrame["hero"]>;
  heroStyle?: NonNullable<UiFrame["heroStyle"]>;
  sidebar: boolean;
  bands: boolean;
  width: NonNullable<UiFrame["width"]>;
  sticky: NonNullable<UiFrame["sticky"]>;
  h2: NonNullable<UiDecor["h2"]>;
  bg: NonNullable<UiDecor["bg"]>;
  img: NonNullable<UiDecor["img"]>;
  btn: NonNullable<UiDecor["btn"]>;
  variants: {
    breadcrumbs: string;
    ratingStrip: string;
    toc: string;
    dataTable: string;
    prosCons: string;
    faq: string;
    biography: string;
    footer: string;
  };
  dark: RawFamilyBranch;
  light: RawFamilyBranch;
}

const RAW_FAMILIES: RawFamily[] = [
  {
    key: "neon-violet",
    original: "dark",
    font: { display: "Unbounded", body: "Manrope", weight: 800 },
    radius: "16px",
    scale: "display",
    h1: "left",
    density: "regular",
    borders: 0,
    shadow: "glow",
    header: "classic",
    hero: "photo",
    heroStyle: "blobs",
    sidebar: false,
    bands: true,
    width: "wide",
    sticky: "button",
    h2: "gradient",
    bg: "flat",
    img: "rounded",
    btn: ["pill", "gradient"],
    variants: {
      breadcrumbs: "pills",
      ratingStrip: "chips",
      toc: "pills",
      dataTable: "rows",
      prosCons: "scoreboard",
      faq: "chat",
      biography: "inline",
      footer: "centered",
    },
    dark: {
      id: "neon-violet",
      label: "Neon Violet",
      headerInverted: false,
      colors: {
        primary: { 300: "#0e0a24", 200: "#181239", 100: "#241b55" },
        active: { 300: "#b31b8f", 200: "#ec2fc0", 100: "#ff8ae4" },
        accent: { 300: "#3b8bff", 200: "#6fb0ff", 100: "#b7d8ff" },
      },
      scheme: {
        heading: "#ffffff",
        "card-title": "#ffffff",
        link: "accent-200",
        "link-hover": "accent-100",
        "card-border": "primary-100",
        "panel-border": "primary-100",
        "table-head-bg": "primary-100",
        "cta-bg": "active-300",
        "cta-hover": "active-200",
        "cta-text": "#ffffff",
        marker: "accent-200",
        "badge-bg": "accent-200",
        "badge-text": "#0e0a24",
      },
    },
    light: {
      id: "neon-violet-light",
      label: "Neon Violet Light",
      headerInverted: false,
      colors: {
        primary: { 300: "#e4dcff", 200: "#f1ecff", 100: "#faf8ff" },
        active: { 300: "#8f1470", 200: "#b31b8f", 100: "#ec2fc0" },
        accent: { 300: "#1e1546", 200: "#2f2270", 100: "#8a7fc4" },
      },
      scheme: LIGHT_TWIN_SCHEME,
    },
  },
  {
    key: "acid-charcoal",
    original: "dark",
    font: {
      display: "Bebas Neue",
      body: "Barlow",
      weight: 400,
      tracking: ".03em",
      upper: true,
    },
    radius: "3px",
    scale: "regular",
    h1: "left",
    density: "tight",
    borders: 2,
    shadow: "none",
    header: "compact",
    hero: "band",
    heroStyle: "skew",
    sidebar: false,
    bands: false,
    width: "wide",
    sticky: "bar",
    h2: "left-rule",
    bg: "stripes",
    img: "square",
    btn: ["skew"],
    variants: {
      breadcrumbs: "back",
      ratingStrip: "bars",
      toc: "rule",
      dataTable: "classic",
      prosCons: "table",
      faq: "list",
      biography: "signature",
      footer: "minimal",
    },
    dark: {
      id: "acid-charcoal",
      label: "Acid Charcoal",
      headerInverted: false,
      colors: {
        primary: { 300: "#111315", 200: "#1a1d21", 100: "#25292f" },
        active: { 300: "#b8cc12", 200: "#e2ff2e", 100: "#f1ff8a" },
        accent: { 300: "#c9ced6", 200: "#e8ebef", 100: "#ffffff" },
      },
      scheme: {
        heading: "#ffffff",
        "card-title": "active-200",
        link: "active-200",
        "link-hover": "active-100",
        "card-bg": "primary-200",
        "card-border": "primary-100",
        "panel-border": "primary-100",
        "table-head-bg": "active-200",
        "table-head-text": "#111315",
        marker: "active-200",
        "badge-bg": "active-200",
      },
    },
    light: {
      id: "sport-light",
      label: "Sport Light",
      headerInverted: true,
      colors: {
        primary: { 300: "#dbe4f3", 200: "#eef2f9", 100: "#ffffff" },
        active: { 300: "#d4a90a", 200: "#facc15", 100: "#fde68a" },
        accent: { 300: "#1e3a8a", 200: "#1d4ed8", 100: "#93c5fd" },
      },
      scheme: {
        ...LIGHT_SCHEME_BASE,
        "header-bg": "accent-300",
        heading: "accent-300",
        "card-title": "accent-200",
        link: "accent-200",
        "link-hover": "accent-300",
        "cta-bg": "active-200",
        "cta-hover": "active-300",
        "cta-text": "#111111",
        "table-head-bg": "accent-200",
        "table-head-text": "#ffffff",
        "badge-bg": "accent-200",
        "badge-text": "#ffffff",
        marker: "accent-200",
      },
    },
  },
  {
    key: "navy-mint",
    original: "dark",
    font: { display: "Sora", body: "Inter", weight: 800 },
    radius: "12px",
    scale: "compact",
    h1: "left",
    density: "regular",
    borders: 1,
    shadow: "none",
    header: "search",
    hero: "none",
    sidebar: true,
    bands: false,
    width: "wide",
    sticky: "bar",
    h2: "none",
    bg: "flat",
    img: "rounded",
    btn: [],
    variants: {
      breadcrumbs: "slash",
      ratingStrip: "strip",
      toc: "columns",
      dataTable: "classic",
      prosCons: "two-col",
      faq: "grid",
      biography: "card",
      footer: "columns",
    },
    dark: {
      id: "navy-mint",
      label: "Navy Mint",
      headerInverted: false,
      colors: {
        primary: { 300: "#0a1020", 200: "#111a30", 100: "#1a2746" },
        active: { 300: "#159a5c", 200: "#22c55e", 100: "#86efac" },
        accent: { 300: "#2563eb", 200: "#3b82f6", 100: "#93c5fd" },
      },
      scheme: {
        heading: "#ffffff",
        "card-title": "#ffffff",
        link: "accent-100",
        "link-hover": "accent-200",
        "card-bg": "primary-200",
        "card-border": "primary-100",
        "panel-border": "primary-100",
        "table-head-bg": "accent-300",
        "table-head-text": "#ffffff",
        marker: "accent-200",
        "badge-bg": "active-200",
        "badge-text": "#0a1020",
        "cta-text": "#06130a",
      },
    },
    light: {
      id: "teal-pay",
      label: "Teal Pay",
      headerInverted: false,
      colors: {
        primary: { 300: "#d9e2e1", 200: "#eef3f2", 100: "#ffffff" },
        active: { 300: "#0f766e", 200: "#0d9488", 100: "#5eead4" },
        accent: { 300: "#0f172a", 200: "#334155", 100: "#64748b" },
      },
      scheme: {
        ...LIGHT_SCHEME_BASE,
        heading: "accent-300",
        "card-title": "accent-300",
        link: "active-300",
        "link-hover": "accent-300",
        "cta-bg": "active-300",
        "cta-hover": "active-200",
        "cta-text": "#ffffff",
        "table-head-bg": "accent-300",
        "table-head-text": "#ffffff",
        "badge-bg": "active-300",
        "badge-text": "#ffffff",
        marker: "active-200",
      },
    },
  },
  {
    key: "ember",
    original: "dark",
    font: { display: "Russo One", body: "Rubik", weight: 400 },
    radius: "10px",
    scale: "display",
    h1: "center",
    density: "regular",
    borders: 1,
    shadow: "soft",
    header: "centered",
    hero: "band",
    heroStyle: "warm",
    sidebar: false,
    bands: true,
    width: "wide",
    sticky: "button",
    h2: "dot",
    bg: "flat",
    img: "tilt",
    btn: ["gradient"],
    variants: {
      breadcrumbs: "slash",
      ratingStrip: "scorecard",
      toc: "steps",
      dataTable: "rows",
      prosCons: "merged",
      faq: "accordion",
      biography: "banner",
      footer: "disclaimer",
    },
    dark: {
      id: "ember",
      label: "Ember",
      headerInverted: false,
      colors: {
        primary: { 300: "#120a09", 200: "#1d100e", 100: "#2c1815" },
        active: { 300: "#c8381a", 200: "#ff5a1f", 100: "#ff9a6b" },
        accent: { 300: "#d9a21b", 200: "#ffc531", 100: "#ffe08a" },
      },
      scheme: {
        heading: "accent-200",
        "card-title": "accent-200",
        link: "active-100",
        "link-hover": "accent-200",
        "card-bg": "primary-200",
        "card-border": "primary-100",
        "panel-border": "primary-100",
        "table-head-bg": "primary-100",
        "cta-text": "#1a0d08",
        marker: "accent-200",
        "badge-bg": "accent-200",
      },
    },
    light: {
      id: "ember-light",
      label: "Ember Light",
      headerInverted: false,
      colors: {
        primary: { 300: "#f3dccd", 200: "#faece3", 100: "#fff8f3" },
        active: { 300: "#a12b12", 200: "#c8381a", 100: "#ff5a1f" },
        accent: { 300: "#3b1d12", 200: "#5c2f1e", 100: "#b07a5a" },
      },
      scheme: LIGHT_TWIN_SCHEME,
    },
  },
  {
    key: "guru-red",
    original: "light",
    font: { display: "Archivo", body: "Roboto", weight: 900 },
    radius: "6px",
    scale: "regular",
    h1: "left",
    density: "tight",
    borders: 1,
    shadow: "none",
    header: "classic",
    hero: "none",
    sidebar: false,
    bands: false,
    width: "wide",
    sticky: "bar",
    h2: "left-rule",
    bg: "flat",
    img: "rounded",
    btn: [],
    variants: {
      breadcrumbs: "slash",
      ratingStrip: "strip",
      toc: "box",
      dataTable: "classic",
      prosCons: "two-col",
      faq: "accordion",
      biography: "inline",
      footer: "columns",
    },
    light: {
      id: "guru-red",
      label: "Guru Red",
      headerInverted: false,
      colors: {
        primary: { 300: "#e4e4e7", 200: "#f4f4f5", 100: "#ffffff" },
        active: { 300: "#b71c2e", 200: "#d7263d", 100: "#f0a3ad" },
        accent: { 300: "#18181b", 200: "#27272a", 100: "#71717a" },
      },
      scheme: LIGHT_TWIN_SCHEME,
    },
    dark: {
      id: "guru-red-dark",
      label: "Guru Red Dark",
      headerInverted: false,
      colors: {
        primary: { 300: "#0f0f11", 200: "#18181b", 100: "#27272a" },
        active: { 300: "#b71c2e", 200: "#e0364a", 100: "#f28b96" },
        accent: { 300: "#e4e4e7", 200: "#f4f4f5", 100: "#ffffff" },
      },
      scheme: {
        heading: "#ffffff",
        "card-title": "#ffffff",
        link: "active-100",
        "link-hover": "active-200",
        "card-bg": "primary-200",
        "card-border": "primary-100",
        "panel-border": "primary-100",
        "table-head-bg": "active-300",
        "table-head-text": "#ffffff",
        "cta-bg": "active-300",
        "cta-hover": "active-200",
        "cta-text": "#ffffff",
        "badge-bg": "active-300",
        "badge-text": "#ffffff",
        marker: "active-200",
      },
    },
  },
];

const PRESET_UPDATED_AT = new Date("2026-09-20T00:00:00.000Z");

const buildPreset = (family: RawFamily, mode: UiThemeMode): UiTheme => {
  const branch = family[mode];
  const { font } = family;

  return {
    templateId: branch.id,
    templateName: branch.label,
    mode,
    colors: branch.colors,
    scheme: { ...DEFAULT_UI_SCHEME, ...branch.scheme },
    type: {
      display: {
        family: font.display,
        weight: font.weight,
        ...(font.upper ? { case: "upper" as const } : {}),
        ...(font.tracking ? { tracking: font.tracking } : {}),
      },
      body: { family: font.body },
      scale: family.scale,
      h1Align: family.h1,
    },
    geometry: {
      radius: family.radius,
      borders: family.borders,
      shadow: family.shadow,
      density: family.density,
    },
    frame: {
      header: family.header,
      headerInverted: branch.headerInverted,
      hero: family.hero,
      ...(family.heroStyle ? { heroStyle: family.heroStyle } : {}),
      sidebar: family.sidebar ? "toc-offer" : "none",
      bands: family.bands,
      width: family.width,
      sticky: family.sticky,
    },
    variants: family.variants,
    decor: {
      h2: family.h2,
      bg: family.bg,
      img: family.img,
      btn: family.btn,
    },
    accents: {},
    updatedAt: PRESET_UPDATED_AT,
  };
};

// 10 готовых тем — 5 семейств × тёмный/светлый близнец, оригинал семьи
// первым (`family.original`), тот же порядок, что в макете.
export const UI_PRESETS: UiTheme[] = RAW_FAMILIES.flatMap((family) => {
  const twin: UiThemeMode = family.original === "dark" ? "light" : "dark";
  return [buildPreset(family, family.original), buildPreset(family, twin)];
});

export const findUiPreset = (templateId: string): UiTheme | null =>
  UI_PRESETS.find((preset) => preset.templateId === templateId) || null;
