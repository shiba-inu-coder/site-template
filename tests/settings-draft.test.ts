import { test } from "node:test";
import assert from "node:assert/strict";
import {
  overlaySettingsDraft,
  resolvePublicSettings,
} from "../shared/utils/site-config.ts";

const published: ISettingPublic = {
  redirectsRoutes: [],
  brand: {
    name: "Lucky Spin",
    logo: { src: "brands/lucky/logo", alt: "Lucky Spin", width: 200, height: 40 },
  },
  layout: { header: { cta: { label: "Play", link: "/go/lucky/", note: "" } } },
  strings: { showMore: "Show more" },
  uiTheme: { templateId: "published", mode: "dark" } as unknown as UiTheme,
};

test("частичный бренд черновика не стирает опубликованное лого", () => {
  const result = overlaySettingsDraft(published, {
    brand: { name: "Lucky Spin Casino" },
  });

  assert.equal(result.brand?.name, "Lucky Spin Casino");
  assert.deepEqual(result.brand?.logo, published.brand?.logo);
});

test("макет и строки накладываются глубоко", () => {
  const result = overlaySettingsDraft(published, {
    layout: { header: { cta: { label: "Spielen" } } },
    strings: { showLess: "Weniger" },
  });

  assert.deepEqual(result.layout?.header?.cta, {
    label: "Spielen",
    link: "/go/lucky/",
    note: "",
  });
  assert.deepEqual(result.strings, { showMore: "Show more", showLess: "Weniger" });
});

test("тема черновика заменяет опубликованную целиком, пустая — нет", () => {
  const draftTheme = { templateId: "draft", mode: "light" } as unknown as UiTheme;

  assert.deepEqual(
    overlaySettingsDraft(published, { uiTheme: draftTheme }).uiTheme,
    draftTheme,
  );
  assert.deepEqual(
    overlaySettingsDraft(published, { uiTheme: {} as UiTheme }).uiTheme,
    published.uiTheme,
  );
});

test("черновика нет — опубликованное как есть", () => {
  assert.equal(overlaySettingsDraft(published, null), published);
});

test("draft не уходит наружу ни с флагом, ни без", () => {
  const stored: ISettingStoredPublic = {
    ...published,
    draft: { brand: { name: "Draft" } },
  };

  const prod = resolvePublicSettings(stored);
  const stand = resolvePublicSettings(stored, { showDraft: true });

  assert.equal("draft" in prod, false);
  assert.equal("draft" in stand, false);
  assert.equal(prod.brand?.name, "Lucky Spin");
  assert.equal(stand.brand?.name, "Draft");
});
