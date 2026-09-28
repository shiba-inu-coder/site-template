#!/usr/bin/env node
/**
 * Правила картинок страницы (docs/ui.md, «Images») по SSR-ответу:
 *
 *   node scripts/perf-smoke.mjs https://69casino.cz/ [--expect-priority]
 *
 * Читается именно ответ сервера, а не DOM после загрузки: браузер и Vite
 * дописывают в <head> своё, и то, что видит сканер предзагрузки, в DOM уже не
 * отличить. Размеры оригиналов берутся из data API поста того же адреса.
 * Выход 1 — хоть одно правило нарушено.
 */

const args = process.argv.slice(2);
const pageUrl = args.find((arg) => !arg.startsWith("--"));
const expectPriority = args.includes("--expect-priority");

if (!pageUrl) {
  console.error(
    "Использование: node scripts/perf-smoke.mjs <url> [--expect-priority]",
  );
  process.exit(2);
}

const ENTITIES = {
  amp: "&",
  quot: '"',
  "#39": "'",
  apos: "'",
  lt: "<",
  gt: ">",
};

const decode = (value) =>
  value.replace(/&(amp|quot|#39|apos|lt|gt);/g, (_, name) => ENTITIES[name]);

// Vue экранирует `<` и `>` в значениях атрибутов, поэтому тег кончается на
// первом `>`.
const parseTags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => {
    const attrs = {};
    const body = match[0].replace(/^<\w+/, "").replace(/\/?>$/, "");

    for (const attr of body.matchAll(
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
    )) {
      attrs[attr[1].toLowerCase()] = decode(
        attr[2] ?? attr[3] ?? attr[4] ?? "",
      );
    }

    return { index: match.index, attrs };
  });

// Запятая внутри URL Cloudinary (`f_auto,q_auto`) идёт без пробела, между
// кандидатами — с пробелом.
const parseSrcset = (srcset = "") =>
  srcset
    .split(/,\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, descriptor = "1x"] = entry.split(/\s+/);
      const w = descriptor.endsWith("w") ? Number.parseInt(descriptor) : null;

      return { url, descriptor, w };
    });

const TRANSFORMATION_RE = /^[a-z]{1,3}_[^/]*$/;

const publicId = (url = "") => {
  const rest = url.match(/\/image\/upload\/(.+)$/)?.[1];

  if (!rest) {
    return null;
  }

  const segments = rest.split("/");

  if (TRANSFORMATION_RE.test(segments[0])) {
    segments.shift();
  }

  return segments.join("/").replace(/\.[a-z0-9]+$/i, "");
};

const widthParam = (url = "") => {
  const match = url
    .match(/\/image\/upload\/([^/]+)\//)?.[1]
    .match(/(?:^|,)w_(\d+)/);

  return match ? Number(match[1]) : null;
};

const slugOf = (url) => {
  const path = new URL(url).pathname.split("/").filter(Boolean).join("/");

  return path || "index";
};

const fetchText = async (url) => {
  const response = await fetch(url, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`${url} ответил ${response.status}`);
  }

  return response.text();
};

// Любой объект с path и положительными width/height в данных поста — картинка
// с известным оригиналом, в каком бы блоке она ни лежала.
const knownImages = (post) => {
  const known = new Map();

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }

    if (!node || typeof node !== "object") {
      return;
    }

    const width = Number(node.width);
    const height = Number(node.height);

    if (typeof node.path === "string" && node.path && width > 0 && height > 0) {
      known.set(node.path.replace(/\.[a-z0-9]+$/i, ""), { width, height });
    }

    Object.values(node).forEach(walk);
  };

  walk(post);

  return known;
};

// Картинка в боксе с пропорцией (вертикальная карточка сетки, aspect-video)
// место держит боксом, размеры ей не нужны.
const inAspectBox = (html, index) => {
  const opener = html
    .slice(Math.max(0, index - 400), index)
    .match(/<(\w+)\b([^>]*)>\s*$/);

  return Boolean(opener && /class="[^"]*\baspect-/.test(opener[2]));
};

const html = await fetchText(pageUrl);
const origin = new URL(pageUrl).origin;
const slug = slugOf(pageUrl);
const post = JSON.parse(
  await fetchText(
    `${origin}/api/v1/public/posts/slug?slug=${encodeURIComponent(slug)}`,
  ),
);
const known = knownImages(post);

const images = parseTags(html, "img");
const preloads = parseTags(html, "link").filter(
  ({ attrs }) =>
    attrs.rel?.split(/\s+/).includes("preload") && attrs.as === "image",
);

const problems = [];
const problem = (text) => problems.push(text);

const checkCandidates = (label, id, candidates) => {
  const original = known.get(id);

  for (const candidate of candidates) {
    const param = widthParam(candidate.url);

    if (candidate.w !== null && param !== null && candidate.w !== param) {
      problem(`${label}: дескриптор ${candidate.w}w у файла w_${param}`);
    }

    const asked = candidate.w ?? param;

    if (original && asked !== null && asked > original.width) {
      const where = candidate.descriptor === "src" ? "src" : "кандидат";

      problem(
        `${label}: ${where} ${asked}px шире оригинала ${original.width}px`,
      );
    }
  }
};

const rows = images.map(({ index, attrs }, position) => {
  const label = `картинка #${position + 1}`;
  const candidates = [
    ...parseSrcset(attrs.srcset),
    ...(attrs.src ? [{ url: attrs.src, descriptor: "src", w: null }] : []),
  ];
  const id = publicId(attrs.src) ?? publicId(candidates[0]?.url);
  const original = id ? known.get(id) : undefined;

  checkCandidates(label, id, candidates);

  if (
    original &&
    !inAspectBox(html, index) &&
    !(/^\d+$/.test(attrs.width ?? "") && /^\d+$/.test(attrs.height ?? ""))
  ) {
    problem(
      `${label}: оригинал ${original.width}×${original.height} известен, а числовых width/height нет`,
    );
  }

  const wide = parseSrcset(attrs.srcset)
    .map((candidate) => candidate.w)
    .filter((w) => w !== null);

  return {
    "#": position + 1,
    loading: attrs.loading || "—",
    priority: attrs.fetchpriority || "—",
    "width×height":
      attrs.width || attrs.height
        ? `${attrs.width ?? "?"}×${attrs.height ?? "?"}`
        : "—",
    candidates: parseSrcset(attrs.srcset).length,
    "max w": wide.length ? Math.max(...wide) : "—",
    original: original ? `${original.width}×${original.height}` : "—",
    image: (id || attrs.src || "").split("/").slice(-2).join("/"),
    attrs,
  };
});

const priority = rows.filter((row) => row.attrs.fetchpriority === "high");

if (priority.length > 1) {
  problem(`приоритетных картинок ${priority.length}, а должна быть одна`);
}

if (expectPriority && priority.length !== 1) {
  problem(`ждали ровно одну приоритетную картинку, а их ${priority.length}`);
}

if (preloads.length > 1) {
  problem(`preload картинок ${preloads.length}, а должен быть один`);
}

if (priority.length !== preloads.length) {
  problem(
    `приоритетных картинок ${priority.length}, а preload у картинок ${preloads.length}`,
  );
}

for (const row of priority) {
  if (row.attrs.loading === "lazy") {
    problem(`картинка #${row["#"]}: приоритетная, но loading=lazy`);
  }

  const link = preloads[0]?.attrs;

  if (link) {
    if ((link.imagesrcset ?? "") !== (row.attrs.srcset ?? "")) {
      problem(
        `картинка #${row["#"]}: srcset у <img> и imagesrcset у preload разные`,
      );
    }

    if ((link.imagesizes ?? "") !== (row.attrs.sizes ?? "")) {
      problem(
        `картинка #${row["#"]}: sizes у <img> и imagesizes у preload разные`,
      );
    }
  }
}

preloads.forEach(({ attrs }, position) => {
  const candidates = parseSrcset(attrs.imagesrcset);

  checkCandidates(
    `preload #${position + 1}`,
    publicId(attrs.href) ?? publicId(candidates[0]?.url),
    candidates,
  );
});

console.log(
  `${pageUrl} — пост «${slug}», картинок ${images.length}, с известным оригиналом ${rows.filter((row) => row.original !== "—").length}, preload ${preloads.length}`,
);
console.table(
  rows.map((row) =>
    Object.fromEntries(Object.entries(row).filter(([key]) => key !== "attrs")),
  ),
);

if (problems.length) {
  console.log(`Нарушения (${problems.length}):`);

  for (const text of problems) {
    console.log(`  ✗ ${text}`);
  }

  process.exit(1);
}

console.log("Нарушений нет.");
