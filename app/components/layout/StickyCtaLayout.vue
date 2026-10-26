<template>
  <div
    v-if="hasCta"
    class="site-sticky fixed z-30 flex items-center gap-3 border-ui-panel-border bg-ui-header-bg px-3 py-2 md:hidden"
    :class="
      variant === 'bar-float'
        ? 'inset-x-2 bottom-2 rounded-primary border shadow-lg'
        : 'inset-x-0 bottom-0 border-t'
    "
  >
    <div
      v-if="hasBonus"
      class="min-w-0 flex-1 text-step-9 leading-tight"
    >
      <b class="block truncate text-step-8 text-ui-heading">{{ bonus }}</b>
      <span
        v-if="terms"
        class="block truncate text-ui-text"
        >{{ terms }}</span
      >
    </div>
    <CtaButtonLayout
      :label="buttonLabel"
      :link="buttonLink"
      :ref-key="REF_KEY.stickyCta"
      :ref-block="REF_BLOCK.sticky"
      :full-width="!hasBonus"
    />
  </div>
</template>

<script setup lang="ts">
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";
import { REF_BLOCK, REF_KEY } from "#shared/constants/ref-buttons";

// Липкая панель живёт только на телефоне: на десктопе хватает кнопок самой
// статьи, и место внизу экрана там не дефицит.
const { variant } = defineProps<{
  variant: "bar" | "bar-float" | "button";
}>();

const { bonus, terms, buttonLabel, buttonLink, hasCta } = usePageOffer();

const hasBonus = computed(() => variant !== "button" && Boolean(bonus.value));
</script>
