<template>
  <div class="h-full">
    <PostCasinoDrawer
      v-model="showModal"
      :casino="casino"
      :index="index"
    ></PostCasinoDrawer>
    <div
      class="h-full bg-primary-200/50 rounded-primary shadow-primary relative flex flex-col"
      @keydown.esc="toggle(false)"
    >
      <PostEntityRibbon v-if="casino.ribbon">
        {{ casino.ribbon }}
      </PostEntityRibbon>
      <div
        class="flex items-start mb-4"
        :class="{
          'mt-10': casino.ribbon,
          'mt-4': !casino.ribbon,
        }"
      >
        <div class="flex-1 flex justify-center">
          <NuxtImg
            provider="cloudinary"
            width="90"
            height="90"
            :alt="casino.logo.alt"
            :src="casino.logo.path"
            :modifiers="seoConfig.img.modifiers"
          ></NuxtImg>
        </div>
        <div class="flex-1 flex shrink-[0] justify-start md:justify-center">
          <div class="flex flex-col items-center shrink-[0]">
            <span class="text-left mb-[8px] block text-step-6 font-semibold">{{
              casino.title
            }}</span>
            <PostCasinoRating :rating="casino.rating"></PostCasinoRating>
          </div>
        </div>
      </div>
      <PostCasinoRatingBonus
        :bonus-text="bonus.text"
        :bonus-title="bonus.title"
      ></PostCasinoRatingBonus>

      <!-- Button Ref -->

      <div class="col-span-3 flex justify-end flex-col w-full h-full">
        <span class="mx-5 pt-3 flex flex-col sm:flex-row justify-between gap-2">
          <PostButtonRef
            :slug="casino.slug"
            size="medium"
            full-width
            container-class
            variant="soft"
            :padding="false"
            component-name="CasinosRatingShortcode"
            context="Casino Rating card in Post"
            >Hrát nyní
          </PostButtonRef>
          <nuxt-link
            v-if="casino?.reviewPost?.slug"
            :to="`/${casino?.reviewPost?.slug}/`"
            class="font-semibold rounded-primary inline-flex justify-center items-center whitespace-pre-wrap focus:outline-none focus:ring-2 text-center border text-active-200 bg-primary-200 border-active-200 hover:bg-active-200 transition duration-500 ease-in-out hover:text-surface-text focus:bg-active-300 text-step-5 py-2.5 px-2 w-full"
          >
            Přečíst recenzi
          </nuxt-link>
        </span>
        <!-- Button More Info  -->
        <button
          class="mt-3 py-2 bg-primary-200 text-step-8 text-surface-muted hover:text-surface-text transition duration-500 ease-in-out flex items-center justify-center gap-x-2 rounded-b-primary"
          @click="toggle(true)"
        >
          <span>{{ seoConfig.translates.btnMoreInfo }}</span>
          <svg-icon
            name="chevron-up"
            class="transform rotate-180 pt-0.5"
          />
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import PostCasinoDrawer from "./components/PostCasinoDrawer.vue";
import PostEntityRibbon from "./components/PostEntityRibbon.vue";
import PostCasinoRatingBonus from "./components/PostCasinoRatingBonus.vue";
import PostCasinoRating from "./components/PostCasinoRating.vue";
import { seoConfig } from "@@/seo.conf";

const {
  index,
  casino,
  isTop = false,
} = defineProps<{
  index: number;
  isTop?: boolean;
  casino: PostCasinoRatingEntity;
  bonus: Pick<IBonus, "title" | "text">;
}>();

const showModal = ref(false);
const toggle = (val: boolean) => (showModal.value = val);
</script>
