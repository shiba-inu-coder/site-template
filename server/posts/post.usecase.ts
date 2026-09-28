import { AppNitroCache } from "#sg/lib/app-cache";
import { withoutUnusedContent } from "#shared/utils/post-content";

export class PostUsecase implements IPostUsecasePublic {
  constructor(private postRepository: IPostRepository) {}

  async getBySlug(slug: string, isPreview = false) {
    const read = async () =>
      withoutUnusedContent(await this.postRepository.getBySlug(slug));

    // Черновик не должен лечь в тот же кеш, что публичный трафик: документ с
    // isActive: false закешировался бы на год под тем же ключом, и после
    // публикации живая страница отвечала бы 404 из устаревшей записи кеша.
    if (isPreview) {
      return { data: await read(), volatile: false };
    }

    const { value, volatile } = await AppNitroCache().setCachePostItem(
      slug,
      read,
    );

    return { data: value, volatile };
  }
}
