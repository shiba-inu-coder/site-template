import { seoConfig } from "@@/seo.conf";
import { buildSiteConfig } from "#shared/utils/site-config";

// Меню, тексты, логотип и язык сайта живут в его базе, а `seo.conf.ts` —
// нейтральный дефолт шаблона под ними. Настройки кладёт в состояние
// `app/plugins/ui-theme.ts` с `await` до первого рендера, поэтому меню уже
// стоит в SSR-HTML, а не доезжает гидрацией.
export const useSiteConfig = () => {
  const { settings } = useSettings();

  return computed<SiteConfig>(() => buildSiteConfig(seoConfig, settings.value));
};
