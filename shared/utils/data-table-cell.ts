export type DataTableCellKind = "logo" | "button" | "labeled" | "plain";

const TAG_RE = /<div\b[^>]*>/gi;
const QUOTED_RE = /"[^"]*"|'[^']*'/g;

// Значения атрибутов вырезаются до разбора: `alt="logo"` — не признак `logo`.
// Квотированное значение `is` вырезано вместе с остальными, поэтому вид
// маркера читается по исходному тегу, а наличие булева `logo` — по очищенному.
const parse = (template: string) =>
  (template.match(TAG_RE) ?? []).map((raw) => ({
    raw,
    bare: raw.replace(QUOTED_RE, '""'),
  }));

const hasLogoFlag = (bare: string): boolean => /\slogo(?=[\s/>=])/.test(bare);

// Как ячейка встаёт в карточку на телефоне: лого и кнопка — на всю ширину и
// без подписи, остальное — «подпись слева, значение справа». Колонка без
// заголовка подписи не имеет, ей нечего показывать слева.
export const dataTableCellKind = (
  template: string | undefined,
  columnTitle: string | undefined,
): DataTableCellKind => {
  const tags = parse(template ?? "");

  if (tags.some(({ raw }) => /\bis=["']vue:ref-link-btn["']/i.test(raw))) {
    return "button";
  }

  if (
    tags.some(
      ({ raw, bare }) =>
        /\bis=["']vue:image["']/i.test(raw) && hasLogoFlag(bare),
    )
  ) {
    return "logo";
  }

  return columnTitle?.trim() ? "labeled" : "plain";
};
