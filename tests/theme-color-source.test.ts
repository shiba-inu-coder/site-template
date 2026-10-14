// Цвет элементов идёт только через `ui-*`. `surface-*` живёт ради
// `color-scheme`, сайтов без темы и старых записей схемы — в блоках дефолтов
// `tailwind.css`, а не в классах компонентов: такой класс не слушает ни схему,
// ни оператора, и текст статьи оказывается цвета режима, а не «Основного
// текста».
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";

const ROOT = new URL("../", import.meta.url);

const stripBlocks = (css: string, opening: RegExp): string => {
  let result = css;

  for (let match = opening.exec(result); match; match = opening.exec(result)) {
    let depth = 1;
    let end = match.index + match[0].length;

    while (depth > 0 && end < result.length) {
      depth += result[end] === "{" ? 1 : result[end] === "}" ? -1 : 0;
      end += 1;
    }

    result = result.slice(0, match.index) + result.slice(end);
  }

  return result;
};

const vueFiles = (dir: URL): URL[] =>
  readdirSync(dir).flatMap((name) => {
    const url = new URL(name, dir);

    if (statSync(url).isDirectory()) {
      return vueFiles(new URL(`${name}/`, dir));
    }

    return name.endsWith(".vue") ? [url] : [];
  });

test("tailwind.css: var(--color-surface-*) только в блоках дефолтов", () => {
  const css = readFileSync(
    new URL("app/assets/css/tailwind.css", ROOT),
    "utf8",
  );
  const outside = stripBlocks(
    stripBlocks(css.replace(/\/\*[\s\S]*?\*\//g, ""), /@theme\b[^{]*\{/),
    /@layer theme\s*\{/,
  );

  assert.deepEqual(outside.match(/var\(--color-surface-[\w-]+\)/g) ?? [], []);
});

test("компоненты: ни одного класса вида *-surface-*", () => {
  const offenders = vueFiles(new URL("app/", ROOT)).flatMap((file) => {
    const source = readFileSync(file, "utf8");

    return [
      ...(source.match(
        /[\w:\-/[\]]*-surface-(?:text|muted|raised|on-brand)/g,
      ) ?? []),
      ...(source.match(/var\(--color-surface-[\w-]+\)/g) ?? []),
    ].map((hit) => `${file.pathname.split("/app/")[1]}: ${hit}`);
  });

  assert.deepEqual(offenders, []);
});
