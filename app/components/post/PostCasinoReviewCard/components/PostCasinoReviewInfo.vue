<template>
  <div
    class="bg-primary-100 border-2 border-primary-300 rounded-primary shadow-primary flex-1 p-primary-1"
  >
    <div
      class="flex"
      :class="{
        'items-center': isMobileRow,
        'flex-col md:items-start': !isMobileRow,
      }"
    >
      <span
        class="text-primary-3 block font-bold"
        :class="{
          'mb-2': !isMobileRow,
        }"
        >{{ title }}</span
      >
      <div class="text-primary-4 block">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string;
  col?: boolean;
  isMobileRow?: boolean;
}>();
</script>
