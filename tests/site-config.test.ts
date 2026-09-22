// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node — `site-config.ts`, в отличие от `ui-theme.ts`/`ui-presets.ts`, не
// тянет ни одного алиаса, поэтому в package.json#imports ничего добавлять
// не пришлось.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSiteConfig } from "../shared/utils/site-config.ts";

const template: DeepPartial<SiteConfig> = {
  site: { name: "", lang: "en", theme: "light", brandSlug: "" },
  logo: { src: "", alt: "", width: 0, height: 0 },
  favicon: { src: "" },
  img: { modifiers: { roundCorner: "15" } },
  layout: {
    header: {
      items: [],
      cta: { label: "", link: "", note: "" },
    },
    footer: { title: "", body: "", links: [], legalLogos: [] },
    breadcrumbs: { homeLabel: "" },
  },
  translates: { showMore: "Show more", showLess: "Show less" },
};

const buildMessageSettings = (): ISettingPublic => ({
  redirectsRoutes: [],
  brand: {
    name: "Test Casino",
    lang: "ru",
    brandSlug: "test-casino",
    logo: { src: "site/logo", alt: "Test Casino logo", width: 200, height: 60 },
    favicon: { src: "site/favicon" },
    imgRoundCorner: "8",
  },
  layout: {
    header: {
      items: [
        {
          kind: "page",
          label: "Bonuses",
          link: "/bonuses",
          style: "primary",
          position: "left",
        },
      ],
      cta: { label: "Play", link: "https://example.com/go", note: "" },
    },
    footer: {
      title: "Test Casino",
      body: "Real footer body",
      links: [{ name: "Contacts", link: "/contacts" }],
      legalLogos: [],
    },
    breadcrumbs: { homeLabel: "Главная" },
  },
  strings: { showMore: "Показать больше" },
  uiTheme: null,
});

test("buildSiteConfig: бренд, шапка, подвал и переводы из settings ложатся в конфиг", () => {
  const settings = buildMessageSettings();
  const config = buildSiteConfig(template, settings);

  assert.equal(config.site.name, "Test Casino");
  assert.equal(config.site.lang, "ru");
  assert.equal(config.logo.src, "site/logo");
  assert.equal(config.favicon.src, "site/favicon");
  assert.equal(config.layout.header.items.length, 1);
  assert.equal(config.layout.header.items[0].label, "Bonuses");
  assert.equal(config.layout.footer.title, "Test Casino");
  assert.equal(config.translates.showMore, "Показать больше");
});

test("buildSiteConfig: пустая строка в settings не затирает дефолт шаблона", () => {
  const settings = buildMessageSettings();
  settings.brand = { ...settings.brand, imgRoundCorner: "" };
  settings.strings = { showMore: "" };

  const config = buildSiteConfig(template, settings);

  assert.equal(config.img.modifiers.roundCorner, "15");
  assert.equal(config.translates.showMore, "Show more");
});

test("buildSiteConfig: uiTheme из settings не просачивается в конфиг сайта и не меняется", () => {
  const settings = buildMessageSettings();
  const config = buildSiteConfig(template, settings);

  assert.equal("uiTheme" in config, false);
  assert.equal(settings.uiTheme, null);
});
