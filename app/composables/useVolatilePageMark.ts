import { APP_CACHE_STATE_HEADER } from "#shared/constants/base";

type ResponseWithHeaders = { headers: Headers };

// Признак `volatile` с ответа API переносится на саму страницу: nginx держит
// HTML 30 дней, а прочитанное между сбросами кеша оседать в нём не должно.
// Звать до `await` — заголовки ответа привязываются к запросу при вызове, а
// после `await` контекст Nuxt не гарантирован. Сам заголовок внутреннего
// ответа на страницу не переносится: только запрет кеширования.
export const useVolatilePageMark = (): ((
  response: ResponseWithHeaders,
) => void) => {
  if (!import.meta.server) {
    return () => {};
  }

  const cacheControl = useResponseHeader("Cache-Control");
  const accelExpires = useResponseHeader("X-Accel-Expires");

  return (response) => {
    if (response.headers.get(APP_CACHE_STATE_HEADER) === "volatile") {
      cacheControl.value = "no-store";
      accelExpires.value = "0";
    }
  };
};
