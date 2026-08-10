<template>
  <div class="h-full">
    <PostBookmakerDrawer
      v-model="showModal"
      :bookmaker="bookmaker"
      :index="index"
    ></PostBookmakerDrawer>
    <div
      class="h-full bg-primary-200/50 rounded-primary shadow-primary relative flex flex-col"
      @keydown.esc="toggle(false)"
    >
      <PostEntityRibbon v-if="bookmaker.ribbon">
        {{ bookmaker.ribbon }}
      </PostEntityRibbon>
      <div
        class="flex items-start mb-4"
        :class="{
          'mt-10': bookmaker.ribbon,
          'mt-4': !bookmaker.ribbon,
        }"
      >
        <div class="flex-1 flex justify-center">
          <NuxtImg
            provider="cloudinary"
            width="90"
            height="90"
            :alt="bookmaker.logo.alt"
            :src="bookmaker.logo.path"
            :modifiers="seoConfig.img.modifiers"
          ></NuxtImg>
        </div>
        <div class="flex-1 flex shrink-[0] justify-start md:justify-center">
          <div class="flex flex-col items-center shrink-[0]">
            <span class="text-left mb-[8px] block text-step-6 font-semibold">{{
              bookmaker.title
            }}</span>
            <PostBookmakerRating
              :rating="bookmaker.rating"
            ></PostBookmakerRating>
          </div>
        </div>
      </div>
      <PostBookmakerRatingBonus
        :bonus-text="bonus.text"
        :bonus-title="bonus.title"
      ></PostBookmakerRatingBonus>

      <!-- Button Ref -->

      <div class="col-span-3 flex justify-end flex-col w-full h-full">
        <span class="mx-5 pt-3 flex flex-col sm:flex-row justify-between gap-2">
          <PostButtonRef
            :slug="bookmaker.slug"
            size="medium"
            full-width
            container-class
            variant="soft"
            :padding="false"
            component-name="BookmakersRatingShortcode"
            context="Bookmaker Rating card in Post"
            >Hrát nyní
          </PostButtonRef>
        </span>
        <ul class="flex flex-col not-format px-3 mt-2">
          <li
            v-for="(benefit, i) in bookmaker.benefits"
            :key="i"
            class="flex-1 pl-2 py-1.5 text-step-9 font-medium text-left first:rounded-t-primary first:rounded-tl-primary first:rounded-tr-primary last:rounded-b-primary last:rounded-bl-primary last:rounded-br-primary"
          >
            {{ benefit }}
          </li>
        </ul>
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
import PostBookmakerDrawer from "./components/PostBookmakerDrawer.vue";
import PostEntityRibbon from "./components/PostEntityRibbon.vue";
import PostBookmakerRating from "./components/PostBookmakerRating.vue";
import PostBookmakerRatingBonus from "./components/PostBookmakerRatingBonus.vue";
import { seoConfig } from "@@/seo.conf";

const {
  index,
  bookmaker,
  isTop = false,
} = defineProps<{
  index: number;
  isTop?: boolean;
  bookmaker: PostBookmakerRatingEntity;
  bonus: Pick<IBonus, "title" | "text">;
}>();

const showModal = ref(false);
const toggle = (val: boolean) => (showModal.value = val);
</script>
