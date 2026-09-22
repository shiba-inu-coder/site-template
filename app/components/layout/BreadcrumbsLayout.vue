<template>
  <nav class="mt-4 flex w-full">
    <ol
      class="not-format flex items-center overflow-x-auto overflow-y-hidden text-step-8"
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
          :to="crumb.slug"
        >
          {{ crumb.title }}
        </nuxt-link>
        <span
          v-else
          class="font-medium text-ui-text"
          aria-current="page"
        >
          {{ crumb.title }}
        </span>
        <svg-icon
          v-if="index !== items.length - 1"
          class="mx-2 size-5 rotate-90 text-ui-muted"
          name="client/chevron-up"
        />
      </li>
    </ol>
  </nav>
</template>
<script setup lang="ts">
const { breadcrumbs } = defineProps<{
  breadcrumbs: PostBreadcrumb[];
}>();

const siteConfig = useSiteConfig();

// Первая крошка — всегда главная, и подписана она именем бренда: сервер берёт
// её подпись из `breadcrumbTitle` главной, а панель у главной это поле не
// заполняет. Шаблон, к которому бренд ещё не применён, имени не знает — ему
// остаётся прежняя цепочка.
const items = computed(() =>
  breadcrumbs.map((crumb, index) =>
    index === 0
      ? {
          ...crumb,
          title:
            siteConfig.value.site.name ||
            crumb.title ||
            siteConfig.value.layout.breadcrumbs.homeLabel,
        }
      : crumb,
  ),
);

const itemListElement = computed(() =>
  items.value.map((crumb, index: number) => {
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
