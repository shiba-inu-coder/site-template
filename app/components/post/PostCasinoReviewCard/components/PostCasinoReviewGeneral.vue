<template>
  <div class="grid md:grid-cols-3 gap-4">
    <PostCasinoReviewInfo
      v-if="website"
      title="Webová stránka"
    >
      <nuxt-link
        target="_blank"
        class="underline text-blue-500"
        :to="
          useFakeRefLink({
            type: 'casino',
            slug,
          })
        "
        >{{ website }}</nuxt-link
      >
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      v-if="yearEstablished"
      col
      title="Rok založení"
      >{{ yearEstablished }}</PostCasinoReviewInfo
    >
    <PostCasinoReviewInfo
      v-if="owner"
      title="Majitel"
      >{{ owner }}</PostCasinoReviewInfo
    >
    <PostCasinoReviewInfo
      col
      title="Mobilní aplikace"
    >
      <div
        v-if="mobileApps.length"
        class="space-y-3"
      >
        <div class="flex items-center space-x-2">
          <svg-icon
            v-if="mobileApps.includes('ios')"
            name="client/brand-apple"
            class="text-xl text-blue-500"
          ></svg-icon>
          <svg-icon
            v-if="mobileApps.includes('android')"
            name="client/brand-android"
            class="text-xl text-blue-500"
          ></svg-icon>
        </div>
      </div>
      <div
        v-else
        class="mb-3 text-sm"
      >
        Ne
      </div>
    </PostCasinoReviewInfo>
    <PostCasinoReviewInfo
      v-if="languages"
      title="Jazyky"
      >{{ languages }}</PostCasinoReviewInfo
    >
    <div class="col-span-full grid gap-4 grid-cols-1 md:grid-cols-2">
      <PostCasinoReviewInfo
        v-if="customerServices.length"
        col
        title="Zákaznické služby"
      >
        <ul>
          <li
            v-for="(item, key) in customerServices"
            :key="key"
          >
            {{ item }}
          </li>
        </ul>
      </PostCasinoReviewInfo>
      <PostCasinoReviewInfo
        v-if="customerServices.length"
        col
        title="Výhody"
      >
        <ul>
          <li
            v-for="(benefit, i) in benefits"
            :key="i"
          >
            {{ benefit }}
          </li>
        </ul>
      </PostCasinoReviewInfo>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostCasinoReviewInfo from "./PostCasinoReviewInfo.vue";
import type { ICasino } from "#shared/types";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";

type Props = Pick<
  ICasino,
  | "mobileApps"
  | "website"
  | "languages"
  | "owner"
  | "yearEstablished"
  | "slug"
  | "customerServices"
  | "benefits"
>;

defineProps<Props>();
</script>
