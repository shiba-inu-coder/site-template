import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";

export class SeoController {
  constructor(private seoUsecase: ISeoUsecasePublic) {}

  getRefLinkRedirect = defineEventHandler({
    handler: async (e) => {
      const log = AppLogger("handler.seo.getRefLinkRedirect");
      // Роут catch-all, поэтому в slug приходит хвост пути целиком:
      // "mafia-casino/" → "mafia-casino".
      const { slug: rawSlug } = getRouterParams(e) as { slug: string };
      const slug = rawSlug.replace(/^\/+|\/+$/g, "");

      setHeader(e, "X-Robots-Tag", "noindex, nofollow");
      setHeader(e, "Cache-Control", "no-store");

      try {
        const refLink = await this.seoUsecase.getRefLink(slug);

        log.info("Resolved ref link successfully", { slug });
        // 302, не 301: партнёрская ссылка меняется, а 301 браузер
        // закэшировал бы бессрочно и увёл бы юзеров на мёртвый URL.
        return sendRedirect(e, refLink, 302);
      } catch (error: any) {
        log.error("Failed to resolve ref link", {
          error: error.message,
          stack: error.stack,
          slug,
        });
        // Пользователь уже кликнул по кнопке — 500 ему показывать незачем,
        // уводим на главную.
        return sendRedirect(e, "/", 302);
      }
    },
  });

  getSitemap = defineEventHandler({
    handler: async () => {
      const log = AppLogger("handler.seo.sitemap");
      try {
        const res = await this.seoUsecase.getSitemap();
        log.info("Sitemap retrieved successfully");
        return res;
      } catch (error: any) {
        log.error("Failed to retrieve sitemap", { error: error.message });
        throw AppError.ClientError(error);
      }
    },
  });
}
