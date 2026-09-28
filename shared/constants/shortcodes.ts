/**
 * Какие атрибуты маркера доходят до компонента сверх общих (`class`,
 * `uniq-id`, `data-*`, `aria-*`). Остальное рендерер статьи отбрасывает, так
 * что атрибут, заведённый в панели (`attrs` в
 * `appspro/shared/constants/shortcodes.js`), без строки здесь до сайта не
 * доедет.
 */
export const ARTICLE_SHORTCODE_ATTRS = {
  ButtonRef: [
    "name",
    "position",
    "size",
    "variant",
    "slug",
    "full-width",
    "padding",
    "show-mobile-icon",
  ],
  BiographyWriter: ["compact"],
  TableContent: [],
  Faq: [],
  GridCards: [],
  ProsConsPost: [],
  DataTable: [],
  ContactUs: [],
  TextImage: [],
} as const satisfies Record<string, readonly string[]>;

/** Маркеры внутри ячейки `data-table`: иконка и реф-ссылки. */
export const TABLE_CELL_SHORTCODE_ATTRS = {
  Image: ["name", "alt", "width", "height", "inline"],
  RefLink: ["slug"],
  RefLinkBtn: ["slug"],
} as const satisfies Record<string, readonly string[]>;
