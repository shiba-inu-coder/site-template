import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveSectionBg,
  sectionElementStyles,
} from "../shared/utils/section-style.ts";
import type { UiDecor } from "../shared/utils/ui-theme.ts";

const CLOUD_NAME = "test-cloud";

const colorLayout = (width: "container" | "full") => ({
  mode: "color" as const,
  width,
  bg: { token: "primary-200", hex: "", opacity: 100 },
});

const COLOR_FIRST: UiDecor = {
  firstSection: {
    mode: "color",
    width: "container",
    bg: { token: "primary-100", hex: "", opacity: 100 },
  },
};

const IMAGE_FIRST: UiDecor = {
  firstSection: {
    mode: "image",
    width: "full",
    image: { path: "hero/bg", overlay: 40 },
  },
};

test("resolveSectionBg: коробка «в контейнере» с фоном получает зазор", () => {
  const placement = resolveSectionBg(
    colorLayout("container"),
    {},
    CLOUD_NAME,
    1,
  );

  assert.equal(placement.target, "box");
  assert.equal(placement.gap, true);
  assert.match(placement.style, /background-color:var\(--color-primary-200\)/);
});

test("resolveSectionBg: полоса во всю ширину красит обёртку и встаёт встык", () => {
  const placement = resolveSectionBg(colorLayout("full"), {}, CLOUD_NAME, 1);

  assert.equal(placement.target, "wrap");
  assert.equal(placement.gap, false);
});

test("resolveSectionBg: без фона — ни подложки, ни зазора, ни цветов", () => {
  const placement = resolveSectionBg({ mode: "none" }, {}, CLOUD_NAME, 0);

  assert.deepEqual(placement, {
    target: "none",
    style: "",
    gap: false,
    vars: "",
    padding: { top: null, bottom: null },
  });
});

test("resolveSectionBg: первая секция «как у сайта» берёт цвет firstSection", () => {
  const placement = resolveSectionBg(
    { mode: "site", width: "full" },
    COLOR_FIRST,
    CLOUD_NAME,
    0,
  );

  assert.equal(placement.target, "box");
  assert.equal(placement.gap, true);
  assert.equal(placement.style, "background-color:var(--color-primary-100)");
});

test("resolveSectionBg: первая секция «как у сайта» берёт картинку с затемнением", () => {
  const placement = resolveSectionBg(undefined, IMAGE_FIRST, CLOUD_NAME, 0);

  assert.equal(placement.target, "wrap");
  assert.match(placement.style, /background-image:linear-gradient\(/);
  assert.match(placement.style, /test-cloud.*w_1920,c_limit\/hero\/bg/);
});

test("resolveSectionBg: вторая и следующие секции фона темы не получают", () => {
  for (const index of [1, 2, 5]) {
    for (const decor of [COLOR_FIRST, IMAGE_FIRST]) {
      const placement = resolveSectionBg(
        { mode: "site" },
        decor,
        CLOUD_NAME,
        index,
      );

      assert.equal(placement.target, "none");
      assert.equal(placement.style, "");
      assert.equal(placement.vars, "");
    }
  }
});

test("resolveSectionBg: свой фон первой секции главнее firstSection", () => {
  const placement = resolveSectionBg(
    colorLayout("full"),
    COLOR_FIRST,
    CLOUD_NAME,
    0,
  );

  assert.equal(placement.target, "wrap");
  assert.match(placement.style, /var\(--color-primary-200\)/);
  assert.equal(placement.vars, "");
});

test("resolveSectionBg: «без фона» у первой секции гасит firstSection целиком", () => {
  const placement = resolveSectionBg(
    { mode: "none" },
    {
      firstSection: {
        ...COLOR_FIRST.firstSection,
        heading: "#ff0000",
        padding: { top: 20 },
      },
    },
    CLOUD_NAME,
    0,
  );

  assert.equal(placement.target, "none");
  assert.equal(placement.vars, "");
  assert.deepEqual(placement.padding, { top: null, bottom: null });
});

test("resolveSectionBg: пустой firstSection или режим none — без подложки", () => {
  for (const firstSection of [
    undefined,
    {},
    { mode: "none" as const, heading: "#ff0000", padding: { top: 30 } },
    { mode: "bogus" as never },
  ]) {
    const placement = resolveSectionBg(
      { mode: "site" },
      { firstSection },
      CLOUD_NAME,
      0,
    );

    assert.equal(placement.target, "none");
    assert.equal(placement.vars, "");
    assert.deepEqual(placement.padding, { top: null, bottom: null });
  }
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
    1,
  );

  assert.equal(placement.target, "none");
});

test("firstSection: цвета заголовка и текста — токен палитры или hex", () => {
  const placement = resolveSectionBg(
    { mode: "site" },
    {
      firstSection: {
        ...COLOR_FIRST.firstSection,
        heading: "accent-200",
        text: "#ffffff",
      },
    },
    CLOUD_NAME,
    0,
  );

  assert.equal(
    placement.vars,
    "--color-ui-heading:var(--color-accent-200);--color-ui-text:#ffffff;color:#ffffff",
  );
});

test("firstSection: пустые и невалидные цвета переменных не дают", () => {
  for (const value of ["", "red", "primary-900", "#ff0;}x{", "url(x)"]) {
    const placement = resolveSectionBg(
      { mode: "site" },
      {
        firstSection: {
          ...COLOR_FIRST.firstSection,
          heading: value,
          text: value,
        },
      },
      CLOUD_NAME,
      0,
    );

    assert.equal(placement.vars, "", value);
  }
});

test("firstSection: токен и hex фона проверяются, мусор — фона нет", () => {
  const placement = resolveSectionBg(
    { mode: "site" },
    {
      firstSection: {
        mode: "color",
        bg: { token: "red;}", hex: "javascript:1", opacity: 100 },
      },
    },
    CLOUD_NAME,
    0,
  );

  assert.equal(placement.target, "none");
});

test("firstSection: отступы клампятся в 0–200, пусто и мусор — null", () => {
  const padding = (top: unknown, bottom: unknown) =>
    resolveSectionBg(
      { mode: "site" },
      {
        firstSection: {
          ...COLOR_FIRST.firstSection,
          padding: { top, bottom } as never,
        },
      },
      CLOUD_NAME,
      0,
    ).padding;

  assert.deepEqual(padding(500, -20), { top: 200, bottom: 0 });
  assert.deepEqual(padding("40", 12.6), { top: 40, bottom: 13 });
  assert.deepEqual(padding("", null), { top: null, bottom: null });
  assert.deepEqual(padding("abc", undefined), { top: null, bottom: null });
  assert.deepEqual(padding(0, 10), { top: 0, bottom: 10 });
});

test("sectionElementStyles: с фоном отступы идут на элемент с фоном, цвета — на секцию", () => {
  const decor = (width: "container" | "full"): UiDecor => ({
    firstSection: {
      ...COLOR_FIRST.firstSection,
      width,
      heading: "#ff0000",
      padding: { top: 10, bottom: 20 },
    },
  });
  const box = sectionElementStyles(
    resolveSectionBg({ mode: "site" }, decor("container"), CLOUD_NAME, 0),
  );
  const wrap = sectionElementStyles(
    resolveSectionBg({ mode: "site" }, decor("full"), CLOUD_NAME, 0),
  );

  assert.equal(box.wrap, "");
  assert.equal(
    box.section,
    "--color-ui-heading:#ff0000;background-color:var(--color-primary-100);padding-top:10px;padding-bottom:20px",
  );
  assert.equal(
    wrap.wrap,
    "background-color:var(--color-primary-100);padding-top:10px;padding-bottom:20px",
  );
  assert.equal(wrap.section, "--color-ui-heading:#ff0000");
});

test("sectionElementStyles: без фона отступы идут на саму секцию", () => {
  const styles = sectionElementStyles(
    resolveSectionBg(
      { mode: "site" },
      {
        firstSection: {
          mode: "color",
          padding: { bottom: 8 },
          text: "#111111",
        },
      },
      CLOUD_NAME,
      0,
    ),
  );

  assert.equal(styles.wrap, "");
  assert.equal(
    styles.section,
    "--color-ui-text:#111111;color:#111111;padding-bottom:8px",
  );
});
