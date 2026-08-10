<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>
<script setup lang="ts">
import "~/assets/css/tailwind.css";
import { seoConfig } from "@@/seo.conf";

// data-theme включает блок :root[data-theme="light"] в tailwind.css. color-scheme
// нужен отдельно: без него браузерные контролы — скроллбары, автозаполнение,
// системные чекбоксы — останутся тёмными на светлом сайте.
useHead({
  htmlAttrs: { "data-theme": seoConfig.site.theme },
  meta: [{ name: "color-scheme", content: seoConfig.site.theme }],
});
</script>
