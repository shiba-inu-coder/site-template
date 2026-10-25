import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHeroImage } from "../shared/utils/hero-image.ts";

const site = { path: "site/banner", alt: "Общий", width: 1200, height: 600 };

test("баннер: своя картинка страницы важнее общей", () => {
  const own = { path: "page/own", alt: "Своя" };

  assert.deepEqual(resolveHeroImage(own, site), own);
});

test("баннер: без своей картинки берётся общая", () => {
  assert.deepEqual(resolveHeroImage(null, site), {
    path: "site/banner",
    alt: "Общий",
    width: 1200,
    height: 600,
  });
  assert.equal(
    resolveHeroImage({ path: "", alt: "" }, site)?.path,
    "site/banner",
  );
});

test("баннер: alt страницы без картинки важнее общего alt", () => {
  const resolved = resolveHeroImage({ path: "", alt: "Alt страницы" }, site);

  assert.equal(resolved?.path, "site/banner");
  assert.equal(resolved?.alt, "Alt страницы");
});

test("баннер: нет ни своей, ни общей картинки — null", () => {
  assert.equal(resolveHeroImage(undefined, undefined), null);
  assert.equal(resolveHeroImage({ path: "", alt: "x" }, null), null);
  assert.equal(resolveHeroImage(null, { path: "", alt: "x" }), null);
});
