import { test } from "node:test";
import assert from "node:assert/strict";
import { sectionAnchorId } from "../shared/utils/section-anchor.ts";

test("секция со своим якорем отдаёт его заголовку", () => {
  assert.equal(
    sectionAnchorId({ uid: "s3", anchor: "bonus-betonred" }),
    "bonus-betonred",
  );
});

test("секция без якоря — старая запись или пустое поле — остаётся на uid", () => {
  assert.equal(sectionAnchorId({ uid: "s3" }), "s3");
  assert.equal(sectionAnchorId({ uid: "s3", anchor: "" }), "s3");
});

test("секция без uid и якоря id не получает", () => {
  assert.equal(sectionAnchorId({}), "");
  assert.equal(sectionAnchorId(null), "");
});
