<template>
  <div
    v-if="previewAttached"
    class="pointer-events-none absolute left-2 top-2 z-40 opacity-0 transition duration-500 ease-in-out group-hover:pointer-events-auto group-hover:opacity-100"
  >
    <div
      class="flex items-center gap-1.5 rounded-full bg-black/85 px-2.5 py-1.5 text-step-9 whitespace-nowrap text-white shadow-lg"
    >
      <span class="font-semibold">{{ label }}</span>
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :title="option.label"
        :aria-label="option.label"
        :aria-pressed="option.value === current"
        class="size-2.5 shrink-0 rounded-full border border-white/70 transition duration-500 ease-in-out"
        :class="
          option.value === current
            ? 'bg-white'
            : 'bg-transparent hover:bg-white/40'
        "
        @click="onPick(option.value)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pickVariant } from "#shared/utils/block-variant";

/**
 * Панелька выбора варианта поверх блока (5b) — рисуется только при живом
 * `?preview=` соединении с панелью (`previewAttached`), поэтому на боевой
 * странице без панели её никто не увидит. Обёртка (`RuntimeTemplateLayout`,
 * `layouts/default.vue` и несколько компонентов каркаса) кладёт её первым
 * ребёнком в контейнер с классом `group` — оттуда `group-hover`.
 */
const { label, group, optionKey, options, fallback } = defineProps<{
  label: string;
  group: "variants" | "frame";
  optionKey: string;
  options: { value: string; label: string }[];
  fallback: string;
}>();

const { theme, previewAttached, setVariant } = useUiTheme();

const current = computed(() => {
  const source =
    group === "variants" ? theme.value?.variants : theme.value?.frame;
  const raw = (source as Record<string, unknown> | undefined)?.[optionKey];

  return pickVariant(
    options.map((option) => option.value),
    fallback,
    typeof raw === "string" ? raw : undefined,
  );
});

const onPick = (value: string) => {
  setVariant(group, optionKey, value);
};
</script>
