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
      class="font-semibold rounded-primary inline-flex justify-center transition-all items-center gap-x-2 whitespace-pre-wrap focus:outline-none focus:ring-2 text-center"
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
    </a>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { seoConfig } from "@@/seo.conf";

interface Props {
  variant?: "solid" | "outline" | "soft" | "link";
  position?: "left" | "center" | "right";
  size?: "small" | "small-medium" | "medium" | "medium-big" | "big";
  fullWidth?: boolean;
  padding?: boolean;
  name?: string;
  showMobileIcon?: boolean;
  slug?: string;
}

const {
  variant = "solid",
  position = "center",
  size = "small",
  fullWidth = false,
  padding = true,
  name,
  slug = seoConfig.site.brandSlug,
  showMobileIcon = false,
} = defineProps<Props>();

const positionClassesMap: Record<Props["position"], string> = {
  left: "justify-center lg:justify-start",
  center: "justify-center",
  right: "justify-center md:justify-end",
};

const variantClasses: Record<Props["variant"], string> = {
  solid:
    "border border-transparent bg-ui-cta-bg text-ui-cta-text hover:bg-ui-cta-hover focus:bg-ui-cta-hover",
  outline:
    "border text-ui-link bg-ui-panel-bg border-ui-link hover:bg-ui-cta-bg transition duration-500 ease-in-out hover:text-ui-cta-text focus:bg-ui-cta-hover",
  soft: "border border-transparent bg-ui-highlight-bg text-ui-highlight-text hover:bg-ui-cta-bg focus:bg-ui-cta-bg",
  link: "app-link text-left text-step-6!",
};

const textClasses: Record<Props["size"], string> = {
  small: "text-step-8",
  "small-medium": "text-step-7",
  medium: "text-step-5",
  "medium-big": "text-step-3",
  big: "text-step-2",
};

const paddingClasses: Record<Props["size"], string> = {
  small: "py-2 px-2",
  "small-medium": "py-1.5 px-4",
  medium: "py-2.5 px-2",
  "medium-big": "py-3 px-16",
  big: "py-3.5 px-28",
};

const containerClasses = computed(() => [
  positionClassesMap[position],
  {
    "mb-8 mt-5": padding,
    "w-full": fullWidth,
  },
]);

const buttonClasses = computed(() => {
  const classes: string[] = [variantClasses[variant]];

  classes.push(textClasses[size]);

  if (variant !== "link") {
    classes.push(paddingClasses[size]);
  }

  if (fullWidth) {
    classes.push("w-full");
  }

  return classes;
});
</script>
