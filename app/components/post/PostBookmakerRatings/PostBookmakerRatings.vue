<template>
  <div v-if="sortedList && sortedList.length">
    <div
      class="relative h-full justify-center items-start grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
    >
      <template
        v-for="(item, index) in sortedList"
        :key="index"
      >
        <PostBookmakerRatingCard
          v-show="showAll ? true : index < 9"
          :bookmaker="item.entity"
          :bonus="item.bonus"
          :index="index"
        />
      </template>
    </div>

    <div
      v-if="countBonuses > 9"
      class="flex justify-center mt-5"
    >
      <button
        v-show="!showAll"
        type="button"
        class="bg-active-200 transition duration-500 ease-in-out hover:bg-active-300 px-4 py-2 rounded-primary text-step-6 font-medium"
        @click="toggleShowAll(true)"
      >
        {{ seoConfig.translates.showMore }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import PostBookmakerRatingCard from "./PostBookmakerRatingCard.vue";
import { seoConfig } from "@@/seo.conf";

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const casinosRating = computed(() =>
  getShortcode({
    uniqId,
    shortcode: "bookmakerRatings",
  }),
);

const showAll = ref(false);
const toggleShowAll = (val: boolean) => (showAll.value = val);

const sortedList = computed(() => {
  return casinosRating.value.data.data
    .flatMap((item) =>
      item.bonuses.map((bonus) => ({
        bonus: bonus,
        entity: item.entity,
      })),
    )
    .sort((a, b) => Number(b.entity.rating) - Number(a.entity.rating));
});

const countBonuses = computed(
  () => casinosRating.value.data.data.flatMap((num) => num.bonuses).length,
);
</script>
