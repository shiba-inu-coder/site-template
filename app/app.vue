<template>
  <NuxtLayout>
    <NuxtPage :page-key="(route) => route.fullPath" />
  </NuxtLayout>
</template>
<script setup lang="ts">
import "~/assets/css/tailwind.css";
</script>
