<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="space-y-4">
      <PostCasinoReviewInfo
        v-if="numberCasinosGame"
        title="Počet her"
        col
        >{{ numberCasinosGame }}</PostCasinoReviewInfo
      >
      <PostCasinoReviewInfo
        col
        title="Sportovní sázení"
        >{{ sportsBetting ? "Ano" : "No" }}</PostCasinoReviewInfo
      >
      <PostCasinoReviewInfo
        v-if="gameTypesList"
        col
        title="Typy her"
        >{{ gameTypesList }}</PostCasinoReviewInfo
      >
    </div>
    <PostCasinoReviewInfo
      v-if="softwareProviders.length"
      col
      title="Poskytovatelé softwaru"
    >
      <PostCasinoReviewList :items="softwareProviders"></PostCasinoReviewList>
    </PostCasinoReviewInfo>
  </div>
</template>

<script lang="ts" setup>
import PostCasinoReviewInfo from "./PostCasinoReviewInfo.vue";
import PostCasinoReviewList from "./PostCasinoReviewList.vue";
import type { ICasino } from "#shared/types";

type Props = Pick<
  ICasino<
    { title: string; order: number },
    {
      title: string;
      logo: {
        path: string;
        alt: string;
      };
    }
  >,
  "numberCasinosGame" | "sportsBetting" | "gameTypes" | "softwareProviders"
>;

const { gameTypes } = defineProps<Props>();

const gameTypesList = computed(() =>
  gameTypes.map((item) => item.title).join(", "),
);
</script>
