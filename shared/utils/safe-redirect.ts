const PROTOCOL_RELATIVE = /^\/\//;
const RELATIVE_PATH = /^\/(?!\/)/;
const HTTP_URL = /^https?:\/\//i;

/**
 * `/go/**` ведёт на партнёрский домен из БД — внешний хост там легитимен,
 * запрещать нужно только опасные схемы (`javascript:`, `data:`) и
 * протокол-относительные `//host`, которые браузер резолвит на текущий
 * протокол, но на чужой хост.
 */
export const isSafeExternalRedirect = (url?: string) => {
  if (!url || PROTOCOL_RELATIVE.test(url)) return false;
  return HTTP_URL.test(url) || RELATIVE_PATH.test(url);
};

/** Редиректы из настроек ведут внутри сайта — внешний хост там подделка. */
export const isSafeRelativeRedirect = (url?: string) =>
  !!url && RELATIVE_PATH.test(url);
