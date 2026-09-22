<template>
  <nav
    class="site-header bg-ui-header-bg fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between gap-3 p-primary-1 px-3 md:px-8"
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
  </nav>
</template>

<script setup lang="ts">
import type { HeaderItem } from "#shared/types";
import HeaderNavItem from "./HeaderNavItem.vue";

const siteConfig = useSiteConfig();

const headerItems = computed<HeaderItem[]>(
  () => siteConfig.value.layout.header.items || [],
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
</script>
