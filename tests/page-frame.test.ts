import { test } from "node:test";
import assert from "node:assert/strict";
import { resolvePageFrame } from "../shared/utils/ui-theme.ts";

test("resolvePageFrame: пост с frame.hero = band — шапка есть", () => {
  const frame = resolvePageFrame({ hero: "band" });

  assert.equal(frame.hero, "band");
});

test("resolvePageFrame: незнакомое значение оси схлопывается в дефолт", () => {
  const frame = resolvePageFrame({
    // @ts-expect-error значение не из перечня — тест на защиту от мусора
    sidebar: "grid",
  });

  assert.equal(frame.sidebar, undefined);
});

test("resolvePageFrame: без поста — каркас пустой, не бросает", () => {
  const frame = resolvePageFrame(null);

  assert.equal(frame.width, undefined);
  assert.equal(frame.sticky, undefined);
});
