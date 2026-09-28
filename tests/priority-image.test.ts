import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHeroContent } from "../shared/utils/hero-content.ts";
import {
  FIRST_SCREEN_TEXT,
  resolvePriorityImage,
} from "../shared/utils/priority-image.ts";

const marker = (name: string, uniqId: string) =>
  `<div class="shortcode" is="vue:${name}" data-name="${name}" uniq-id="${uniqId}">&nbsp;</div>`;

const paragraph = (length: number) => `<p>${"я".repeat(length)}</p>`;

const picture = (uniqId: string, extra: Record<string, unknown> = {}) => ({
  data: {
    uniqId,
    text: "<p>Коротко о картинке.</p>",
    buttonText: "",
    imgSide: "top",
    img: { path: `v1/articles/${uniqId}`, alt: uniqId },
    ...extra,
  },
});

const NO_HERO = resolveHeroContent({
  style: "none",
  sections: [],
  textImages: [],
  headerCtaLabel: "",
});

const lead = (body: string, textImages: ReturnType<typeof picture>[]) =>
  resolvePriorityImage({
    hero: NO_HERO,
    sections: [
      { body },
      { body: marker("text-image", "later") + paragraph(50) },
    ],
    content: "",
    textImages: [...textImages, picture("later")],
  });

test("приоритет: картинка в начале лида", () => {
  assert.deepEqual(
    lead(marker("text-image", "lead") + paragraph(800), [picture("lead")]),
    { uniqId: "lead", place: "lead" },
  );
});

test("приоритет: первый блок без картинки пропускается, его текст считается", () => {
  const empty = picture("empty", { img: null, text: paragraph(100) });
  const nullPath = picture("blank", { img: { path: "", alt: "" } });

  assert.deepEqual(
    lead(
      marker("text-image", "empty") +
        marker("text-image", "blank") +
        marker("text-image", "lead"),
      [empty, nullPath, picture("lead")],
    ),
    { uniqId: "lead", place: "lead" },
  );
  assert.equal(
    lead(marker("text-image", "empty") + marker("text-image", "lead"), [
      picture("empty", { img: null, text: paragraph(FIRST_SCREEN_TEXT + 1) }),
      picture("lead"),
    ]),
    null,
  );
});

test("приоритет: осиротевший маркер ничего не рисует и не мешает", () => {
  assert.deepEqual(
    lead(marker("text-image", "gone") + marker("text-image", "lead"), [
      picture("lead"),
    ]),
    { uniqId: "lead", place: "lead" },
  );
});

test("приоритет: bottom ставит картинку под собственный текст блока", () => {
  const short = picture("lead", { imgSide: "bottom" });
  const long = picture("lead", {
    imgSide: "bottom",
    text: paragraph(FIRST_SCREEN_TEXT + 1),
  });
  const side = picture("lead", {
    imgSide: "right",
    text: paragraph(FIRST_SCREEN_TEXT + 1),
  });

  assert.equal(lead(marker("text-image", "lead"), [short])?.uniqId, "lead");
  assert.equal(lead(marker("text-image", "lead"), [long]), null);
  assert.equal(lead(marker("text-image", "lead"), [side])?.uniqId, "lead");
});

test("приоритет: длинный лид над картинкой — LCP уже текст", () => {
  assert.equal(
    lead(paragraph(FIRST_SCREEN_TEXT + 1) + marker("text-image", "lead"), [
      picture("lead"),
    ]),
    null,
  );
  assert.equal(
    lead(paragraph(120) + marker("text-image", "lead"), [picture("lead")])
      ?.uniqId,
    "lead",
  );
});

test("приоритет: тяжёлый блок над картинкой сталкивает её с первого экрана, кнопка — нет", () => {
  assert.equal(
    lead(marker("table-content", "toc") + marker("text-image", "lead"), [
      picture("lead"),
    ]),
    null,
  );
  assert.equal(
    lead(marker("button-ref", "btn") + marker("text-image", "lead"), [
      picture("lead"),
    ])?.uniqId,
    "lead",
  );
});

test("приоритет: в лиде нет картинки — текстовый LCP, картинка из второй секции не кандидат", () => {
  assert.equal(lead(paragraph(80) + paragraph(80), []), null);
});

test("приоритет: старая статья без секций ищет картинку в content", () => {
  const found = resolvePriorityImage({
    hero: NO_HERO,
    sections: [],
    content: `<h1>Заголовок</h1>${marker("text-image", "lead")}${paragraph(900)}`,
    textImages: [picture("lead")],
  });

  assert.deepEqual(found, { uniqId: "lead", place: "lead" });
});

test("приоритет: фото хиро — всегда оно, одна картинка на страницу", () => {
  const sections = [
    {
      uid: "s1",
      title: "H1",
      body: marker("text-image", "first") + marker("text-image", "second"),
    },
  ];
  const textImages = [picture("first"), picture("second")];
  const hero = resolveHeroContent({
    style: "photo",
    sections,
    textImages,
    headerCtaLabel: "",
  });

  assert.deepEqual(
    resolvePriorityImage({ hero, sections, content: "", textImages }),
    { uniqId: "first", place: "hero" },
  );
});

test("приоритет: текстовое хиро забирает автора из лида — он больше не над картинкой", () => {
  const body =
    marker("biography-writer", "w") +
    paragraph(FIRST_SCREEN_TEXT - 100) +
    marker("text-image", "lead");
  const sections = [{ uid: "s1", title: "H1", body }];
  const textImages = [picture("lead")];
  const band = resolveHeroContent({
    style: "band",
    sections,
    textImages,
    headerCtaLabel: "",
  });

  assert.equal(
    resolvePriorityImage({ hero: NO_HERO, sections, content: "", textImages }),
    null,
  );
  assert.equal(
    resolvePriorityImage({ hero: band, sections, content: "", textImages })
      ?.place,
    "lead",
  );
});
