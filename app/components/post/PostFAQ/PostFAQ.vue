<template>
  <div
    v-if="faq.data.length"
    class="space-y-6"
  >
    <PostFAQItem
      v-for="(item, index) in faq.data"
      :key="index"
      :faq-item="item"
    />
  </div>
</template>
<script setup lang="ts">
import PostFAQItem from "./components/PostFAQItem.vue";

const { faq } = usePost();

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
