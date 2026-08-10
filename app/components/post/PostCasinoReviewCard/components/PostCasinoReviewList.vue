<template>
  <div class="flex flex-wrap items-center gap-2">
    <NuxtImg
      v-for="(item, i) in isAll ? sortedItems : shortList"
      :key="i"
      provider="cloudinary"
      width="75"
      height="55"
      class="rounded-primary border border-primary-100 bg-surface-raised p-0.5 app-animation-scale"
      :alt="item.logo.alt"
      format="svg"
      loading="lazy"
      :modifiers="seoConfig.img.modifiers"
      :src="item.logo.path"
    >
    </NuxtImg>
    <button
      v-if="showBtn"
      type="button"
      class="h-[50px] w-[75px] shadow-sm border border-active-200 py-1.5 text-step-7 rounded-primary font-medium text-active-200 hover:border-active-300 hover:text-active-300 focus:border-active-300 focus:outline-hidden"
      @click="toggle"
    >
      {{ btnName }}
    </button>
  </div>
</template>
<script setup lang="ts">
import { seoConfig } from "@@/seo.conf";

const { items } = defineProps<{
  items: {
    title: string;
    logo: {
      path: string;
      alt: string;
    };
  }[];
}>();

const DEFAULT_COUNT = 11;
const MAX_COUNT = items.length;
const sortedItems = computed(() =>
  [...items].sort((a, b) => a.title.localeCompare(b.title)),
);
const shortList = computed(() => sortedItems.value.slice(0, DEFAULT_COUNT));
const showBtn = computed(() => MAX_COUNT - DEFAULT_COUNT > 0);
const btnName = computed(() =>
  isAll.value ? "Sbalit" : `+${MAX_COUNT - DEFAULT_COUNT}`,
);

const isAll = ref(false);
const toggle = () => (isAll.value = !isAll.value);
</script>
