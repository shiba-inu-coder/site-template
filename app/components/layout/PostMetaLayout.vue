<template>
  <div
    v-if="breadcrumbs.length || postDated"
    class="grid gap-2"
  >
    <BreadcrumbsLayout
      v-if="breadcrumbs.length"
      :breadcrumbs="breadcrumbs"
    ></BreadcrumbsLayout>

    <span
      v-if="postDated"
      class="block text-step-8 font-medium text-ui-heading"
    >
      {{ siteConfig.translates.lastUpdated }}:
      <NuxtTime
        :datetime="postDated"
        month="long"
        day="2-digit"
        :locale="siteConfig.site.lang"
        year="numeric"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";

const siteConfig = useSiteConfig();
const { breadcrumbs, postDated } = usePost();
</script>
