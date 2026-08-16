<script setup lang="ts">
import { computed } from "#imports";
import { compile } from "vue";
import ButtonRef from "#rc/components/post/PostButtonRef.vue";

// const MiniCasinoReview = defineLazyHydrationComponent(
//   "visible",
//   () => import("#rc/components/post/PostMiniCasinoReview.vue"),
// );
// const MiniBookmakerReview = defineLazyHydrationComponent(
//   "visible",
//   () => import("#rc/components/post/PostMiniBookmakerReview.vue"),
// );
const TableContent = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostTableContent.vue"),
);
const Faq = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostFAQ/PostFAQ.vue"),
);
const ProsConsPost = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostProsCons/PostProsCons.vue"),
);
const GridCards = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostGridCards.vue"),
);

const BiographyWriter = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostBiographyWriter.vue"),
);

const DataTable = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostDataTable/PostDataTable.vue"),
);

const ContactUs = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostContactUs.vue"),
);

const TextImage = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostTextImage.vue"),
);
// const CasinoRatings = defineLazyHydrationComponent(
//   "visible",
//   () => import("#rc/components/post/PostCasinoRatings/PostCasinoRatings.vue"),
// );
// const BookmakerRatings = defineLazyHydrationComponent(
//   "visible",
//   () =>
//     import("#rc/components/post/PostBookmakerRatings/PostBookmakerRatings.vue"),
// );

// const CasinoBonuses = defineLazyHydrationComponent(
//   "visible",
//   () => import("#rc/components/post/PostBonuses/PostCasinoBonuses.vue"),
// );
// const BookmakerBonuses = defineLazyHydrationComponent(
//   "visible",
//   () => import("#rc/components/post/PostBonuses/PostBookmakerBonuses.vue"),
// );

const components = {
  ButtonRef,
  BiographyWriter,
  TableContent,
  Faq,
  GridCards,
  ProsConsPost,
  DataTable,
  ContactUs,
  TextImage,
  // CasinoRatings,
  // BookmakerRatings,
  // MiniCasinoReview,
  // MiniBookmakerReview,
  // BookmakerBonuses,
  // CasinoBonuses,
};

const { template = "" } = defineProps<{
  template?: string;
}>();

const CompiledTemplate = computed(() => {
  if (!template) return null;

  const render = compile(`<div>${template}</div>`);

  return {
    render,
    components,
  };
});
</script>

<template>
  <component
    :is="CompiledTemplate"
    v-if="CompiledTemplate"
  />
</template>
