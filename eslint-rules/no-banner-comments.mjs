// Баннер-разделитель ничего не объясняет: он размечает файл, который уже
// размечен объявлениями. Ловится он детерминированно, поэтому и вынесен в
// правило, а не в договорённость, которую каждый раз забывают.
const BANNER =
  /^\s*(?:-{2,}|={2,}|─{2,}|—{2,})\s*\S.*?\s*(?:-{2,}|={2,}|─{2,}|—{2,})\s*$/;
const RULER = /^\s*(?:[-=─—_*#]{6,})\s*$/;

export const noBannerComments = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Запрещает комментарии-разделители вида // --- Название --- и линейки из дефисов",
    },
    schema: [],
    messages: {
      banner:
        "Баннер-разделитель. Заголовок секции в файле — это объявление, а не комментарий: удали строку.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type !== "Line" && comment.type !== "Block") {
            continue;
          }

          // Блочный комментарий проверяется построчно: линейка из дефисов
          // внутри /* */ — тот же баннер, просто в другой обёртке.
          const lines =
            comment.type === "Line"
              ? [comment.value]
              : comment.value
                  .split("\n")
                  .map((line) => line.replace(/^\s*\*/, ""));

          if (lines.some((line) => BANNER.test(line) || RULER.test(line))) {
            context.report({ node: comment, messageId: "banner" });
          }
        }
      },
    };
  },
};

export default {
  rules: { "no-banner-comments": noBannerComments },
};
