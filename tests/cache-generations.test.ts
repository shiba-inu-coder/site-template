import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cacheStorageKey,
  createCacheGenerations,
  purgeCacheTarget,
  readThroughGenerations,
} from "../server/lib/cache-generations.ts";
import type {
  CacheGenerations,
  CacheGroup,
} from "../server/lib/cache-generations.ts";

const createStorage = () => {
  const data = new Map<string, unknown>();

  return {
    data,
    getKeys: async (base: string) =>
      [...data.keys()].filter((key) => key.startsWith(base)),
    removeItem: async (key: string) => {
      data.delete(key);
    },
  };
};

type Storage = ReturnType<typeof createStorage>;

// Как defineCachedFunction в Nitro: промах — резолвер, и запись в хранилище
// только после его await. `beforeWrite` — окно между ними, в нём и гонка.
const createNitroLikeCache =
  (storage: Storage, group: CacheGroup, beforeWrite = async () => {}) =>
  async <T>(cacheKey: string, resolver: () => Promise<T>): Promise<T> => {
    const key = cacheStorageKey(group, cacheKey);

    if (storage.data.has(key)) {
      return storage.data.get(key) as T;
    }

    const value = await resolver();

    await beforeWrite();
    storage.data.set(key, value);

    return value;
  };

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });

  return { promise, resolve };
};

const tick = () => new Promise((done) => setImmediate(done));

const readSettings = <T>(
  generations: CacheGenerations,
  cache: ReturnType<typeof createNitroLikeCache>,
  resolver: () => Promise<T>,
) =>
  readThroughGenerations({
    generations,
    group: "settings",
    item: "settings",
    read: (cacheKey) => cache(cacheKey, resolver),
  });

const purgeSettings = (generations: CacheGenerations, storage: Storage) =>
  purgeCacheTarget({ generations, storage, target: { group: "settings" } });

test("без сброса: одно чтение базы, повторов нет, дальше — из кеша", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "settings");
  let reads = 0;
  const resolver = async () => {
    reads += 1;
    return "v1";
  };

  assert.deepEqual(await readSettings(generations, cache, resolver), {
    value: "v1",
    volatile: false,
  });
  assert.deepEqual(await readSettings(generations, cache, resolver), {
    value: "v1",
    volatile: false,
  });
  assert.equal(reads, 1);
});

test("сброс во время чтения базы: запрос получает свежее, в кеше — свежее", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "settings");
  const firstRead = deferred<string>();
  let reads = 0;
  const resolver = () => {
    reads += 1;
    return reads === 1 ? firstRead.promise : Promise.resolve("new");
  };

  const pending = readSettings(generations, cache, resolver);

  await tick();
  await purgeSettings(generations, storage);
  firstRead.resolve("old");

  assert.deepEqual(await pending, { value: "new", volatile: false });
  assert.deepEqual(await readSettings(generations, cache, resolver), {
    value: "new",
    volatile: false,
  });
  assert.equal(reads, 2);
});

test("сброс после резолвера, до записи Nitro: поздняя запись ложится под старый ключ и не читается", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const writeGate = deferred<undefined>();
  let writes = 0;
  const cache = createNitroLikeCache(storage, "settings", async () => {
    writes += 1;

    if (writes === 1) {
      await writeGate.promise;
    }
  });
  let reads = 0;
  const resolver = async () => {
    reads += 1;
    return reads === 1 ? "old" : "new";
  };

  const pending = readSettings(generations, cache, resolver);

  await tick();
  await purgeSettings(generations, storage);
  writeGate.resolve(undefined);

  assert.deepEqual(await pending, { value: "new", volatile: false });
  assert.ok(
    [...storage.data.values()].includes("old"),
    "старое чтение всё-таки записало своё — под старым ключом",
  );
  assert.deepEqual(await readSettings(generations, cache, resolver), {
    value: "new",
    volatile: false,
  });
  assert.equal(reads, 2);
});

test("сброс all меняет и ключ поста, который ещё ни разу не сбрасывали", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "posts");
  const firstRead = deferred<string>();
  let reads = 0;
  const resolver = () => {
    reads += 1;
    return reads === 1 ? firstRead.promise : Promise.resolve("new");
  };

  const pending = readThroughGenerations({
    generations,
    group: "posts",
    item: "casino/review",
    read: (cacheKey) => cache(cacheKey, resolver),
  });

  await tick();
  await purgeCacheTarget({ generations, storage, target: { all: true } });
  firstRead.resolve("old");

  assert.deepEqual(await pending, { value: "new", volatile: false });
  assert.equal(reads, 2);
});

test("два экземпляра кеша делят поколения: сброс через один виден другому", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const first = createNitroLikeCache(storage, "settings");
  const second = createNitroLikeCache(storage, "settings");
  let value = "v1";
  const resolver = async () => value;

  await readSettings(generations, first, resolver);
  value = "v2";
  await purgeSettings(generations, storage);

  assert.deepEqual(await readSettings(generations, second, resolver), {
    value: "v2",
    volatile: false,
  });
  assert.deepEqual(await readSettings(generations, first, resolver), {
    value: "v2",
    volatile: false,
  });
});

test("рестарт с тем же хранилищем: ключи прошлого запуска не читаются", async () => {
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "settings");

  await readSettings(
    createCacheGenerations("before"),
    cache,
    async () => "old",
  );

  let reads = 0;
  const result = await readSettings(
    createCacheGenerations("after"),
    cache,
    async () => {
      reads += 1;
      return "new";
    },
  );

  assert.deepEqual(result, { value: "new", volatile: false });
  assert.equal(reads, 1);
});

test("сбросы на всех трёх попытках: отдаётся последнее прочитанное с volatile, в ключ текущего поколения не кладётся", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "settings");
  let reads = 0;
  const purgingResolver = async () => {
    reads += 1;
    await purgeSettings(generations, storage);
    return `v${reads}`;
  };

  assert.deepEqual(await readSettings(generations, cache, purgingResolver), {
    value: "v3",
    volatile: true,
  });
  assert.equal(reads, 3);

  const currentKey = cacheStorageKey(
    "settings",
    generations.cacheKey(
      "settings",
      generations.snapshot("settings", "settings"),
    ),
  );

  assert.equal(storage.data.has(currentKey), false);
  assert.deepEqual(
    await readSettings(generations, cache, async () => "fresh"),
    { value: "fresh", volatile: false },
  );
});

test("ошибка базы без единого успешного чтения — обычная ошибка", async () => {
  const generations = createCacheGenerations("boot");
  const cache = createNitroLikeCache(createStorage(), "settings");

  await assert.rejects(
    readSettings(generations, cache, async () => {
      throw new Error("mongo down");
    }),
    /mongo down/,
  );
});

test("ошибка после чтения, устаревшего из-за сброса, — отдаётся прочитанное с volatile", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "settings");
  let reads = 0;
  const resolver = async () => {
    reads += 1;

    if (reads === 1) {
      await purgeSettings(generations, storage);
      return "stale";
    }

    throw new Error("mongo down");
  };

  assert.deepEqual(await readSettings(generations, cache, resolver), {
    value: "stale",
    volatile: true,
  });
});

test("сброс поста чистит только его файлы, соседи остаются", async () => {
  const generations = createCacheGenerations("boot");
  const storage = createStorage();
  const cache = createNitroLikeCache(storage, "posts");
  const readPost = (slug: string) =>
    readThroughGenerations({
      generations,
      group: "posts",
      item: slug,
      read: (cacheKey) => cache(cacheKey, async () => slug),
    });

  await readPost("casino/review");
  await readPost("casino");

  const removed = await purgeCacheTarget({
    generations,
    storage,
    target: { group: "posts", slug: "casino/review" },
  });

  assert.equal(removed.length, 1);
  assert.match(removed[0], /^nitro:functions:posts:casino:review~/);
  assert.equal(storage.data.size, 1);
});
