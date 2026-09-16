<template>
  <span
    class="flex"
    :class="containerClasses"
  >
    <a
      data-id="ref_link"
      :href="useFakeRefLink(slug)"
      target="_blank"
      rel="nofollow noopener"
      class="font-semibold rounded-primary items-center transition-all whitespace-pre-wrap focus:outline-none focus:ring-2 text-center"
      :class="buttonClasses"
    >
      <span
        v-if="showMobileIcon"
        class="sm:hidden"
      >
        <svg-icon
          name="client/play"
          class="text-step-5"
        />
      </span>

      <span :class="{ 'hidden sm:block': showMobileIcon }">
        <template v-if="name">{{ name }}</template>
        <slot v-else>{{ name }}</slot>
      </span>

      <small
        v-if="resolvedVariant === 'block' && note"
        class="text-step-9 font-medium opacity-80"
        >{{ note }}</small
      >
    </a>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { seoConfig } from "@@/seo.conf";
import { pickVariant } from "#shared/utils/block-variant";

type ButtonVariant = "solid" | "outline" | "soft" | "block" | "link";

interface Props {
  variant?: ButtonVariant;
  position?: "left" | "center" | "right";
  size?: "small" | "small-medium" | "medium" | "medium-big" | "big";
  fullWidth?: boolean;
  padding?: boolean;
  name?: string;
  // Подстрочник варианта block — бонус или условие под самой надписью.
  note?: string;
  showMobileIcon?: boolean;
  slug?: string;
}

const {
  variant,
  position = "center",
  size = "small",
  fullWidth = false,
  padding = true,
  name = "",
  note = "",
  slug = seoConfig.site.brandSlug,
  showMobileIcon = false,
} = defineProps<Props>();

const { variantFor } = useUiTheme();

// Тема умеет только первые четыре; link — кнопка-текст внутри таблицы, её
// ставят пропом руками. Список общий, потому что проп и тема проходят один и
// тот же фильтр, а link в `uiTheme.variants.buttonRef` — уже ошибка панели.
const VARIANTS = ["solid", "outline", "soft", "block", "link"] as const;

const positionClassesMap: Record<NonNullable<Props["position"]>, string> = {
  left: "justify-center lg:justify-start",
  center: "justify-center",
  right: "justify-center md:justify-end",
};

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    "border border-transparent bg-ui-cta-bg text-ui-cta-text hover:bg-ui-cta-hover focus:bg-ui-cta-hover",
  outline:
    "border text-ui-link bg-ui-panel-bg border-ui-link hover:bg-ui-cta-bg transition duration-500 ease-in-out hover:text-ui-cta-text focus:bg-ui-cta-hover",
  soft: "border border-transparent bg-ui-highlight-bg text-ui-highlight-text hover:bg-ui-cta-bg focus:bg-ui-cta-bg",
  block:
    "border border-transparent bg-ui-cta-bg text-ui-cta-text hover:bg-ui-cta-hover focus:bg-ui-cta-hover",
  link: "app-link text-left text-step-6!",
};

// display пишется ровно один раз: inline-flex и flex — одно и то же свойство,
// и порядок в строке классов ничего не решает, решает порядок в собранном CSS.
const layoutClasses: Record<ButtonVariant, string> = {
  solid: "inline-flex justify-center gap-x-2",
  outline: "inline-flex justify-center gap-x-2",
  soft: "inline-flex justify-center gap-x-2",
  block: "flex w-full flex-col justify-center gap-y-1",
  link: "inline-flex justify-center gap-x-2",
};

const textClasses: Record<NonNullable<Props["size"]>, string> = {
  small: "text-step-8",
  "small-medium": "text-step-7",
  medium: "text-step-5",
  "medium-big": "text-step-3",
  big: "text-step-2",
};

const paddingClasses: Record<NonNullable<Props["size"]>, string> = {
  small: "py-2 px-2",
  "small-medium": "py-1.5 px-4",
  medium: "py-2.5 px-2",
  "medium-big": "py-3 px-16",
  big: "py-3.5 px-28",
};

// Проп руками > вариант темы > solid. Проп без значения по умолчанию —
// единственный способ отличить «вызывающий попросил solid» от «не просил
// ничего», а значит и дать теме сказать своё слово.
const resolvedVariant = computed(() =>
  pickVariant(VARIANTS, "solid", variant, variantFor("buttonRef")),
);

const isBlock = computed(() => resolvedVariant.value === "block");

const containerClasses = computed(() => [
  positionClassesMap[position],
  {
    "mb-8 mt-5": padding,
    "w-full": fullWidth || isBlock.value,
  },
]);

const buttonClasses = computed(() => {
  const classes: string[] = [
    variantClasses[resolvedVariant.value],
    layoutClasses[resolvedVariant.value],
    textClasses[isBlock.value ? "medium" : size],
  ];

  if (isBlock.value) {
    // Своя внутренняя рамка: размерная сетка рассчитана на строку в одну
    // высоту, а у block внутри две.
    classes.push("py-3.5 px-5");
  } else if (resolvedVariant.value !== "link") {
    classes.push(paddingClasses[size]);
  }

  if (fullWidth) {
    classes.push("w-full");
  }

  return classes;
});
</script>
