import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePixelSize } from "../shared/utils/pixel-size.ts";

test("размер: число и число с px — пиксели", () => {
  assert.equal(parsePixelSize("320"), 320);
  assert.equal(parsePixelSize(" 320px "), 320);
  assert.equal(parsePixelSize("320PX"), 320);
  assert.equal(parsePixelSize(480), 480);
});

test("размер: auto, пусто и мусор — не размер", () => {
  for (const raw of ["auto", "AUTO", "", "  ", "abc", "50%", "-10", "1e3"]) {
    assert.equal(parsePixelSize(raw), undefined, `«${raw}»`);
  }

  assert.equal(parsePixelSize(undefined), undefined);
  assert.equal(parsePixelSize(null), undefined);
});

test("размер: ноль — не размер, дробное округляется", () => {
  assert.equal(parsePixelSize("0"), undefined);
  assert.equal(parsePixelSize("0px"), undefined);
  assert.equal(parsePixelSize("320.6"), 321);
});
