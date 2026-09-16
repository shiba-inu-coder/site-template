<template>
  <span
    class="inline-flex items-center gap-0.5 leading-none"
    role="img"
    :aria-label="`${value} / ${STARS}`"
  >
    <svg-icon
      v-for="star in STARS"
      :key="star"
      name="client/star"
      :class="[sizeClass, star <= filled ? 'text-ui-marker' : 'text-ui-muted']"
    />
  </span>
</template>

<script setup lang="ts">
const { score = 0, size = "small" } = defineProps<{
  score?: number | string;
  size?: "small" | "medium";
}>();

const STARS = 5;

const SIZE_CLASSES: Record<"small" | "medium", string> = {
  small: "size-4",
  medium: "size-5",
};

// Оценка приезжает из базы и может быть строкой, пустой строкой или мусором.
const value = computed(() => {
  const parsed = Number(score);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), STARS) : 0;
});

const filled = computed(() => Math.round(value.value));

const sizeClass = computed(() => SIZE_CLASSES[size]);
</script>
