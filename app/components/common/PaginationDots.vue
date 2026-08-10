<template>
  <div class="gap-2.5 py-2.5 flex justify-center items-center">
    <button
      class="rounded-full border border-active-300 bg-active-200 transition ease-in-out duration-500 hover:bg-active-300 w-[18px] h-[18px] flex justify-center items-center"
      aria-label="Previous slide"
      @click="goTo(current - 1)"
    >
      <svg-icon
        name="arrow-up"
        class="text-surface-text text-step-9 rotate-270"
      />
    </button>
    <button
      v-for="(_, idx) in dots"
      :key="idx"
      class="rounded-full border border-active-300 transition ease-in-out duration-500 hover:bg-active-300 w-[10px] h-[10px] flex justify-center items-center"
      :class="{
        'bg-active-200': current === idx,
        'bg-surface-raised': current !== idx,
      }"
      :aria-label="`Go to slide ${idx + 1}`"
      @click="goTo(idx)"
    />
    <button
      class="rounded-full border border-active-300 bg-active-200 transition ease-in-out duration-500 hover:bg-active-300 w-[18px] h-[18px] flex justify-center items-center"
      aria-label="Next slide"
      @click="goTo(current + 1)"
    >
      <svg-icon
        name="arrow-up"
        class="text-surface-text text-step-9 rotate-90"
      />
    </button>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: "next" | "prev"): void;
  (e: "dot", val: number): void;
}>();
const current = defineModel({ type: Number });

defineProps<{
  dots: number;
}>();

const goTo = (idx: number) => (current.value = idx);
</script>
