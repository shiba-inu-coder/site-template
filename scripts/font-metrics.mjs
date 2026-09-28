#!/usr/bin/env node
/**
 * Пересобирает `server/lib/font-metrics.json` — метрики, по которым сервер
 * строит запасной @font-face для шрифтов темы:
 *
 *   node scripts/font-metrics.mjs
 *
 * Источник — devDependency `@capsizecss/metrics` (данные Google Fonts плюс
 * системные шрифты). Сам пакет в образ не едет: распакованный он весит
 * ~28 МБ, а серверу нужны шесть чисел на семейство. Обновил пакет — прогони
 * скрипт и закоммить таблицу.
 */
import { writeFileSync } from "node:fs";
import { entireMetricsCollection } from "@capsizecss/metrics/entireMetricsCollection";

// Та же проверка, что `normalizeFontFamily`: имя из таблицы уходит в CSS как
// есть, и `-apple-system` туда не нужен.
const FAMILY_NAME = /^[A-Za-z0-9 ]{1,64}$/;

const rows = Object.values(entireMetricsCollection)
  .filter((font) => FAMILY_NAME.test(font.familyName))
  .map((font) => {
    const widths = {};

    for (const [variant, metrics] of Object.entries(font.variants ?? {})) {
      if (!variant.includes("italic")) {
        widths[variant === "regular" ? 400 : Number(variant)] =
          metrics.xWidthAvg;
      }
    }

    if (!Object.keys(widths).length) {
      widths[400] = font.xWidthAvg;
    }

    return [
      font.familyName,
      [
        font.category,
        font.unitsPerEm,
        font.ascent,
        font.descent,
        font.lineGap,
        widths,
      ],
    ];
  })
  .sort(([a], [b]) => a.localeCompare(b));

writeFileSync(
  new URL("../server/lib/font-metrics.json", import.meta.url),
  `{\n${rows
    .map(([name, row]) => `${JSON.stringify(name)}:${JSON.stringify(row)}`)
    .join(",\n")}\n}\n`,
);

console.log(`font-metrics.json: ${rows.length} семейств`);
