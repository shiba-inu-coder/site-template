export class SeoUsecase implements ISeoUsecasePublic {
  constructor(
    private casinoRepository: ICasinoRepository,
    private boomakerRepository: IBookmakerRepository,

    private postRepository: IPostRepository,
  ) {}

  // Слаг один на казино и букмекеров: сначала ищем казино (их подавляющее
  // большинство), потом букмекера. Ничего не нашли — уводим на главную,
  // а не в 404: пользователь уже кликнул по кнопке.
  async getRefLink(slug: string) {
    const casino = await this.casinoRepository.getBySlug(slug);
    if (casino?.refLink) {
      return casino.refLink;
    }

    const bookmaker = await this.boomakerRepository.getBySlug(slug);
    return bookmaker?.refLink ?? "/";
  }

  async getSitemap() {
    return this.postRepository.getSitemap();
  }
}
