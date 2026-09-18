// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node (без сборки) — `ui-theme.ts` тянет `#rc/utils/get-cloudinary-base-url`
// алиасом, которого вне Nuxt не существует, поэтому `imports` в package.json
// зеркалит его для голого Node.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  themeToCssVars,
  DEFAULT_UI_THEME_DARK,
} from "../shared/utils/ui-theme.ts";

const CLOUD_NAME = "test-cloud";

const withBgImage = (bgImage: { path: string; overlay: number }) => ({
  ...DEFAULT_UI_THEME_DARK,
  decor: { ...DEFAULT_UI_THEME_DARK.decor, bgImage },
});

test("themeToCssVars: без decor.bgImage фоновых строк нет", () => {
  const css = themeToCssVars(DEFAULT_UI_THEME_DARK, CLOUD_NAME);

  assert.doesNotMatch(css, /--ui-bg-image/);
  assert.doesNotMatch(css, /--ui-bg-overlay/);
});

test("themeToCssVars: пустой path — то же самое, что фона нет", () => {
  const css = themeToCssVars(
    withBgImage({ path: "", overlay: 50 }),
    CLOUD_NAME,
  );

  assert.doesNotMatch(css, /--ui-bg-image/);
  assert.doesNotMatch(css, /--ui-bg-overlay/);
});

test("themeToCssVars: Cloudinary public id идёт через f_auto,q_auto", () => {
  const css = themeToCssVars(
    withBgImage({ path: "site/bg-mountains", overlay: 40 }),
    CLOUD_NAME,
  );

  assert.match(
    css,
    /--ui-bg-image: url\(https:\/\/res\.cloudinary\.com\/test-cloud\/image\/upload\/f_auto,q_auto\/site\/bg-mountains\);/,
  );
  assert.match(css, /--ui-bg-overlay: 0\.4;/);
});

test("themeToCssVars: абсолютный URL идёт как есть, без Cloudinary", () => {
  const css = themeToCssVars(
    withBgImage({ path: "https://example.com/bg.jpg", overlay: 0 }),
    CLOUD_NAME,
  );

  assert.match(css, /--ui-bg-image: url\(https:\/\/example\.com\/bg\.jpg\);/);
  assert.match(css, /--ui-bg-overlay: 0;/);
});

test("themeToCssVars: overlay вне 0–100 клампится, а не ломает значение", () => {
  const tooHigh = themeToCssVars(
    withBgImage({ path: "site/bg.jpg", overlay: 150 }),
    CLOUD_NAME,
  );
  const negative = themeToCssVars(
    withBgImage({ path: "site/bg.jpg", overlay: -20 }),
    CLOUD_NAME,
  );

  assert.match(tooHigh, /--ui-bg-overlay: 1;/);
  assert.match(negative, /--ui-bg-overlay: 0;/);
});
