import { test } from "node:test";
import assert from "node:assert/strict";
import { imageSizes, pageImageLayout } from "../shared/utils/image-sizes.ts";
import type { ImageLayout, ImageRole } from "../shared/utils/image-sizes.ts";

/** Ширина слота, которую браузер возьмёт из `sizes` на данном вьюпорте. */
const slot = (sizes: string, viewport: number): number => {
  for (const entry of sizes.split(/,\s*(?![^(]*\))/)) {
    const media = entry.match(/^\(min-width: (\d+)px\)\s+(.+)$/);

    if (media && viewport < Number(media[1])) {
      continue;
    }

    const value = media ? media[2] : entry;
    const calc = value.match(/^calc\(([\d.]+)vw ([+-]) (\d+)px\)$/);

    if (calc) {
      const px = Number(calc[3]) * (calc[2] === "-" ? -1 : 1);

      return (Number(calc[1]) * viewport) / 100 + px;
    }

    if (value.endsWith("vw")) {
      return (parseFloat(value) * viewport) / 100;
    }

    return parseFloat(value);
  }

  throw new Error(`sizes без значения по умолчанию: ${sizes}`);
};

const PLAIN: ImageLayout = { sidebar: false, narrow: false, sectionBg: "none" };

// Доли округлены до сотых процента, отступы — до пикселя: слот может
// разойтись с вёрсткой на пиксель, не больше.
const assertWidth = (
  role: ImageRole,
  layout: Partial<ImageLayout>,
  vw: number,
  expected: number,
) => {
  const actual = slot(imageSizes(role, { ...PLAIN, ...layout }), vw);

  assert.ok(
    Math.abs(actual - expected) <= 1,
    `вьюпорт ${vw}: слот ${actual}, а по вёрстке ${expected}`,
  );
};

const COLUMN: ImageRole = { kind: "column" };

test("sizes: колонка статьи — вьюпорт минус отступы контейнера, на xl — сам контейнер", () => {
  assertWidth(COLUMN, {}, 390, 370);
  assertWidth(COLUMN, {}, 1024, 992);
  assertWidth(COLUMN, {}, 1350, 1280);
});

test("sizes: сайдбар забирает 300px и gap только с md — на телефоне его нет", () => {
  assertWidth(COLUMN, { sidebar: true }, 390, 370);
  assertWidth(COLUMN, { sidebar: true }, 1024, 628);
  assertWidth(COLUMN, { sidebar: true }, 1350, 916);
});

test("sizes: узкая колонка упирается в 52rem", () => {
  assertWidth(COLUMN, { narrow: true }, 800, 768);
  assertWidth(COLUMN, { narrow: true }, 1024, 800);
  assertWidth(COLUMN, { narrow: true }, 1350, 832);
});

test("sizes: фон секции коробкой отнимает свой padding внутри контейнера", () => {
  assertWidth(COLUMN, { sectionBg: "box" }, 390, 354);
  assertWidth(COLUMN, { sectionBg: "box" }, 1350, 1264);
});

test("sizes: полоса во всю ширину отнимает padding снаружи контейнера", () => {
  assertWidth(COLUMN, { sectionBg: "wrap" }, 1024, 976);
  assertWidth(COLUMN, { sectionBg: "wrap" }, 1290, 1274);
  assertWidth(COLUMN, { sectionBg: "wrap" }, 1400, 1280);
});

test("sizes: картинка сбоку — половина колонки минус gap, на телефоне вся колонка", () => {
  const half: ImageRole = { kind: "half" };

  assertWidth(half, {}, 390, 370);
  assertWidth(half, {}, 1350, 628);
  assertWidth(half, { sidebar: true }, 1350, 446);
});

test("sizes: карточка — доля ряда за вычетом gap, горизонтальная — 36% от неё", () => {
  const four: ImageRole = { kind: "card", perRow: 4, horizontal: false };
  const wide: ImageRole = { kind: "card", perRow: 1, horizontal: true };

  assertWidth(four, {}, 390, 370);
  assertWidth(four, {}, 1350, 296);
  assertWidth(wide, {}, 1350, 461);
  assertWidth(wide, {}, 390, 133);
});

test("sizes: фото хиро — вторая колонка 1fr из 2.2fr, сайдбар статьи его не сужает", () => {
  const hero: ImageRole = { kind: "hero" };

  assertWidth(hero, {}, 390, 366);
  assertWidth(hero, {}, 1024, 424);
  assertWidth(hero, {}, 1400, 569);
  assert.equal(
    imageSizes(hero, { ...PLAIN, sidebar: true }),
    imageSizes(hero, PLAIN),
  );
  assertWidth(hero, { narrow: true }, 1400, 365);
});

test("sizes: кроме calc() и px в значениях ничего нет", () => {
  const sizes = imageSizes({ kind: "half" }, { ...PLAIN, sectionBg: "box" });

  for (const entry of sizes.split(/,\s*(?![^(]*\))/)) {
    assert.match(
      entry,
      /^(\(min-width: \d+px\) )?(\d+px|[\d.]+vw|calc\([\d.]+vw [+-] \d+px\))$/,
    );
  }
});

test("pageImageLayout: узкая колонка не включается при сайдбаре, сайдбар — без секций", () => {
  assert.deepEqual(pageImageLayout({ sidebar: "toc", width: "narrow" }, true), {
    sidebar: true,
    narrow: false,
    sectionBg: "none",
  });
  assert.equal(pageImageLayout({ sidebar: "toc" }, false).sidebar, false);
  assert.equal(pageImageLayout({ width: "narrow" }, true).narrow, true);
});
