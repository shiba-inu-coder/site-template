// node:test запускает этот файл напрямую через нативную поддержку TS в
// Node — `site-config.ts`, в отличие от `ui-theme.ts`/`ui-presets.ts`, не
// тянет ни одного алиаса, поэтому в package.json#imports ничего добавлять
// не пришлось.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyNavigation,
  buildSiteConfig,
  resolvePageLang,
} from "../shared/utils/site-config.ts";

const template: DeepPartial<SiteConfig> = {
  site: { name: "", lang: "en", theme: "light", brandSlug: "" },
  logo: { src: "", alt: "", width: 0, height: 0 },
  favicon: { src: "" },
  banner: { path: "", alt: "", width: 0, height: 0 },
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

test("язык страницы: пост перекрывает сайт, пустой — не перекрывает", () => {
  const site = { lang: "en" };

  assert.equal(resolvePageLang({ lang: "de-DE" }, site), "de-DE");
  assert.equal(resolvePageLang({ lang: "" }, site), "en");
  assert.equal(resolvePageLang(undefined, site), "en");
});

test("buildSiteConfig: общий баннер из settings.brand ложится в конфиг, без него поле пустое", () => {
  const settings = buildMessageSettings();

  assert.equal(buildSiteConfig(template, settings).banner.path, "");

  settings.brand = {
    ...settings.brand,
    banner: { path: "site/banner", alt: "Баннер", width: 1200, height: 600 },
  };

  const { banner } = buildSiteConfig(template, settings);

  assert.equal(banner.path, "site/banner");
  assert.equal(banner.alt, "Баннер");
});

const customSite: DeepPartial<SiteConfig> = {
  layout: {
    header: {
      items: [
        { kind: "logo", label: "", style: "link", position: "left" },
        {
          kind: "page",
          label: "Старое",
          link: "/old/",
          style: "link",
          position: "center",
        },
        {
          kind: "page",
          label: "Ещё",
          link: "/more/",
          style: "outline",
          position: "center",
        },
        { kind: "ref", label: "Играть", style: "primary", position: "right" },
      ],
    },
  },
};

test("навигация из панели заменяет page-пункты, логотип и ref остаются на местах", () => {
  const settings = buildMessageSettings();
  settings.navigation = {
    headerLinks: [
      { label: "Бонусы", link: "/bonusy/" },
      { label: "Слоты", link: "/sloty/" },
    ],
  };

  const { items } = buildSiteConfig(template, settings, customSite).layout
    .header;

  assert.deepEqual(
    items.map((item) => [item.kind, item.label]),
    [
      ["logo", ""],
      ["page", "Бонусы"],
      ["page", "Слоты"],
      ["ref", "Играть"],
    ],
  );
  assert.equal(items[1].position, "center");
  assert.equal(items[1].style, "link");
  assert.equal(items[3].position, "right");
});

test("навигация из панели без page-пунктов в шапке встаёт сразу после логотипа", () => {
  const config = buildSiteConfig(template, null, {
    layout: {
      header: {
        items: [
          { kind: "ref", label: "Играть", style: "primary", position: "right" },
          { kind: "logo", label: "", style: "link", position: "left" },
        ],
      },
    },
  });

  const { items } = applyNavigation(config, {
    headerLinks: [{ label: "Бонусы", link: "/bonusy/" }],
  }).layout.header;

  assert.deepEqual(
    items.map((item) => item.kind),
    ["ref", "logo", "page"],
  );
  assert.equal(items[2].position, "left");
  assert.equal(items[2].style, "link");
});

test("навигация из панели: подвал заменяется, пустые поля не перекрывают", () => {
  const settings = buildMessageSettings();
  const base = buildSiteConfig(template, settings);

  const filled = applyNavigation(base, {
    footerLinks: [{ name: "Kontakt", link: "/kontakt/" }],
    footerTitle: "Новый",
    footerBody: "<p>18+</p>",
  }).layout.footer;

  assert.deepEqual(filled.links, [{ name: "Kontakt", link: "/kontakt/" }]);
  assert.equal(filled.title, "Новый");
  assert.equal(filled.body, "<p>18+</p>");

  const empty = applyNavigation(base, {
    headerLinks: [],
    footerLinks: [],
    footerTitle: "",
    footerBody: "",
  });

  assert.deepEqual(empty.layout, base.layout);
});

test("без navigation конфиг не меняется", () => {
  const settings = buildMessageSettings();
  const base = buildSiteConfig(template, settings, customSite);

  assert.equal(applyNavigation(base, null), base);
  assert.equal(applyNavigation(base, undefined), base);
});

test("навигация из формы (explicit): удалённое не возвращается из вёрстки", () => {
  const settings = buildMessageSettings();
  const base = buildSiteConfig(template, settings, customSite);

  assert.ok(base.layout.footer.links.length > 0 || base.layout.footer.body);

  const { header, footer } = applyNavigation(base, {
    headerLinks: [],
    footerLinks: [],
    footerTitle: "",
    footerBody: "",
    explicit: true,
  }).layout;

  assert.deepEqual(footer.links, []);
  assert.equal(footer.title, "");
  assert.equal(footer.body, "");
  assert.equal(header.items.filter((i) => i.kind === "page").length, 0);
  assert.equal(
    header.items.length,
    base.layout.header.items.filter((i) => i.kind !== "page").length,
  );
});

test("навигация из формы (explicit): непустое поле по-прежнему заменяет", () => {
  const base = buildSiteConfig(template, buildMessageSettings(), customSite);

  const { footer } = applyNavigation(base, {
    footerLinks: [{ name: "Kontakt", link: "/kontakt/" }],
    footerTitle: "",
    footerBody: "<p>18+</p>",
    explicit: true,
  }).layout;

  assert.deepEqual(footer.links, [{ name: "Kontakt", link: "/kontakt/" }]);
  assert.equal(footer.body, "<p>18+</p>");
});

test("навигация без explicit: пустое значение, как и раньше, уступает вёрстке", () => {
  const base = buildSiteConfig(template, buildMessageSettings(), customSite);

  const empty = applyNavigation(base, {
    headerLinks: [],
    footerLinks: [],
    footerTitle: "",
    footerBody: "",
    explicit: false,
  });

  assert.deepEqual(empty.layout, base.layout);
});
