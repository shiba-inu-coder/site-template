<template>
  <ul
    class="not-format flex flex-col rounded-primary bg-ui-panel-bg border-2 border-ui-panel-border"
    tabindex="0"
  >
    <li
      v-if="title"
      class="p-primary-1 rounded-t-primary text-left"
    >
      <span
        class="my-0! font-semibold! text-shadow-none! text-step-6"
        :class="{
          ' text-status-positive!': type === 'pros',
          ' text-status-negative!': type === 'cons',
        }"
      >
        {{ title }}
      </span>
    </li>
    <li
      v-for="(item, index) in list"
      :key="index"
      class="inline-flex relative items-center gap-x-2 p-primary-1"
    >
      <svg-icon
        :name="icon"
        :class="
          type === 'pros' ? 'text-status-positive' : 'text-status-negative'
        "
        class="size-5 absolute top-[18.5px] left-[8px]"
      ></svg-icon>
      <span
        class="ml-7"
        v-html="safeHTMLWrap(item)"
      >
      </span>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";

const { type, title = "" } = defineProps<{
  list: string[];
  title?: string;
  type: "pros" | "cons";
}>();

const icon = computed(() =>
  type === "cons" ? "client/close-round" : "client/check",
);
</script>
