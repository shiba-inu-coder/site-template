import { AppNitroCache } from "#sg/lib/app-cache";

export class PostUsecase implements IPostUsecasePublic {
  constructor(private postRepository: IPostRepository) {}

  async getBySlug(slug: string, isPreview = false) {
    // Черновик не должен лечь в тот же кеш, что публичный трафик: документ с
    // isActive: false закешировался бы на год под тем же ключом, и после
    // публикации живая страница отвечала бы 404 из устаревшей записи кеша.
    if (isPreview) {
      return this.postRepository.getBySlug(slug);
    }

    return AppNitroCache().setCachePostItem(slug, () =>
      this.postRepository.getBySlug(slug),
    );
  }
}
