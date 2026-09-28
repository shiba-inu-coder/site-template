// Чистый модуль: без импортов из Nuxt/Vue и без auto-import. Схема темы
// читается и панелью (appspro), и этим сайтом, и превью — там, где Nuxt не
// поднят вовсе.
import { contrastRatio } from "./contrast.ts";

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
  "header-text",
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
    tracking?: string;
  };
  body: {
    family: string;
  };
}

export interface UiGeometry {
  radius: string;
  borders?: 0 | 1 | 2;
  shadow?: "none" | "soft" | "glow";
  // Свободные CSS-длины (12px/0.5rem), не enum — оператор набирает своё
  // значение, а не выбирает из трёх пресетов, как раньше density.
  blockGap?: string;
  paragraphGap?: string;
}

// Поля страницы, не темы — у каждой страницы свой каркас, и
// `resolvePageFrame` берёт эти четыре оси с поста, не с темы (`UiTheme`
// больше не несёт `frame` вовсе).
export interface UiFrame {
  hero?: "none" | "band" | "photo";
  sidebar?: "none" | "toc" | "toc-offer";
  width?: "narrow" | "wide";
  sticky?: "none" | "bar" | "button";
}

// Каркас страницы: `IPost.frame` в `shared/types/post.ts` берёт этот тип
// напрямую, чтобы набор значений не разъехался с `UiFrame`.
export type PostFrame = Pick<UiFrame, "hero" | "sidebar" | "width" | "sticky">;

// Вариант темы остался у четырёх блоков; остальные рисуются одним видом, и
// их старые ключи в базе просто не читаются.
export interface UiVariants {
  toc?: string;
  gridCards?: string;
  faq?: string;
  buttonRef?: string;
}

// Три оттенка primary — та же ось, что per-секционный layout.bg.token в
// конструкторе статьи (appspro-articles, PostSection.layout ниже), с этим
// объектом не путать: тот перекрывает эту по одной секции, mode "site".
export type SectionBgToken = "" | "primary-100" | "primary-200" | "primary-300";

export interface UiDecor {
  h2?:
    | "none"
    | "underline"
    | "left-rule"
    | "dot"
    | "gradient"
    | "number"
    | "line";
  sectionBg?: { token?: SectionBgToken; width?: "container" | "full" };
}

export interface UiTheme {
  templateId: string;
  templateName: string;
  mode: UiThemeMode;
  colors: UiColors;
  scheme: UiScheme;
  type: UiTypeAxis;
  geometry: UiGeometry;
  variants: UiVariants;
  decor: UiDecor;
  updatedAt: Date;
}

// Дефолтная схема применения — токен в токен то, что раньше было
// захардкожено в компонентах (см. таблицу в `docs/ui.md`). Не зависит от
// режима: тёмная/светлая тема переключает только нейтраль (surface-*) ниже.
export const DEFAULT_UI_SCHEME: UiScheme = {
  "page-bg": "primary-300",
  "header-bg": "primary-300",
  "header-text": "auto",
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

// header-text: "auto" сравнивает контраст с уже резолвленным header-bg —
// порядок в UI_TOKENS (header-bg раньше header-text) это гарантирует.
const resolveRef = (
  ref: UiSchemeRef,
  theme: UiTheme,
  resolved: Partial<Record<UiToken, string>>,
): string => {
  if (ref === "auto") {
    const bg = resolved["header-bg"] as string;
    return contrastRatio("#ffffff", bg) >= contrastRatio("#0f172a", bg)
      ? "#ffffff"
      : "#0f172a";
  }

  if (ref.startsWith("#")) {
    return ref;
  }

  for (const family of BRAND_FAMILIES) {
    const prefix = `${family}-`;
    if (ref.startsWith(prefix)) {
      const shade = Number(ref.slice(prefix.length)) as keyof UiColorRamp;
      return theme.colors?.[family]?.[shade] ?? ref;
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

const HERO_VALUES = ["none", "band", "photo"] as const;
const SIDEBAR_VALUES = ["none", "toc", "toc-offer"] as const;
const WIDTH_VALUES = ["narrow", "wide"] as const;
const STICKY_VALUES = ["none", "bar", "button"] as const;

const knownOrUndefined = <T extends string>(
  allowed: readonly T[],
  value: T | undefined,
): T | undefined =>
  value !== undefined && (allowed as readonly string[]).includes(value)
    ? value
    : undefined;

// Хиро/сайдбар/ширина/sticky читаются только с поста — тема каркас больше не
// несёт вовсе. Мусор или значение из другой эпохи (`toc-offer` после того,
// как панель перестала его предлагать, всё ещё валиден и здесь пропускается
// как есть) схлопывается в `undefined`, а не протекает в `data-*`: без
// атрибута сайт рисует свой дефолт (см. `frameAttrs`), а не рисует мусор.
export const resolvePageFrame = (
  postFrame: PostFrame | null | undefined,
): UiFrame => ({
  hero: knownOrUndefined(HERO_VALUES, postFrame?.hero),
  sidebar: knownOrUndefined(SIDEBAR_VALUES, postFrame?.sidebar),
  width: knownOrUndefined(WIDTH_VALUES, postFrame?.width),
  sticky: knownOrUndefined(STICKY_VALUES, postFrame?.sticky),
});

// `scheme` может не покрывать все токены (старая запись до добавления нового
// токена) — недостающие достраиваются дефолтом, а не роняют резолв.
export const resolveScheme = (theme: UiTheme): Record<UiToken, string> => {
  const result = {} as Record<UiToken, string>;

  for (const token of UI_TOKENS) {
    const ref = theme.scheme?.[token] ?? DEFAULT_UI_SCHEME[token];
    result[token] = resolveRef(ref, theme, result);
  }

  return result;
};

// Весь каталог Google Fonts (1946 семейств на 27.09.2026) укладывается в
// латиницу, цифры и пробелы. Имя уходит и в CSS внутри `<style>`, и в адрес
// Google Fonts, поэтому всё, что шире, отбрасывается, а не экранируется.
const FONT_FAMILY_NAME = /^[A-Za-z0-9 ]{1,64}$/;

// В базах лежит и голое имя, и готовое CSS-значение `"Raleway", sans-serif`:
// второе давало в адресе `family="Raleway",+sans-serif`, и Google отвечал 400.
export const normalizeFontFamily = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  const name = value
    .split(",")[0]
    .trim()
    .replace(/^(["'])(.*)\1$/, "$2")
    .replace(/\s+/g, " ")
    .trim();

  return FONT_FAMILY_NAME.test(name) ? name : "";
};

// Без кавычек `--font-primary: Source Sans 3` делает `font-family`
// невалидным целиком: «3» — не идентификатор CSS. Стек с запасным шрифтом
// под метрики темы приходит только от сервера сайта (`fontFallback`), панель
// его не знает и пишет голое `sans-serif`.
const fontFamilyCss = (
  value: unknown,
  stacks: Record<string, string>,
): string => {
  const name = normalizeFontFamily(value);

  if (!name) {
    return "";
  }

  return Object.hasOwn(stacks, name) ? stacks[name] : `"${name}", sans-serif`;
};

// Шкала Tailwind 4.3.3 (`tailwindcss/theme.css`) плюс none/full. Старые
// записи несут токен вида `var(--radius-xl)`, а в бандле объявлен только
// `--radius-lg` — такая ссылка вела в пустоту. Map, а не объект: токен
// `constructor` не должен найти что-то в прототипе.
const RADIUS_TOKENS = new Map([
  ["none", "0"],
  ["xs", "0.125rem"],
  ["sm", "0.25rem"],
  ["md", "0.375rem"],
  ["lg", "0.5rem"],
  ["xl", "0.75rem"],
  ["2xl", "1rem"],
  ["3xl", "1.5rem"],
  ["4xl", "2rem"],
  ["full", "9999px"],
]);

const RADIUS_TOKEN = /^var\(\s*--radius-([a-z0-9]+)\s*\)$/;
const CSS_LENGTH =
  /^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex|pt)$/;

export const resolveRadius = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  const radius = value.trim();
  const token = RADIUS_TOKEN.exec(radius);

  if (token) {
    return RADIUS_TOKENS.get(token[1]) ?? "";
  }

  return radius === "0" || CSS_LENGTH.test(radius) ? radius : "";
};

// Цвета + радиус + шрифты + отступы + фон секций по умолчанию. Остальной
// декор (variants/decor.h2) сюда не попадает: его рендерят другие слои.
export const themeToCssVars = (
  theme: UiTheme,
  fontStacks: Record<string, string> = {},
): string => {
  const resolved = resolveScheme(theme);

  // Девять цветов бренда нужны не только схеме `ui-*`: фон секции «Цвет»
  // (`section-style.ts`) и классы вроде `bg-active-200` читают
  // `--color-<семья>-<оттенок>` напрямую, а в `:root` образа там дефолт
  // шаблона — в образ бренд больше никто не вписывает.
  const lines = BRAND_FAMILIES.flatMap((family) =>
    RAMP_SHADES.filter((shade) => theme.colors?.[family]?.[shade]).map(
      (shade) =>
        `  --color-${family}-${shade}: ${theme.colors[family][shade]};`,
    ),
  );

  lines.push(
    ...UI_TOKENS.map((token) => `  --color-ui-${token}: ${resolved[token]};`),
  );

  // Ось, которой в записи нет или которая не прошла проверку, не
  // переопределяется пустотой: значение из `tailwind.css` остаётся жить.
  const radius = resolveRadius(theme.geometry?.radius);
  const bodyFont = fontFamilyCss(theme.type?.body?.family, fontStacks);
  const displayFont = fontFamilyCss(theme.type?.display?.family, fontStacks);

  if (radius) {
    lines.push(`  --radius-primary: ${radius};`);
  }
  if (bodyFont) {
    lines.push(`  --font-primary: ${bodyFont};`);
  }
  if (displayFont) {
    lines.push(`  --font-heading: ${displayFont};`);
  }
  if (theme.type?.display?.weight) {
    lines.push(`  --font-heading-weight: ${theme.type.display.weight};`);
  }
  if (theme.type?.display?.tracking) {
    lines.push(`  --font-heading-tracking: ${theme.type.display.tracking};`);
  }
  if (theme.geometry?.blockGap) {
    lines.push(`  --block-gap: ${theme.geometry.blockGap};`);
  }
  if (theme.geometry?.paragraphGap) {
    lines.push(`  --paragraph-gap: ${theme.geometry.paragraphGap};`);
  }

  // Только оттенок primary — тот же диапазон, что SectionBgToken; секция с
  // mode "site" (PostSections.vue) читает эту переменную по имени, без
  // своего резолва токена.
  const sectionBgToken = theme.decor?.sectionBg?.token;
  if (sectionBgToken) {
    const shade = Number(sectionBgToken.split("-")[1]) as keyof UiColorRamp;
    const hex = theme.colors?.primary?.[shade];

    if (hex) {
      lines.push(`  --ui-section-bg: ${hex};`);
    }
  }

  return `:root {\n${lines.join("\n")}\n}`;
};

// Что реально используют шрифты шаблона: текст + полужирный + подзаголовки.
export const GOOGLE_FONT_WEIGHTS = [400, 500, 700];

// Адрес css2 собирается без @nuxt/fonts — тот модуль сканирует CSS на сборке
// и о семействе, приехавшем из базы, не знает. По этому адресу сервер сам
// забирает @font-face и встраивает в страницу (`server/lib/theme-fonts.ts`);
// браузер идёт сюда только в превью панели и когда сервер до Google не
// достучался. Пара семейств — один запрос: два вместо одного ничего не дают.
export const googleFontsHref = (
  fontFamily: string | string[],
  weights: number[] = GOOGLE_FONT_WEIGHTS,
): string => {
  const families = [
    ...new Set(
      (Array.isArray(fontFamily) ? fontFamily : [fontFamily])
        .map(normalizeFontFamily)
        .filter(Boolean),
    ),
  ];

  if (!families.length) {
    return "";
  }

  const weightAxis = [...new Set(weights)].sort((a, b) => a - b).join(";");
  const query = families
    .map((name) => `family=${name.replace(/\s+/g, "+")}:wght@${weightAxis}`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
};

// Семейства и веса, которые страница берёт у Google, — от них же строится
// запасной шрифт: грань без пары у настоящего шрифта ничего бы не подгоняла.
export const themeFontAxes = (
  theme: UiTheme | null | undefined,
): { families: string[]; weights: number[] } => {
  if (!isUiThemeConfigured(theme)) {
    return { families: [], weights: [] };
  }

  const type = theme.type;

  return {
    families: [
      ...new Set(
        [type?.body?.family, type?.display?.family]
          .map(normalizeFontFamily)
          .filter(Boolean),
      ),
    ],
    weights: type?.display?.weight
      ? [...GOOGLE_FONT_WEIGHTS, type.display.weight]
      : GOOGLE_FONT_WEIGHTS,
  };
};

// Один расчёт на сервер и страницу: сервер встраивает @font-face по этому
// адресу, а страница сверяет с ним свой. Разойдись они — сайт тянул бы тот же
// шрифт ещё и ссылкой на Google.
export const themeFontsHref = (theme: UiTheme | null | undefined): string => {
  const { families, weights } = themeFontAxes(theme);

  return googleFontsHref(families, weights);
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
  variants: {},
  decor: {},
  updatedAt: new Date(0),
});

export const DEFAULT_UI_THEME_DARK: UiTheme = buildDefaultTheme("dark");
export const DEFAULT_UI_THEME_LIGHT: UiTheme = buildDefaultTheme("light");
