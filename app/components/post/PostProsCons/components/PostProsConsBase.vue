<template>
  <div class="grid gap-8 md:grid-cols-2">
    <PostProsConsItem
      type="pros"
      :title="seoConfig.translates.shortcodes.prosAndCons.pros"
      :list="prosList"
    ></PostProsConsItem>
    <PostProsConsItem
      type="cons"
      :title="seoConfig.translates.shortcodes.prosAndCons.cons"
      :list="consList"
    ></PostProsConsItem>
  </div>
</template>
<script setup lang="ts">
import PostProsConsItem from "./PostProsConsItem.vue";
import { seoConfig } from "@@/seo.conf";

const { prosList, consList } = defineProps<{
  prosList: string[];
  consList: string[];
}>();
</script>
