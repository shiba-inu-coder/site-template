import { defineEventHandler, sendRedirect, getRequestURL } from "h3";

const CONFIG = {
  enforceTrailingSlash: true,
  redirectCode: 301,
};

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname || "/";

  const skipPatterns = [
    "/",
    /\.[a-zA-Z0-9]+$/,
    /^\/api\b/,
    /^\/_(nuxt|payload|ipx|nitro)\b/,
    /^\/__\w+/,
    /^\/@\w+/,
    /^\/sitemap\.xml$/,
    // Аффилиатный редирект отвечает сам: 301-хоп на слеш-вариант
    // закэшировался бы навсегда и пережил бы смену реф-ссылки.
    /^\/go\//,
    /nuxt_error/,
  ];

  const shouldSkip = skipPatterns.some((pattern) => {
    if (typeof pattern === "string") {
      return pathname === pattern;
    }
    return pattern.test(pathname);
  });

  if (shouldSkip) {
    return;
  }

  let normalized = pathname.toLowerCase();

  const hasTrailingSlash = normalized.endsWith("/");
  const isFile = /\.[a-zA-Z0-9]+$/.test(normalized);

  if (!isFile) {
    if (CONFIG.enforceTrailingSlash && !hasTrailingSlash) {
      normalized = normalized + "/";
    } else if (
      !CONFIG.enforceTrailingSlash &&
      hasTrailingSlash &&
      normalized !== "/"
    ) {
      normalized = normalized.slice(0, -1);
    }
  }

  if (pathname !== normalized) {
    url.pathname = normalized;
    return sendRedirect(event, url.toString(), CONFIG.redirectCode);
  }
});
