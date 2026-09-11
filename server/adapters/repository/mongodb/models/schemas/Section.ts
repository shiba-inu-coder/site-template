import { Schema } from "mongoose";

/**
 * Секция статьи из конструктора AppsPro. Зеркало `SectionSchema` там же —
 * панель пишет сюда напрямую при публикации, и лишнее поле с одной стороны
 * просто не доедет до другой.
 *
 * `layout` объявлен отдельной схемой с `_id: false`, а не объектным литералом:
 * литерал регистрируется путями вида `layout.width`, и запись, отфильтрованная
 * по путям верхнего уровня, потеряла бы его целиком. Той же ловушкой в AppsPro
 * объясняется `metaTag`.
 */
const SectionBgSchema = new Schema(
  {
    token: { type: String, default: "", trim: true },
    hex: { type: String, default: "", trim: true },
    opacity: { type: Number, default: 100 },
  },
  { _id: false },
);

const SectionImageSchema = new Schema(
  {
    path: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
    overlay: { type: Number, default: 0 },
  },
  { _id: false },
);

const SectionPaddingSchema = new Schema(
  {
    top: { type: Number, default: 40 },
    right: { type: Number, default: 0 },
    bottom: { type: Number, default: 40 },
    left: { type: Number, default: 0 },
  },
  { _id: false },
);

const SectionMarginSchema = new Schema(
  {
    top: { type: Number, default: 0 },
    bottom: { type: Number, default: 0 },
  },
  { _id: false },
);

// Старые пресеты (одно вертикальное значение) — запись до перехода панели
// на px, зеркало LEGACY_PADDING_VERTICAL_PX в section-style.ts.
const LEGACY_PADDING_VERTICAL_PX: Record<string, number> = {
  none: 0,
  sm: 16,
  md: 40,
  lg: 72,
};

const legacyPaddingToPx = (preset: string) => {
  const vertical = LEGACY_PADDING_VERTICAL_PX[preset] ?? LEGACY_PADDING_VERTICAL_PX.md;

  return { top: vertical, right: 0, bottom: vertical, left: 0 };
};

const SectionLayoutSchema = new Schema(
  {
    width: { type: String, default: "container", trim: true },
    bg: { type: SectionBgSchema, default: () => ({}) },
    image: { type: SectionImageSchema, default: () => ({}) },
    // Запись до этой правки хранит пресет строкой (`none/sm/md/lg`) — set
    // ловит её при гидратации документа и переводит в px, как и normalizeSectionLayout
    // на клиенте.
    padding: {
      type: SectionPaddingSchema,
      default: () => ({}),
      set: (value: unknown) =>
        typeof value === "string" ? legacyPaddingToPx(value) : value,
    },
    margin: { type: SectionMarginSchema, default: () => ({}) },
    radius: { type: Number, default: 0 },
  },
  { _id: false },
);

const SectionChildSchema = new Schema(
  {
    tag: { type: String, default: "h3", trim: true },
    title: { type: String, default: "", trim: true },
    comment: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const SectionSchema = new Schema(
  {
    uid: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    // Бриф и план подзаголовков читателю не показываются: они нужны только
    // конструктору, чтобы секцию можно было перегенерировать поодиночке.
    comment: { type: String, default: "", trim: true },
    children: { type: [SectionChildSchema], default: () => [] },
    body: { type: String, default: "" },
    blocks: { type: [String], default: () => [] },
    layout: { type: SectionLayoutSchema, default: () => ({}) },
  },
  { _id: false },
);
