<template>
  <div
    v-if="item.children?.length"
    class="relative group"
  >
    <button
      type="button"
      :class="itemClass"
    >
      {{ item.label }}
    </button>

    <div
      class="absolute hidden group-hover:flex flex-col left-0 top-full mt-1 min-w-[180px] rounded-primary bg-ui-header-bg py-2 shadow-lg z-10"
    >
      <a
        v-for="(child, i) in item.children.filter((c) => c.kind === 'ref')"
        :key="`ref-${i}`"
        :href="refLink"
        target="_blank"
        rel="nofollow noopener"
        data-id="ref_link"
        class="px-4 py-2 hover:text-ui-link transition"
      >
        {{ child.label }}
      </a>
      <nuxt-link
        v-for="(child, i) in item.children.filter((c) => c.kind === 'page')"
        :key="`page-${i}`"
        :to="child.link"
        data-id="ref_link"
        class="px-4 py-2 hover:text-ui-link transition"
      >
        {{ child.label }}
      </nuxt-link>
    </div>
  </div>

  <nuxt-link
    v-else-if="item.kind === 'page'"
    :to="item.link"
    data-id="ref_link"
    :class="itemClass"
  >
    {{ item.label }}
  </nuxt-link>

  <a
    v-else-if="item.kind === 'ref'"
    :href="refLink"
    target="_blank"
    rel="nofollow noopener"
    data-id="ref_link"
    :class="itemClass"
  >
    {{ item.label }}
  </a>

  <nuxt-link
    v-else-if="item.kind === 'logo' && siteConfig.logo.src"
    to="/"
    data-id="ref_link"
    class="logo"
  >
    <NuxtImg
      provider="cloudinary"
      v-bind="logoSize(siteConfig.logo, 36, 200)"
      class="h-auto w-auto max-h-9 max-w-[200px] object-contain"
      :alt="siteConfig.logo.alt"
      :src="siteConfig.logo.src"
    />
  </nuxt-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { logoSize } from "#rc/utils/logo-size";
import type { HeaderItem } from "#shared/types";

interface Props {
  item: HeaderItem;
}

const { item } = defineProps<Props>();

const siteConfig = useSiteConfig();

const refLink = computed(() => useFakeRefLink(siteConfig.value.site.brandSlug));

// Четыре вида — четыре полных набора классов литералами: `@config` отключает
// скан Tailwind по всему проекту, кроме глобов `tailwind.config.js`, и класс,
// собранный из строки (`bg-${x}-200`), в сборке не появится.
const styleClassMap: Record<HeaderItem["style"], string> = {
  primary:
    "font-bold bg-ui-panel-bg transition ease-in-out duration-500 hover:bg-ui-card-bg px-7 py-3 rounded-primary",
  active:
    "font-bold bg-ui-cta-bg text-ui-cta-text transition ease-in-out duration-500 hover:bg-ui-cta-hover px-7 py-3 rounded-primary",
  outline:
    "font-bold border border-ui-link text-ui-link transition ease-in-out duration-500 hover:border-ui-link-hover hover:text-ui-link-hover px-7 py-3 rounded-primary",
  link: "transition ease-in-out duration-500 hover:text-ui-link font-semibold",
};

const itemClass = computed(
  () => styleClassMap[item.style] || styleClassMap.link,
);
</script>
