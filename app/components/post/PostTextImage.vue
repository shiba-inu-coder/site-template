<template>
  <div class="flex flex-col md:block after:block after:clear-both">
    <div
      v-if="data.img"
      class="mb-4 md:max-w-[45%]"
      :class="[
        mobileOrderClasses[data.imgMobileSide],
        sideClasses[data.imgSide],
      ]"
      :style="sizeStyle"
    >
      <NuxtImg
        loading="lazy"
        provider="cloudinary"
        class="w-full"
        :width="imgWidth"
        :height="imgHeight"
        :alt="data.img.alt"
        :src="data.img.path"
        :modifiers="{ roundCorner: data.imgRoundCorner }"
      />
    </div>

    <div
      v-if="data.text"
      v-html="data.text"
    ></div>

    <div
      v-if="data.buttonText"
      class="clear-both order-last"
    >
      <PostButtonRef
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();

// Классы перечислены целиком: tailwind.config.js сканирует только .vue,
// контент из базы он не видит, поэтому собранные строкой варианты
// (`md:float-${side}`) в сборку не попадут.
const sideClasses: Record<PostTextImage["data"]["imgSide"], string> = {
  left: "md:float-left md:mr-6",
  right: "md:float-right md:ml-6",
};

const mobileOrderClasses: Record<
  PostTextImage["data"]["imgMobileSide"],
  string
> = {
  top: "order-first",
  bottom: "order-last",
};

const FALLBACK: PostTextImage = {
  data: {
    uniqId: "",
    text: "",
    img: null,
    imgSide: "right",
    imgMobileSide: "top",
    imgWidth: "auto",
    imgHeight: "auto",
    imgRoundCorner: "0",
    buttonText: "",
    refLink: "",
  },
};

// Маркер в тексте может пережить удаление своей записи из конфига.
const data = computed(
  () => (getShortcode({ uniqId, shortcode: "textImages" }) || FALLBACK).data,
);

const toSize = (value: string) =>
  value?.trim() && !isNaN(Number(value)) ? parseInt(value) : undefined;

const imgWidth = computed(() => toSize(data.value.imgWidth));
const imgHeight = computed(() => toSize(data.value.imgHeight));

// Только числом: «auto» дало бы `autopx`, объявление отбросилось бы, и
// плавающий блок остался бы без ограничения ширины.
const sizeStyle = computed(() => ({
  ...(imgWidth.value ? { maxWidth: `${imgWidth.value}px` } : {}),
  ...(imgHeight.value ? { maxHeight: `${imgHeight.value}px` } : {}),
}));
</script>
