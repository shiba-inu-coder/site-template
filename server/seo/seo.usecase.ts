export class SeoUsecase implements ISeoUsecasePublic {
  constructor(
    private casinoRepository: ICasinoRepository,
    private boomakerRepository: IBookmakerRepository,

    private postRepository: IPostRepository,
  ) {}

  async getRefLink({ type, slug }: { type: RefLinkType; slug: string }) {
    const repo =
      type === "casino" ? this.casinoRepository : this.boomakerRepository;

    const entity = await repo.getBySlug(slug);
    return entity?.refLink ?? "/";
  }

  async getSitemap() {
    return this.postRepository.getSitemap();
  }
}
