import { timingSafeEqual } from "node:crypto";
import { AppNitroCache } from "#sg/lib/app-cache";
import { AppError } from "#sg/lib/app-error";
import { AppLogger } from "#sg/lib/app-logger";
import { PostSlugRegex } from "#shared/constants/base";

type PurgeBody = {
  target?: "post" | "settings" | "all";
  slug?: string;
};

// timingSafeEqual бросает на разной длине буферов, а не возвращает false —
// секрет и заголовок почти никогда не совпадают по длине с чужим вводом.
const secretsMatch = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
};

export default defineEventHandler(async (e) => {
  const log = AppLogger("handler.system.cache.purge");
  const secret = useRuntimeConfig(e).CACHE_PURGE_SECRET;
  const header = getHeader(e, "x-cache-purge-secret");

  // Fail closed: no configured secret means the endpoint is disabled
  if (!secret || !header || !secretsMatch(header, secret)) {
    log.error("cache purge rejected: invalid or missing secret");
    throw AppError.ClientError(AppError.NotAuthorized());
  }

  const body = await readBody<PurgeBody>(e);
  const { purge } = AppNitroCache();

  if (body?.target === "post" && body.slug && PostSlugRegex.test(body.slug)) {
    await purge({ group: "posts", slug: body.slug });
    log.info("purged post cache", { slug: body.slug });
    return { ok: true, purged: [`posts:${body.slug}`] };
  }

  if (body?.target === "settings") {
    await purge({ group: "settings" });
    log.info("purged settings cache");
    return { ok: true, purged: ["settings"] };
  }

  if (body?.target === "all") {
    const keys = await purge({ all: true });
    log.info("purged all cache", { count: keys.length });
    return { ok: true, purged: keys };
  }

  throw AppError.ClientError(
    AppError.New({ statusCode: "BAD_REQUEST", msg: "Invalid purge request" }),
  );
});
