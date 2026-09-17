<template>
  <div
    v-if="faq.data.length"
    :class="containerClasses"
  >
    <PostFAQItem
      v-for="(item, index) in faq.data"
      :key="index"
      :faq-item="item"
      :variant="variant"
      :index="index"
    />
  </div>
</template>
<script setup lang="ts">
import PostFAQItem from "./components/PostFAQItem.vue";
import { pickVariant } from "#shared/utils/block-variant";

// FAQ — синглтон без своего uniqId, но `/ui` (5b) должен показать все пять
// вариантов сразу поверх одних и тех же вопросов: проп `variant` бьёт и
// запись, и тему — тот же приём, что у `PostBiographyWriter`.
const { variant: forcedVariant = "" } = defineProps<{
  variant?: string;
}>();

const { faq } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["list", "accordion", "numbered", "grid", "chat"] as const;

const CONTAINER_CLASSES: Record<(typeof VARIANTS)[number], string> = {
  list: "grid gap-3 max-w-[760px]",
  accordion: "grid gap-2 max-w-[760px]",
  // Разделители рисуют сами вопросы — зазор между ними разорвал бы линию.
  numbered: "grid max-w-[760px]",
  grid: "grid gap-3 md:grid-cols-2",
  chat: "grid gap-4 max-w-[760px]",
};

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "list",
    forcedVariant,
    faq.value.variant,
    variantFor("faq"),
  ),
);

const containerClasses = computed(() => CONTAINER_CLASSES[variant.value]);

const questionSchemaOrg = computed(() =>
  faq.value.data.map((item) => ({
    "@type": "Question",
    name: item.label,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.value,
    },
  })),
);

useSchemaOrg([
  {
    "@type": "FAQPage",
    mainEntity: questionSchemaOrg.value,
  },
]);
</script>
