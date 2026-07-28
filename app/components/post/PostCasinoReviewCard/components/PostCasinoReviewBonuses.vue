<template>
  <div>
    <div class="grid md:grid-cols-2 gap-4">
      <PostCasinoReviewInfo
        v-for="(bonus, i) in bonuses"
        :key="i"
        col
        :title="bonus.title"
        >{{ bonus.text }}</PostCasinoReviewInfo
      >
    </div>
    <PostCasinoReviewInfo
      title="VIP program"
      col
      class="my-5"
      >{{ isVipProgram ? "Ano" : "No" }}</PostCasinoReviewInfo
    >
    <div class="flex justify-center">
      <PostButtonRef
        :slug="slug"
        size="big"
        type="casino"
        :padding="false"
        >Hrát nyní
      </PostButtonRef>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostCasinoReviewInfo from "./PostCasinoReviewInfo.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

defineProps<{
  slug: string;
  isVipProgram: boolean;
  bonuses: Pick<IBonus, "title" | "text">[];
}>();
</script>
