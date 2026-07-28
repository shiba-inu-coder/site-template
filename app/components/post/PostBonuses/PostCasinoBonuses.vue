<template>
  <div v-if="sortedList && sortedList.length">
    <div
      class="relative h-full justify-center items-start grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
    >
      <template
        v-for="(item, index) in sortedList"
        :key="index"
      >
        <PostEntityBonusCard
          v-show="showAll ? true : index < 9"
          :entity-logo="item.entity.logo"
          :entity-slug="item.entity.slug"
          :bonus="item.bonus"
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
        class="bg-active-200 transition duration-500 ease-in-out hover:bg-active-300 px-4 py-2 rounded-primary text-primary-3 font-medium"
        @click="toggleShowAll(true)"
      >
        {{ seoConfig.translates.showMore }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import PostEntityBonusCard from "./PostEntityBonusCard.vue";
import { seoConfig } from "@@/seo.conf";

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const casinosRating = computed(() =>
  getShortcode({
    uniqId,
    shortcode: "casinoBonuses",
  }),
);

const showAll = ref(false);
const toggleShowAll = (val: boolean) => (showAll.value = val);

const sortedList = computed(() => {
  return casinosRating.value.data.data.flatMap((item) =>
    item.bonuses.map((bonus) => ({
      bonus: bonus,
      entity: item.entity,
    })),
  );
});

const countBonuses = computed(
  () => casinosRating.value.data.data.flatMap((num) => num.bonuses).length,
);
</script>
