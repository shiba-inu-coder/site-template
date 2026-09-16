// Чистый модуль: контраст WCAG без библиотек, чтобы панель и сайт считали
// его одинаково без общей зависимости.

import type { UiToken } from "./ui-theme";

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace("#", "").trim();
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalized;
  const int = Number.parseInt(full, 16);

  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
const channelLuminance = (channel: number): number => {
  const ratio = channel / 255;
  return ratio <= 0.03928
    ? ratio / 12.92
    : Math.pow((ratio + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
};

export const contrastRatio = (hexA: string, hexB: string): number => {
  const lighter = Math.max(relativeLuminance(hexA), relativeLuminance(hexB));
  const darker = Math.min(relativeLuminance(hexA), relativeLuminance(hexB));

  return (lighter + 0.05) / (darker + 0.05);
};

export interface ContrastPairDef {
  id: string;
  label: string;
  fg: UiToken;
  bg: UiToken;
  required: boolean;
}

// Семь обязательных пар — гейт пресета (`ui-presets.test.js`, 1e/6a). Ещё
// четыре информационные: не блокируют пресет, но входят в отчёт, потому что
// у них тоже случается text-on-text.
export const CONTRAST_PAIRS: ContrastPairDef[] = [
  {
    id: "text-page",
    label: "Текст на странице",
    fg: "text",
    bg: "page-bg",
    required: true,
  },
  {
    id: "heading-page",
    label: "Заголовок на странице",
    fg: "heading",
    bg: "page-bg",
    required: true,
  },
  {
    id: "cta-text-cta-bg",
    label: "Текст кнопки CTA",
    fg: "cta-text",
    bg: "cta-bg",
    required: true,
  },
  {
    id: "text-card",
    label: "Текст на карточке",
    fg: "text",
    bg: "card-bg",
    required: true,
  },
  {
    id: "link-page",
    label: "Ссылка на странице",
    fg: "link",
    bg: "page-bg",
    required: true,
  },
  {
    id: "badge-text-badge-bg",
    label: "Текст бейджа",
    fg: "badge-text",
    bg: "badge-bg",
    required: true,
  },
  {
    id: "table-head-text-bg",
    label: "Текст шапки таблицы",
    fg: "table-head-text",
    bg: "table-head-bg",
    required: true,
  },
  {
    id: "card-title-card",
    label: "Заголовок карточки",
    fg: "card-title",
    bg: "card-bg",
    required: false,
  },
  {
    id: "text-table-row",
    label: "Текст в строке таблицы",
    fg: "text",
    bg: "table-row",
    required: false,
  },
  {
    id: "text-table-row-alt",
    label: "Текст в чётной строке таблицы",
    fg: "text",
    bg: "table-row-alt",
    required: false,
  },
  {
    id: "text-panel",
    label: "Текст на панели",
    fg: "text",
    bg: "panel-bg",
    required: false,
  },
];

export type ContrastLevel = "AAA" | "AA" | "AA-large" | "fail";

const levelFor = (ratio: number): ContrastLevel => {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
};

export interface ContrastReportEntry {
  pair: string;
  ratio: number;
  level: ContrastLevel;
}

export const contrastReport = (
  resolved: Record<UiToken, string>,
): ContrastReportEntry[] =>
  CONTRAST_PAIRS.map(({ id, fg, bg }) => {
    const ratio = contrastRatio(resolved[fg], resolved[bg]);

    return {
      pair: id,
      ratio: Math.round(ratio * 100) / 100,
      level: levelFor(ratio),
    };
  });
