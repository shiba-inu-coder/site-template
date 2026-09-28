import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveHeroContent } from "../shared/utils/hero-content.ts";
import {
  postNeedsContent,
  withoutUnusedContent,
} from "../shared/utils/post-content.ts";
import { resolvePriorityImage } from "../shared/utils/priority-image.ts";

const marker = (name: string, uniqId: string) =>
  `<div class="shortcode" is="vue:${name}" data-name="${name}" uniq-id="${uniqId}">&nbsp;</div>`;

const section = (uid: string, body: string) => ({
  uid,
  title: uid,
  body,
  layout: {},
});

test("content: нужен только посту без секций", () => {
  assert.equal(
    postNeedsContent({ sections: [section("s1", "<p>a</p>")] }),
    false,
  );
  assert.equal(postNeedsContent({ sections: [] }), true);
  assert.equal(postNeedsContent({ sections: undefined }), true);
  assert.equal(postNeedsContent({ sections: null }), true);
  assert.equal(postNeedsContent({}), true);
});

test("content: секция с пустым телом — всё равно секции, content не нужен", () => {
  assert.equal(postNeedsContent({ sections: [section("s1", "")] }), false);
});

test("content: пост с секциями уходит без content, остальное — те же ссылки", () => {
  const sections = [section("s1", "<p>лид</p>")];
  const shortcodesConfig = { textImages: [] };
  const post = {
    slug: "index",
    content: "<h1>s1</h1><p>лид</p>",
    sections,
    shortcodesConfig,
  };

  const out = withoutUnusedContent(post);

  assert.equal(Object.hasOwn(out, "content"), false);
  assert.equal(out.sections, sections);
  assert.equal(out.shortcodesConfig, shortcodesConfig);
  assert.equal(out.slug, "index");
  assert.equal(post.content, "<h1>s1</h1><p>лид</p>");
});

test("content: пост без секций или с пустым списком отдаётся как есть", () => {
  const legacy = { slug: "old", content: "<p>старая статья</p>", sections: [] };
  const bare = { slug: "older", content: "<p>ещё старее</p>" };

  assert.equal(withoutUnusedContent(legacy), legacy);
  assert.equal(withoutUnusedContent(bare), bare);
});

test("content: приоритетная картинка поста с секциями не зависит от content", () => {
  const textImages = [
    {
      data: {
        uniqId: "lead",
        text: "<p>Коротко.</p>",
        imgSide: "top",
        img: { path: "v1/articles/lead", alt: "lead" },
      },
    },
  ];
  const sections = [
    section("s1", marker("text-image", "lead") + "<p>текст</p>"),
    section("s2", "<p>дальше</p>"),
  ];
  const full = {
    content: sections.map((item) => item.body).join(""),
    sections,
  };
  const hero = resolveHeroContent({
    style: "none",
    sections,
    textImages,
    headerCtaLabel: "",
  });

  const before = resolvePriorityImage({ hero, textImages, ...full });
  const after = resolvePriorityImage({
    hero,
    textImages,
    ...withoutUnusedContent(full),
  });

  assert.deepEqual(before, { uniqId: "lead", place: "lead" });
  assert.deepEqual(after, before);
});
