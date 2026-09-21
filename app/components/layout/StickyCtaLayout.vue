<template>
  <div
    v-if="hasCta"
    class="site-sticky fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-ui-panel-border bg-ui-header-bg px-3 py-2 md:hidden"
  >
    <div
      v-if="variant === 'bar' && bonus"
      class="min-w-0 flex-1 text-step-9 leading-tight"
    >
      <b class="block truncate text-step-8 text-ui-heading">{{ bonus }}</b>
      <span
        v-if="terms"
        class="block truncate text-ui-muted"
        >{{ terms }}</span
      >
    </div>
    <CtaButtonLayout
      :label="buttonLabel"
      :link="buttonLink"
      :full-width="variant !== 'bar' || !bonus"
    />
  </div>
</template>

<script setup lang="ts">
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";

// Липкая панель живёт только на телефоне: на десктопе её перекрывает сайдбар
// и кнопки самой статьи, и место внизу экрана там не дефицит.
const { variant } = defineProps<{
  variant: "bar" | "button";
}>();

const { bonus, terms, buttonLabel, buttonLink, hasCta } = usePageOffer();
</script>
