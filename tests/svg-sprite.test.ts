import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { buildSprite } from "../modules/svg-sprite/sprite.ts";

const root = new URL("../", import.meta.url);
const iconsDir = new URL("app/assets/icons/", root);

const readIcons = () =>
  readdirSync(iconsDir, { recursive: true, encoding: "utf8" })
    .filter((path) => path.endsWith(".svg"))
    .map((path) => ({
      path,
      svg: readFileSync(new URL(path, iconsDir), "utf8"),
    }));

const symbolIds = (sprite: string) =>
  new Set([...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));

// Имена иконок в шаблонах — литералы: `name="…"` у самого `<svg-icon>` и
// строки `"client/…"`, которые доходят до него пропсом `icon`.
const iconNamesInTemplates = () => {
  const names = new Set<string>();
  const files = readdirSync(new URL("app/", root), {
    recursive: true,
    encoding: "utf8",
  }).filter((file) => file.endsWith(".vue"));

  for (const file of files) {
    const source = readFileSync(new URL(`app/${file}`, root), "utf8");

    for (const [, name] of source.matchAll(
      /<svg-icon\b[^>]*?\sname="([^"]+)"/g,
    )) {
      names.add(name);
    }
    for (const [, name] of source.matchAll(/"(client\/[a-z0-9/-]+)"/g)) {
      names.add(name);
    }
  }

  return names;
};

test("спрайт: каждое имя иконки из шаблонов находит свой symbol", () => {
  const ids = symbolIds(buildSprite(readIcons()));
  const names = iconNamesInTemplates();

  assert.ok(names.size > 20);
  assert.deepEqual(
    [...names].filter((name) => !ids.has(name.replace(/\//g, "-"))),
    [],
  );
});

test("спрайт: пролог и комментарий до корня не попадают в symbol, префиксы объявлены на корне", () => {
  const sprite = buildSprite([
    {
      path: "client/licence.svg",
      svg: `<?xml version='1.0' encoding='iso-8859-1'?>\n<!-- generator -->\n<svg fill="#000" width="800px" height="800px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 465 465"><use xlink:href="#a"/></svg>\n`,
    },
  ]);

  assert.equal(sprite.match(/<\?xml/g), null);
  assert.equal(sprite.includes("generator"), false);
  assert.match(
    sprite,
    /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink">/,
  );
  assert.match(
    sprite,
    /<symbol id="client-licence" viewBox="0 0 465 465"><use xlink:href="#a"\/><\/symbol>/,
  );
});

test("спрайт: без viewBox рамка берётся из width/height", () => {
  const sprite = buildSprite([
    {
      path: "dot.svg",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10"><circle r="1"/></svg>',
    },
  ]);

  assert.match(sprite, /<symbol id="dot" viewBox="0 0 20 10">/);
});
