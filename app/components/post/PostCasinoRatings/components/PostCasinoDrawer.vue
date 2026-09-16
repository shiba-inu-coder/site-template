<template>
  <div
    :class="{
      'translate-x-0': model,
      '-translate-x-full': !model,
    }"
    class="fixed top-0 start-0 transition-all duration-500 transform h-full w-full z-[999] bg-ui-page-bg/50"
    role="dialog"
    tabindex="-1"
    @click.self="emit('update:modelValue', false)"
  >
    <div
      class="max-w-4xl w-full relative h-full overflow-scroll border-x-2 border-ui-panel-border bg-ui-panel-bg"
    >
      <div
        class="flex justify-between items-center p-primary-1 border-y-2 border-ui-panel-border"
      >
        <div class="flex items-center gap-x-2">
          <NuxtImg
            provider="cloudinary"
            width="40"
            height="40"
            :alt="casino.logo.alt"
            loading="lazy"
            :modifiers="seoConfig.img.modifiers"
            :src="casino.logo.path"
          ></NuxtImg>
          <span class="font-semibold text-step-4">{{ casino.title }}</span>
        </div>
        <button
          type="button"
          class="focus:outline-hidden text-ui-link transition-colors duration-500 ease-in-out hover:text-ui-link-hover text-step-2 focus:text-ui-text"
          @click="emit('update:modelValue', false)"
        >
          <svg-icon name="client/close-round" />
        </button>
      </div>
      <PostCasinoRatingBody :casino="casino"></PostCasinoRatingBody>
      <div
        class="flex justify-center items-center p-primary-1 border-y-2 border-ui-panel-border"
      >
        <nuxt-link
          class="font-semibold px-12 py-1 rounded-primary inline-flex justify-center transition-all focus:outline-none focus:ring-2 text-center border border-transparent bg-ui-cta-bg text-ui-cta-text hover:bg-ui-cta-hover focus:bg-ui-cta-hover text-step-6"
          >{{ seoConfig.translates.playNow }}</nuxt-link
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostCasinoRatingBody from "./PostCasinoRatingBody.vue";
import { seoConfig } from "@@/seo.conf";
const model = defineModel({ type: Boolean });

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const { casino } = defineProps<{
  index: number;
  casino: PostCasinoRatingEntity;
}>();

watch(model, () => {
  if (model.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>
