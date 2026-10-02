import { test } from "node:test";
import assert from "node:assert/strict";
import { resolvePageFrame } from "../shared/utils/ui-theme.ts";
import type { PostFrame, UiTheme } from "../shared/utils/ui-theme.ts";

test("resolvePageFrame: ширина с темы, sticky с поста", () => {
  const frame = resolvePageFrame(
    { frame: { width: "narrow" } },
    { sticky: "bar" },
  );

  assert.deepEqual(frame, { width: "narrow", sticky: "bar" });
});

test("resolvePageFrame: ширина старой эпохи на посте не читается", () => {
  const frame = resolvePageFrame(
    null,
    // @ts-expect-error ключ сайтов ниже v1.11.0 — в базе он остаётся
    { width: "narrow", sticky: "button" },
  );

  assert.equal(frame.width, undefined);
  assert.equal(frame.sticky, "button");
});

test("resolvePageFrame: незнакомое значение оси схлопывается в дефолт", () => {
  const theme = { frame: { width: "full" } } as unknown as UiTheme;
  const post = { sticky: "float" } as unknown as PostFrame;
  const frame = resolvePageFrame(theme, post);

  assert.deepEqual(frame, { width: undefined, sticky: undefined });
});
