import type { SettingPreviewGrant } from "#shared/types";

// Кука, в которую оседает токен «смотреть весь стейджинг» после первого
// захода по ссылке — дальше не нужно вставлять ?preview= в каждый адрес.
export const PREVIEW_COOKIE_NAME = "staging_preview";

/**
 * Живая ли именная ссылка на черновик.
 *
 * Зеркало `shared/utils/preview-link.js` из AppsPro: панель по этой же функции
 * решает, показывать ли ссылку в списке выданных. Разойдутся — получится
 * худший из возможных багов: ссылка, которая в панели числится погашенной, а
 * на сайте продолжает открывать черновик. Правка здесь означает правку там.
 *
 * Привязка к странице обязательна для именных — ссылка, выданная на один
 * черновик, не должна открывать все остальные неопубликованные страницы
 * сайта. Исключение — `scope: "site"`: такой грант живой на любой странице.
 */
export const isPreviewGrantLive = (
  grant: SettingPreviewGrant | null | undefined,
  { slug, now = Date.now() }: { slug?: string; now?: number } = {},
): boolean => {
  if (!grant?.id || !grant.expiresAt) {
    return false;
  }

  if (grant.scope !== "site" && slug !== undefined && grant.slug !== slug) {
    return false;
  }

  return new Date(grant.expiresAt).getTime() > now;
};

export const findPreviewGrant = (
  grants: SettingPreviewGrant[] | null | undefined,
  { token, slug, now = Date.now() }: { token?: string; slug?: string; now?: number },
): SettingPreviewGrant | null => {
  if (!token) {
    return null;
  }

  return (
    (grants || []).find(
      (grant) => grant.id === token && isPreviewGrantLive(grant, { slug, now }),
    ) || null
  );
};
