<template>
  <span class="relative mb-1.5 text-primary-4 uppercase inline-block">
    <svg-icon
      :name="icon"
      class="absolute top-1/2 uppercase -translate-y-1/2 text-primary-2 p-1 text-accent-200"
    ></svg-icon>
    <span class="pl-8 text-white font-bold">{{ title }}</span></span
  >
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
}>();
</script>
