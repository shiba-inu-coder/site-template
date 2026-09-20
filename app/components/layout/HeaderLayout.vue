<template>
  <nav
    class="site-header group bg-ui-header-bg fixed left-0 right-0 top-0 z-50"
  >
    <VariantPicker v-bind="UI_VARIANT_PICKERS.header"></VariantPicker>
    <div
      v-if="variant === 'two-row' && hasTopbar"
      class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-ui-panel-border px-3 py-1.5 text-step-9 text-ui-muted md:px-8"
    >
      <span
        v-for="(note, i) in topbar.items"
        :key="i"
        >{{ note }}</span
      >
      <span
        v-if="topbar.note"
        class="ml-auto text-ui-link"
        >{{ topbar.note }}</span
      >
    </div>

    <div
      v-if="variant === 'centered'"
      class="flex flex-col items-center gap-2 p-primary-1 px-3 md:px-8"
    >
      <div class="flex items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in logoItems"
          :key="i"
          :item="item"
        />
      </div>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in [...navItems, ...ctaItems]"
          :key="i"
          :item="item"
        />
      </div>
    </div>

    <div
      v-else-if="variant === 'compact'"
      class="flex items-center justify-between gap-3 p-primary-1 px-3 md:px-8"
    >
      <div class="flex items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in logoItems"
          :key="i"
          :item="item"
        />
      </div>
      <div class="flex items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in ctaItems"
          :key="i"
          :item="item"
        />
        <button
          type="button"
          class="grid size-9 shrink-0 place-items-center gap-1 rounded-primary border border-ui-panel-border p-2"
          :aria-expanded="isMenuOpen"
          :aria-label="siteConfig.translates.menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span
            v-for="i in 3"
            :key="i"
            class="block h-0.5 w-full bg-ui-text"
          ></span>
        </button>
      </div>
    </div>

    <div
      v-else-if="variant === 'search'"
      class="flex flex-wrap items-center gap-3 p-primary-1 px-3 md:px-8"
    >
      <HeaderNavItem
        v-for="(item, i) in logoItems"
        :key="`logo-${i}`"
        :item="item"
      />
      <form
        action="/search/"
        method="get"
        class="order-last w-full grow md:order-none md:w-auto md:max-w-[320px]"
      >
        <input
          name="q"
          type="search"
          :placeholder="siteConfig.translates.search"
          :aria-label="siteConfig.translates.search"
          class="w-full rounded-full border border-ui-panel-border bg-ui-input-bg px-4 py-1.5 text-step-8 text-ui-text"
        />
      </form>
      <div class="ml-auto flex flex-wrap items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in [...navItems, ...ctaItems]"
          :key="`menu-${i}`"
          :item="item"
        />
      </div>
    </div>

    <div
      v-else
      class="flex w-full items-center justify-between gap-3 p-primary-1 px-3 md:px-8"
    >
      <div class="flex items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in leftItems"
          :key="i"
          :item="item"
        />
      </div>
      <div class="flex items-center gap-3">
        <HeaderNavItem
          v-for="(item, i) in centerItems"
          :key="i"
          :item="item"
        />
      </div>
      <div class="flex items-center gap-3.5">
        <HeaderNavItem
          v-for="(item, i) in rightItems"
          :key="i"
          :item="item"
        />
      </div>
    </div>

    <div
      v-if="variant === 'compact' && isMenuOpen"
      class="flex flex-col items-start gap-3 border-t border-ui-panel-border px-3 py-4 md:px-8"
    >
      <HeaderNavItem
        v-for="(item, i) in navItems"
        :key="i"
        :item="item"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { HeaderItem } from "#shared/types";
import { pickVariant } from "#shared/utils/block-variant";
import { UI_VARIANT_PICKERS } from "#shared/constants/ui-variant-options";
import VariantPicker from "#rc/components/layout/VariantPicker.vue";
import HeaderNavItem from "./HeaderNavItem.vue";

const siteConfig = useSiteConfig();
const { frame } = useUiTheme();

const VARIANTS = [
  "classic",
  "centered",
  "compact",
  "two-row",
  "search",
] as const;

const variant = computed(() =>
  pickVariant(VARIANTS, "classic", frame.value.header),
);

const isMenuOpen = ref(false);

const headerItems = computed<HeaderItem[]>(
  () => siteConfig.value.layout.header.items || [],
);

const topbar = computed(() => siteConfig.value.layout.header.topbar);
const hasTopbar = computed(
  () => Boolean(topbar.value.items?.length) || Boolean(topbar.value.note),
);

// Три группы по `position` — `justify-between` разносит их по краям и центру
// шапки. Порядок внутри группы — порядок в массиве, как его собрала панель.
const byPosition = (position: HeaderItem["position"]) =>
  computed(() =>
    headerItems.value.filter((item) => item.position === position),
  );

const leftItems = byPosition("left");
const centerItems = byPosition("center");
const rightItems = byPosition("right");

// Остальные четыре варианта раскладывают шапку не по краям, а по роли: у
// `centered` логотип стоит над меню, у `compact` кнопка остаётся снаружи
// бургера — `position` такого не выражает.
const logoItems = computed(() =>
  headerItems.value.filter((item) => item.kind === "logo"),
);

// active и outline — пара кнопок («Регистрация» + «Вход»), а не кнопка и
// обычная ссылка: обе остаются снаружи бургера в compact и держатся вместе
// в конце строки в centered/search.
const isCta = (item: HeaderItem) =>
  item.style === "active" || item.style === "outline";

const ctaItems = computed(() =>
  headerItems.value.filter((item) => item.kind !== "logo" && isCta(item)),
);

const navItems = computed(() =>
  headerItems.value.filter((item) => item.kind !== "logo" && !isCta(item)),
);
</script>
