<template>
  <nav
    v-if="tableContent.length"
    class="toc-block"
    :class="ROOT_CLASSES[variant]"
  >
    <span
      v-if="TITLE_CLASSES[variant]"
      class="block mb-2 text-step-9 uppercase tracking-wide"
      :class="TITLE_CLASSES[variant]"
    >
      {{ siteConfig.translates.tableContent }}
    </span>
    <ol
      class="not-format"
      :class="LIST_CLASSES[variant]"
    >
      <li
        v-for="(contentItem, index) in tableContent"
        :key="index"
        :class="ITEM_CLASSES[variant]"
      >
        <template v-if="variant === 'steps'">
          <span
            class="absolute left-0 top-0 grid place-items-center size-6 rounded-full font-bold text-step-9 bg-ui-marker text-ui-badge-text"
          >
            {{ index + 1 }}
          </span>
          <span
            v-if="index !== tableContent.length - 1"
            class="absolute left-[11px] top-6 bottom-0 w-0.5 bg-ui-panel-border"
          ></span>
        </template>
        <a
          :title="contentItem.title"
          :href="`#${contentItem.value}`"
          class="transition duration-500 ease-in-out"
          :class="LINK_CLASSES[variant]"
          @click.prevent="scrollTo(contentItem.value)"
        >
          {{ contentItem.title }}
        </a>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { pickVariant } from "#shared/utils/block-variant";

// Оглавление — синглтон без своего uniqId, но библиотека вариантов на `/ui`
// (5b) показывает все пять сразу над одним и тем же списком: проп `variant`
// бьёт и запись, и тему — тот же приём, что у `PostBiographyWriter`.
const { variant: forcedVariant = "" } = defineProps<{
  variant?: string;
}>();

const siteConfig = useSiteConfig();

const { tableContent, tableContentEntry } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["box", "rule", "pills", "columns", "steps"] as const;

type TocVariant = (typeof VARIANTS)[number];

const ROOT_CLASSES: Record<TocVariant, string> = {
  box: "max-w-[420px] p-4 text-step-7 bg-ui-panel-bg border border-ui-panel-border rounded-primary",
  rule: "max-w-[420px] pl-4 text-step-7 border-l-[3px] border-ui-marker",
  pills: "text-step-7",
  columns:
    "p-4 text-step-7 bg-ui-panel-bg border border-ui-panel-border rounded-primary",
  steps: "text-step-7",
};

// Пилюли и шаги живут без подписи: у первых заголовок ломает строку, у вторых
// нумерация и есть подпись.
const TITLE_CLASSES: Record<TocVariant, string> = {
  box: "text-ui-heading",
  rule: "text-ui-muted",
  pills: "",
  columns: "text-ui-heading",
  steps: "",
};

const LIST_CLASSES: Record<TocVariant, string> = {
  box: "grid gap-1.5 pl-5 list-decimal",
  rule: "grid gap-1.5 pl-5 list-decimal",
  pills: "flex flex-wrap gap-2 pl-0 list-none",
  columns: "grid gap-x-6 gap-y-1.5 pl-5 list-decimal md:grid-cols-2",
  steps: "grid pl-0 list-none",
};

const ITEM_CLASSES: Record<TocVariant, string> = {
  box: "",
  rule: "",
  pills: "",
  columns: "",
  steps: "relative pl-9 pb-3 last:pb-0",
};

const LINK_CLASSES: Record<TocVariant, string> = {
  box: "text-ui-link hover:text-ui-link-hover",
  rule: "text-ui-link hover:text-ui-link-hover",
  pills:
    "inline-block px-3 py-1.5 font-semibold text-step-8 rounded-full bg-ui-panel-bg border border-ui-panel-border text-ui-text hover:text-ui-link",
  columns: "text-ui-link hover:text-ui-link-hover",
  steps: "text-ui-link hover:text-ui-link-hover",
};

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "box",
    forcedVariant,
    tableContentEntry.value.variant,
    variantFor("toc"),
  ),
);

onMounted(() => {
  const id = useRoute().hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
});

const scrollTo = (id: string) => {
  history.pushState(null, "", `#${id}`);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
};
</script>
