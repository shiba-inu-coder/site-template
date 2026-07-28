import { AppNitroCache } from "#sg/lib/app-cache";

export class PostUsecase implements IPostUsecasePublic {
  constructor(private postRepository: IPostRepository) {}

  async getBySlug(slug: string) {
    return AppNitroCache().setCachePostItem(slug, () =>
      this.postRepository.getBySlug(slug),
    );
  }
}
