import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import type { UiDecor } from "./ui-theme.ts";

// Оформление секции статьи. Значения читают трое: конструктор в панели,
// сборщик HTML для неперевезённых сайтов (article-sections.js) и этот файл.
// Зеркальную копию в панели нужно держать в синхроне с этим файлом.

// "site" — фон темы (decor.sectionBg) целиком, "none" гасит его даже там,
// где он есть, "color"/"image" — секция несёт фон сама. Тот же список несёт
// Section.ts (Mongoose enum) — один источник на оба места.
export const SECTION_BG_MODES = ["site", "color", "image", "none"] as const;

type SectionBgMode = (typeof SECTION_BG_MODES)[number];

const resolveSectionBgMode = (mode: unknown): SectionBgMode | undefined =>
  (SECTION_BG_MODES as readonly unknown[]).includes(mode)
    ? (mode as SectionBgMode)
    : undefined;

const SECTION_PADDING_MAX = 200;
const SECTION_MARGIN_MAX = 200;
const SECTION_RADIUS_MAX = 64;

// Старые пресеты (одно вертикальное значение, без горизонтали) — то, что
// хранит запись до перехода панели на px.
const LEGACY_PADDING_VERTICAL_PX: Record<string, number> = {
  none: 0,
  sm: 16,
  md: 40,
  lg: 72,
};

const legacyPaddingToPx = (preset: string): PostSectionPadding => {
  const vertical =
    LEGACY_PADDING_VERTICAL_PX[preset] ?? LEGACY_PADDING_VERTICAL_PX.md;

  return { top: vertical, right: 0, bottom: vertical, left: 0 };
};

const clampPx = (value: unknown, max: number, fallback = 0): number => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(max, Math.max(0, Math.round(number)));
};

const resolvePadding = (
  rawPadding: PostSectionPadding | LegacyPostSectionPadding | undefined,
  base: PostSectionPadding,
): PostSectionPadding => {
  if (typeof rawPadding === "string") {
    return legacyPaddingToPx(rawPadding);
  }

  return {
    top: clampPx(rawPadding?.top, SECTION_PADDING_MAX, base.top),
    right: clampPx(rawPadding?.right, SECTION_PADDING_MAX, base.right),
    bottom: clampPx(rawPadding?.bottom, SECTION_PADDING_MAX, base.bottom),
    left: clampPx(rawPadding?.left, SECTION_PADDING_MAX, base.left),
  };
};

/**
 * Запись любой эпохи → полный объект оформления. Строковый `padding`
 * (пресет записи до перехода на px) переводится по legacyPaddingToPx;
 * уже объектный клампится в допустимый диапазон, отсутствующие поля
 * (margin/radius у записи ещё старше) достраиваются дефолтом.
 */
export const normalizeSectionLayout = (
  layout?: RawPostSectionLayout | null,
): PostSectionLayout => {
  const base: PostSectionLayout = {
    mode: "site",
    width: "container",
    bg: { token: "", hex: "", opacity: 100 },
    image: { path: "", alt: "", overlay: 0 },
    padding: { top: 40, right: 0, bottom: 40, left: 0 },
    margin: { top: 0, bottom: 0 },
    radius: 0,
  };

  if (!layout) {
    return base;
  }

  const mode = resolveSectionBgMode(layout.mode) ?? base.mode;
  const width = layout.width === "full" ? "full" : base.width;
  const bg = { ...base.bg, ...(layout.bg || {}) };
  const image = { ...base.image, ...(layout.image || {}) };
  const padding = resolvePadding(layout.padding, base.padding);

  const margin = {
    top: clampPx(layout.margin?.top, SECTION_MARGIN_MAX, base.margin.top),
    bottom: clampPx(
      layout.margin?.bottom,
      SECTION_MARGIN_MAX,
      base.margin.bottom,
    ),
  };

  const radius = clampPx(layout.radius, SECTION_RADIUS_MAX, base.radius);

  return { mode, width, bg, image, padding, margin, radius };
};

export const sectionBackgroundColor = (bg?: PostSectionBg): string => {
  const opacity = clampPx(bg?.opacity, 100, 100);

  if (bg?.token) {
    return opacity >= 100
      ? `var(--color-${bg.token})`
      : `color-mix(in srgb, var(--color-${bg.token}) ${opacity}%, transparent)`;
  }

  if (bg?.hex) {
    return opacity >= 100 ? bg.hex : `${bg.hex}${alphaSuffix(opacity)}`;
  }

  return "";
};

const alphaSuffix = (opacity: number): string =>
  Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, "0");

/**
 * Затемнение — вторым слоем градиента, а не трансформацией Cloudinary: правка
 * ползунка в панели не должна перезаливать ассет. Цвет — `--color-ui-page-bg`
 * через color-mix, не чёрный: на светлой теме страницы чёрная вуаль поверх
 * картинки читалась бы как чужеродное пятно, а текст секции остаётся тёмным
 * (surface-text светлой темы) и должен остаться читаемым поверх затемнения.
 */
export const sectionBackgroundImage = (
  image: PostSectionImage | undefined,
  cloudName: string,
): string => {
  if (!image?.path) {
    return "";
  }

  const url = /^https?:\/\//.test(image.path)
    ? image.path
    : `${getCloudinaryBaseUrl(cloudName)}f_auto,q_auto/${image.path}`;

  const overlay = clampPx(image.overlay, 100, 0);
  const layers: string[] = [];

  if (overlay > 0) {
    const mixed = `color-mix(in srgb, var(--color-ui-page-bg) ${overlay}%, transparent)`;
    layers.push(`linear-gradient(${mixed},${mixed})`);
  }

  layers.push(`url(${url})`);

  return layers.join(",");
};

export interface SectionBgPlacement {
  // "wrap" — обёртка во всю ширину, без скругления; "box" — сам <section>
  // внутри контейнера, со скруглением. Классы под каждое значение живут
  // литералами в PostSections.vue: Tailwind не сканирует .ts.
  target: "none" | "wrap" | "box";
  style: string;
  // Коробки со скруглением, поставленные встык, читаются одной плашкой со
  // щербинами. Полосы во всю ширину, наоборот, встык и задуманы.
  gap: boolean;
}

/**
 * "color"/"image" несут фон сами, своей width; "site" берёт --ui-section-bg
 * и width темы целиком — width самой секции здесь не в счёт, оператор явно
 * выбрал «как у сайта»; "none" гасит фон темы даже там, где он есть.
 */
export const resolveSectionBg = (
  layout: RawPostSectionLayout | null | undefined,
  decor: UiDecor | undefined,
  cloudName: string,
): SectionBgPlacement => {
  const normalized = normalizeSectionLayout(layout);

  let width = normalized.width;
  let color = "";
  let image = "";

  if (normalized.mode === "color") {
    color = sectionBackgroundColor(normalized.bg);
  } else if (normalized.mode === "image") {
    image = sectionBackgroundImage(normalized.image, cloudName);
  } else if (normalized.mode === "site") {
    width = decor?.sectionBg?.width === "full" ? "full" : "container";
    color = decor?.sectionBg?.token ? "var(--ui-section-bg)" : "";
  }

  const style = [
    color && `background-color:${color}`,
    image && `background-image:${image}`,
  ]
    .filter(Boolean)
    .join(";");

  if (!style) {
    return { target: "none", style: "", gap: false };
  }

  return width === "full"
    ? { target: "wrap", style, gap: false }
    : { target: "box", style, gap: true };
};

/**
 * `normalizeSectionLayout` внутри: запись старой эпохи (padding строкой,
 * margin/radius отсутствуют вовсе) обязана рендериться верно независимо от
 * того, нормализовал ли кто-то секцию раньше.
 *
 * margin — только top/bottom, никогда шорткэндом: у секции «во всю ширину»
 * горизонтальный сдвиг для растягивания фона задаёт CONTAINER-обёртка в
 * PostSections.vue, а шорткэнд `margin:T 0 B` обнулил бы его инлайном, если
 * бы оказался на том же элементе.
 */
export const sectionStyle = (
  layout: RawPostSectionLayout | undefined,
  cloudName: string,
): string => {
  const { bg, image, padding, margin, radius } = normalizeSectionLayout(layout);
  const declarations: string[] = [];
  const color = sectionBackgroundColor(bg);
  const backgroundImage = sectionBackgroundImage(image, cloudName);

  if (color) {
    declarations.push(`background-color:${color}`);
  }

  if (backgroundImage) {
    declarations.push(`background-image:${backgroundImage}`);
  }

  declarations.push(
    `padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
  );

  if (margin.top) {
    declarations.push(`margin-top:${margin.top}px`);
  }

  if (margin.bottom) {
    declarations.push(`margin-bottom:${margin.bottom}px`);
  }

  if (radius) {
    declarations.push(`border-radius:${radius}px`);
  }

  return declarations.join(";");
};
