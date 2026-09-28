import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHeroContent } from "../shared/utils/hero-content.ts";
import type { HeroContent } from "../shared/utils/hero-content.ts";
import {
  findShortcodeMarkers,
  removeShortcodeMarkers,
} from "../shared/utils/shortcode-markers.ts";

const marker = (name: string, uniqId: string, attrs = "") =>
  `<div class="shortcode" is="vue:${name}" data-name="${name}" uniq-id="${uniqId}"${attrs}>&nbsp;</div>`;

const buttonRef = (uniqId: string, name: string) =>
  marker("button-ref", uniqId, ` name="${name}"`);

const LEAD = [
  "<p>Вступление.</p>",
  marker("biography-writer", "writer-1"),
  marker("text-image", "textimg-1"),
  buttonRef("btn-1", "Играть"),
  "<p>Середина лида.</p>",
  marker("biography-writer", "writer-2"),
  marker("text-image", "textimg-2"),
  buttonRef("btn-2", "Забрать бонус"),
].join("");

const TEXT_IMAGES = [
  {
    data: {
      uniqId: "textimg-1",
      img: { path: "v1/articles/a", alt: "A", width: 1600, height: 900 },
      text: "<p>Текст A</p>",
      buttonText: "Кнопка A",
    },
  },
  {
    data: {
      uniqId: "textimg-2",
      img: { path: "v1/articles/b", alt: "B" },
      text: "<p>Текст B</p>",
      buttonText: "Кнопка B",
    },
  },
];

const SECTIONS = [
  { uid: "s1", title: "Заголовок статьи", body: LEAD },
  { uid: "s2", title: "Вторая секция", body: "<p>Дальше.</p>" },
];

const ORIGINAL_LINKS = ["Играть", "Кнопка A", "Забрать бонус", "Кнопка B"];

/**
 * Что посетитель увидит на странице: хиро плюс лид так, как его рисуют
 * HeroLayout, PostSections и PostTextImage.
 */
const page = (hero: HeroContent, ctaLabel: string) => {
  const lead = findShortcodeMarkers(hero.enabled ? hero.leadBody : LEAD);
  const config = (uniqId: string) =>
    TEXT_IMAGES.find((entry) => entry.data.uniqId === uniqId)?.data;
  const heroLinks = !hero.enabled
    ? []
    : hero.button
      ? [hero.button.html.match(/\sname="([^"]*)"/)![1]]
      : ctaLabel
        ? [ctaLabel]
        : [];

  const leadLinks = lead.flatMap((item) => {
    if (item.name === "button-ref") {
      return [item.html.match(/\sname="([^"]*)"/)![1]];
    }

    return item.name === "text-image"
      ? [config(item.uniqId)?.buttonText || ""]
      : [];
  });

  const leadPictures = lead
    .filter(
      (item) =>
        item.name === "text-image" &&
        item.uniqId !== hero.photo?.uniqId &&
        config(item.uniqId)?.img?.path,
    )
    .map((item) => item.uniqId);

  return {
    links: [...heroLinks, ...leadLinks].sort(),
    pictures: [
      ...(hero.photo ? [hero.photo.uniqId] : []),
      ...leadPictures,
    ].sort(),
    texts: lead
      .filter((item) => item.name === "text-image")
      .map((item) => config(item.uniqId)?.text),
    authors: [
      ...(hero.biography ? [hero.biography.uniqId] : []),
      ...lead
        .filter((item) => item.name === "biography-writer")
        .map((item) => item.uniqId),
    ].sort(),
  };
};

const resolve = (style: string, headerCtaLabel = "") =>
  resolveHeroContent({
    style,
    sections: SECTIONS,
    textImages: TEXT_IMAGES,
    headerCtaLabel,
  });

test("хиро none: ничего не переезжает, H1 остаётся у секции со своим id", () => {
  const hero = resolve("none");
  const view = page(hero, "");

  assert.equal(hero.enabled, false);
  assert.equal(hero.titleId, "s1");
  assert.deepEqual(view.links, [...ORIGINAL_LINKS].sort());
  assert.deepEqual(view.pictures, ["textimg-1", "textimg-2"]);
  assert.deepEqual(view.authors, ["writer-1", "writer-2"]);
});

test("текстовое хиро без CTA шапки: уезжают первый автор и первая кнопка, вторые остаются в лиде", () => {
  const hero = resolve("band");
  const view = page(hero, "");

  assert.equal(hero.biography?.uniqId, "writer-1");
  assert.equal(hero.button?.uniqId, "btn-1");
  assert.equal(hero.photo, null);
  assert.deepEqual(view.links, [...ORIGINAL_LINKS].sort());
  assert.deepEqual(view.authors, ["writer-1", "writer-2"]);
  assert.deepEqual(view.pictures, ["textimg-1", "textimg-2"]);
  assert.match(hero.leadBody, /uniq-id="writer-2"/);
  assert.match(hero.leadBody, /uniq-id="btn-2"/);
});

test("текстовое хиро с CTA шапки: статейные кнопки все в лиде, CTA добавляется одна", () => {
  const hero = resolve("band", "Регистрация");
  const view = page(hero, "Регистрация");

  assert.equal(hero.button, null);
  assert.deepEqual(view.links, [...ORIGINAL_LINKS, "Регистрация"].sort());
});

test("хиро photo: уезжает только картинка, текст и кнопка блока остаются в лиде по разу", () => {
  const hero = resolve("photo");
  const view = page(hero, "");

  assert.equal(hero.photo?.uniqId, "textimg-1");
  assert.equal(hero.photo?.img.path, "v1/articles/a");
  assert.deepEqual(view.pictures, ["textimg-1", "textimg-2"]);
  assert.deepEqual(view.texts, ["<p>Текст A</p>", "<p>Текст B</p>"]);
  assert.deepEqual(view.links, [...ORIGINAL_LINKS].sort());
  assert.deepEqual(view.authors, ["writer-1", "writer-2"]);
});

test("хиро photo с CTA шапки: ссылок столько же плюс CTA, картинки по одной", () => {
  const hero = resolve("photo", "Регистрация");
  const view = page(hero, "Регистрация");

  assert.deepEqual(view.links, [...ORIGINAL_LINKS, "Регистрация"].sort());
  assert.deepEqual(view.pictures, ["textimg-1", "textimg-2"]);
});

test("хиро photo: первый блок без картинки пропускается, в хиро идёт следующая", () => {
  const hero = resolveHeroContent({
    style: "photo",
    sections: SECTIONS,
    textImages: [
      { data: { ...TEXT_IMAGES[0].data, img: null } },
      TEXT_IMAGES[1],
    ],
    headerCtaLabel: "",
  });

  assert.equal(hero.photo?.uniqId, "textimg-2");
});

test("хиро с кадром: H1 в хиро несёт id первой секции — якорь оглавления живой", () => {
  for (const style of ["band", "photo"]) {
    const hero = resolve(style);

    assert.equal(hero.enabled, true);
    assert.equal(hero.titleId, SECTIONS[0].uid);
  }
});

test("removeShortcodeMarkers: из двух копий с одним uniq-id убирается только найденная", () => {
  const html = buttonRef("btn-1", "Первая") + buttonRef("btn-1", "Копия");
  const [first] = findShortcodeMarkers(html);
  const rest = findShortcodeMarkers(removeShortcodeMarkers(html, [first]));

  assert.equal(rest.length, 1);
  assert.match(rest[0].html, /name="Копия"/);
});
