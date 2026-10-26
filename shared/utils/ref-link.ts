export interface SiteRefsInput {
  defaultSlug?: string | null;
  blocks?: Record<string, string | null | undefined> | null;
  buttons?: Record<string, string | null | undefined> | null;
}

const own = (map: SiteRefsInput["blocks"], key: string) =>
  map && key && Object.hasOwn(map, key) ? map[key] || "" : "";

/**
 * Казино, которое выбрала панель: кнопка → её блок → по умолчанию. Пусто, если
 * панель ничего не выбрала, — тогда вызывающий идёт своим запасным путём
 * (явная ссылка пункта меню, `brandSlug`), и сайт без `settings.refs` выглядит
 * как раньше.
 */
export const pickRefSlug = (
  refs: SiteRefsInput | null | undefined,
  { key = "", block = "" }: { key?: string; block?: string } = {},
) =>
  own(refs?.buttons, key) ||
  own(refs?.blocks, block) ||
  refs?.defaultSlug ||
  "";

/** Весь порядок: выбор панели → `brandSlug` сайта. Пусто — кнопка ведёт на `/`. */
export const resolveRefSlug = (
  refs: SiteRefsInput | null | undefined,
  options: { key?: string; block?: string; brandSlug?: string },
) => pickRefSlug(refs, options) || options.brandSlug || "";

/**
 * Выбор без казино, которого нет среди казино сайта: снятое казино иначе
 * оставило бы кнопки с битым `/go/<slug>/`. Пустые значения выпадают сами.
 */
export const pruneRefs = (
  refs: SiteRefsInput | null | undefined,
  knownSlugs: Iterable<string>,
) => {
  if (!refs) {
    return null;
  }

  const known = new Set(knownSlugs);
  const keep = (slug: unknown): slug is string =>
    typeof slug === "string" && known.has(slug);
  const pruneMap = (map: SiteRefsInput["blocks"]) =>
    Object.fromEntries(
      Object.entries(map || {}).filter(([key, slug]) => key && keep(slug)),
    ) as Record<string, string>;

  return {
    defaultSlug: keep(refs.defaultSlug) ? refs.defaultSlug : "",
    blocks: pruneMap(refs.blocks),
    buttons: pruneMap(refs.buttons),
  };
};

/** Часть ключа из подписи кнопки: `header.ref.<подпись>`. */
export const refLabelSlug = (label: string) =>
  label
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
