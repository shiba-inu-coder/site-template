<template>
  <div
    v-if="score || facts.length"
    class="my-5"
  >
    <div
      v-if="variant === 'scorecard'"
      class="flex flex-col gap-5 p-4 bg-ui-panel-bg border border-ui-panel-border rounded-primary sm:flex-row sm:items-center sm:gap-6"
    >
      <div class="shrink-0">
        <div class="font-bold text-step-1 leading-none text-ui-heading">
          {{ score }}<span class="text-step-7 text-ui-muted"> / 5</span>
        </div>
        <PostStars
          class="mt-1.5"
          :score="score"
        />
      </div>
      <div class="grid grid-cols-2 gap-x-6 gap-y-2 grow">
        <div
          v-for="(fact, index) in facts"
          :key="index"
          class="text-step-8"
        >
          <span
            class="block text-step-9 uppercase tracking-wide text-ui-muted"
            >{{ fact.label }}</span
          >
          <span class="font-semibold text-ui-heading">{{ fact.value }}</span>
        </div>
      </div>
    </div>

    <div
      v-else-if="variant === 'bars'"
      class="grid gap-2 max-w-[520px]"
    >
      <div
        v-for="(fact, index) in facts"
        :key="index"
        class="grid grid-cols-[minmax(72px,120px)_1fr_auto] items-center gap-2.5 text-step-8"
      >
        <span>{{ fact.label }}</span>
        <span class="block h-2 rounded-full overflow-hidden bg-ui-panel-border">
          <span
            class="block h-full bg-ui-marker"
            :style="{ width: barWidth(fact.value) }"
          ></span>
        </span>
        <span class="text-right font-bold text-ui-heading">{{
          fact.value
        }}</span>
      </div>
    </div>

    <div
      v-else-if="variant === 'chips'"
      class="flex flex-wrap items-center gap-2"
    >
      <span
        v-if="score"
        class="inline-flex items-center gap-x-1.5 px-3 py-1 text-step-8 font-semibold rounded-full bg-ui-panel-bg border border-ui-panel-border"
      >
        <svg-icon
          name="client/star"
          class="size-4 text-ui-marker"
        ></svg-icon>
        <span class="text-ui-heading">{{ score }}</span>
      </span>
      <span
        v-for="(fact, index) in facts"
        :key="index"
        class="inline-flex items-center gap-x-1.5 px-3 py-1 text-step-8 font-semibold rounded-full bg-ui-panel-bg border border-ui-panel-border"
      >
        {{ fact.label }}
        <span class="text-ui-heading">{{ fact.value }}</span>
      </span>
    </div>

    <div
      v-else
      class="flex flex-wrap items-center gap-x-5 gap-y-3"
    >
      <span
        v-if="score"
        class="inline-flex items-center px-3 py-1 font-bold text-step-7 rounded-full bg-ui-badge-bg text-ui-badge-text"
        >{{ score }} / 5</span
      >
      <PostStars :score="score" />
      <div class="flex flex-wrap gap-x-5 gap-y-2">
        <div
          v-for="(fact, index) in facts"
          :key="index"
          class="text-step-8"
        >
          <span
            class="block text-step-9 uppercase tracking-wide text-ui-muted"
            >{{ fact.label }}</span
          >
          <span class="font-semibold text-ui-heading">{{ fact.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostStars from "#rc/components/post/PostStars.vue";
import { pickVariant } from "#shared/utils/block-variant";

// Рейтинг — синглтон без своего uniqId, но библиотека вариантов на `/ui`
// (5b) показывает все четыре сразу над одними и теми же фактами: проп
// `variant` бьёт и запись, и тему — тот же приём, что у `PostBiographyWriter`.
const { variant: forcedVariant = "" } = defineProps<{
  variant?: string;
}>();

const { ratingStrip } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["strip", "scorecard", "bars", "chips"] as const;

// Больше четырёх фактов строка не держит ни на телефоне, ни в сетке
// scorecard — лишние обрезаются здесь, а не в панели.
const MAX_FACTS = 4;

const MAX_SCORE = 5;

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "strip",
    forcedVariant,
    ratingStrip.value.variant,
    variantFor("ratingStrip"),
  ),
);

const score = computed(() => ratingStrip.value.score || 0);

const facts = computed(() =>
  (ratingStrip.value.facts ?? []).slice(0, MAX_FACTS),
);

// В bars значение факта — оценка 0–5: доля от неё и есть длина полосы.
// Нечисловое значение полосу не рисует, а не растягивает её на всю ширину.
const barWidth = (value: string) => {
  const parsed = Number(value);
  const safe = Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, 0), MAX_SCORE)
    : 0;

  return `${(safe / MAX_SCORE) * 100}%`;
};
</script>
