import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveTextImageSide,
  textImageRole,
} from "../shared/utils/text-image.ts";
import type { TextImageSide } from "../shared/utils/text-image.ts";

const SIDES: TextImageSide[] = ["left", "right", "top", "bottom"];

test("положение: каждое из четырёх читается как есть", () => {
  for (const side of SIDES) {
    assert.equal(resolveTextImageSide(side), side);
  }
});

test("положение: full — старое «одна колонка, картинка первой», то есть top", () => {
  assert.equal(resolveTextImageSide("full"), "top");
});

test("положение: нет значения или мусор — right", () => {
  for (const raw of [undefined, null, "", "LEFT", "center", 1, {}]) {
    assert.equal(resolveTextImageSide(raw), "right");
  }
});

test("роль картинки: сбоку половина колонки, сверху и снизу — вся колонка", () => {
  assert.deepEqual(textImageRole("left"), { kind: "half" });
  assert.deepEqual(textImageRole("right"), { kind: "half" });
  assert.deepEqual(textImageRole("top"), { kind: "column" });
  assert.deepEqual(textImageRole("bottom"), { kind: "column" });
});
