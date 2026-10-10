import { test } from "node:test";
import assert from "node:assert/strict";
import { dataTableImageSize } from "../shared/utils/data-table-image-size.ts";

test("размер картинок таблицы: пусто — высота 40, ширина по пропорциям", () => {
  for (const [w, h] of [
    [undefined, undefined],
    ["", ""],
    ["auto", "мусор"],
  ]) {
    assert.deepEqual(dataTableImageSize(w, h), {
      height: 40,
      framed: false,
    });
  }
});

test("размер картинок таблицы: задана одна сторона — вторая по пропорциям", () => {
  assert.deepEqual(dataTableImageSize("", "24"), {
    width: undefined,
    height: 24,
    framed: false,
  });
  assert.deepEqual(dataTableImageSize("80px", ""), {
    width: 80,
    height: undefined,
    framed: false,
  });
});

test("размер картинок таблицы: обе стороны — рамка", () => {
  assert.deepEqual(dataTableImageSize("80", "40"), {
    width: 80,
    height: 40,
    framed: true,
  });
});

test("размер картинок таблицы: значение зажимается в границы", () => {
  assert.equal(dataTableImageSize("", "2").height, 12);
  assert.equal(dataTableImageSize("5000", "").width, 400);
});
