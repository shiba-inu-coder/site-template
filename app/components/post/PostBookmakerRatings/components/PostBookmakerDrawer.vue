<template>
  <div
    :class="{
      'translate-x-0': model,
      '-translate-x-full': !model,
    }"
    class="fixed top-0 start-0 transition-all duration-500 transform h-full w-full z-[999] bg-primary-300/50"
    role="dialog"
    tabindex="-1"
    @click.self="emit('update:modelValue', false)"
  >
    <div
      class="max-w-4xl w-full relative h-full overflow-scroll border-x-2 border-primary-300 bg-primary-200"
    >
      <div
        class="flex justify-between items-center p-primary-1 border-y-2 border-primary-300"
      >
        <div class="flex items-center gap-x-2">
          <NuxtImg
            provider="cloudinary"
            width="40"
            height="40"
            :alt="bookmaker.logo.alt"
            loading="lazy"
            :modifiers="seoConfig.img.modifiers"
            :src="bookmaker.logo.path"
          ></NuxtImg>
          <span class="font-semibold text-step-4">{{ bookmaker.title }}</span>
        </div>
        <button
          type="button"
          class="focus:outline-hidden text-active-200 transition-colors duration-500 ease-in-out hover:text-active-300 text-step-2 focus:text-surface-text"
          @click="emit('update:modelValue', false)"
        >
          <svg-icon name="client/close-round" />
        </button>
      </div>
      <PostCasinoRatingBody :bookmaker="bookmaker"></PostCasinoRatingBody>
      <div
        class="flex justify-center items-center p-primary-1 border-y-2 border-primary-300"
      >
        <nuxt-link
          class="font-semibold px-12 py-1 rounded-primary inline-flex justify-center transition-all focus:outline-none focus:ring-2 text-center border border-transparent bg-active-200 text-surface-text hover:bg-active-300 focus:bg-active-300 text-step-6"
          >{{ seoConfig.translates.playNow }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostCasinoRatingBody from "./PostBookmakerRatingBody.vue";
import { seoConfig } from "@@/seo.conf";
const model = defineModel({ type: Boolean });

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const { bookmaker } = defineProps<{
  index: number;
  bookmaker: PostBookmakerRatingEntity;
}>();

watch(model, () => {
  if (model.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>
