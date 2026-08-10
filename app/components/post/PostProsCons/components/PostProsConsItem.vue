<template>
  <ul
    class="rounded-primary not-format flex flex-col bg-primary-200 border-2 border-primary-300"
    tabindex="0"
  >
    <li class="p-primary-1 rounded-t-primary text-left">
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
        :class="{
          ' text-status-positive': type === 'pros',
          ' text-status-negative': type === 'cons',
        }"
        class="size-5 absolute left-[8px] top-[18.5px]"
      ></svg-icon>
      <span
        class="ml-7"
        v-html="item"
      >
      </span>
    </li>
  </ul>
</template>
<script setup lang="ts">
const { list, type } = defineProps<{
  list: string[];
  title: string;
  type: "pros" | "cons";
}>();

const icon = computed(() =>
  type === "cons" ? "client/close-round" : "client/check",
);
</script>
