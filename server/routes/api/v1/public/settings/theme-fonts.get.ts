import { AppLogger } from "#sg/lib/app-logger";
import { themeFontFallback, themeFontsCss } from "#sg/lib/theme-fonts";
import type {
  FontFallback,
  ThemeFontsResponse,
} from "#shared/utils/theme-fonts";

const NO_FALLBACK: FontFallback = { css: "", stacks: {} };

// Запрос ничего не принимает от клиента — семейства берутся из темы самого
// сайта, поэтому чужой шрифт через этот адрес не запросить. Сбой — пустой
// CSS, а не ошибка: страница тогда подключит шрифт ссылкой на Google.
export default defineEventHandler(async (): Promise<ThemeFontsResponse> => {
  const fallback = await themeFontFallback().catch(() => NO_FALLBACK);

  try {
    return { ...(await themeFontsCss()), fallback };
  } catch (error: any) {
    AppLogger("handler.settings.themeFonts").error(
      "Failed to self-host theme fonts",
      { error: error.message },
    );

    return { css: "", href: "", fallback };
  }
});
