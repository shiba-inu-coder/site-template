import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveGridCardsLayout } from "../shared/utils/grid-cards-layout.ts";

test("resolveGridCardsLayout: значения дошорткодовой эпохи переводятся", () => {
  assert.deepEqual(resolveGridCardsLayout("1", "", false), {
    variant: "image-caption",
    horizontal: false,
  });
  assert.deepEqual(resolveGridCardsLayout("2", "", false), {
    variant: "image-title-text",
    horizontal: false,
  });
});

test("resolveGridCardsLayout: удалённые text и offer рисуются как image-title-text", () => {
  for (const legacy of ["text", "offer"]) {
    assert.deepEqual(resolveGridCardsLayout(legacy, "", undefined), {
      variant: "image-title-text",
      horizontal: false,
    });
  }
});

test("resolveGridCardsLayout: вариант horizontal становится флагом", () => {
  assert.deepEqual(resolveGridCardsLayout("horizontal", "", undefined), {
    variant: "image-title-text",
    horizontal: true,
  });
});

test("resolveGridCardsLayout: horizontal из темы работает, пока у записи своего нет", () => {
  assert.deepEqual(resolveGridCardsLayout("", "horizontal", undefined), {
    variant: "image-title-text",
    horizontal: true,
  });
  assert.deepEqual(resolveGridCardsLayout("image", "horizontal", undefined), {
    variant: "image",
    horizontal: false,
  });
});

test("resolveGridCardsLayout: запись с мусором уступает теме, а не дефолту", () => {
  assert.deepEqual(resolveGridCardsLayout("chat", "image", false), {
    variant: "image",
    horizontal: false,
  });
});

test("resolveGridCardsLayout: без годных кандидатов — image-caption, флаг записи сохраняется", () => {
  assert.deepEqual(resolveGridCardsLayout(undefined, null, true), {
    variant: "image-caption",
    horizontal: true,
  });
  assert.deepEqual(resolveGridCardsLayout("constructor", "toString", false), {
    variant: "image-caption",
    horizontal: false,
  });
});
