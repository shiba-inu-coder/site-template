<template>
  <div class="grid gap-8 md:grid-cols-2">
    <PostProsConsItem
      type="pros"
      :title="siteConfig.translates.shortcodes.prosAndCons.pros"
      :list="prosList"
    ></PostProsConsItem>
    <PostProsConsItem
      type="cons"
      :title="siteConfig.translates.shortcodes.prosAndCons.cons"
      :list="consList"
    ></PostProsConsItem>
  </div>
</template>
<script setup lang="ts">
import PostProsConsItem from "./PostProsConsItem.vue";

const siteConfig = useSiteConfig();

defineProps<{
  prosList: string[];
  consList: string[];
}>();
</script>
