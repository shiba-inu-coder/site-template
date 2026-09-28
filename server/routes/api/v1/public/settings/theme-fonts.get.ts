import { AppLogger } from "#sg/lib/app-logger";
import { themeFontsCss } from "#sg/lib/theme-fonts";
import type { ThemeFonts } from "#shared/utils/theme-fonts";

// Запрос ничего не принимает от клиента — семейства берутся из темы самого
// сайта, поэтому чужой шрифт через этот адрес не запросить. Сбой — пустой
// CSS, а не ошибка: страница тогда подключит шрифт ссылкой на Google.
export default defineEventHandler(async (): Promise<ThemeFonts> => {
  try {
    return await themeFontsCss();
  } catch (error: any) {
    AppLogger("handler.settings.themeFonts").error(
      "Failed to self-host theme fonts",
      { error: error.message },
    );

    return { css: "", href: "" };
  }
});
