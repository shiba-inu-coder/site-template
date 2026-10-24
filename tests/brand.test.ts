import { test } from "node:test";
import assert from "node:assert/strict";
import { pickUiTheme, siteThemeFontsHref } from "../shared/utils/brand.ts";
import { buildSiteConfig } from "../shared/utils/site-config.ts";
import { DEFAULT_UI_THEME_DARK } from "../shared/utils/ui-theme.ts";
import type { UiTheme } from "../shared/utils/ui-theme.ts";

const fromBase = { ...DEFAULT_UI_THEME_DARK, mode: "light" } as UiTheme;
const fromBrand = { ...DEFAULT_UI_THEME_DARK, mode: "dark" } as UiTheme;

test("pickUiTheme: настроенная тема бренда заменяет тему из базы", () => {
  assert.equal(pickUiTheme(fromBrand, fromBase), fromBrand);
});

test("pickUiTheme: без theme.json остаётся тема из базы", () => {
  assert.equal(pickUiTheme(null, fromBase), fromBase);
  assert.equal(pickUiTheme(undefined, null), null);
});

test("pickUiTheme: недонастроенная тема бренда не берётся", () => {
  const partial = { mode: "dark", colors: {} } as unknown as UiTheme;

  assert.equal(pickUiTheme(partial, fromBase), fromBase);
});

test("siteThemeFontsHref: шрифт берётся из theme.json, а не из темы в базе", () => {
  const brand = {
    ...fromBrand,
    type: { display: { family: "Raleway" }, body: { family: "Raleway" } },
  } as UiTheme;

  const href = siteThemeFontsHref(brand, fromBase);

  assert.match(href, /family=Raleway/);
  assert.doesNotMatch(href, /family=Inter/);
});

test("siteThemeFontsHref: без theme.json — шрифт темы из базы", () => {
  assert.equal(
    siteThemeFontsHref(null, fromBase),
    siteThemeFontsHref(fromBase, null),
  );
  assert.equal(siteThemeFontsHref(null, null), "");
});

test("buildSiteConfig: site.json перекрывает запись из базы, пустое — нет", () => {
  const settings = {
    brand: { name: "From DB", lang: "cs" },
    layout: null,
    strings: null,
  } as unknown as ISettingPublic;

  const config = buildSiteConfig({}, settings, {
    site: { name: "From brand", lang: "" },
  });

  assert.equal(config.site.name, "From brand");
  assert.equal(config.site.lang, "cs");
});

test("buildSiteConfig: без site.json результат прежний", () => {
  const settings = { brand: { name: "X" } } as unknown as ISettingPublic;

  assert.deepEqual(
    buildSiteConfig({}, settings),
    buildSiteConfig({}, settings, null),
  );
});
