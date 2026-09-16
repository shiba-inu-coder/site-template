<template>
  <div
    v-if="data.amount || data.label"
    class="my-5"
  >
    <div
      v-if="variant === 'banner'"
      class="flex flex-col items-center gap-2 text-center px-5 py-6 bg-linear-to-br from-ui-card-bg to-ui-panel-bg border border-ui-panel-border rounded-primary"
    >
      <span
        v-if="data.label"
        class="text-step-9 font-bold uppercase tracking-wide text-ui-muted"
        >{{ data.label }}</span
      >
      <span
        v-if="data.amount"
        class="font-bold text-step-2 leading-tight text-ui-heading"
        >{{ data.amount }}</span
      >
      <span
        v-if="data.terms"
        class="text-step-9 text-ui-muted"
        >{{ data.terms }}</span
      >
      <PostButtonRef
        v-if="data.buttonText"
        class="mt-2"
        size="medium"
        :padding="false"
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>

    <div
      v-else-if="variant === 'ticket'"
      class="flex flex-col sm:flex-row"
    >
      <div
        class="grow px-5 py-4 bg-ui-panel-bg border border-ui-panel-border rounded-t-primary sm:rounded-primary sm:rounded-r-none sm:border-r-0"
      >
        <span
          v-if="data.label"
          class="block text-step-9 font-bold uppercase tracking-wide text-ui-muted"
          >{{ data.label }}</span
        >
        <span
          v-if="data.amount"
          class="block font-bold text-step-3 leading-tight text-ui-heading"
          >{{ data.amount }}</span
        >
        <span
          v-if="data.terms"
          class="block text-step-9 text-ui-muted"
          >{{ data.terms }}</span
        >
      </div>
      <PostButtonRef
        v-if="data.code"
        class="shrink-0 sm:self-stretch"
        size="medium"
        :padding="false"
        :slug="data.refLink || undefined"
      >
        <span
          class="flex flex-col items-center justify-center gap-0.5 px-2 py-1"
        >
          <span
            v-if="data.label"
            class="text-step-9 font-semibold opacity-80"
            >{{ data.label }}</span
          >
          <span class="font-bold tracking-wide">{{ data.code }}</span>
          <span
            v-if="data.buttonText"
            class="text-step-9 font-semibold opacity-80"
            >{{ data.buttonText }}</span
          >
        </span>
      </PostButtonRef>
    </div>

    <div
      v-else-if="variant === 'split'"
      class="flex flex-col overflow-hidden bg-ui-panel-bg border border-ui-panel-border rounded-primary sm:flex-row sm:items-center"
    >
      <div
        class="flex flex-col justify-center shrink-0 px-6 py-5 bg-ui-cta-bg text-ui-cta-text sm:min-w-[180px]"
      >
        <span
          v-if="data.label"
          class="text-step-9 font-bold uppercase tracking-wide opacity-85"
          >{{ data.label }}</span
        >
        <span
          v-if="data.amount"
          class="font-bold text-step-2 leading-tight"
          >{{ data.amount }}</span
        >
      </div>
      <div class="grow px-5 py-4">
        <span
          v-if="data.terms"
          class="block text-step-9 text-ui-muted"
          >{{ data.terms }}</span
        >
        <span
          v-if="data.code"
          class="block mt-1 font-bold tracking-wide text-ui-heading"
          >{{ data.code }}</span
        >
      </div>
      <PostButtonRef
        v-if="data.buttonText"
        class="shrink-0 px-5 pb-4 sm:pb-0 sm:pr-5 sm:pl-0"
        size="medium"
        :padding="false"
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>

    <div
      v-else-if="variant === 'bar'"
      class="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-ui-panel-bg border border-ui-panel-border rounded-primary"
    >
      <span
        v-if="data.label"
        class="text-step-9 font-bold uppercase tracking-wide text-ui-muted"
        >{{ data.label }}</span
      >
      <span
        v-if="data.amount"
        class="grow font-bold text-step-6 text-ui-heading"
        >{{ data.amount }}</span
      >
      <PostButtonRef
        v-if="data.buttonText"
        class="shrink-0"
        size="small"
        :padding="false"
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>

    <div
      v-else
      class="flex flex-wrap items-center gap-4 px-5 py-4 bg-ui-panel-bg border border-ui-panel-border border-l-4 border-l-ui-marker rounded-primary"
    >
      <div class="grow min-w-[200px]">
        <span
          v-if="data.label"
          class="block text-step-9 font-bold uppercase tracking-wide text-ui-muted"
          >{{ data.label }}</span
        >
        <span
          v-if="data.amount"
          class="block font-bold text-step-2 leading-tight text-ui-heading"
          >{{ data.amount }}</span
        >
        <span
          v-if="data.terms"
          class="block text-step-9 text-ui-muted"
          >{{ data.terms }}</span
        >
      </div>
      <PostButtonRef
        v-if="data.buttonText"
        class="shrink-0"
        size="medium"
        :padding="false"
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import { pickVariant } from "#shared/utils/block-variant";

const { uniqId } = defineProps<{ uniqId: string }>();

const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["stripe", "banner", "ticket", "split", "bar"] as const;

// Маркер в статье может пережить свою запись в конфиге.
const FALLBACK: PostBonusBox = {
  data: {
    uniqId: "",
  },
};

const data = computed(
  () => (getShortcode({ uniqId, shortcode: "bonusBoxes" }) || FALLBACK).data,
);

const variant = computed(() =>
  pickVariant(VARIANTS, "stripe", data.value.variant, variantFor("bonusBox")),
);
</script>
