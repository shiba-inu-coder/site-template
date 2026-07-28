<template>
  <div
    v-if="isRenderBonus"
    v-show="isVisible"
    @click="toggleGiftIconVisibility"
  >
    <div
      class="bg-active-200 border-2 transition duration-500 ease-in-out hover:bg-accent-300 border-primary-300 group rounded-primary inline-block p-2.5 left-3 z-30 fixed bottom-5 cursor-pointer"
    >
      <svg-icon
        class="size-10 block"
        name="client/gift-color"
        :filled="true"
      />
    </div>
  </div>
  <a
    v-if="isRenderBonus"
    v-show="!isVisible"
    :href="useFakeRefLink(seoConfig.site.brandSlug)"
    target="_blank"
    rel="nofollow noopener"
    data-id="ref_link"
    class="bg-primary-300 border fixed bottom-10 left-1/2 -translate-1/2 rounded-primary z-998 border-accent-300 w-[95%] md:w-[50%] px-6 py-2.5"
  >
    <button
      type="button"
      class="bg-primary-300 hover:border-accent-300 hover:text-accent-300 transition duration-500 ease-in-out text-accent-200 cursor-pointer shrink-0 absolute right-0 top-0 rounded-l-xs rounded-b-xs rounded-t-primary md:rounded-primary inline-flex justify-center w-6 h-6 items-center"
      @click.prevent="toggleGiftIconVisibility"
    >
      <svg-icon name="close" />
    </button>
    <div class="flex flex-col md:flex-row items-center justify-center gap-4">
      <NuxtImg
        provider="cloudinary"
        width="auto"
        height="40"
        :alt="banner.entity.logo.alt"
        :src="banner.entity.logo.path"
        :modifiers="seoConfig.img.modifiers"
      ></NuxtImg>
      <span class="text-active-200 font-medium text-xl text-center">
        {{ banner.text }}
      </span>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { seoConfig } from "@@/seo.conf";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";

const { banner } = usePost();
const isRenderBonus = computed(() => banner.value?.entity);

const isVisible = ref(false);
const toggleGiftIconVisibility = () => (isVisible.value = !isVisible.value);
</script>
