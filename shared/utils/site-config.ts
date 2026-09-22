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

// Форма, которой обязан обладать конфиг, чем бы ни оказался `seo.conf.ts`:
// до этапа 5d панель переписывает этот файл целиком по своему фиксированному
// шаблону, и ключей, заведённых здесь, в переписанном файле не будет.
const SITE_CONFIG_STRUCTURE: SiteConfig = {
  site: { name: "", lang: "en", theme: "light", brandSlug: "" },
  logo: { src: "", alt: "", width: 0, height: 0 },
  favicon: { src: "" },
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

export const buildSiteConfig = (
  template: DeepPartial<SiteConfig>,
  settings?: ISettingPublic | null,
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
    img: { modifiers: { roundCorner: brand.imgRoundCorner } },
    layout: settings?.layout || undefined,
    translates: settings?.strings || undefined,
  };

  return deepMerge(deepMerge(SITE_CONFIG_STRUCTURE, template), fromDb);
};
