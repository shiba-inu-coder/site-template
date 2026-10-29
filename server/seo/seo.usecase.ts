import { SettingComposition } from "#sg/settings";
import { REF_CLICKS_TIMEZONE } from "#shared/constants/ref-clicks";
import { refClickDay, shouldCountRefClick } from "#shared/utils/ref-clicks";

export class SeoUsecase implements ISeoUsecasePublic {
  constructor(
    private casinoRepository: ICasinoRepository,
    private boomakerRepository: IBookmakerRepository,

    private postRepository: IPostRepository,
    private refClickRepository: IRefClickRepository,
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

  // Домен — из конфига сайта, как `site.domain` в панели; хост запроса дал бы
  // мусорные «домены» со стейджинга и обращений по IP.
  async countRefClick(method: string) {
    const settings = await SettingComposition.GetPublicSettings();
    const { DOMAIN_NAME } = useRuntimeConfig().public;
    const domain = String(DOMAIN_NAME ?? "");

    if (
      !shouldCountRefClick({
        method,
        enabled: settings.refClicksEnabled,
        domain,
      })
    ) {
      return;
    }

    await this.refClickRepository.increment(
      domain,
      refClickDay(new Date(), REF_CLICKS_TIMEZONE),
    );
  }

  async getSitemap() {
    return this.postRepository.getSitemap();
  }
}
