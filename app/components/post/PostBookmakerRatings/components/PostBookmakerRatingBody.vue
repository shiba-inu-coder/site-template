<template>
  <!-- BOX 1  -->
  <div class="space-y-3 py-4 px-3 md:p-primary-1 bg-ui-card-bg">
    <div class="grid md:grid-cols-3 gap-3">
      <div class="">
        <PostBookmakerRatingTitle
          :title="t.minDeposit"
          icon="client/deposit"
        ></PostBookmakerRatingTitle>
        <div class="bookmaker-rating__text">
          {{ bookmaker.minimumDeposit }}
        </div>
      </div>
      <div>
        <PostBookmakerRatingTitle
          :title="t.payoutSpeed"
          icon="client/speed"
        ></PostBookmakerRatingTitle>
        <div class="bookmaker-rating__text">
          {{ bookmaker.payoutsSpeed }}
        </div>
      </div>
      <div>
        <PostBookmakerRatingTitle
          :title="t.licence"
          icon="client/licence"
        ></PostBookmakerRatingTitle>
        <span class="bookmaker-rating__text">{{ bookmaker.licence }}</span>
      </div>
      <div>
        <PostBookmakerRatingTitle
          :title="t.mobileApp"
          icon="client/mobile"
        ></PostBookmakerRatingTitle>

        <div
          v-if="bookmaker.mobileApps.length"
          class="flex items-center space-x-2 mb-2 pl-8"
        >
          <svg-icon
            v-if="bookmaker.mobileApps.includes('ios')"
            name="client/brand-apple"
            class="text-step-5 text-ui-text"
          ></svg-icon>
          <svg-icon
            v-if="bookmaker.mobileApps.includes('android')"
            name="client/brand-android"
            class="text-step-5 text-ui-text"
          ></svg-icon>
        </div>
        <div
          v-else
          class="bookmaker-rating__text"
        >
          {{ t.no }}
        </div>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <PostBookmakerRatingTitle
          :title="t.paymentMethods"
          icon="client/card"
        ></PostBookmakerRatingTitle>
        <div class="pl-4">
          <PostBookmakerListLogos :items="bookmaker.paymentMethods" />
        </div>
      </div>
      <div>
        <PostBookmakerRatingTitle
          :title="t.bestFeatures"
          icon="client/list"
        ></PostBookmakerRatingTitle>
        <ul class="bookmaker-rating__text my-0">
          <li
            v-for="(benefit, i) in bookmaker.benefits"
            :key="i"
          >
            {{ benefit }}
          </li>
        </ul>
      </div>
    </div>

    <div>
      <PostBookmakerRatingTitle
        :title="t.sportsBetting"
        icon="client/dice"
      ></PostBookmakerRatingTitle>
      <div class="bookmaker-rating__text">
        {{ sports }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PostBookmakerListLogos from "./PostBookmakerListLogos.vue";
import PostBookmakerRatingTitle from "./PostBookmakerRatingTitle.vue";
import { seoConfig } from "@@/seo.conf";

const t = seoConfig.translates.entity;

const { bookmaker } = defineProps<{
  bookmaker: PostBookmakerRatingEntity;
}>();

const sports = computed(
  () =>
    [...bookmaker.sports].map((gameType) => gameType.title)?.join(", ") || "",
);
</script>
<style scoped lang="css">
.bookmaker-rating__text {
  margin-bottom: calc(var(--spacing) * 1);
  display: block;
  font-size: var(--text-step-3);
  line-height: 1.5;
  font-weight: 400;
  padding-left: calc(var(--spacing) * 8);
  color: var(--color-ui-text);
}
</style>
