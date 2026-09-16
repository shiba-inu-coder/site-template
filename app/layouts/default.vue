<template>
  <div
    id="site"
    class="relative font-primary bg-ui-page-bg"
    v-bind="frameAttrs"
  >
    <HeaderLayout></HeaderLayout>
    <div>
      <slot></slot>
    </div>
    <FooterLayout></FooterLayout>
  </div>
</template>
<script lang="ts" setup>
import HeaderLayout from "#rc/components/layout/HeaderLayout.vue";

// Оси темы висят атрибутами на корне страницы, а не классами: по ним
// разводится блок `/* UI axes */` в `tailwind.css`. Тот же набор обязан быть
// и на `error.vue` — 404 рисует не этот файл.
const { frameAttrs } = useUiTheme();

const FooterLayout = defineLazyHydrationComponent(
  "visible",
  () => import("#rc/components/layout/FooterLayout.vue"),
);
</script>
