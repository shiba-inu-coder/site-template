<script setup lang="ts">
import PostDataTableImg from "./components/PostDataTableImg.vue";
import PostDataTableRefLink from "./components/PostDataTableRefLink.vue";
import PostDataTableRefLinkBtn from "./components/PostDataTableRefLinkBtn.vue";
import { compile } from "vue";
const { template = "" } = defineProps<{
  template?: string;
}>();

const components = {
  Image: PostDataTableImg,
  RefLink: PostDataTableRefLink,
  RefLinkBtn: PostDataTableRefLinkBtn,
};

const DataTableRuntime = computed(() => {
  if (!template) return null;

  // Та же ловушка, что в RuntimeTemplateLayout: без onError компилятор в
  // проде бросает на битой разметке, а на таблицу зовётся по разу на ячейку.
  try {
    const render = compile(`<span>${template}</span>`, {
      onError: (error) => {
        console.error(
          "[PostDataTableRuntime] template compile error",
          error,
        );
      },
    });

    return { render, components };
  } catch (error) {
    console.error("[PostDataTableRuntime] template compile failed", error);

    return null;
  }
});
</script>

<template>
  <DataTableRuntime v-if="DataTableRuntime" />
</template>
