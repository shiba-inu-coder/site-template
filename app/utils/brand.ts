import type { Component } from "vue";
import type { UiTheme } from "#shared/utils/ui-theme";

// Папки `brand/` может не быть: тогда glob отдаёт пустой объект, и сайт
// рендерит стандартные части. Eager — чтобы свой компонент попал и в SSR,
// и в гидрацию без асинхронной подгрузки. Корень проекта задаётся алиасом
// `~~`: голый `/brand/…` Vite у Nuxt считает от другой папки и ничего не
// находит. Ключи приходят как `../brand/X.vue`, поэтому поиск по суффиксу.
const parts = import.meta.glob<{ default: Component }>("~~/brand/*.vue", {
  eager: true,
});
const blocks = import.meta.glob<{ default: Component }>(
  "~~/brand/blocks/*.vue",
  { eager: true },
);
const theme = import.meta.glob<UiTheme>("~~/brand/theme.json", {
  eager: true,
  import: "default",
});
const site = import.meta.glob<DeepPartial<SiteConfig>>("~~/brand/site.json", {
  eager: true,
  import: "default",
});

export type BrandPart = "Header" | "Footer" | "Hero";

const first = <T>(found: Record<string, T>): T | null =>
  Object.values(found)[0] ?? null;

export const getBrandPart = (name: BrandPart): Component | null => {
  const key = Object.keys(parts).find((k) => k.endsWith(`/brand/${name}.vue`));

  return key ? parts[key].default : null;
};

export const getBrandBlocks = (): Record<string, Component> =>
  Object.fromEntries(
    Object.entries(blocks).map(([path, module]) => [
      path.replace(/^.*\/([^/]+)\.vue$/, "$1"),
      module.default,
    ]),
  );

export const getBrandTheme = (): UiTheme | null => first(theme);

export const getBrandSite = (): DeepPartial<SiteConfig> | null => first(site);
