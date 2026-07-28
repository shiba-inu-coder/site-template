<template>
  <div class="grid grid-cols-5 gap-2 pl-4">
    <NuxtImg
      v-for="(item, i) in isAll ? sortedItems : shortList"
      :key="i"
      provider="cloudinary"
      width="auto"
      height="45"
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
      class="border h-[45px] flex justify-center items-center border-accent-200 text-accent-300 transition py-3 text-primary-2 font-semibold duration-500 ease-in-out hover:border-accent-100 hover:text-accent-100 rounded-primary"
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

const DEFAULT_COUNT = 9;

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
