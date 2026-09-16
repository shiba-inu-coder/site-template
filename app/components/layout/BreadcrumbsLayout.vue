<template>
  <nav
    v-if="variant === 'back'"
    class="mt-4 flex w-full text-step-8"
  >
    <nuxt-link
      v-if="backCrumb"
      trailing-slash="append"
      prefetch-on="interaction"
      class="font-semibold text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover"
      :to="backCrumb.slug"
    >
      ← {{ backCrumb.title }}
    </nuxt-link>
  </nav>

  <nav
    v-else
    class="mt-4 flex w-full"
  >
    <ol
      class="not-format flex items-center overflow-x-auto overflow-y-hidden text-step-8"
      :class="variant === 'pills' ? 'gap-2' : ''"
    >
      <li
        v-for="(crumb, index) in items"
        :key="index"
        class="flex items-center whitespace-nowrap"
      >
        <nuxt-link
          v-if="index !== items.length - 1"
          trailing-slash="append"
          prefetch-on="interaction"
          class="font-semibold text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover"
          :class="
            variant === 'pills'
              ? 'rounded-full border border-ui-panel-border bg-ui-panel-bg px-2.5 py-0.5'
              : ''
          "
          :to="crumb.slug"
        >
          <span>{{ crumb.title }} </span>
        </nuxt-link>
        <span
          v-else
          class="font-medium"
          :class="
            variant === 'pills'
              ? 'rounded-full border border-ui-panel-border bg-ui-panel-bg px-2.5 py-0.5 text-ui-muted'
              : ''
          "
        >
          {{ crumb.title }}
        </span>
        <svg-icon
          v-if="index !== items.length - 1"
          class="mx-2 size-5 rotate-90 text-ui-muted"
          :class="variant === 'pills' ? 'mx-0.5' : ''"
          name="client/chevron-up"
        />
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
import { pickVariant } from "#shared/utils/block-variant";

const { breadcrumbs } = defineProps<{
  breadcrumbs: PostBreadcrumb[];
}>();

const siteConfig = useSiteConfig();
const { variantFor } = useUiTheme();

const VARIANTS = ["slash", "pills", "back"] as const;

const variant = computed(() =>
  pickVariant(VARIANTS, "slash", variantFor("breadcrumbs")),
);

// Первую крошку строит сервер из `breadcrumbTitle` главной страницы, а его
// там может не быть вовсе — тогда подпись даёт конфиг сайта.
const items = computed(() =>
  breadcrumbs.map((crumb, index) =>
    index === 0 && !crumb.title
      ? { ...crumb, title: siteConfig.value.layout.breadcrumbs.homeLabel }
      : crumb,
  ),
);

// «Назад» ведёт в родительский раздел, а у страницы первого уровня родителя
// нет — там это главная.
const backCrumb = computed(() => items.value[items.value.length - 2] || null);

const itemListElement = computed(() =>
  breadcrumbs.map((crumb, index: number) => {
    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        "@id": crumb.slug,
        name: crumb.title,
      },
    };
  }),
);

useSchemaOrg([
  {
    "@type": "BreadcrumbList",
    itemListElement: itemListElement.value,
  },
]);
</script>
