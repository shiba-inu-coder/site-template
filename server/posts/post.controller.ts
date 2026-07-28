import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";

export class PostController {
  constructor(private postUsecase: IPostUsecasePublic) {}

  getBySlug = defineEventHandler(async (e) => {
    const log = AppLogger("handler.post.slug");
    const { slug } = getQuery(e);
    try {
      const res = await this.postUsecase.getBySlug(slug as string);
      if (res.isDeleted || !res.isActive) {
        log.error("post is archived or not active");
        throw AppError.NotFound();
      }
      log.info("post found successfully", { slug: slug as string });
      return res;
    } catch (error: any) {
      log.error("post failed find by slug", {
        error: error.message,
        slug: slug as string,
      });
      throw AppError.ClientError(error);
    }
  });
}
