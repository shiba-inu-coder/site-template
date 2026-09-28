import { test } from "node:test";
import assert from "node:assert/strict";
import {
  candidateWidths,
  imageDimensions,
  responsiveImage,
} from "../shared/utils/image-candidates.ts";

const urlFor = (width: number) => `https://img.test/w_${width}/pic`;

const descriptors = (srcset: string) =>
  srcset.split(", ").map((entry) => {
    const [url, descriptor] = entry.split(" ");

    return { url, width: Number(descriptor.replace("w", "")) };
  });

test("кандидаты: лестница обрезана по оригиналу, сам оригинал — последним", () => {
  const widths = candidateWidths(1344);

  assert.ok(widths.every((width) => width <= 1344));
  assert.equal(widths.at(-1), 1344);
  assert.ok(widths.includes(1280));
});

test("кандидаты: оригинал уже того, что есть в лестнице, — единственный кандидат", () => {
  assert.deepEqual(candidateWidths(244), [244]);
});

test("кандидаты: оригинал на ступеньке лестницы не даёт дубля", () => {
  const widths = candidateWidths(1280);

  assert.equal(widths.filter((width) => width === 1280).length, 1);
  assert.equal(new Set(widths).size, widths.length);
});

test("кандидаты: оригинал шире лестницы целиком не предлагается", () => {
  const widths = candidateWidths(6000);

  assert.ok(!widths.includes(6000));
  assert.ok(widths.every((width) => width < 6000));
});

test("кандидаты: без размеров — лестница с потолком ниже её вершины", () => {
  const unknown = candidateWidths(undefined);
  const known = candidateWidths(6000);

  assert.ok(unknown.length > 1);
  assert.ok(Math.max(...unknown) < Math.max(...known));
});

test("responsiveImage: дескриптор каждого кандидата — ширина, с которой собран его URL", () => {
  const image = responsiveImage({ width: 1600, height: 900 }, "100vw", urlFor);

  for (const { url, width } of descriptors(image.srcset)) {
    assert.equal(url, urlFor(width));
  }

  assert.equal(image.width, 1600);
  assert.equal(image.height, 900);
  assert.ok(descriptors(image.srcset).some(({ url }) => url === image.src));
});

test("responsiveImage: размеров нет или они мусор — атрибутов width/height нет", () => {
  for (const img of [{}, { width: 0, height: 900 }, { width: "abc" }]) {
    const image = responsiveImage(img, "100vw", urlFor);

    assert.equal(image.width, undefined);
    assert.equal(image.height, undefined);
    assert.ok(image.srcset.length > 0);
  }
});

test("imageDimensions: нужны обе стороны, положительные", () => {
  assert.deepEqual(imageDimensions({ width: 1344, height: 768 }), {
    width: 1344,
    height: 768,
  });
  assert.equal(imageDimensions({ width: 1344 }), null);
  assert.equal(imageDimensions({ width: -1, height: 768 }), null);
  assert.equal(imageDimensions(null), null);
});
