// Тема сайта приходит внеслойным `<style id="ui-theme">` и при любом порядке
// таблиц побеждает только то, что лежит в слое. Внеслойное объявление той же
// переменной на корне перебивает тему, стоит его таблице оказаться ниже, — а
// ленивые блоки дописывают entry.css в конец <head>.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import {
  themeToCssVars,
  DEFAULT_UI_THEME_DARK,
} from "../shared/utils/ui-theme.ts";

const FULL_THEME = {
  ...DEFAULT_UI_THEME_DARK,
  type: {
    display: { family: "Raleway", weight: 700, tracking: "0.01em" },
    body: { family: "Raleway" },
  },
  geometry: { radius: "0.5rem", blockGap: "24px", paragraphGap: "12px" },
  decor: {
    sectionBg: { token: "primary-200" as const, width: "full" as const },
  },
};

const THEME_VARIABLES = new Set(
  themeToCssVars(FULL_THEME).match(/--[\w-]+(?=\s*:)/g),
);

// Корень документа с уточнениями вроде `[data-theme="light"]`, но без
// комбинатора: `html .site-header` — уже потомок, его тема не касается.
const isRootSelector = (selector: string) =>
  /^(:root|html|:host)(\[[^\]]*\]|:[\w-]+(\([^)]*\))?)*$/.test(selector.trim());

type Block = { prelude: string; layered: boolean; body: string };

const skipString = (source: string, start: number) => {
  const quote = source[start];
  let index = start + 1;

  while (index < source.length && source[index] !== quote) {
    index += source[index] === "\\" ? 2 : 1;
  }

  return index;
};

const collectBlocks = (css: string): Block[] => {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks: Block[] = [];
  const stack: Block[] = [];
  let buffer = "";

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (char === '"' || char === "'") {
      const end = skipString(source, index);

      buffer += source.slice(index, end + 1);
      index = end;
      continue;
    }

    if (char === "{") {
      const prelude = buffer.trim();

      stack.push({
        prelude,
        layered:
          Boolean(stack.at(-1)?.layered) || /^@(layer|theme)\b/.test(prelude),
        body: "",
      });
      buffer = "";
      continue;
    }

    if (char === "}") {
      const block = stack.pop();

      if (block) {
        block.body += buffer;
        blocks.push(block);
      }
      buffer = "";
      continue;
    }

    if (char === ";") {
      const current = stack.at(-1);

      if (current) {
        current.body += `${buffer};`;
      }
      buffer = "";
      continue;
    }

    buffer += char;
  }

  return blocks;
};

const unlayeredThemeDeclarations = (css: string) =>
  collectBlocks(css)
    .filter(
      (block) =>
        !block.layered && block.prelude.split(",").some(isRootSelector),
    )
    .flatMap((block) =>
      (block.body.match(/--[\w-]+(?=\s*:)/g) ?? [])
        .filter((name) => THEME_VARIABLES.has(name))
        .map((name) => `${block.prelude} → ${name}`),
    );

test("tailwind.css: переменные темы на корне объявлены только в слое", () => {
  const css = readFileSync(
    new URL("../app/assets/css/tailwind.css", import.meta.url),
    "utf8",
  );

  assert.ok(THEME_VARIABLES.has("--color-primary-300"));
  assert.deepEqual(unlayeredThemeDeclarations(css), []);
});

const readBuiltEntryCss = () => {
  const dir = new URL("../.output/public/_nuxt/", import.meta.url);

  if (!existsSync(dir)) {
    return null;
  }

  const file = readdirSync(dir).find((name) => /^entry\..*\.css$/.test(name));

  return file ? readFileSync(new URL(file, dir), "utf8") : null;
};

test("собранный entry.css: переменные темы на корне объявлены только в слое", (t) => {
  const css = readBuiltEntryCss();

  if (!css) {
    t.skip("сборки нет — сначала npm run build");
    return;
  }

  assert.deepEqual(unlayeredThemeDeclarations(css), []);
});
