<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>
<script setup lang="ts">
import "~/assets/css/tailwind.css";
import { seoConfig } from "@@/seo.conf";

useHead({
  htmlAttrs: { "data-theme": seoConfig.site.theme },
  meta: [{ name: "color-scheme", content: seoConfig.site.theme }],
});
</script>
