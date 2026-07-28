import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";

export class SeoController {
  constructor(private seoUsecase: ISeoUsecasePublic) {}

  getRefLink = defineEventHandler({
    handler: async (e) => {
      const log = AppLogger("handler.seo.getRefLink");
      const { slug, type } = getRouterParams(e) as {
        slug: string;
        type: RefLinkType;
      };

      try {
        const res = await this.seoUsecase.getRefLink({
          type,
          slug,
        });

        log.info("Fetched ref link successfully", { slug, type });
        return res;
      } catch (error: any) {
        log.error("Failed to fetch ref link", {
          error: error.message,
          stack: error.stack,
          slug,
          type,
        });
        throw AppError.ClientError(error);
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
