<template>
  <span
    v-if="inline"
    class="inline-flex align-middle mr-1.5"
  >
    <NuxtImg
      provider="cloudinary"
      width="auto"
      height="20"
      :alt="altImg"
      :src="srcImg"
      :modifiers="siteConfig.img.modifiers"
    ></NuxtImg>
  </span>
  <div
    v-else
    class="flex justify-center items-center"
  >
    <NuxtImg
      provider="cloudinary"
      :width="widthImg"
      :height="heightImg"
      :alt="altImg"
      :src="srcImg"
      :modifiers="siteConfig.img.modifiers"
    ></NuxtImg>
  </div>
</template>
<script lang="ts" setup>
const siteConfig = useSiteConfig();

const { name, alt, width, height, inline } = defineProps<{
  name: string;
  alt?: string;
  width?: string;
  height?: string;
  inline?: boolean;
}>();

const srcImg = computed(() => name);
const altImg = computed(() => alt || name);
const widthImg = computed(() => width || "70");
const heightImg = computed(() => height || "auto");
</script>
