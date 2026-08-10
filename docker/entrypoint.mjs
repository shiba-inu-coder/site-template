// Точка входа контейнера. Забирает конфигурацию из Vault и только потом
// запускает сервер — в образе не лежит ни адрес базы, ни домен, ни секрет.
//
// Почему это здесь, а не плагином Nitro: переменные должны попасть в окружение
// ДО того, как Nitro соберёт runtimeConfig, а он делает это при импорте. Плагин
// выполнился бы уже после — и порядок пришлось бы обеспечивать именами файлов.
//
// Отличие от такой же точки входа в AppsPro — кеш. Панель, не достучавшаяся до
// Vault, просто не поднимается: полежать она может. Сайт — нет, поэтому каждый
// удачный старт сохраняет конфиг в том, и при недоступном Vault контейнер
// поднимается по нему. Опасность у этого одна — тихо уехать на старых
// значениях, поэтому в лог идёт и жалоба, и возраст копии.
//
// Токен приходит НЕ переменной окружения, а файлом из docker secret: swarm
// держит его зашифрованным в своём raft-логе и расшифровывает только в tmpfs
// контейнера. Переменная окружения была бы видна в `docker service inspect`.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  applyRuntimeEnv,
  missingRequiredKeys,
  readVaultSecrets,
  toRuntimeEnv,
} from "./vault-env.mjs";

const RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 20_000];

const CACHE_FILE = process.env.RUNTIME_CONFIG_CACHE;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Файл из docker secret — основной путь; переменная остаётся запасным, чтобы
// образ можно было запустить локально одной командой.
const readToken = () => {
  const file = process.env.VAULT_TOKEN_FILE;

  if (file) {
    return readFileSync(file, "utf8").trim();
  }

  return process.env.VAULT_TOKEN;
};

const saveCache = (secrets) => {
  if (!CACHE_FILE) return;

  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    // 0600: том общий на все сайты ноды, и содержимое — живой пароль к Mongo.
    writeFileSync(CACHE_FILE, JSON.stringify(secrets), { mode: 0o600 });
  } catch (error) {
    console.error(`[entrypoint] Кеш конфига не сохранён: ${error.message}`);
  }
};

const loadCache = () => {
  if (!CACHE_FILE) return null;

  try {
    const secrets = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
    const missing = missingRequiredKeys(secrets);

    if (missing.length > 0) {
      console.error(
        `[entrypoint] В кеше не хватает ключей: ${missing.join(", ")}`,
      );
      return null;
    }

    return { secrets, savedAt: statSync(CACHE_FILE).mtime.toISOString() };
  } catch {
    return null;
  }
};

const loadFromVault = async (token) => {
  const addr = process.env.VAULT_ADDR;
  const path = process.env.VAULT_SECRET_PATH;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await readVaultSecrets({ addr, token, path });
    } catch (error) {
      if (attempt >= RETRY_DELAYS_MS.length) {
        console.error(`[entrypoint] ${error.message}`);
        return null;
      }

      const wait = RETRY_DELAYS_MS[attempt];
      console.error(
        `[entrypoint] ${error.message} — повтор через ${wait / 1000} с`,
      );
      await sleep(wait);
    }
  }
};

const load = async () => {
  const fresh = await loadFromVault(readToken());

  if (fresh) {
    saveCache(fresh);
    return fresh;
  }

  const cached = loadCache();

  // Ни Vault, ни кеша: стартовать нечем. Выходим с ошибкой — swarm перезапустит
  // контейнер и попробует ещё раз, и это честнее сайта, отдающего 500.
  if (!cached) {
    console.error(
      "[entrypoint] Конфигурации нет ни в Vault, ни в кеше — старт невозможен",
    );
    process.exit(1);
  }

  console.error(
    `[entrypoint] Vault недоступен — конфиг из кеша от ${cached.savedAt}`,
  );

  return cached.secrets;
};

const applied = applyRuntimeEnv(toRuntimeEnv(await load()));

console.log(
  `[entrypoint] Конфигурация применена: ${applied.length} переменных`,
);

await import("./.output/server/index.mjs");
