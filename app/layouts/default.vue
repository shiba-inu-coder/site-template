<template>
  <div class="relative font-primary bg-primary-300">
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

const { GET_SETTINGS, setSettings } = useSettings();

GET_SETTINGS().then(({ data }) => {
  setSettings(data.value);
});
</script>
