import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSectionBg } from "../shared/utils/section-style.ts";

const CLOUD_NAME = "test-cloud";

const colorLayout = (width: "container" | "full") => ({
  mode: "color" as const,
  width,
  bg: { token: "primary-200", hex: "", opacity: 100 },
});

test("resolveSectionBg: коробка «в контейнере» с фоном получает зазор", () => {
  const placement = resolveSectionBg(colorLayout("container"), {}, CLOUD_NAME);

  assert.equal(placement.target, "box");
  assert.equal(placement.gap, true);
  assert.match(placement.style, /background-color:var\(--color-primary-200\)/);
});

test("resolveSectionBg: полоса во всю ширину красит обёртку и встаёт встык", () => {
  const placement = resolveSectionBg(colorLayout("full"), {}, CLOUD_NAME);

  assert.equal(placement.target, "wrap");
  assert.equal(placement.gap, false);
});

test("resolveSectionBg: без фона — ни подложки, ни зазора", () => {
  const placement = resolveSectionBg({ mode: "none" }, {}, CLOUD_NAME);

  assert.deepEqual(placement, { target: "none", style: "", gap: false });
});

test("resolveSectionBg: «как у сайта» берёт фон и ширину темы, своя ширина не в счёт", () => {
  const placement = resolveSectionBg(
    { mode: "site", width: "full" },
    { sectionBg: { token: "primary-100", width: "container" } },
    CLOUD_NAME,
  );

  assert.equal(placement.target, "box");
  assert.equal(placement.gap, true);
  assert.equal(placement.style, "background-color:var(--ui-section-bg)");
});

test("resolveSectionBg: секция без layout — это «как у сайта»", () => {
  const placement = resolveSectionBg(
    undefined,
    { sectionBg: { token: "primary-200", width: "full" } },
    CLOUD_NAME,
  );

  assert.equal(placement.target, "wrap");
});

test("resolveSectionBg: «как у сайта» без фона темы — секция голая", () => {
  const placement = resolveSectionBg({ mode: "site" }, {}, CLOUD_NAME);

  assert.equal(placement.target, "none");
});

test("resolveSectionBg: «без фона» гасит фон темы", () => {
  const placement = resolveSectionBg(
    { mode: "none" },
    { sectionBg: { token: "primary-200", width: "container" } },
    CLOUD_NAME,
  );

  assert.equal(placement.target, "none");
});

test("resolveSectionBg: картинка без пути — не фон", () => {
  const placement = resolveSectionBg(
    {
      mode: "image",
      width: "container",
      image: { path: "", alt: "", overlay: 0 },
    },
    {},
    CLOUD_NAME,
  );

  assert.equal(placement.target, "none");
});
