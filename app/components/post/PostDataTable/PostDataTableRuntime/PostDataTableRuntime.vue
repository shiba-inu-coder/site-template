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

  const render = compile(`<span>${template}</span>`);

  return {
    render,
    components,
  };
});
</script>

<template>
  <DataTableRuntime />
</template>
