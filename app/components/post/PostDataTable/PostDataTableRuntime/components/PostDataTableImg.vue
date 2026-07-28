<template>
  <div class="flex justify-center items-center">
    <NuxtImg
      provider="cloudinary"
      :width="widthImg"
      :height="heightImg"
      :alt="altImg"
      :src="srcImg"
      :modifiers="seoConfig.img.modifiers"
    ></NuxtImg>
  </div>
</template>
<script lang="ts" setup>
import { seoConfig } from "@@/seo.conf";

const { name, alt, width, height } = defineProps<{
  name: string;
  alt?: string;
  width?: string;
  height?: string;
}>();

const srcImg = computed(() => name);
const altImg = computed(() => alt || name);
const widthImg = computed(() => width || "70");
const heightImg = computed(() => height || "auto");
</script>
