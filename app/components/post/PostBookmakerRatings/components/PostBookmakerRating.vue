<template>
  <span
    class="font-semibold text-primary-2 block rounded-primary text-accent-300"
    >{{ Number(rating).toFixed(1) }}/5</span
  >
</template>

<script setup lang="ts">
defineProps<{
  rating: number;
}>();
</script>
