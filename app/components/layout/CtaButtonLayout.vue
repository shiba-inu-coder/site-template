<template>
  <nuxt-link
    v-if="link"
    :to="link"
    trailing-slash="append"
    class="cta-button inline-flex items-center justify-center gap-x-2 rounded-primary border border-transparent bg-ui-cta-bg px-5 py-2.5 text-center font-semibold text-ui-cta-text transition-all hover:bg-ui-cta-hover focus:outline-none focus:ring-2"
    :class="[fullWidth ? 'w-full' : '', textClass]"
  >
    {{ label }}
  </nuxt-link>
  <PostButtonRef
    v-else
    :name="label"
    :size="size"
    :padding="false"
    :full-width="fullWidth"
    position="left"
  />
</template>

<script setup lang="ts">
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

// Внутренний адрес `PostButtonRef` нарисовать не умеет — он всегда внешняя
// реф-ссылка. Поэтому кнопка каркаса одна на три места (хиро, сайдбар, липкая
// панель) и сама решает, что рисовать: ссылку сайта или реф бренда.
const {
  label,
  link = "",
  size = "small-medium",
  fullWidth = false,
} = defineProps<{
  label: string;
  link?: string;
  size?: "small" | "small-medium" | "medium" | "medium-big" | "big";
  fullWidth?: boolean;
}>();

const TEXT_CLASSES: Record<string, string> = {
  small: "text-step-8",
  "small-medium": "text-step-7",
  medium: "text-step-5",
  "medium-big": "text-step-3",
  big: "text-step-2",
};

const textClass = computed(() => TEXT_CLASSES[size] || TEXT_CLASSES.medium);
</script>
