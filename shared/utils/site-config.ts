/**
 * Конфиг сайта = нейтральный `seo.conf.ts` из образа, перекрытый записью из
 * базы (`settings.brand/layout/strings`). Чистая функция без Nuxt: её же форму
 * читает и превью, где состояния ещё нет.
 *
 * Пустое значение записи не перекрывает дефолт шаблона. Панель пишет настройки
 * по частям, и полузаполненная запись иначе стирала бы надпись кнопки в пустую
 * строку — ровно тем же способом, каким `themeToCssVars` не пишет пустую ось.
 */

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const deepMerge = <T>(base: T, patch: unknown): T => {
  if (isEmpty(patch)) {
    return base;
  }

  if (!isPlainObject(base) || !isPlainObject(patch)) {
    return patch as T;
  }

  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    result[key] = deepMerge(result[key], value);
  }

  return result as T;
};

/**
 * Черновик оформления поверх опубликованного — только у сайта на стенде
 * (флаг `SETTINGS_DRAFT`). Панель пишет черновик точечными путями
 * `draft.brand.*`, так что частичный `brand` без лого обязан не стереть
 * опубликованное лого: бренд, макет и строки накладываются глубоко, тем же
 * правилом, что и запись поверх шаблона. Тема — целиком: панель пишет её
 * одним ключом, и смешивать две темы по полям значило бы показать ни ту, ни
 * другую.
 */
export const overlaySettingsDraft = <T extends ISettingPublic>(
  published: T,
  draft?: ISettingDraft | null,
): T => {
  if (!isPlainObject(draft)) {
    return published;
  }

  const draftTheme = isPlainObject(draft.uiTheme) ? draft.uiTheme : null;

  return {
    ...published,
    brand: deepMerge(published.brand, draft.brand),
    layout: deepMerge(published.layout, draft.layout),
    strings: deepMerge(published.strings, draft.strings),
    uiTheme:
      draftTheme && Object.keys(draftTheme).length
        ? draftTheme
        : published.uiTheme,
  };
};

/**
 * Публичный ответ настроек из того, что лежит в базе: черновик накладывается
 * только у стенда (`showDraft`) и наружу не уходит ни с флагом, ни без.
 */
export const resolvePublicSettings = (
  stored: ISettingStoredPublic,
  { showDraft = false }: { showDraft?: boolean } = {},
): ISettingPublic => {
  const { draft, ...published } = stored;

  return showDraft ? overlaySettingsDraft(published, draft) : published;
};

// Форма, которой обязан обладать конфиг, чем бы ни оказался `seo.conf.ts`:
// до этапа 5d панель переписывает этот файл целиком по своему фиксированному
// шаблону, и ключей, заведённых здесь, в переписанном файле не будет.
const SITE_CONFIG_STRUCTURE: SiteConfig = {
  site: { name: "", lang: "en", theme: "light", brandSlug: "" },
  logo: { src: "", alt: "", width: 0, height: 0 },
  favicon: { src: "" },
  banner: { path: "", alt: "", width: 0, height: 0 },
  img: { modifiers: { roundCorner: "" } },
  layout: {
    header: {
      items: [],
      cta: { label: "", link: "", note: "" },
    },
    footer: {
      title: "",
      body: "",
      links: [],
      legalLogos: [],
    },
    breadcrumbs: { homeLabel: "" },
  },
  translates: {} as SiteStrings,
};

/**
 * Навигация из панели поверх готового конфига. Нужна отдельным полем, а не
 * приоритетом `settings.layout`: применение манифеста переписывает `layout.*`
 * дефолтами, и они затёрли бы вёрстку, лежащую в `brand/site.json`.
 *
 * Пункты шапки `kind: "page"` заменяются целиком (выпадашка `children` у
 * заменённого пункта пропадает), логотип и кнопки `ref` остаются. Новые пункты
 * встают на место первого убранного с его `position` и `style`.
 *
 * Поле, сохранённое формой (`explicit`), главнее вёрстки целиком: удалённые
 * пункты не возвращаются из `brand/site.json`. Запись без `explicit` — старая,
 * в ней пустое значение не отличить от «не трогали», поэтому оно вёрстке
 * уступает.
 */
export const applyNavigation = (
  config: SiteConfig,
  navigation?: DeepPartial<SiteNavigation> | null,
): SiteConfig => {
  if (!isPlainObject(navigation)) {
    return config;
  }

  const { headerLinks, footerLinks, footerTitle, footerBody } = navigation;
  const { header, footer } = config.layout;
  const explicit = navigation.explicit === true;
  let items = header.items;

  if (explicit || !isEmpty(headerLinks)) {
    const firstPage = items.find((item) => item.kind === "page");
    const kept = items.filter((item) => item.kind !== "page");
    const at = firstPage
      ? items
          .slice(0, items.indexOf(firstPage))
          .filter((i) => i.kind !== "page").length
      : kept.findIndex((item) => item.kind === "logo") + 1;
    const inserted: HeaderItem[] = (headerLinks ?? []).map((link) => ({
      kind: "page",
      label: link?.label ?? "",
      link: link?.link ?? "",
      style: firstPage?.style ?? "link",
      position: firstPage?.position ?? "left",
    }));

    items = [...kept.slice(0, at), ...inserted, ...kept.slice(at)];
  }

  return {
    ...config,
    layout: {
      ...config.layout,
      header: { ...header, items },
      footer: {
        ...footer,
        links:
          explicit || !isEmpty(footerLinks)
            ? ((footerLinks ?? []) as FooterLink[])
            : footer.links,
        title:
          explicit || !isEmpty(footerTitle)
            ? ((footerTitle ?? "") as string)
            : footer.title,
        body:
          explicit || !isEmpty(footerBody)
            ? ((footerBody ?? "") as string)
            : footer.body,
      },
    },
  };
};

export const buildSiteConfig = (
  template: DeepPartial<SiteConfig>,
  settings?: ISettingPublic | null,
  brandSite?: DeepPartial<SiteConfig> | null,
): SiteConfig => {
  const brand = settings?.brand || {};

  // Бренд лежит в базе плоской записью, а в шаблоне то же самое разнесено по
  // `site`, `logo` и `img` — раскладка живёт здесь, чтобы компоненты видели
  // один и тот же конфиг независимо от того, откуда он пришёл.
  const fromDb: DeepPartial<SiteConfig> = {
    site: {
      name: brand.name,
      lang: brand.lang,
      brandSlug: brand.brandSlug,
    },
    logo: brand.logo,
    favicon: brand.favicon,
    banner: brand.banner,
    img: { modifiers: { roundCorner: brand.imgRoundCorner } },
    layout: settings?.layout || undefined,
    translates: settings?.strings || undefined,
  };

  // `brand/site.json` перекрывает базу, а форма панели (`navigation`) — его.
  return applyNavigation(
    deepMerge(
      deepMerge(deepMerge(SITE_CONFIG_STRUCTURE, template), fromDb),
      brandSite,
    ),
    settings?.navigation,
  );
};

// `<html lang>` и `inLanguage` в schema.org обязаны совпадать — поэтому правило
// одно на оба места.
export const resolvePageLang = (
  metaTag: Pick<PostMetaTag, "lang"> | undefined,
  site: Pick<SiteConfig["site"], "lang">,
) => metaTag?.lang || site.lang;
