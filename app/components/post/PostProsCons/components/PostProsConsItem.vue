<template>
  <ul
    class="not-format flex flex-col"
    :class="chromeClasses"
    tabindex="0"
  >
    <li
      v-if="title"
      class="p-primary-1 rounded-t-primary text-left"
      :class="{ 'px-0!': chrome === 'plain' }"
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
      :class="{ 'px-0!': chrome === 'plain' }"
    >
      <svg-icon
        :name="icon"
        :class="[
          type === 'pros' ? 'text-status-positive' : 'text-status-negative',
          chrome === 'plain' ? 'left-0' : 'left-[8px]',
        ]"
        class="size-5 absolute top-[18.5px]"
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

const {
  type,
  title = "",
  chrome = "panel",
} = defineProps<{
  list: string[];
  title?: string;
  type: "pros" | "cons";
  // Рамка списка принадлежит варианту, а не списку: у merged, scoreboard и
  // table она своя или её нет вовсе.
  chrome?: "panel" | "plain";
}>();

const icon = computed(() =>
  type === "cons" ? "client/close-round" : "client/check",
);

const chromeClasses = computed(() =>
  chrome === "panel"
    ? "rounded-primary bg-ui-panel-bg border-2 border-ui-panel-border"
    : "",
);
</script>
