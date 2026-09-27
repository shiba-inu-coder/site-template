// Поколения кеша приложения. Nitro кладёт результат в хранилище уже после
// `await` резолвера, поэтому чтение базы, начатое до сброса, дописывает старое
// значение в файл, который сброс только что удалил, — и оно живёт год.
// Сброс здесь сначала поднимает поколение, и такая поздняя запись ложится
// под ключ, который больше никто не читает.
//
// Без импортов Nitro и с подставляемым хранилищем: иначе гонки не проверить
// тестом. Гарантия — в пределах одного процесса.
import { randomBytes } from "node:crypto";

export type CacheGroup = "settings" | "posts";

export type CacheSnapshot = { boot: string; all: number; item: number };

export type CacheGenerations = {
  snapshot: (group: CacheGroup, item: string) => CacheSnapshot;
  isCurrent: (
    group: CacheGroup,
    item: string,
    snapshot: CacheSnapshot,
  ) => boolean;
  cacheKey: (item: string, snapshot: CacheSnapshot) => string;
  bump: (group: CacheGroup, item: string) => void;
  bumpAll: () => void;
};

export type CacheStorage = {
  getKeys: (base: string) => Promise<string[]>;
  removeItem: (key: string) => Promise<unknown>;
};

export type CachePurgeTarget =
  | { group: "settings" }
  | { group: "posts"; slug: string }
  | { all: true };

// Так Nitro раскладывает кеш-функцию `name` с `base: "fsApp"`: группа
// `nitro/functions`, `/` в ключе становится `:` — слаг `a/b` лежит как `a:b`.
const STORAGE_BASE = "nitro:functions";

export const cacheStorageKey = (group: CacheGroup, cacheKey: string) =>
  `${STORAGE_BASE}:${group}:${cacheKey.replaceAll("/", ":")}.json`;

// Метка запуска входит в ключ: счётчики живут в памяти и после рестарта
// начинаются с нуля, а хранилище на диске остаётся тем же.
export const createCacheGenerations = (
  boot = randomBytes(4).toString("hex"),
): CacheGenerations => {
  let all = 0;
  const items = new Map<string, number>();
  const itemGeneration = (group: CacheGroup, item: string) =>
    items.get(`${group}:${item}`) ?? 0;

  return {
    snapshot: (group, item) => ({
      boot,
      all,
      item: itemGeneration(group, item),
    }),
    isCurrent: (group, item, snapshot) =>
      snapshot.boot === boot &&
      snapshot.all === all &&
      snapshot.item === itemGeneration(group, item),
    cacheKey: (item, snapshot) =>
      `${item}~${snapshot.boot}~${snapshot.all}~${snapshot.item}`,
    bump: (group, item) => {
      items.set(`${group}:${item}`, itemGeneration(group, item) + 1);
    },
    bumpAll: () => {
      all += 1;
    },
  };
};

export type CachedValue<T> = { value: T; volatile: boolean };

const MAX_ATTEMPTS = 3;

/**
 * Поколение захватывается до вызова и уходит в ключ аргументом, а после
 * вызова сверяется с текущим: сменилось — чтение повторяется. Если сбросы
 * шли на всех попытках, запрос получает последнее прочитанное с `volatile`:
 * оформление страницы важнее свежести, а 503 плагин темы превратил бы в
 * страницу без оформления вовсе. В ключ текущего поколения такое значение не
 * попадает само — оно легло под ключ своей попытки.
 */
export const readThroughGenerations = async <T>({
  generations,
  group,
  item,
  read,
}: {
  generations: CacheGenerations;
  group: CacheGroup;
  item: string;
  read: (cacheKey: string) => Promise<T>;
}): Promise<CachedValue<T>> => {
  let last: { value: T } | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const snapshot = generations.snapshot(group, item);
    let value: T;

    try {
      value = await read(generations.cacheKey(item, snapshot));
    } catch (error) {
      if (last) {
        return { value: last.value, volatile: true };
      }

      throw error;
    }

    if (generations.isCurrent(group, item, snapshot)) {
      return { value, volatile: false };
    }

    last = { value };
  }

  return { value: (last as { value: T }).value, volatile: true };
};

const purgePrefix = (target: CachePurgeTarget) => {
  if ("all" in target) {
    return `${STORAGE_BASE}:`;
  }

  return target.group === "settings"
    ? `${STORAGE_BASE}:settings:`
    : `${STORAGE_BASE}:posts:${target.slug.replaceAll("/", ":")}~`;
};

// Сначала поколение, потом хранилище: чтение, успевшее записать между ними,
// уже лежит под старым ключом. `all` поднимает общее поколение — оно меняет и
// ключи, которых на момент сброса ещё не было.
export const purgeCacheTarget = async ({
  generations,
  storage,
  target,
}: {
  generations: CacheGenerations;
  storage: CacheStorage;
  target: CachePurgeTarget;
}): Promise<string[]> => {
  if ("all" in target) {
    generations.bumpAll();
  } else if (target.group === "settings") {
    generations.bump("settings", "settings");
  } else {
    generations.bump("posts", target.slug);
  }

  const prefix = purgePrefix(target);
  const keys = (await storage.getKeys(STORAGE_BASE)).filter((key) =>
    key.startsWith(prefix),
  );

  await Promise.all(keys.map((key) => storage.removeItem(key)));

  return keys;
};
