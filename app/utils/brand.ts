import type { Component } from "vue";

// Папки `brand/` может не быть: тогда glob отдаёт пустой объект, и сайт
// рендерит стандартные части. Eager — чтобы свой компонент попал и в SSR,
// и в гидрацию без асинхронной подгрузки. Корень проекта задаётся алиасом
// `~~`: голый `/brand/…` Vite у Nuxt считает от другой папки и ничего не
// находит.
const modules = import.meta.glob<{ default: Component }>("~~/brand/*.vue", {
  eager: true,
});

export type BrandPart = "Header" | "Footer" | "Hero";

export function getBrandPart(name: BrandPart): Component | null {
  const key = Object.keys(modules).find((k) => k.endsWith(`/brand/${name}.vue`));
  return key ? modules[key].default : null;
}
