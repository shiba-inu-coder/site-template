import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";

const parseOrigins = (raw: unknown): string[] =>
  String(raw || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Тема сайта приезжает из базы, а не из сборки, поэтому её некому применить
// раньше первого рендера — отсюда `enforce: "pre"` и `await`. Плагин работает
// и на `error.vue`: 404 рисует не `app.vue`, и заданная там тема туда не
// доезжала.
export default defineNuxtPlugin({
  name: "ui-theme",
  enforce: "pre",
  async setup(nuxtApp) {
    const route = useRoute();
    const runtimeConfig = useRuntimeConfig();
    const panelOrigins = parseOrigins(runtimeConfig.public.PANEL_ORIGINS);
    const { setSettings } = useSettings();
    const siteConfig = useSiteConfig();
    const { mode, cssVars, fontsHref, contrast, setTheme } = useUiTheme();

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
        ...(fontsHref.value
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
              { rel: "stylesheet" as const, href: fontsHref.value },
            ]
          : []),
        ...(faviconHref.value
          ? [{ rel: "icon" as const, href: faviconHref.value }]
          : []),
      ],
      style: cssVars.value
        ? [
            {
              id: "ui-theme",
              innerHTML: cssVars.value,
              // Вес 65 вместо умолчания: unhead сортирует теги по весам, где и
              // `<link rel=stylesheet>`, и `<style>` весят 60, а при равном
              // весе выигрывает зарегистрированный раньше. Плагин пишет свой
              // тег до рендера, то есть раньше бандловой таблицы стилей, и
              // `:root` из `tailwind.css` перебил бы тему обратно.
              tagPriority: 65,
            },
          ]
        : [],
    }));

    const { data } = await useAsyncData<ISettingPublic>("ui-theme", () =>
      $fetch<ISettingPublic>("/api/v1/public/settings/settings"),
    );

    if (data.value) {
      setSettings(data.value);
    }

    if (import.meta.server) {
      return;
    }

    const postToPanel = (message: Record<string, unknown>) => {
      const target = window.parent !== window ? window.parent : window.opener;

      if (!target) {
        return;
      }

      for (const origin of panelOrigins) {
        target.postMessage(message, origin);
      }
    };

    // Превью-адрес — единственное место, где страница слушается кого-то
    // снаружи: без `?preview=` в URL сообщения игнорируются, иначе любое окно
    // с разрешённого домена перекрашивало бы боевую страницу.
    const isPreview = () => Boolean(route.query.preview);

    window.addEventListener("message", (event: MessageEvent) => {
      if (!isPreview() || !panelOrigins.includes(event.origin)) {
        return;
      }

      if (event.data?.type !== "ui-theme") {
        return;
      }

      setTheme(event.data.theme);
      postToPanel({ type: "ui-contrast", report: contrast.value });
    });

    nuxtApp.hook("app:mounted", () => {
      if (isPreview()) {
        postToPanel({ type: "ui-ready" });
      }
    });
  },
});
