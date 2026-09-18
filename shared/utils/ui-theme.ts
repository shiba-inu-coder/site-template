// Чистый модуль: без импортов из Nuxt/Vue и без auto-import. Схема темы
// читается и панелью (appspro), и этим сайтом, и превью — там, где Nuxt не
// поднят вовсе.
import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";

export type UiThemeMode = "dark" | "light";

export interface UiColorRamp {
  300: string;
  200: string;
  100: string;
}

export interface UiColors {
  primary: UiColorRamp;
  active: UiColorRamp;
  accent: UiColorRamp;
}

export type UiSurfaceToken = "text" | "muted" | "raised" | "on-brand";

// Тот же порядок и те же имена, что в блоке `/* UI scheme */` в
// `app/assets/css/tailwind.css` (без префикса `--color-ui-`). Переименование
// здесь без переименования там рассинхронит компоненты и схему.
export const UI_TOKENS = [
  "page-bg",
  "header-bg",
  "footer-bg",
  "footer-bg-alt",

  "card-bg",
  "card-border",
  "card-title",

  "panel-bg",
  "panel-border",

  "input-bg",
  "input-border",

  "highlight-bg",
  "highlight-text",

  "heading",
  "text",
  "muted",

  "link",
  "link-hover",

  "cta-bg",
  "cta-hover",
  "cta-text",

  "table-head-bg",
  "table-head-text",
  "table-row",
  "table-row-alt",
  "table-row-border",

  "badge-bg",
  "badge-text",
  "marker",

  "accent-strong",
  "accent-soft",
] as const;

export type UiToken = (typeof UI_TOKENS)[number];

// Ссылка на брендовый токен ("primary-200"), нейтральный ("surface-text")
// или собственный hex ("#ff0000") — резолвит `resolveScheme`.
export type UiSchemeRef = string;

export type UiScheme = Record<UiToken, UiSchemeRef>;

export interface UiTypeAxis {
  display: {
    family: string;
    weight?: number;
    case?: "none" | "upper";
    tracking?: string;
  };
  body: {
    family: string;
  };
  scale?: "compact" | "regular" | "display";
  h1Align?: "left" | "center";
}

export interface UiGeometry {
  radius: string;
  borders?: 0 | 1 | 2;
  shadow?: "none" | "soft" | "glow";
  density?: "tight" | "regular" | "airy";
}

// Каркас, варианты блоков, декор и акценты — форма зарезервирована под 4c/4e
// (см. `V 1e.макеты-пресетов-и-вариантов.md`). Этот этап их не читает и не
// пишет в `resolveScheme`/`themeToCssVars`, только держит место в типе.
export interface UiFrame {
  header?: "classic" | "centered" | "compact" | "two-row" | "search";
  headerInverted?: boolean;
  hero?: "none" | "band" | "photo";
  heroStyle?: "radial" | "blobs" | "skew" | "warm" | "pale" | "solid" | "flat";
  sidebar?: "none" | "toc" | "toc-offer";
  bands?: boolean;
  width?: "narrow" | "wide";
  sticky?: "none" | "bar" | "button";
}

export interface UiVariants {
  breadcrumbs?: string;
  ratingStrip?: string;
  toc?: string;
  textImage?: string;
  dataTable?: string;
  gridCards?: string;
  bonusBox?: string;
  prosCons?: string;
  faq?: string;
  verdictBox?: string;
  buttonRef?: string;
  biography?: string;
  contact?: string;
  footer?: string;
}

export interface UiDecor {
  h2?:
    | "none"
    | "underline"
    | "left-rule"
    | "dot"
    | "gradient"
    | "number"
    | "line";
  bg?: "flat" | "radial" | "dots" | "grid" | "stripes";
  // Побеждает над `bg`: обе оси взаимоисключающи, порядок правил в
  // tailwind.css решает это на CSS-уровне, а не чтением здесь.
  bgImage?: { path: string; overlay: number };
  img?: "rounded" | "framed" | "square" | "tilt";
  btn?: Array<"pill" | "skew" | "gradient">;
}

export interface UiAccents {
  badge?: "pill" | "square";
  big?: "score" | "bonus" | "logo" | "none";
}

export interface UiTheme {
  templateId: string;
  templateName: string;
  mode: UiThemeMode;
  colors: UiColors;
  scheme: UiScheme;
  type: UiTypeAxis;
  geometry: UiGeometry;
  frame: UiFrame;
  variants: UiVariants;
  decor: UiDecor;
  accents: UiAccents;
  updatedAt: Date;
}

// Дефолтная схема применения — токен в токен то, что раньше было
// захардкожено в компонентах (см. таблицу в `docs/ui.md`). Не зависит от
// режима: тёмная/светлая тема переключает только нейтраль (surface-*) ниже.
export const DEFAULT_UI_SCHEME: UiScheme = {
  "page-bg": "primary-300",
  "header-bg": "primary-300",
  "footer-bg": "primary-200",
  "footer-bg-alt": "primary-300",

  "card-bg": "primary-100",
  "card-border": "primary-300",
  "card-title": "accent-200",

  "panel-bg": "primary-200",
  "panel-border": "primary-300",

  "input-bg": "primary-100",
  "input-border": "primary-100",

  "highlight-bg": "active-100",
  "highlight-text": "primary-300",

  heading: "accent-200",
  text: "surface-text",
  muted: "surface-muted",

  link: "active-200",
  "link-hover": "active-300",

  "cta-bg": "active-200",
  "cta-hover": "active-300",
  "cta-text": "surface-on-brand",

  "table-head-bg": "primary-300",
  "table-head-text": "surface-text",
  "table-row": "primary-200",
  "table-row-alt": "primary-300",
  "table-row-border": "primary-100",

  "badge-bg": "accent-200",
  "badge-text": "surface-on-brand",
  marker: "accent-200",

  "accent-strong": "accent-300",
  "accent-soft": "accent-100",
};

// Нейтральный слой по режиму — те же пары, что `:root` / `:root[data-theme="light"]`
// в `tailwind.css`. Бренд (primary/active/accent) сюда не входит: он не флипается.
const SURFACE_BY_MODE: Record<UiThemeMode, Record<UiSurfaceToken, string>> = {
  dark: {
    text: "#ffffff",
    muted: "#cbd5e1",
    raised: "#ffffff",
    "on-brand": "#0f172a",
  },
  light: {
    text: "#0f172a",
    muted: "#475569",
    raised: "#f1f5f9",
    "on-brand": "#ffffff",
  },
};

const BRAND_FAMILIES = ["primary", "active", "accent"] as const;

const resolveRef = (ref: UiSchemeRef, theme: UiTheme): string => {
  if (ref.startsWith("#")) {
    return ref;
  }

  for (const family of BRAND_FAMILIES) {
    const prefix = `${family}-`;
    if (ref.startsWith(prefix)) {
      const shade = Number(ref.slice(prefix.length)) as keyof UiColorRamp;
      return theme.colors[family][shade] ?? ref;
    }
  }

  if (ref.startsWith("surface-")) {
    const key = ref.slice("surface-".length) as UiSurfaceToken;
    return SURFACE_BY_MODE[theme.mode][key] ?? ref;
  }

  return ref;
};

const RAMP_SHADES = [300, 200, 100] as const;

// `Setting.uiTheme` объявлен в монге с `default: () => ({})`, так что объект
// темы приходит всегда — и «темы нет» отличается от «тема есть» только тем,
// заполнены ли режим и все девять цветов. Неполную применять нельзя:
// `resolveRef` вернёт вместо цвета саму ссылку, браузер выбросит объявление, и
// элемент останется без цвета вовсе — это хуже, чем бренд, собранный в образ.
export const isUiThemeConfigured = (
  theme: UiTheme | null | undefined,
): theme is UiTheme =>
  Boolean(theme?.mode && theme.colors) &&
  BRAND_FAMILIES.every((family) =>
    RAMP_SHADES.every((shade) => Boolean(theme.colors[family]?.[shade])),
  );

// `scheme` может не покрывать все токены (старая запись до добавления нового
// токена) — недостающие достраиваются дефолтом, а не роняют резолв.
export const resolveScheme = (theme: UiTheme): Record<UiToken, string> => {
  const result = {} as Record<UiToken, string>;

  for (const token of UI_TOKENS) {
    const ref = theme.scheme[token] ?? DEFAULT_UI_SCHEME[token];
    result[token] = resolveRef(ref, theme);
  }

  return result;
};

// Цвета + радиус + шрифты + фон статьи картинкой — оси, которые уже есть в
// этом этапе. Каркас и остальной декор (frame/variants/decor.h2|bg|img|btn/
// accents) сюда не попадают: их рендерят 4c/4e.
export const themeToCssVars = (theme: UiTheme, cloudName: string): string => {
  const resolved = resolveScheme(theme);

  const lines = UI_TOKENS.map(
    (token) => `  --color-ui-${token}: ${resolved[token]};`,
  );

  // Ось, которой в записи нет, не переопределяется пустотой: значение из
  // `:root` собранного образа остаётся жить.
  if (theme.geometry?.radius) {
    lines.push(`  --radius-primary: ${theme.geometry.radius};`);
  }
  if (theme.type?.body?.family) {
    lines.push(`  --font-primary: ${theme.type.body.family};`);
  }
  if (theme.type?.display?.family) {
    lines.push(`  --font-heading: ${theme.type.display.family};`);
  }

  const bgImagePath = theme.decor?.bgImage?.path;
  if (bgImagePath) {
    const url = /^https?:\/\//.test(bgImagePath)
      ? bgImagePath
      : `${getCloudinaryBaseUrl(cloudName)}f_auto,q_auto/${bgImagePath}`;

    // `decor` — Mixed в Mongo, без валидации на запись: overlay нечисловым
    // или вне 0–100 не должен превращать весь background-image (картинка
    // вместе с градиентом-затемнением — одно CSS-значение) в невалидный.
    const rawOverlay = Number(theme.decor?.bgImage?.overlay);
    const overlay = Number.isFinite(rawOverlay)
      ? Math.min(100, Math.max(0, rawOverlay))
      : 0;

    lines.push(`  --ui-bg-image: url(${url});`);
    lines.push(`  --ui-bg-overlay: ${overlay / 100};`);
  }

  return `:root {\n${lines.join("\n")}\n}`;
};

// Что реально используют шрифты шаблона: текст + полужирный + подзаголовки.
export const GOOGLE_FONT_WEIGHTS = [400, 500, 700];

// Сборка href без @nuxt/fonts — тот модуль сканирует CSS на сборке и о
// семействе, приехавшем из базы, не знает. Пара семейств уходит одной
// ссылкой: два запроса к fonts.googleapis.com вместо одного ничего не дают.
export const googleFontsHref = (
  fontFamily: string | string[],
  weights: number[] = GOOGLE_FONT_WEIGHTS,
): string => {
  const families = [
    ...new Set(
      (Array.isArray(fontFamily) ? fontFamily : [fontFamily])
        .map((name) => name.trim())
        .filter(Boolean),
    ),
  ];
  const weightAxis = [...new Set(weights)].sort((a, b) => a - b).join(";");
  const query = families
    .map((name) => `family=${name.replace(/\s+/g, "+")}:wght@${weightAxis}`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
};

// Дефолт шаблона до 6a/5b: тот же primary/active/accent, что сейчас в
// `:root` `tailwind.css` — активный ramp не флипается, поэтому светлый и
// тёмный вариант отличаются только `mode` (а значит и surface-*).
const TEMPLATE_DEFAULT_COLORS: UiColors = {
  primary: { 300: "#e2e8f0", 200: "#f1f5f9", 100: "#ffffff" },
  active: { 300: "#1e293b", 200: "#334155", 100: "#94a3b8" },
  accent: { 300: "#334155", 200: "#475569", 100: "#64748b" },
};

const TEMPLATE_DEFAULT_TYPE: UiTypeAxis = {
  display: { family: "Inter" },
  body: { family: "Inter" },
};

const TEMPLATE_DEFAULT_GEOMETRY: UiGeometry = {
  radius: "0.5rem",
};

const buildDefaultTheme = (mode: UiThemeMode): UiTheme => ({
  templateId: "template-default",
  templateName: "Template default",
  mode,
  colors: TEMPLATE_DEFAULT_COLORS,
  scheme: DEFAULT_UI_SCHEME,
  type: TEMPLATE_DEFAULT_TYPE,
  geometry: TEMPLATE_DEFAULT_GEOMETRY,
  frame: {},
  variants: {},
  decor: {},
  accents: {},
  updatedAt: new Date(0),
});

export const DEFAULT_UI_THEME_DARK: UiTheme = buildDefaultTheme("dark");
export const DEFAULT_UI_THEME_LIGHT: UiTheme = buildDefaultTheme("light");
