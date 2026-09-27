import type { H3Event } from "h3";
import { APP_CACHE_STATE_HEADER } from "#shared/constants/base";
import {
  createCacheGenerations,
  purgeCacheTarget,
  readThroughGenerations,
} from "./cache-generations";
import type { CachePurgeTarget, CachedValue } from "./cache-generations";

const cacheStorage = useStorage("fsApp");

// Одно состояние на процесс: `AppNitroCache()` зовут на каждый запрос, и у
// каждого вызова свои кеш-функции, — общими должны быть поколения.
const generations = createCacheGenerations();

const CACHE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 365,
  staleMaxAge: 60 * 60 * 24 * 366,
  base: "fsApp",
  // Ключ с поколением приходит аргументом, собранный до вызова: прочитай
  // getKey поколение сам, он увидел бы уже то, что сменилось за `await`.
  getKey: (cacheKey: string) => cacheKey,
};

export const AppNitroCache = () => {
  const cachedPost = defineCachedFunction(
    async (_cacheKey: string, fn: () => Promise<unknown>) => await fn(),
    { ...CACHE_OPTIONS, name: "posts" },
  );
  const cachedSetting = defineCachedFunction(
    async (_cacheKey: string, fn: () => Promise<unknown>) => await fn(),
    { ...CACHE_OPTIONS, name: "settings" },
  );

  const setCachePostItem = <T>(
    slug: string,
    fn: () => Promise<T>,
  ): Promise<CachedValue<T>> =>
    readThroughGenerations({
      generations,
      group: "posts",
      item: slug,
      read: (cacheKey) => cachedPost(cacheKey, fn) as Promise<T>,
    });

  const setCacheSettingItem = <T>(
    fn: () => Promise<T>,
  ): Promise<CachedValue<T>> =>
    readThroughGenerations({
      generations,
      group: "settings",
      item: "settings",
      read: (cacheKey) => cachedSetting(cacheKey, fn) as Promise<T>,
    });

  const purge = (target: CachePurgeTarget) =>
    purgeCacheTarget({ generations, storage: cacheStorage, target });

  return { purge, setCachePostItem, setCacheSettingItem };
};

// Прочитанное между сбросами не должно осесть ни в одном кеше по дороге:
// nginx держит публичный API 7 дней, а заголовки ответа для него главнее.
export const markCacheVolatile = (event: H3Event) => {
  setResponseHeader(event, APP_CACHE_STATE_HEADER, "volatile");
  setResponseHeader(event, "Cache-Control", "no-store");
  setResponseHeader(event, "X-Accel-Expires", "0");
};
