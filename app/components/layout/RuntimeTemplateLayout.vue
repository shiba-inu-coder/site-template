<script setup lang="ts">
import { computed } from "#imports";
import type { Component } from "vue";
import { compile, defineComponent, h } from "vue";
import ButtonRef from "#rc/components/post/PostButtonRef.vue";
import VariantPicker from "#rc/components/layout/VariantPicker.vue";
import { sanitizeRuntimeTemplate } from "#shared/utils/sanitize-runtime-template";
import { UI_VARIANT_PICKERS } from "#shared/constants/ui-variant-options";

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

const RatingStrip = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/post/PostRatingStrip.vue"),
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

// Панелька выбора варианта (5b) садится на каждый шорткод-маркер этой же
// оберткой, а не правкой 12 компонентов по отдельности: `components` ниже —
// единственное место, которое видит все маркеры разом. Она не трогает
// использование тех же компонентов ВНУТРИ других (кнопка внутри вердикта или
// бонуса) — тот рендерится обычным SFC-импортом, а не через эту карту.
const withVariantPicker = (
  component: Component,
  pickerKey: keyof typeof UI_VARIANT_PICKERS,
) =>
  defineComponent({
    inheritAttrs: false,
    setup:
      (_, { attrs }) =>
      () =>
        h("div", { class: "group relative" }, [
          h(VariantPicker, UI_VARIANT_PICKERS[pickerKey]),
          h(component, attrs),
        ]),
  });

const components = {
  ButtonRef: withVariantPicker(ButtonRef, "buttonRef"),
  BiographyWriter: withVariantPicker(BiographyWriter, "biography"),
  TableContent: withVariantPicker(TableContent, "toc"),
  Faq: withVariantPicker(Faq, "faq"),
  GridCards: withVariantPicker(GridCards, "gridCards"),
  ProsConsPost: withVariantPicker(ProsConsPost, "prosCons"),
  DataTable: withVariantPicker(DataTable, "dataTable"),
  ContactUs: withVariantPicker(ContactUs, "contact"),
  TextImage: withVariantPicker(TextImage, "textImage"),
  RatingStrip: withVariantPicker(RatingStrip, "ratingStrip"),
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

  // В прод-сборке onError не задан по умолчанию, и компилятор бросает —
  // незакрытый тег из панели клал бы всю статью в 500 вместо того, чтобы не
  // отрисовать один блок. Свой onError гасит throw для того, что парсер умеет
  // восстановить сам; try/catch — страховка на случай, если не умеет.
  try {
    const render = compile(`<div>${sanitizeRuntimeTemplate(template)}</div>`, {
      onError: (error) => {
        console.error("[RuntimeTemplateLayout] template compile error", error);
      },
    });

    return { render, components };
  } catch (error) {
    console.error("[RuntimeTemplateLayout] template compile failed", error);

    return null;
  }
});
</script>

<template>
  <component
    :is="CompiledTemplate"
    v-if="CompiledTemplate"
  />
</template>
