<template>
  <div class="relative font-primary bg-ui-page-bg">
    <HeaderLayout></HeaderLayout>
    <div>
      <slot></slot>
    </div>
    <FooterLayout></FooterLayout>
  </div>
</template>
<script lang="ts" setup>
import HeaderLayout from "#rc/components/layout/HeaderLayout.vue";

const FooterLayout = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/layout/FooterLayout.vue"),
);
</script>
