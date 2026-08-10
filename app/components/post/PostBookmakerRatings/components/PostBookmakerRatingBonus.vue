<template>
  <div
    class="border border-transparent flex justify-center flex-col items-center w-full"
  >
    <span class="text-step-8 mb-1 lg:pr-4.5 uppercase flex items-center">
      <svg-icon
        name="client/gift"
        class="text-accent-200 inline-block text-step-8 pb-0.5 pr-2"
      ></svg-icon>
      {{ bonusTitle }}
    </span>
    <span
      class="text-accent-100 font-bold text-step-4 text-center flex justify-center items-center px-1.5"
      >{{ bonusText }}</span
    >
  </div>
</template>
<script setup lang="ts">
defineProps<{
  bonusText: string;
  bonusTitle: string;
}>();
</script>
