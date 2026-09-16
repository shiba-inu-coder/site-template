// Значения, которые нужны браузеру: приложение читает их из public-части
// конфига (`useRuntimeConfig().public`), и без второй, публичной копии клиент
// останется без адреса сайта, его имени и разрешённых origin'ов панели
// (плагин `ui-theme.ts` сверяет с ними `event.origin` входящего postMessage).
export const PUBLIC_KEYS = ["SITE_URL", "DOMAIN_NAME", "PANEL_ORIGINS"];

// Второе имя для тех же значений. nuxt-site-config собирает site.url/site.name
// из `runtimeConfig.site`, и sitemap со schema-org берут домен именно оттуда —
// без этих двух переменных они уедут на адрес, вшитый при сборке.
export const ALIASES = {
  SITE_URL: "NUXT_SITE_URL",
  DOMAIN_NAME: "NUXT_SITE_NAME",
};

// Без этих четырёх сайт запустится, но будет отдавать 500 на каждой странице
// (нет базы) или чужой домен в канонических ссылках. Лучше не стартовать.
export const REQUIRED_KEYS = [
  "MONGO_URI",
  "MONGO_DB_NAME",
  "SITE_URL",
  "DOMAIN_NAME",
];

/**
 * Префикс обязателен: nuxt.config.ts выполняется только на сборке, а в
 * контейнере значения подставляет Nitro, и он читает окружение со своим
 * префиксом.
 */
export const toRuntimeEnv = (secrets = {}) => {
  const env = {};

  for (const [key, value] of Object.entries(secrets)) {
    if (value === null || value === undefined) {
      continue;
    }

    env[`NUXT_${key}`] = String(value);

    if (PUBLIC_KEYS.includes(key)) {
      env[`NUXT_PUBLIC_${key}`] = String(value);
    }

    if (ALIASES[key]) {
      env[ALIASES[key]] = String(value);
    }
  }

  return env;
};

/**
 * Уже заданные переменные не затираются: то, что пришло из стека, должно
 * побеждать содержимое Vault. Это единственный способ подменить один ключ в
 * аварии, не трогая хранилище.
 */
export const applyRuntimeEnv = (env, target = process.env) => {
  const applied = [];

  for (const [key, value] of Object.entries(env)) {
    if (target[key] !== undefined && target[key] !== "") {
      continue;
    }

    target[key] = value;
    applied.push(key);
  }

  return applied;
};

export const missingRequiredKeys = (secrets = {}) =>
  REQUIRED_KEYS.filter((key) => !secrets[key]);

// Том с кешем общий на все сайты ноды, а UID контейнеров одинаковый — сайт с
// инъекцией в контенте мог бы прочитать чужой файл кеша через тот же общий
// UID. MONGO_URI — пароль к боевой базе, и он же в REQUIRED_KEYS: без него
// кеш всегда "неполный" и не используется вовсе, а без Vault сайт и так не
// поднимется без базы — кешировать пароль ради недостижимого сценария смысла
// не имеет.
const CACHE_EXCLUDED_KEYS = ["MONGO_URI"];

export const toCacheableSecrets = (secrets = {}) =>
  Object.fromEntries(
    Object.entries(secrets).filter(
      ([key]) => !CACHE_EXCLUDED_KEYS.includes(key),
    ),
  );

export const readVaultSecrets = async ({
  addr,
  token,
  path,
  fetchImpl = fetch,
} = {}) => {
  if (!addr || !token) {
    throw new Error(
      "Нет VAULT_ADDR или VAULT_TOKEN — конфигурацию взять неоткуда",
    );
  }

  if (!path) {
    throw new Error("Нет VAULT_SECRET_PATH — неизвестно, какую запись читать");
  }

  const res = await fetchImpl(`${addr.replace(/\/$/, "")}/v1/${path}`, {
    headers: { "X-Vault-Token": token },
    signal: AbortSignal.timeout(15_000),
  });

  // 503 у Vault означает «запечатан», и это самая частая причина здесь: после
  // перезагрузки ноды он сам не открывается.
  if (res.status === 503) {
    throw new Error("Vault запечатан — распечатай его на мониторинг-ноде");
  }

  // 403 значит отозванный или истёкший токен, а не проблему Vault: так легла
  // панель и оба стейджинг-слота 09.09, когда токен от 08.08 никто не продлил.
  if (res.status === 403) {
    throw new Error(
      "Токен Vault отозван или истёк — перевыпусти: bash scripts/vault-rotate-token.sh на ноде",
    );
  }

  if (!res.ok) {
    throw new Error(`Vault ответил ${res.status} на ${path}`);
  }

  const body = await res.json();
  const secrets = body?.data?.data;

  if (!secrets || typeof secrets !== "object") {
    throw new Error(`В ${path} нет данных — сайту нечем настроиться`);
  }

  const missing = missingRequiredKeys(secrets);

  if (missing.length > 0) {
    throw new Error(`В ${path} не хватает ключей: ${missing.join(", ")}`);
  }

  return secrets;
};
