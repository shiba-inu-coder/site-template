<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="space-y-4">
      <PostCasinoReviewInfo
        v-if="minimumDeposit"
        title="Minimální vklad"
        col
        >{{ minimumDeposit }}</PostCasinoReviewInfo
      >
      <PostCasinoReviewInfo
        v-if="maximumCashout"
        title="Maximální výplata"
        col
        >{{ maximumCashout }}</PostCasinoReviewInfo
      >
      <PostCasinoReviewInfo
        v-if="payoutsSpeed"
        title="Rychlost výplaty"
        col
        >{{ payoutsSpeed }}</PostCasinoReviewInfo
      >
    </div>
    <PostCasinoReviewInfo
      v-if="paymentMethods.length"
      col
      title="Platební metody"
    >
      <PostCasinoReviewList :items="paymentMethods"></PostCasinoReviewList>
    </PostCasinoReviewInfo>
  </div>
</template>

<script lang="ts" setup>
import PostCasinoReviewInfo from "./PostCasinoReviewInfo.vue";
import PostCasinoReviewList from "./PostCasinoReviewList.vue";
import type { ICasino } from "#shared/types";

type Props = Pick<
  ICasino<
    string,
    string,
    {
      title: string;
      logo: {
        path: string;
        alt: string;
      };
    }
  >,
  "paymentMethods" | "minimumDeposit" | "maximumCashout" | "payoutsSpeed"
>;

defineProps<Props>();
</script>
