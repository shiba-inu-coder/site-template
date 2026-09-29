<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "#imports";
import ButtonRef from "#rc/components/post/PostButtonRef.vue";
import {
  defineShortcodes,
  parseStoredHtml,
  renderStoredHtml,
} from "#shared/utils/stored-html";
import { ARTICLE_SHORTCODE_ATTRS } from "#shared/constants/shortcodes";
import type { ImageLayout } from "#shared/utils/image-sizes";

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

const shortcodes = defineShortcodes(ARTICLE_SHORTCODE_ATTRS, {
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
});

const { template, imageLayout } = defineProps({
  template: { type: String, default: "" },
  // Раскладка вокруг тела — для `sizes` картинок в его блоках. Без неё блоки
  // берут раскладку страницы (тело статьи без секций).
  imageLayout: { type: Object as PropType<ImageLayout>, default: null },
});

if (imageLayout) {
  provide(
    IMAGE_LAYOUT_KEY,
    computed(() => imageLayout),
  );
}

const Body = computed(() => {
  if (!template) return null;

  // Без onError парсер Vue бросает — незакрытый тег из панели клал бы всю
  // статью в 500 вместо того, чтобы не отрисовать один блок. Свой onError
  // гасит throw для того, что парсер умеет восстановить сам; try/catch —
  // страховка на случай, если не умеет.
  try {
    const nodes = parseStoredHtml(`<div>${template}</div>`, (error) => {
      console.error("[RuntimeTemplateLayout] template parse error", error);
    });

    return { render: () => renderStoredHtml(nodes, shortcodes) };
  } catch (error) {
    console.error("[RuntimeTemplateLayout] template parse failed", error);

    return null;
  }
});
</script>

<template>
  <component
    :is="Body"
    v-if="Body"
  />
</template>
