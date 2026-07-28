const cacheStorage = useStorage("fsApp");
// function escapeKey(key: string | string[]) {
//   return String(key).replace(/\W/g, "");
// }

type FormatKey = { group: "posts" | "settings"; fileName: string };

function formatKey(param: FormatKey): string {
  return `nitro:functions:${param.group}:${param.fileName}.json`;
}
export const AppNitroCache = () => {
  async function removeCacheItem(param: FormatKey) {
    const key = formatKey(param);
    if (await cacheStorage.hasItem(key)) {
      await cacheStorage.removeItem(key);
    }
  }

  const setCachePostItem = defineCachedFunction(
    async (slug: string, fn: Function) => {
      return await fn();
    },
    {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      staleMaxAge: 60 * 60 * 24 * 366, // 1 year + 1 day
      name: "posts",
      base: "fsApp",
      getKey: (slug: string) => slug,
    },
  );
  const setCacheSettingItem = defineCachedFunction(
    async (slug: string, fn: Function) => {
      return await fn();
    },
    {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      staleMaxAge: 60 * 60 * 24 * 366, // 1 year + 1 day
      name: "settings",
      base: "fsApp",
      getKey: (slug: string) => slug,
    },
  );

  return {
    removeCacheItem,
    setCachePostItem,
    setCacheSettingItem,
  };
};
