import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
import type { ThemeFonts } from "#shared/utils/theme-fonts";

// Тема сайта приезжает из базы, а не из сборки, поэтому её некому применить
// раньше первого рендера — отсюда `enforce: "pre"` и `await`. Плагин работает
// и на `error.vue`: 404 рисует не `app.vue`, и заданная там тема туда не
// доезжала.
export default defineNuxtPlugin({
  name: "ui-theme",
  enforce: "pre",
  async setup() {
    const runtimeConfig = useRuntimeConfig();
    const { setSettings } = useSettings();
    const siteConfig = useSiteConfig();
    const { mode, cssVars, fontsHref } = useUiTheme();

    // Фавикон приезжает public id Cloudinary, а не файлом: `public/favicon.ico`
    // в шаблоне нет и панель его больше не коммитит. Пока id пуст, ссылки нет
    // вовсе — браузер сам сходит за `/favicon.ico` и получит 404, что нормально.
    const faviconHref = computed(() => {
      const src = siteConfig.value.favicon.src;

      if (!src) {
        return "";
      }

      const base = getCloudinaryBaseUrl(
        runtimeConfig.public.CLOUDINARY_CLOUD_NAME as string,
      );

      return `${base}f_auto,q_auto/${src}`;
    });

    // @font-face темы сервер кладёт прямо в SSR-HTML, и в payload они не
    // едут: у CJK-семейства это сотни килобайт, которые состояние удвоило бы.
    // На клиенте ref пуст, но тег из SSR остаётся — unhead снимает только
    // теги, которые сам поставил на клиенте.
    const fontFaceCss = ref("");
    // Адрес, чьи @font-face уже в странице. Ссылка на Google нужна, только
    // если адрес темы с ним разошёлся: сервер не достал CSS или превью панели
    // сменило шрифт на лету.
    const inlinedFontsHref = useState("ui-theme-fonts-href", () => "");
    const fontsLinkHref = computed(() =>
      fontsHref.value !== inlinedFontsHref.value ? fontsHref.value : "",
    );

    // Все композаблы вызываются до `await`: после него контекст Nuxt внутри
    // плагина не гарантирован. Голова описана геттером, поэтому ждать данных
    // ей не нужно — она пересоберётся, когда настройки лягут в состояние.
    useHead(() => ({
      htmlAttrs: {
        lang: siteConfig.value.site.lang,
        "data-theme": mode.value,
      },
      meta: [{ name: "color-scheme", content: mode.value }],
      link: [
        ...(fontsLinkHref.value
          ? [
              {
                rel: "preconnect" as const,
                href: "https://fonts.googleapis.com",
              },
              {
                rel: "preconnect" as const,
                href: "https://fonts.gstatic.com",
                crossorigin: "anonymous" as const,
              },
              { rel: "stylesheet" as const, href: fontsLinkHref.value },
            ]
          : []),
        ...(faviconHref.value
          ? [{ rel: "icon" as const, href: faviconHref.value }]
          : []),
      ],
      style: [
        ...(fontFaceCss.value
          ? [{ id: "ui-theme-fonts", innerHTML: fontFaceCss.value }]
          : []),
        ...(cssVars.value
          ? [
              {
                id: "ui-theme",
                innerHTML: cssVars.value,
                // Вес 65 ставит тег после таблиц стилей (у них и у `<style>`
                // по умолчанию 60), но от порядка тегов больше ничего не
                // зависит: дефолты `tailwind.css` лежат в `@layer theme`, а
                // этот тег вне слоёв и перебивает их, где бы ни стоял, — в том
                // числе когда ленивый блок дописывает entry.css в конец
                // `<head>`.
                tagPriority: 65,
              },
            ]
          : []),
      ],
    }));

    const markVolatile = useVolatilePageMark();

    // Параллельно с настройками: сервер читает тему из того же кеша сам.
    const themeFonts = import.meta.server
      ? $fetch<ThemeFonts>("/api/v1/public/settings/theme-fonts").catch(
          () => null,
        )
      : null;

    const { data } = await useAsyncData<ISettingPublic>(
      "ui-theme",
      async () => {
        const response = await $fetch.raw<ISettingPublic>(
          "/api/v1/public/settings/settings",
        );

        markVolatile(response);

        return response._data as ISettingPublic;
      },
    );

    if (data.value) {
      setSettings(data.value);
    }

    const fonts = await themeFonts;

    if (fonts?.css) {
      fontFaceCss.value = fonts.css;
      inlinedFontsHref.value = fonts.href;
    }
  },
});
