<template>
  <span class="relative mb-1.5 text-step-7 uppercase inline-block">
    <svg-icon
      :name="icon"
      class="absolute top-1/2 uppercase -translate-y-1/2 text-step-5 p-1 text-accent-200"
    ></svg-icon>
    <span class="pl-8 text-surface-text font-bold">{{ title }}</span></span
  >
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>
