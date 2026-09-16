<template>
  <div
    v-if="variant === 'merged'"
    class="max-w-[560px] p-primary-1 rounded-primary bg-ui-panel-bg border-2 border-ui-panel-border"
  >
    <PostProsConsItem
      type="pros"
      chrome="plain"
      :list="prosList"
    ></PostProsConsItem>
    <PostProsConsItem
      type="cons"
      chrome="plain"
      :list="consList"
    ></PostProsConsItem>
  </div>

  <div
    v-else-if="variant === 'scoreboard'"
    class="grid gap-4 md:grid-cols-2"
  >
    <div class="flex flex-wrap gap-2 md:col-span-2">
      <span
        class="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full border text-step-8 font-semibold border-status-positive text-status-positive"
      >
        <svg-icon
          name="client/check"
          class="size-4"
        ></svg-icon>
        {{ prosList.length }}
        {{ seoConfig.translates.shortcodes.prosAndCons.pros }}
      </span>
      <span
        class="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full border text-step-8 font-semibold border-status-negative text-status-negative"
      >
        <svg-icon
          name="client/close-round"
          class="size-4"
        ></svg-icon>
        {{ consList.length }}
        {{ seoConfig.translates.shortcodes.prosAndCons.cons }}
      </span>
    </div>
    <PostProsConsItem
      type="pros"
      chrome="plain"
      :list="prosList"
    ></PostProsConsItem>
    <PostProsConsItem
      type="cons"
      chrome="plain"
      :list="consList"
    ></PostProsConsItem>
  </div>

  <div
    v-else-if="variant === 'table'"
    class="overflow-hidden rounded-primary border-2 border-ui-table-row-border"
  >
    <div class="grid grid-cols-2">
      <div
        class="px-4 py-2.5 font-bold text-step-8 uppercase tracking-wide bg-ui-table-head-bg text-ui-table-head-text"
      >
        {{ seoConfig.translates.shortcodes.prosAndCons.pros }}
      </div>
      <div
        class="px-4 py-2.5 font-bold text-step-8 uppercase tracking-wide bg-ui-table-head-bg text-ui-table-head-text"
      >
        {{ seoConfig.translates.shortcodes.prosAndCons.cons }}
      </div>
    </div>
    <div class="grid grid-cols-2 bg-ui-table-row">
      <PostProsConsItem
        class="px-4"
        type="pros"
        chrome="plain"
        :list="prosList"
      ></PostProsConsItem>
      <PostProsConsItem
        class="px-4 border-l border-ui-table-row-border"
        type="cons"
        chrome="plain"
        :list="consList"
      ></PostProsConsItem>
    </div>
  </div>

  <div
    v-else
    class="grid gap-8"
    :class="{ 'md:grid-cols-2': variant === 'two-col' }"
  >
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
import { pickVariant } from "#shared/utils/block-variant";

const { variant: ownVariant = "" } = defineProps<{
  prosList: string[];
  consList: string[];
  // Мини-обзоры зовут базу без варианта — тогда решает тема.
  variant?: string;
}>();

const { variantFor } = useUiTheme();

const VARIANTS = [
  "two-col",
  "stacked",
  "merged",
  "scoreboard",
  "table",
] as const;

const variant = computed(() =>
  pickVariant(VARIANTS, "two-col", ownVariant, variantFor("prosCons")),
);
</script>
