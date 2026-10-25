import { postNeedsContent } from "./post-content.ts";
import { splitShortcodeMarkers } from "./shortcode-markers.ts";
import { resolveTextImageSide } from "./text-image.ts";

/**
 * Эвристика первого экрана. Картинка лида — первый экран, если над ней не
 * больше стольких символов текста. Мерка — телефон Lighthouse (412×823):
 * шапка, крошки, дата и H1 съедают около 300px, строка текста — около 26px
 * и 45 символов; при 300 символах над ней картинка 16:9 ещё целиком в экране.
 */
export const FIRST_SCREEN_TEXT = 300;

// Блоки, что могут стоять над картинкой и не сталкивают её с первого экрана,
// — в символах текста той же высоты. Любой другой блок выше картинки
// (оглавление, таблица, карточки, FAQ) — и она уже не первый экран.
const LIGHT_BLOCKS: Record<string, number> = {
  "button-ref": 60,
  "biography-writer": 200,
};

const BUTTON_TEXT = 60;

export interface PriorityImageInput {
  // Уже разрешённая картинка баннера (`resolveHeroImage`): общая картинка
  // сайта тоже стоит над текстом и забирает приоритет у лида.
  banner?: { img?: { path?: string } | null } | null;
  sections: { body?: string }[];
  content?: string;
  textImages: {
    data: {
      uniqId: string;
      text?: string;
      buttonText?: string;
      imgSide?: string;
      img: { path: string } | null;
    };
  }[];
}

export interface PriorityImage {
  uniqId: string;
  place: "lead" | "hero";
}

export const HERO_UNIQ_ID = "hero";

const textLength = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;

/**
 * Одна приоритетная картинка на страницу или ни одной: картинка баннера,
 * если она есть, иначе первая `text-image` лида с картинкой, если та на первом экране;
 * у старой статьи без секций лид — весь `content`. Нет такой — LCP у
 * страницы текст, и приоритет с preload не нужны никому.
 */
export const resolvePriorityImage = ({
  banner,
  sections,
  content,
  textImages,
}: PriorityImageInput): PriorityImage | null => {
  // Баннер стоит над всем текстом страницы: если у него есть картинка, первый
  // экран её, а картинка лида приоритета не получает.
  if (banner?.img?.path) {
    return { uniqId: HERO_UNIQ_ID, place: "hero" };
  }

  const lead = postNeedsContent({ sections })
    ? content || ""
    : sections[0].body || "";

  let above = 0;

  for (const part of splitShortcodeMarkers(lead)) {
    if (typeof part === "string") {
      above += textLength(part);
    } else if (part.name === "text-image") {
      const entry = textImages.find(
        (item) => item.data.uniqId === part.uniqId,
      )?.data;

      // Осиротевший маркер ничего не рисует и места не занимает.
      if (!entry) {
        continue;
      }

      const own =
        textLength(entry.text || "") + (entry.buttonText ? BUTTON_TEXT : 0);

      if (entry.img?.path) {
        // Снизу картинка встаёт под собственный текст блока; сбоку она на
        // телефоне всё равно над ним.
        const before =
          resolveTextImageSide(entry.imgSide) === "bottom" ? own : 0;

        return above + before <= FIRST_SCREEN_TEXT
          ? { uniqId: part.uniqId, place: "lead" }
          : null;
      }

      above += own;
    } else if (Object.hasOwn(LIGHT_BLOCKS, part.name)) {
      above += LIGHT_BLOCKS[part.name];
    } else {
      return null;
    }

    if (above > FIRST_SCREEN_TEXT) {
      return null;
    }
  }

  return null;
};
