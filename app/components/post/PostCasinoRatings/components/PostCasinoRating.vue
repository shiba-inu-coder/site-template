<template>
  <span class="font-semibold text-step-5 block rounded-primary text-accent-300"
    >{{ Number(rating).toFixed(1) }}/5</span
  >
</template>

<script setup lang="ts">
defineProps<{
  rating: number;
}>();
</script>
