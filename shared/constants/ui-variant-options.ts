/**
 * Список значений и подписей для панельки выбора варианта (`VariantPicker`,
 * 5b) — один на каждый из 12 шорткодов плюс шапку, футер, крошки, хиро и
 * sticky. Порядок и первое значение — тот же дефолт, что в компоненте блока
 * (`pickVariant`); поменял вариант компонента — поменяй и здесь, иначе
 * панелька предложит то, чего блок не умеет.
 */

export interface UiVariantPickerOption {
  value: string;
  label: string;
}

export interface UiVariantPickerConfig {
  label: string;
  group: "variants" | "frame";
  optionKey: string;
  fallback: string;
  options: UiVariantPickerOption[];
}

export const UI_VARIANT_PICKERS: Record<string, UiVariantPickerConfig> = {
  header: {
    label: "Шапка",
    group: "frame",
    optionKey: "header",
    fallback: "classic",
    options: [
      { value: "classic", label: "Классика" },
      { value: "centered", label: "По центру" },
      { value: "compact", label: "Компактная" },
      { value: "two-row", label: "Две строки" },
      { value: "search", label: "С поиском" },
    ],
  },
  hero: {
    label: "Хиро",
    group: "frame",
    optionKey: "hero",
    fallback: "none",
    options: [
      { value: "none", label: "Без хиро" },
      { value: "band", label: "Полоса" },
      { value: "photo", label: "С фото" },
    ],
  },
  sticky: {
    label: "Sticky",
    group: "frame",
    optionKey: "sticky",
    fallback: "none",
    options: [
      { value: "none", label: "Скрыт" },
      { value: "bar", label: "Строка бонуса" },
      { value: "button", label: "Одна кнопка" },
    ],
  },
  breadcrumbs: {
    label: "Крошки",
    group: "variants",
    optionKey: "breadcrumbs",
    fallback: "slash",
    options: [
      { value: "slash", label: "Через слэш" },
      { value: "pills", label: "Пилюли" },
      { value: "back", label: "Назад" },
    ],
  },
  footer: {
    label: "Футер",
    group: "variants",
    optionKey: "footer",
    fallback: "columns",
    options: [
      { value: "columns", label: "Колонки" },
      { value: "minimal", label: "Минимум" },
      { value: "centered", label: "По центру" },
      { value: "disclaimer", label: "С дисклеймером" },
    ],
  },
  ratingStrip: {
    label: "Рейтинг",
    group: "variants",
    optionKey: "ratingStrip",
    fallback: "strip",
    options: [
      { value: "strip", label: "Строка" },
      { value: "scorecard", label: "Панель" },
      { value: "bars", label: "Полоски" },
      { value: "chips", label: "Пилюли" },
    ],
  },
  toc: {
    label: "Оглавление",
    group: "variants",
    optionKey: "toc",
    fallback: "box",
    options: [
      { value: "box", label: "Панель" },
      { value: "rule", label: "Линия слева" },
      { value: "pills", label: "Пилюли" },
      { value: "columns", label: "Колонки" },
      { value: "steps", label: "Шаги" },
    ],
  },
  gridCards: {
    label: "Карточки",
    group: "variants",
    optionKey: "gridCards",
    fallback: "text",
    options: [
      { value: "text", label: "Текст" },
      { value: "image-caption", label: "Фото + подпись" },
      { value: "image-title-text", label: "Фото + текст" },
      { value: "horizontal", label: "Горизонтальные" },
      { value: "offer", label: "Оффер" },
    ],
  },
  dataTable: {
    label: "Таблица",
    group: "variants",
    optionKey: "dataTable",
    fallback: "classic",
    options: [
      { value: "classic", label: "Таблица" },
      { value: "ranking", label: "Топ" },
      { value: "rows", label: "Карточки-строки" },
      { value: "compare", label: "Сравнение" },
      { value: "key-value", label: "Досье" },
    ],
  },
  textImage: {
    label: "Картинка + текст",
    group: "variants",
    optionKey: "textImage",
    fallback: "split",
    options: [
      { value: "split", label: "Колонки" },
      { value: "overlay", label: "Текст поверх" },
      { value: "card", label: "Карточка" },
      { value: "caption", label: "Подпись" },
      { value: "banner", label: "Баннер" },
    ],
  },
  faq: {
    label: "FAQ",
    group: "variants",
    optionKey: "faq",
    fallback: "list",
    options: [
      { value: "list", label: "Список" },
      { value: "accordion", label: "Аккордеон" },
      { value: "numbered", label: "Нумерация" },
      { value: "grid", label: "Сетка" },
      { value: "chat", label: "Чат" },
    ],
  },
  prosCons: {
    label: "Плюсы и минусы",
    group: "variants",
    optionKey: "prosCons",
    fallback: "two-col",
    options: [
      { value: "two-col", label: "Две колонки" },
      { value: "stacked", label: "Столбиком" },
      { value: "merged", label: "Один список" },
      { value: "scoreboard", label: "Счёт" },
      { value: "table", label: "Таблица" },
    ],
  },
  biography: {
    label: "Автор",
    group: "variants",
    optionKey: "biography",
    fallback: "card",
    options: [
      { value: "card", label: "Карточка" },
      { value: "inline", label: "Строкой" },
      { value: "banner", label: "Баннер" },
      { value: "centered", label: "По центру" },
      { value: "signature", label: "Подпись" },
    ],
  },
  contact: {
    label: "Контакты",
    group: "variants",
    optionKey: "contact",
    fallback: "card",
    options: [
      { value: "card", label: "Карточка" },
      { value: "plain", label: "Без обёртки" },
      { value: "split", label: "С реквизитами" },
    ],
  },
  buttonRef: {
    label: "Кнопка",
    group: "variants",
    optionKey: "buttonRef",
    fallback: "solid",
    options: [
      { value: "solid", label: "Заливка" },
      { value: "outline", label: "Контур" },
      { value: "soft", label: "Мягкая" },
      { value: "block", label: "Во всю ширину" },
    ],
  },
  bonusBox: {
    label: "Бонус",
    group: "variants",
    optionKey: "bonusBox",
    fallback: "stripe",
    options: [
      { value: "stripe", label: "Полоса" },
      { value: "banner", label: "Баннер" },
      { value: "ticket", label: "Купон" },
      { value: "split", label: "Сплит" },
      { value: "bar", label: "Строка" },
    ],
  },
  verdictBox: {
    label: "Вердикт",
    group: "variants",
    optionKey: "verdictBox",
    fallback: "card",
    options: [
      { value: "card", label: "Карточка" },
      { value: "split", label: "Сплит" },
      { value: "quote", label: "Цитата" },
      { value: "strip", label: "Полоса" },
    ],
  },
};
