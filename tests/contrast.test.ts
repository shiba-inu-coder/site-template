import { test } from "node:test";
import assert from "node:assert/strict";
import {
  resolveScheme,
  DEFAULT_UI_THEME_DARK,
} from "../shared/utils/ui-theme.ts";

test("header-text: auto одинаков для цвета с альфой и без, в короткой и длинной записи", () => {
  const textColors = ["#ff0000", "#f00", "#ff0000ff", "#f00f"].map(
    (headerBg) =>
      resolveScheme({
        ...DEFAULT_UI_THEME_DARK,
        scheme: { ...DEFAULT_UI_THEME_DARK.scheme, "header-bg": headerBg },
      })["header-text"],
  );

  assert.equal(new Set(textColors).size, 1);
});
