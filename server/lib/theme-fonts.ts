import { SettingComposition } from "#sg/settings";
import { themeFontAxes, themeFontsHref } from "#shared/utils/ui-theme";
import {
  THEME_FONTS_PREFIX,
  fontFallback,
  isCompleteWoff2,
  rewriteFontFaceUrls,
} from "#shared/utils/theme-fonts";
import type {
  FontFallback,
  FontMetricsRow,
  ThemeFonts,
} from "#shared/utils/theme-fonts";
import fontMetrics from "./font-metrics.json";

// css2 подбирает ответ под User-Agent: без него отдаёт TTF одним файлом на
// начертание, а современному Chrome — woff2, нарезанный по unicode-range.
const GOOGLE_FONTS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
};
const FETCH_TIMEOUT_MS = 3000;
const RETRY_AFTER_FAILURE_MS = 60_000;
const YEAR_SECONDS = 60 * 60 * 24 * 365;

const storage = useStorage("fsApp");

const EMPTY: ThemeFonts = { css: "", href: "" };

// Сбой бросается, а не возвращается пустой строкой: Nitro кладёт в кеш всё,
// кроме `undefined`, и пустой ответ прожил бы там год.
const cachedFontFaceCss = defineCachedFunction(
  async (href: string) => {
    const css = rewriteFontFaceUrls(
      await $fetch<string>(href, {
        responseType: "text",
        timeout: FETCH_TIMEOUT_MS,
        headers: GOOGLE_FONTS_HEADERS,
      }),
    );

    if (!css) {
      throw new Error("Google Fonts answered without usable @font-face");
    }

    return css;
  },
  { name: "theme-fonts", base: "fsApp", maxAge: YEAR_SECONDS },
);

// Недоступный Google не должен стоить таймаута каждому SSR-рендеру: после
// сбоя адрес минуту не спрашивается, а страница тем временем берёт шрифт
// ссылкой на Google, как раньше.
const failedAt = new Map<string, number>();

export const themeFontsCss = async (): Promise<ThemeFonts> => {
  const settings = await SettingComposition.GetPublicSettings();
  const href = themeFontsHref(settings?.uiTheme);

  if (
    !href ||
    Date.now() - (failedAt.get(href) ?? 0) < RETRY_AFTER_FAILURE_MS
  ) {
    return EMPTY;
  }

  try {
    const css = await cachedFontFaceCss(href);

    failedAt.delete(href);

    return { css, href };
  } catch (error) {
    failedAt.set(href, Date.now());
    throw error;
  }
};

const FONT_METRICS = new Map(
  Object.entries(fontMetrics as unknown as Record<string, FontMetricsRow>),
);

// Только таблица в памяти: Google для этого не нужен, и запасной шрифт стоит
// в странице, даже когда сам шрифт темы сервер не достал.
export const themeFontFallback = async (): Promise<FontFallback> => {
  const settings = await SettingComposition.GetPublicSettings();
  const { families, weights } = themeFontAxes(settings?.uiTheme);

  return fontFallback(families, weights, (family) => FONT_METRICS.get(family));
};

// Скачанный файл отдаётся без сверки с темой: HTML в кеше nginx может ещё
// ссылаться на шрифт прежней. Новый качается, только если его называет
// нынешний CSS темы, — иначе маршрут стал бы прокси ко всему
// fonts.gstatic.com с записью на диск ноды.
export const themeFontFile = async (path: string): Promise<Buffer | null> => {
  const key = `theme-fonts:${path}`;
  const stored = await storage.getItemRaw<Buffer>(key);

  if (stored && isCompleteWoff2(stored)) {
    return stored;
  }

  const { css } = await themeFontsCss().catch(() => EMPTY);

  if (!css.includes(`url(${THEME_FONTS_PREFIX}${path})`)) {
    return null;
  }

  const bytes = Buffer.from(
    await $fetch<ArrayBuffer>(`https://fonts.gstatic.com/${path}`, {
      responseType: "arrayBuffer",
      timeout: FETCH_TIMEOUT_MS,
      headers: GOOGLE_FONTS_HEADERS,
    }),
  );

  if (!isCompleteWoff2(bytes)) {
    throw new Error("fonts.gstatic.com answered with a non-woff2 body");
  }

  await storage.setItemRaw(key, bytes);

  return bytes;
};
