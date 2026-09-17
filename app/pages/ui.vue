<template>
  <BasePostView></BasePostView>

  <div
    v-if="contrast.length"
    class="pointer-events-none fixed bottom-3 right-3 z-50 grid gap-1 rounded-primary bg-black/85 p-3 text-step-9 text-white shadow-lg"
  >
    <span class="font-semibold">Contrast report</span>
    <div
      v-for="entry in contrast"
      :key="entry.pair"
      class="flex items-center justify-between gap-4"
    >
      <span class="text-white/75">{{ pairLabel(entry.pair) }}</span>
      <span :class="levelClass(entry.ratio)">{{ entry.ratio.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasePostView from "#rc/views/BasePostView.vue";
import { buildDemoPost } from "#rc/fixtures/demo-post";
import { CONTRAST_PAIRS } from "#shared/utils/contrast";
import { findUiPreset } from "#shared/constants/ui-presets";

/**
 * `/ui` — демо-статья со всеми шорткодами и вариантами, живая UI-библиотека
 * сайта (см. `docs/ui.md`, «/ui page»). Слой 1 защиты от роботов: без
 * `?preview=` странице нечего показывать — `createError` до рендера отдаёт
 * настоящий 404, а не просто рисует вид ошибки (робот получает статус-код,
 * не HTML). Слои 2–4 — заголовок `X-Robots-Tag` (server middleware),
 * `Disallow: /ui` в `robots.ts` и отсутствие адреса в sitemap (источник —
 * база, шаблонные страницы туда не попадают в принципе).
 */
const route = useRoute();

if (!route.query.preview) {
  throw createError({ statusCode: 404, statusMessage: "Not Found" });
}

useHead({
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const { setPost } = usePost();
const { setTheme, contrast } = useUiTheme();

setPost(buildDemoPost({ lorem: Boolean(route.query.lorem) }));

// `?preset=<id>` — один из 14 утверждённых пресетов вместо темы из базы, для
// проверки шаблона без записи в настоящий сайт. Без параметра тема остаётся
// той, что уже загрузил `app/plugins/ui-theme.ts` — это и есть предпросмотр
// настоящей темы сайта.
const presetId = route.query.preset as string | undefined;
const preset = presetId ? findUiPreset(presetId) : null;

if (preset) {
  setTheme(preset);
}

const CONTRAST_LABELS: Record<string, string> = Object.fromEntries(
  CONTRAST_PAIRS.map((pair) => [pair.id, pair.label]),
);

const pairLabel = (id: string) => CONTRAST_LABELS[id] || id;

// Порог 4.5 — минимум WCAG AA для обычного текста; 7 — AAA. Между ними
// жёлтым: читаемо, но не так надёжно, как хотелось бы для CTA и заголовков.
const levelClass = (ratio: number) => {
  if (ratio < 4.5) return "font-bold text-status-negative";
  if (ratio < 7) return "font-bold text-status-warning";
  return "text-white";
};
</script>
