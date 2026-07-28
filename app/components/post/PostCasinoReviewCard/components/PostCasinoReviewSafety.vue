<template>
  <div class="grid gap-3 md:grid-cols-3">
    <PostCasinoReviewInfo
      v-if="licence"
      col
      title="Licence"
      class="md:col-span-3"
      >{{ licence }}
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Šifrování SSL"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.ssl)"
        :class="getClassName(safety.ssl)"
      ></svg-icon>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Organizace zodpovědného hraní"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.responsibleGambling)"
        :class="getClassName(safety.responsibleGambling)"
      ></svg-icon>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Limity vkladů"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.depositLimits)"
        :class="getClassName(safety.depositLimits)"
      ></svg-icon>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Limity prohry"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.lossLimits)"
        :class="getClassName(safety.lossLimits)"
      ></svg-icon>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Časové limity"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.timeLimits)"
        :class="getClassName(safety.timeLimits)"
      ></svg-icon>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      title="Nástroj pro samovyloučení"
      is-mobile-row
    >
      <svg-icon
        class="block ml-2"
        :name="getIcon(safety.selfExclusionTool)"
        :class="getClassName(safety.selfExclusionTool)"
      ></svg-icon>
    </PostCasinoReviewInfo>
  </div>
</template>

<script lang="ts" setup>
import PostCasinoReviewInfo from "./PostCasinoReviewInfo.vue";
import type { ICasino } from "#shared/types";

type Props = Pick<ICasino, "licence" | "safety">;

defineProps<Props>();

const getClassName = (value: boolean) =>
  `text-2xl ${value ? "text-green-500" : "text-rose-500"}`;

const getIcon = (value: boolean) =>
  value ? "client/check" : "client/close-round";
</script>
