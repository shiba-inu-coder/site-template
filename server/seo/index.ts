import { CasinoRepository } from "#sg/adapters/repository/mongodb/casino.repository";
import { BookmakerRepository } from "#sg/adapters/repository/mongodb/bookmaker.repository";
import { PostRepository } from "#sg/adapters/repository/mongodb/post.repository";
import { SeoUsecase } from "./seo.usecase";
import { SeoController } from "./seo.controller";

const casinoRepo = new CasinoRepository();
const bookmakerRepo = new BookmakerRepository();
const postRepo = new PostRepository();

const seoUsecase = new SeoUsecase(casinoRepo, bookmakerRepo, postRepo);
const seoController = new SeoController(seoUsecase);

export class SeoComposition {
  static GetRefLinkRedirect = seoController.getRefLinkRedirect;
  static GetSitemap = seoController.getSitemap;
}
