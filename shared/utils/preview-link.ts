import type { SettingPreviewGrant } from "#shared/types";

/**
 * Живая ли именная ссылка на черновик.
 *
 * Зеркало `shared/utils/preview-link.js` из AppsPro: панель по этой же функции
 * решает, показывать ли ссылку в списке выданных. Разойдутся — получится
 * худший из возможных багов: ссылка, которая в панели числится погашенной, а
 * на сайте продолжает открывать черновик. Правка здесь означает правку там.
 *
 * Привязка к странице обязательна: ссылка, выданная на один черновик, не
 * должна открывать все остальные неопубликованные страницы сайта.
 */
export const isPreviewGrantLive = (
  grant: SettingPreviewGrant | null | undefined,
  { slug, now = Date.now() }: { slug?: string; now?: number } = {},
): boolean => {
  if (!grant?.id || !grant.expiresAt) {
    return false;
  }

  if (slug !== undefined && grant.slug !== slug) {
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
