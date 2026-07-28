<template>
  <nav class="flex mt-4 w-full">
    <ol
      class="flex items-center overflow-x-auto not-format overflow-y-hidden text-sm"
    >
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="whitespace-nowrap flex items-center"
      >
        <nuxt-link
          v-if="index !== breadcrumbs.length - 1"
          trailing-slash="append"
          prefetch-on="interaction"
          class="font-semibold text-active-100 hover:text-active-300 transition duration-500 ease-in-out"
          :to="crumb.slug"
          :class="{
            breadcrumb: index !== breadcrumbs.length - 1,
          }"
        >
          <span>{{ crumb.title }} </span>
        </nuxt-link>
        <span
          v-else
          class="font-medium"
        >
          {{ crumb.title }}
        </span>
        <svg-icon
          v-if="index !== breadcrumbs.length - 1"
          class="mx-2 rotate-90 text-active-200 size-5"
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
