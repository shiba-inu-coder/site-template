// Постоянные ключи реф-кнопок стандартных частей шаблона. Ключ — адрес выбора
// в `settings.refs`, поэтому менять его нельзя, не потеряв настройку сайта.
export const REF_BLOCK = {
  article: "article",
  hero: "hero",
  sticky: "sticky",
  header: "header",
} as const;

export const REF_KEY = {
  heroCta: "hero.cta",
  stickyCta: "sticky.cta",
} as const;

export const HEADER_REF_KEY_PREFIX = "header.ref.";

// Кнопки, которые шаблон рисует сам. Кнопки пунктов меню `kind: "ref"`
// зависят от `brand/site.json` и в список не входят: их ключ —
// `header.ref.<refLabelSlug(подпись)>`. Остальное задаёт `brand/refs.json`.
export const STANDARD_REF_BLOCKS = [
  {
    block: REF_BLOCK.hero,
    label: "Баннер",
    buttons: [{ key: REF_KEY.heroCta, label: "Кнопка баннера" }],
  },
  {
    block: REF_BLOCK.sticky,
    label: "Липкая панель",
    buttons: [{ key: REF_KEY.stickyCta, label: "Кнопка липкой панели" }],
  },
] as const;
