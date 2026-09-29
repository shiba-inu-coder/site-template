<script setup lang="ts">
import PostDataTableImg from "./components/PostDataTableImg.vue";
import PostDataTableRefLink from "./components/PostDataTableRefLink.vue";
import PostDataTableRefLinkBtn from "./components/PostDataTableRefLinkBtn.vue";
import {
  defineShortcodes,
  parseStoredHtml,
  renderStoredHtml,
} from "#shared/utils/stored-html";
import { TABLE_CELL_SHORTCODE_ATTRS } from "#shared/constants/shortcodes";
const { template = "" } = defineProps<{
  template?: string;
}>();

const shortcodes = defineShortcodes(TABLE_CELL_SHORTCODE_ATTRS, {
  Image: PostDataTableImg,
  RefLink: PostDataTableRefLink,
  RefLinkBtn: PostDataTableRefLinkBtn,
});

const DataTableRuntime = computed(() => {
  if (!template) return null;

  // Та же ловушка, что в RuntimeTemplateLayout: без onError парсер бросает на
  // битой разметке, а на таблицу зовётся по разу на ячейку.
  try {
    const nodes = parseStoredHtml(`<span>${template}</span>`, (error) => {
      console.error("[PostDataTableRuntime] template parse error", error);
    });

    return { render: () => renderStoredHtml(nodes, shortcodes) };
  } catch (error) {
    console.error("[PostDataTableRuntime] template parse failed", error);

    return null;
  }
});
</script>

<template>
  <DataTableRuntime v-if="DataTableRuntime" />
</template>
