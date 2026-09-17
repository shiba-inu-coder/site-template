import type { H3Event } from "h3";
import { defineEventHandler, getRequestURL, setHeader } from "h3";

/**
 * Слой 2 защиты `/ui` от роботов (см. `docs/ui.md`, «/ui page»): заголовок
 * стоит на любом запросе к странице, с `?preview=` или без — он не зависит
 * от того, отдаст ли сама страница 404 (слой 1), чтобы не полагаться на
 * порядок проверок внутри `ui.vue`.
 */
export default defineEventHandler((event: H3Event) => {
  const { pathname } = getRequestURL(event);

  if (pathname === "/ui" || pathname === "/ui/") {
    setHeader(event, "X-Robots-Tag", "noindex, nofollow");
  }
});
