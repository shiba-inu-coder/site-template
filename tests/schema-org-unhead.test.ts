// nuxt-schema-org везёт копии плагина под unhead 2 и 3 и выбирает по мажору,
// который стоит у Nuxt. Плагин под чужой мажор не падает, а молча отдаёт
// пустой `<script type="application/ld+json">`: unhead 3 не ждёт async-хуков
// v2. Так граф пропал после Nuxt 4.4.6 → 4.5.2 с nuxt-schema-org 5.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootRequire = createRequire(join(process.cwd(), "package.json"));
const nuxtRequire = createRequire(rootRequire.resolve("nuxt/package.json"));

const nuxtUnheadServer = nuxtRequire.resolve("unhead/server");
const nuxtUnheadMajor = Number(
  JSON.parse(
    readFileSync(join(dirname(nuxtUnheadServer), "../package.json"), "utf-8"),
  ).version.split(".")[0],
);

const vendorEntry = join(
  dirname(fileURLToPath(import.meta.resolve("nuxt-schema-org"))),
  `vendor/schema-org-v${nuxtUnheadMajor}/index.mjs`,
);

test("nuxt-schema-org везёт плагин под мажор unhead, который стоит у Nuxt", () => {
  assert.ok(existsSync(vendorEntry), vendorEntry);
});

// Вендорный плагин импортирует `unhead/utils` из корня node_modules. Без
// корневого unhead той же версии сборка либо не находит пакет, либо цепляет
// чужой мажор выше по дереву.
test("корневой unhead — тот же, что у Nuxt", () => {
  assert.equal(rootRequire.resolve("unhead/server"), nuxtUnheadServer);
});

test("unhead Nuxt рендерит @graph в SSR", async () => {
  const { createHead, renderSSRHead } = await import(
    pathToFileURL(nuxtUnheadServer).href
  );
  const { UnheadSchemaOrg } = await import(pathToFileURL(vendorEntry).href);

  const head = createHead();
  head.use(UnheadSchemaOrg({}, async () => ({}), {}));
  head.push({
    script: [
      {
        type: "application/ld+json",
        key: "schema-org-graph",
        nodes: [
          {
            "@type": "WebSite",
            "@id": "https://example.com#website",
            name: "example.com",
            url: "https://example.com/",
          },
        ],
      },
    ],
  });

  const { headTags, bodyTags } = await renderSSRHead(head);
  const body = `${headTags}${bodyTags}`.match(
    /<script type="application\/ld\+json"[^>]*>([^]*?)<\/script>/,
  )?.[1];

  assert.ok(body, "тег ld+json пустой");
  assert.equal(JSON.parse(body)["@graph"][0]["@type"], "WebSite");
});
