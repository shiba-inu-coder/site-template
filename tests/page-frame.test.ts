import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolvePageFrame,
  DEFAULT_UI_THEME_DARK,
} from "../shared/utils/ui-theme.ts";

const themeWithFrame = (frame: Record<string, unknown>) => ({
  ...DEFAULT_UI_THEME_DARK,
  frame: { ...DEFAULT_UI_THEME_DARK.frame, ...frame },
});

test("resolvePageFrame: пост с frame.hero = band — шапка есть", () => {
  const frame = resolvePageFrame(DEFAULT_UI_THEME_DARK, { hero: "band" });

  assert.equal(frame.hero, "band");
});

test("resolvePageFrame: пост без frame при теме с hero: band — шапки нет", () => {
  const frame = resolvePageFrame(themeWithFrame({ hero: "band" }), undefined);

  assert.notEqual(frame.hero, "band");
});

test("resolvePageFrame: heroStyle по-прежнему из темы", () => {
  const frame = resolvePageFrame(themeWithFrame({ heroStyle: "radial" }), {
    hero: "photo",
  });

  assert.equal(frame.heroStyle, "radial");
});

test("resolvePageFrame: незнакомое значение оси схлопывается в дефолт", () => {
  const frame = resolvePageFrame(DEFAULT_UI_THEME_DARK, {
    // @ts-expect-error значение не из перечня — тест на защиту от мусора
    sidebar: "grid",
  });

  assert.equal(frame.sidebar, undefined);
});

test("resolvePageFrame: без темы каркас поста всё равно читается", () => {
  const frame = resolvePageFrame(null, { width: "narrow", sticky: "bar" });

  assert.equal(frame.width, "narrow");
  assert.equal(frame.sticky, "bar");
  assert.equal(frame.heroStyle, undefined);
});
