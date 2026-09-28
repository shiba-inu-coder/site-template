import { test } from "node:test";
import assert from "node:assert/strict";
import { fontFallback } from "../shared/utils/theme-fonts.ts";
import type { FontMetricsRow } from "../shared/utils/theme-fonts.ts";
import {
  DEFAULT_UI_THEME_DARK,
  themeFontAxes,
  themeToCssVars,
} from "../shared/utils/ui-theme.ts";
import table from "../server/lib/font-metrics.json" with { type: "json" };

const METRICS = new Map(
  Object.entries(table as unknown as Record<string, FontMetricsRow>),
);
const metricsOf = (family: string) => METRICS.get(family);

const faces = (css: string) =>
  (css.match(/@font-face \{[^}]*\}/g) ?? []).map((block) => ({
    family: /font-family: "([^"]+)"/.exec(block)?.[1],
    src: /src: ([^;]+);/.exec(block)?.[1],
    weight: Number(/font-weight: (\d+);/.exec(block)?.[1]),
    sizeAdjust: /size-adjust: ([^;]+);/.exec(block)?.[1],
  }));

test("запасной шрифт: семейства нет в таблице — ни грани, ни стека", () => {
  const { css, stacks } = fontFallback(
    ["No Such Family", "constructor"],
    [400, 700],
    metricsOf,
  );

  assert.equal(css, "");
  assert.deepEqual(stacks, {});
});

test("запасной шрифт: стоит в стеке между шрифтом темы и generic, и грань с этим именем есть", () => {
  const { css, stacks } = fontFallback(
    ["Source Sans 3"],
    [400, 700],
    metricsOf,
  );
  const [font, fallback, generic] = stacks["Source Sans 3"].split(", ");

  assert.equal(font, '"Source Sans 3"');
  assert.equal(generic, "sans-serif");
  assert.ok(faces(css).every((face) => `"${face.family}"` === fallback));
  assert.match(css, /ascent-override: [\d.]+%;/);
});

test("запасной шрифт: serif-семейство подгоняется под Times и падает в serif", () => {
  const { css, stacks } = fontFallback(["Playfair Display"], [400], metricsOf);

  assert.match(faces(css)[0].src ?? "", /^local\("Times New Roman"\)/);
  assert.match(stacks["Playfair Display"], /, serif$/);
});

test("запасной шрифт: метрический двойник системного шрифта не растягивается", () => {
  for (const family of ["Arimo", "Tinos", "Cousine"]) {
    const { css } = fontFallback([family], [400, 700], metricsOf);

    assert.deepEqual(
      faces(css).map((face) => face.sizeAdjust),
      ["100%", "100%"],
      family,
    );
  }
});

test("запасной шрифт: грань на каждый вес, жирные — от жирного системного", () => {
  const { css } = fontFallback(["Inter"], [700, 400, 500, 400], metricsOf);
  const byWeight = faces(css);

  assert.deepEqual(
    byWeight.map((face) => face.weight),
    [400, 500, 700],
  );
  assert.match(byWeight[0].src ?? "", /^local\("Arial"\)/);
  assert.match(byWeight[2].src ?? "", /^local\("Arial Bold"\)/);
  assert.notEqual(byWeight[0].sizeAdjust, byWeight[2].sizeAdjust);
});

test("запасной шрифт: вес не из шкалы CSS грани не даёт", () => {
  const { css } = fontFallback(
    ["Inter"],
    [0, 1200, Number.NaN, "bold" as never, 400],
    metricsOf,
  );

  assert.deepEqual(
    faces(css).map((face) => face.weight),
    [400],
  );
});

test("запасной шрифт: семейства и веса — те же, что уходят в Google", () => {
  const theme = {
    ...DEFAULT_UI_THEME_DARK,
    type: {
      body: { family: '"Raleway", sans-serif' },
      display: { family: "Raleway", weight: 800 },
    },
  };

  assert.deepEqual(themeFontAxes(theme), {
    families: ["Raleway"],
    weights: [400, 500, 700, 800],
  });
  assert.deepEqual(themeFontAxes(null), { families: [], weights: [] });
});

test("переменные темы: стек от сервера заменяет голый sans-serif, без него — как в панели", () => {
  const theme = {
    ...DEFAULT_UI_THEME_DARK,
    type: {
      body: { family: "Source Sans 3" },
      display: { family: "Playfair Display" },
    },
  };
  const { stacks } = fontFallback(
    themeFontAxes(theme).families,
    [400],
    metricsOf,
  );

  assert.match(
    themeToCssVars(theme, stacks),
    /--font-primary: "Source Sans 3", "Source Sans 3 Fallback: Arial", sans-serif;/,
  );
  assert.match(
    themeToCssVars(theme, stacks),
    /--font-heading: "Playfair Display", "Playfair Display Fallback: Times New Roman", serif;/,
  );
  assert.match(
    themeToCssVars(theme),
    /--font-primary: "Source Sans 3", sans-serif;/,
  );
});
