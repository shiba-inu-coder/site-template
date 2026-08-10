<template>
  <div class="h-full">
    <div
      class="h-full bg-primary-200/50 rounded-primary shadow-primary relative flex flex-col"
      @keydown.esc="toggle(false)"
    >
      <div
        class="flex flex-1 flex-col gap-x-1 gap-y-5 sm:flex-row justify-center items-center h-28 mt-3 mb-3 sm:pl-5 pl-0"
      >
        <NuxtImg
          provider="cloudinary"
          width="90"
          height="90"
          :alt="entityLogo.alt"
          :src="entityLogo.path"
          :modifiers="seoConfig.img.modifiers"
        ></NuxtImg>
        <PostCasinoRatingBonus
          :bonus-text="bonus.text"
          :bonus-title="bonus.title"
        ></PostCasinoRatingBonus>
      </div>

      <div class="flex flex-col px-10 gap-y-3">
        <div
          v-if="bonus.wager.length"
          class="flex justify-between border-b border-primary-100 pb-2 text-md"
        >
          <span class="block">Wager</span>
          <span class="block">{{ bonus.wager }}</span>
        </div>
        <div
          v-if="bonus.minDeposit.length"
          class="flex justify-between text-md"
        >
          <span>Minimální vklad</span>
          <span class="block">{{ bonus.minDeposit }}</span>
        </div>
      </div>
      <!-- Button Ref -->

      <div class="col-span-3 flex justify-between flex-col w-full mb-5">
        <span class="mx-5 pt-3 flex flex-col sm:flex-row justify-between gap-2">
          <PostButtonRef
            :slug="entitySlug"
            size="medium"
            full-width
            container-class
            variant="soft"
            :padding="false"
            component-name="CasinosRatingShortcode"
            context="Casino Rating card in Post"
            >Hrát nyní
          </PostButtonRef>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import PostCasinoRatingBonus from "./components/PostCasinoRatingBonus.vue";
import { seoConfig } from "@@/seo.conf";

const { entityLogo, entitySlug } = defineProps<{
  entityLogo: {
    path: string;
    alt: string;
  };
  entitySlug: string;
  bonus: Pick<IBonus, "title" | "text" | "wager" | "minDeposit">;
}>();

const showModal = ref(false);
const toggle = (val: boolean) => (showModal.value = val);
</script>
