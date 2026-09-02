import type { H3Event } from "h3";

import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { SettingModel } from "#sg/adapters/repository/mongodb/models/setting.model";
import { isPreviewGrantLive, PREVIEW_COOKIE_NAME } from "#shared/utils/preview-link";
import { PostSlugRegex, isDev } from "#shared/constants/base";

/**
 * Ключ ровно один — запись в настройках сайта со сроком и подписью, кому она
 * выдана: и «поделиться», и кнопки предпросмотра в панели выписывают её.
 * Проверяется по базе, а не по конфигу, ровно ради «погасить»: конфиг
 * контейнер читает один раз при старте, и отозванная ссылка работала бы до
 * перезапуска сервиса.
 *
 * Закрыто наглухо: без гранта параметр в адресе не значит ничего.
 */
type PreviewVerdict = {
  allowed: boolean;
  reason:
    | "ok"
    | "no-token-param"
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
  previewQuery: unknown,
  slug: string,
): Promise<PreviewVerdict> => {
  // Токен «весь стейджинг» ставит себе куку при первом заходе по ссылке —
  // дальше по сайту можно ходить без ?preview= в каждом адресе. Query всегда
  // в приоритете: свежая ссылка не должна упираться в чужую старую куку.
  const queryToken =
    typeof previewQuery === "string" && previewQuery ? previewQuery : "";
  const preview = queryToken || getCookie(e, PREVIEW_COOKIE_NAME) || "";

  if (!preview) {
    return { allowed: false, reason: "no-token-param" };
  }

  // Настройки читаются мимо кеша: погашенная ссылка обязана умереть сразу, а
  // не через час. Запрос лишний только на черновиках — их открывают редко.
  const settings = await SettingModel.findOne({}, "previewGrants").lean();
  const grant = (settings?.previewGrants || []).find(
    (item) => item.id === preview,
  );

  if (!grant) {
    return { allowed: false, reason: "grant-not-found" };
  }

  if (grant.scope !== "site" && grant.slug !== slug) {
    return { allowed: false, reason: "grant-slug-mismatch" };
  }

  if (!isPreviewGrantLive(grant, { slug })) {
    return { allowed: false, reason: "grant-expired" };
  }

  // Кука ставится только когда токен реально пришёл в query — иначе она сама
  // себя продлевала бы на каждый запрос без повторной проверки источника.
  if (grant.scope === "site" && queryToken) {
    setCookie(e, PREVIEW_COOKIE_NAME, grant.id, {
      httpOnly: true,
      secure: !isDev,
      sameSite: "lax",
      path: "/",
      expires: new Date(grant.expiresAt),
    });
  }

  return { allowed: true, reason: "ok" };
};

export class PostController {
  constructor(private postUsecase: IPostUsecasePublic) {}

  getBySlug = defineEventHandler(async (e) => {
    const log = AppLogger("handler.post.slug");
    const { slug: rawSlug, preview } = getQuery(e);

    // `?slug=a&slug=b` возвращает массив из getQuery — без проверки формата
    // он ушёл бы в findOne как есть, и Mongoose трактует массив как $in.
    if (typeof rawSlug !== "string" || !PostSlugRegex.test(rawSlug)) {
      throw AppError.NotFound();
    }

    const slug = rawSlug;
    const previewVerdict = await isPreviewAllowed(e, preview, slug);
    const isPreview = previewVerdict.allowed;
    try {
      const res = await this.postUsecase.getBySlug(slug, isPreview);

      // Удалённая страница не открывается никогда: предпросмотр — это «ещё не
      // опубликовано», а не «уже выброшено». Неопубликованную пускаем по
      // токену — админки на сайтах больше нет, и посмотреть черновик иначе
      // негде. Разметка при этом остаётся noindex: useMetaHead ставит его по
      // isActive, а он у черновика как был false, так и остался.
      if (res.isDeleted || (!res.isActive && !isPreview)) {
        log.error("post is archived or not active", {
          slug,
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
      log.info("post found successfully", { slug });
      return res;
    } catch (error: any) {
      log.error("post failed find by slug", {
        error: error.message,
        slug,
      });
      throw AppError.ClientError(error);
    }
  });
}
