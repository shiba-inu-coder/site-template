import type { H3Event } from "h3";

import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";
import { isPreviewGrantLive } from "#shared/utils/preview-link";

/**
 * Два разных ключа, и это намеренно.
 *
 * Именная ссылка — запись в настройках сайта со сроком и подписью, кому она
 * выдана. Это основной путь: и «поделиться», и кнопка предпросмотра в панели
 * выписывают её. Проверяется по базе, а не по конфигу, ровно ради «погасить»:
 * конфиг контейнер читает один раз при старте, и отозванная ссылка работала бы
 * до перезапуска сервиса.
 *
 * PREVIEW_TOKEN — один на сайт, лежит в записи Vault рядом с
 * CACHE_PURGE_SECRET. Остался аварийным ключом на случай, когда до настроек не
 * достучаться; панель его больше не раздаёт.
 *
 * Закрыто наглухо: без ключей параметр в адресе не значит ничего.
 */
type PreviewVerdict = {
  allowed: boolean;
  reason:
    | "ok"
    | "no-token-param"
    | "config-token-mismatch"
    | "grant-not-found"
    | "grant-expired"
    | "grant-slug-mismatch";
};

/**
 * Наружу причина не уходит — только в лог. Перебор токенов не должен получать
 * подсказку, чем именно этот не подошёл.
 */
const isPreviewAllowed = async (
  e: H3Event,
  preview: unknown,
  slug: string,
): Promise<PreviewVerdict> => {
  if (typeof preview !== "string" || !preview) {
    return { allowed: false, reason: "no-token-param" };
  }

  // Аварийный ключ проверяется первым: он в памяти, а грант — это запрос к
  // базе, и на нём же экономить нечего.
  const token = useRuntimeConfig(e).PREVIEW_TOKEN;

  if (token && preview === token) {
    return { allowed: true, reason: "ok" };
  }

  // Настройки читаются мимо кеша: погашенная ссылка обязана умереть сразу, а
  // не через час. Запрос лишний только на черновиках — их открывают редко.
  const settings = await SettingModel.findOne({}, "previewGrants").lean();
  const grant = (settings?.previewGrants || []).find(
    (item) => item.id === preview,
  );

  if (!grant) {
    return {
      allowed: false,
      reason: token ? "config-token-mismatch" : "grant-not-found",
    };
  }

  if (grant.slug !== slug) {
    return { allowed: false, reason: "grant-slug-mismatch" };
  }

  return isPreviewGrantLive(grant, { slug })
    ? { allowed: true, reason: "ok" }
    : { allowed: false, reason: "grant-expired" };
};

export class PostController {
  constructor(private postUsecase: IPostUsecasePublic) {}

  getBySlug = defineEventHandler(async (e) => {
    const log = AppLogger("handler.post.slug");
    const { slug, preview } = getQuery(e);
    const previewVerdict = await isPreviewAllowed(e, preview, slug as string);
    const isPreview = previewVerdict.allowed;
    try {
      const res = await this.postUsecase.getBySlug(slug as string, isPreview);

      // Удалённая страница не открывается никогда: предпросмотр — это «ещё не
      // опубликовано», а не «уже выброшено». Неопубликованную пускаем по
      // токену — админки на сайтах больше нет, и посмотреть черновик иначе
      // негде. Разметка при этом остаётся noindex: useMetaHead ставит его по
      // isActive, а он у черновика как был false, так и остался.
      if (res.isDeleted || (!res.isActive && !isPreview)) {
        log.error("post is archived or not active", {
          slug: slug as string,
          isActive: res.isActive,
          isDeleted: res.isDeleted,
          previewReason: previewVerdict.reason,
        });
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
