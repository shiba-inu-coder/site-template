// Чистый модуль: без импортов из Nuxt/Vue и без auto-import. Схема темы
// читается и панелью (appspro), и этим сайтом, и превью — там, где Nuxt не
// поднят вовсе.

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
  "footer-text",

  "card-bg",
  "card-border",
  "card-title",

  "panel-bg",
  "panel-border",

  "input-bg",
  "input-border",

  "heading",
  "text",

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
  "table-btn-bg",
  "table-btn-hover",
  "table-btn-text",

  "marker",
  "h2-decor",
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
    weight?: number;
  };
}

export interface UiGeometry {
  radius: string;
  // Толщина рамок карточек, панелей и полей: "0" или длина в px/rem/em.
  borderWidth?: string;
  // Записи до 1.16.0: 0/1/2 → 0/1px/2px, пока панель не пересохранила.
  borders?: 0 | 1 | 2;
  // Свободные CSS-длины (12px/0.5rem), не enum — оператор набирает своё
  // значение, а не выбирает из трёх пресетов, как раньше density.
  blockGap?: string;
  paragraphGap?: string;
}

// Ширина — одна на сайт и живёт в теме; sticky — у каждой страницы своя.
// Старые `post.frame.hero/sidebar/width` в базах остаются, но не читаются:
// их пишут и читают сайты ниже v1.11.0.
export interface UiFrame {
  width?: "narrow" | "wide";
}

export interface PostFrame {
  sticky?: "none" | "bar" | "bar-float" | "button";
}

export type PageFrame = UiFrame & PostFrame;

// Вариант темы остался у четырёх блоков; остальные рисуются одним видом, и
// их старые ключи в базе просто не читаются.
export interface UiVariants {
  toc?: string;
  gridCards?: string;
  faq?: string;
  buttonRef?: string;
}

// Цвет из палитры ("primary-200") или свой hex; пусто — как на сайте.
export interface UiFirstSection {
  mode?: "none" | "color" | "image";
  width?: "container" | "full";
  bg?: { token?: string; hex?: string; opacity?: number };
  image?: { path?: string; overlay?: number };
  padding?: { top?: number | string | null; bottom?: number | string | null };
  heading?: string;
  text?: string;
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
  firstSection?: UiFirstSection;
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
  frame?: UiFrame;
  updatedAt: Date;
}

// Дефолтная схема применения — токен в токен то, что раньше было
// захардкожено в компонентах (см. таблицу в `docs/ui.md`). Не зависит от
// режима. Текст — литералы светлого «Пустого»: цвет элементов идёт только
// через `ui-*`, а `surface-*` остался для `color-scheme` и старых записей.
export const DEFAULT_UI_SCHEME: UiScheme = {
  "page-bg": "primary-300",
  "header-bg": "primary-300",
  "header-text": "#0f172a",
  "footer-bg": "primary-200",
  "footer-bg-alt": "primary-300",
  "footer-text": "#0f172a",

  "card-bg": "primary-100",
  "card-border": "primary-300",
  "card-title": "accent-200",

  "panel-bg": "primary-200",
  "panel-border": "primary-300",

  "input-bg": "primary-100",
  "input-border": "primary-100",

  heading: "accent-200",
  text: "#0f172a",

  link: "active-200",
  "link-hover": "active-300",

  "cta-bg": "active-200",
  "cta-hover": "active-300",
  "cta-text": "#ffffff",

  "table-head-bg": "primary-300",
  "table-head-text": "#0f172a",
  "table-row": "primary-200",
  "table-row-alt": "primary-300",
  "table-row-border": "primary-100",
  "table-btn-bg": "active-200",
  "table-btn-hover": "active-300",
  "table-btn-text": "#ffffff",

  marker: "accent-200",
  "h2-decor": "accent-200",
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

// `undefined` — ссылка цвета не дала: «auto» из записи до 028bc8e, оттенок,
// которого в теме нет, неизвестный `surface-*`. Для схемы это отсутствие
// значения, а не значение.
const resolveRef = (ref: UiSchemeRef, theme: UiTheme): string | undefined => {
  if (!ref || ref === "auto") {
    return undefined;
  }

  if (ref.startsWith("#")) {
    return ref;
  }

  for (const family of BRAND_FAMILIES) {
    const prefix = `${family}-`;
    if (ref.startsWith(prefix)) {
      const shade = Number(ref.slice(prefix.length)) as keyof UiColorRamp;
      return theme.colors?.[family]?.[shade];
    }
  }

  if (ref.startsWith("surface-")) {
    const key = ref.slice("surface-".length) as UiSurfaceToken;
    return SURFACE_BY_MODE[theme.mode]?.[key];
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

const WIDTH_VALUES = ["narrow", "wide"] as const;
const STICKY_VALUES = ["none", "bar", "bar-float", "button"] as const;

const knownOrUndefined = <T extends string>(
  allowed: readonly T[],
  value: T | undefined,
): T | undefined =>
  value !== undefined && (allowed as readonly string[]).includes(value)
    ? value
    : undefined;

// Ширина — с темы, sticky — с поста; `post.frame.width` старой эпохи сюда
// не доходит. Мусор схлопывается в `undefined`, а не протекает в `data-*`:
// без атрибута сайт рисует свой дефолт (см. `frameAttrs`).
export const resolvePageFrame = (
  theme: Pick<UiTheme, "frame"> | null | undefined,
  postFrame: PostFrame | null | undefined,
): PageFrame => ({
  width: knownOrUndefined(WIDTH_VALUES, theme?.frame?.width),
  sticky: knownOrUndefined(STICKY_VALUES, postFrame?.sticky),
});

// Ключ, которого нет в записи, берёт цвет старого ключа, а не дефолт: сайт,
// где оператор перекрасил текст или маркеры, не перекрасится сам после
// обновления. Родитель стоит раньше ребёнка только в логике, не в порядке
// `UI_TOKENS`: цвет родителя считается по требованию.
export const SCHEME_INHERIT: Partial<Record<UiToken, UiToken>> = {
  "header-text": "text",
  "footer-text": "text",
  "table-btn-bg": "cta-bg",
  "table-btn-hover": "cta-hover",
  "table-btn-text": "cta-text",
  "h2-decor": "marker",
};

// `scheme` может не покрывать все токены (старая запись до добавления нового
// токена) — недостающие достраиваются по `SCHEME_INHERIT`, потом дефолтом, а не
// роняют резолв. Лишние ключи (удалённые токены старой записи) обход по
// `UI_TOKENS` не видит.
export const resolveScheme = (theme: UiTheme): Record<UiToken, string> => {
  const result = {} as Record<UiToken, string>;

  const resolveToken = (token: UiToken): string => {
    if (result[token]) {
      return result[token];
    }

    const own = theme.scheme?.[token];
    let color = own ? resolveRef(own, theme) : undefined;

    const parent = SCHEME_INHERIT[token];
    if (!color && parent) {
      color = resolveToken(parent);
    }

    result[token] = color ?? resolveRef(DEFAULT_UI_SCHEME[token], theme) ?? "";

    return result[token];
  };

  const ordered = {} as Record<UiToken, string>;
  for (const token of UI_TOKENS) {
    ordered[token] = resolveToken(token);
  }

  return ordered;
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
// невалидным целиком: «3» — не идентификатор CSS.
const fontFamilyCss = (value: unknown): string => {
  const name = normalizeFontFamily(value);

  return name ? `"${name}", sans-serif` : "";
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

const BORDER_WIDTH = /^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em)$/;

// `borderWidth` — то, что пишет панель с 1.16.0; `borders` 0/1/2 остался в
// записях, которые никто не пересохранял. Мусор не пишется: тогда рамка
// остаётся такой, какой её рисует класс компонента.
export const resolveBorderWidth = (
  geometry: Partial<UiGeometry> | null | undefined,
): string => {
  const width = geometry?.borderWidth;

  if (typeof width === "string") {
    const value = width.trim();

    if (value === "0" || BORDER_WIDTH.test(value)) {
      return value;
    }
  }

  const legacy = geometry?.borders;

  if (legacy === 0) return "0";
  if (legacy === 1) return "1px";
  if (legacy === 2) return "2px";

  return "";
};

const BODY_WEIGHT_MIN = 100;
const BODY_WEIGHT_MAX = 900;

export const resolveBodyWeight = (value: unknown): number | undefined => {
  const weight = typeof value === "string" ? Number(value) : value;

  return typeof weight === "number" &&
    Number.isInteger(weight) &&
    weight >= BODY_WEIGHT_MIN &&
    weight <= BODY_WEIGHT_MAX
    ? weight
    : undefined;
};

// Цвета + радиус + шрифты + отступы + рамки. Остальной декор (variants,
// decor.h2, decor.firstSection) сюда не попадает: его рендерят другие слои.
export const themeToCssVars = (theme: UiTheme): string => {
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
  const bodyFont = fontFamilyCss(theme.type?.body?.family);
  const displayFont = fontFamilyCss(theme.type?.display?.family);
  const bodyWeight = resolveBodyWeight(theme.type?.body?.weight);
  const borderWidth = resolveBorderWidth(theme.geometry);

  if (radius) {
    lines.push(`  --radius-primary: ${radius};`);
  }
  if (bodyFont) {
    lines.push(`  --font-primary: ${bodyFont};`);
  }
  if (displayFont) {
    lines.push(`  --font-heading: ${displayFont};`);
  }
  if (bodyWeight) {
    lines.push(`  --font-body-weight: ${bodyWeight};`);
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
  if (borderWidth) {
    lines.push(`  --ui-border-width: ${borderWidth};`);
  }

  return `:root {\n${lines.join("\n")}\n}`;
};

// Что реально используют шрифты шаблона: текст + полужирный + подзаголовки.
// Вес текста и вес заголовков из темы добавляются поверх (`themeFontsHref`).
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

// Один расчёт на сервер и страницу: сервер встраивает @font-face по этому
// адресу, а страница сверяет с ним свой. Разойдись они — сайт тянул бы тот же
// шрифт ещё и ссылкой на Google.
export const themeFontsHref = (theme: UiTheme | null | undefined): string => {
  if (!isUiThemeConfigured(theme)) {
    return "";
  }

  const type = theme.type;
  const bodyWeight = resolveBodyWeight(type?.body?.weight);
  const weights = [
    ...GOOGLE_FONT_WEIGHTS,
    ...(type?.display?.weight ? [type.display.weight] : []),
    ...(bodyWeight ? [bodyWeight] : []),
  ];

  return googleFontsHref([type?.body?.family, type?.display?.family], weights);
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
