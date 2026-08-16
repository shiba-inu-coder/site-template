import type { H3Event } from "h3";

import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";
import { findPreviewGrant } from "#shared/utils/preview-link";

/**
 * Два разных ключа, и это намеренно.
 *
 * PREVIEW_TOKEN — один на сайт, лежит в записи Vault рядом с
 * CACHE_PURGE_SECRET. Это «глаз» оператора в панели: посмотреть свой черновик,
 * ничего никуда не записывая.
 *
 * Именная ссылка — запись в настройках сайта со сроком и подписью, кому она
 * выдана. Проверяется по базе, а не по конфигу, ровно ради «погасить»: конфиг
 * контейнер читает один раз при старте, и отозванная ссылка работала бы до
 * перезапуска сервиса.
 *
 * Закрыто наглухо: без ключей параметр в адресе не значит ничего.
 */
const isPreviewAllowed = async (
  e: H3Event,
  preview: unknown,
  slug: string,
): Promise<boolean> => {
  if (typeof preview !== "string" || !preview) {
    return false;
  }

  const token = useRuntimeConfig(e).PREVIEW_TOKEN;

  if (token && preview === token) {
    return true;
  }

  // Настройки читаются мимо кеша: погашенная ссылка обязана умереть сразу, а
  // не через час. Запрос лишний только на черновиках — их открывают редко.
  const settings = await SettingModel.findOne({}, "previewGrants").lean();

  return Boolean(
    findPreviewGrant(settings?.previewGrants, { token: preview, slug }),
  );
};

export class PostController {
  constructor(private postUsecase: IPostUsecasePublic) {}

  getBySlug = defineEventHandler(async (e) => {
    const log = AppLogger("handler.post.slug");
    const { slug, preview } = getQuery(e);
    const isPreview = await isPreviewAllowed(e, preview, slug as string);
    try {
      const res = await this.postUsecase.getBySlug(slug as string);

      // Удалённая страница не открывается никогда: предпросмотр — это «ещё не
      // опубликовано», а не «уже выброшено». Неопубликованную пускаем по
      // токену — админки на сайтах больше нет, и посмотреть черновик иначе
      // негде. Разметка при этом остаётся noindex: useMetaHead ставит его по
      // isActive, а он у черновика как был false, так и остался.
      if (res.isDeleted || (!res.isActive && !isPreview)) {
        log.error("post is archived or not active");
        throw AppError.NotFound();
      }

      if (isPreview) {
        // Черновик не должен осесть ни в одном кеше по дороге: ни в nginx на
        // ноде, ни у того, кому переслали ссылку.
        setHeader(e, "Cache-Control", "no-store");
        setHeader(e, "X-Robots-Tag", "noindex, nofollow");
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
