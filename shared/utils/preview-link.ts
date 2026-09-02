import type { SettingPreviewGrant } from "#shared/types";

// Кука, в которую оседает токен после первого захода по ссылке — дальше не
// нужно вставлять ?preview= в каждый адрес.
export const PREVIEW_COOKIE_NAME = "staging_preview";

/**
 * Живой ли пропуск на стейджинг-сайт.
 *
 * Зеркало `shared/utils/preview-link.js` из AppsPro: панель по этой же функции
 * решает, что выписала. Разойдутся — получится худший из возможных багов:
 * пропуск, который в панели числится мёртвым, а сайт его продолжает пускать.
 * Правка здесь означает правку там.
 *
 * Страницу пропуск не различает: он на весь сайт.
 */
export const isPreviewGrantLive = (
  grant: SettingPreviewGrant | null | undefined,
  { now = Date.now() }: { now?: number } = {},
): boolean => {
  if (!grant?.id || !grant.expiresAt) {
    return false;
  }

  return new Date(grant.expiresAt).getTime() > now;
};

export const findPreviewGrant = (
  grants: SettingPreviewGrant[] | null | undefined,
  { token, now = Date.now() }: { token?: string; now?: number },
): SettingPreviewGrant | null => {
  if (!token) {
    return null;
  }

  return (
    (grants || []).find(
      (grant) => grant.id === token && isPreviewGrantLive(grant, { now }),
    ) || null
  );
};
