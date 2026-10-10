<template>
  <span
    v-if="inline && inlineSize.framed"
    class="mr-1.5 inline-flex items-center justify-center align-middle"
    :style="{
      width: `${inlineSize.width}px`,
      height: `${inlineSize.height}px`,
    }"
  >
    <NuxtImg
      provider="cloudinary"
      width="auto"
      :height="(inlineSize.height ?? 0) * 2"
      class="h-auto w-auto max-h-full max-w-full object-contain"
      :alt="altImg"
      :src="srcImg"
      :modifiers="siteConfig.img.modifiers"
    ></NuxtImg>
  </span>
  <span
    v-else-if="inline"
    class="inline-flex align-middle mr-1.5"
  >
    <NuxtImg
      provider="cloudinary"
      :width="inlineSize.width ?? 'auto'"
      :height="inlineSize.height ?? 'auto'"
      :alt="altImg"
      :src="srcImg"
      :modifiers="siteConfig.img.modifiers"
    ></NuxtImg>
  </span>
  <div
    v-else-if="logo"
    class="mx-auto flex h-[60px] w-[120px] max-w-full items-center justify-center"
  >
    <NuxtImg
      provider="cloudinary"
      width="auto"
      height="120"
      class="h-auto w-auto max-h-full max-w-full object-contain"
      :alt="altImg"
      :src="srcImg"
      :modifiers="siteConfig.img.modifiers"
    ></NuxtImg>
  </div>
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
import { dataTableImageSize } from "#shared/utils/data-table-image-size";

const siteConfig = useSiteConfig();

// `logo` — рамка 120×60 под лого казино: квадратное и вытянутое лого стоят в
// одинаковой колонке, место занято до загрузки файла.
const { name, alt, width, height, inline, logo } = defineProps<{
  name: string;
  alt?: string;
  width?: string;
  height?: string;
  inline?: boolean;
  logo?: boolean;
}>();

const inlineSize = inject(
  DATA_TABLE_IMAGE_SIZE_KEY,
  computed(() => dataTableImageSize(undefined, undefined)),
);

const srcImg = computed(() => name);
const altImg = computed(() => alt || name);
const widthImg = computed(() => width || "70");
const heightImg = computed(() => height || "auto");
</script>
