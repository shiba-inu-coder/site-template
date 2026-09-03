<template>
  <div class="w-full relative bg-primary-200/50 py-5.5 mb-2">
    <div class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto">
      <span
        v-if="postDated"
        class="text-step-8 text-accent-200 font-medium block"
      >
        {{ seoConfig.translates.lastUpdated }}:
        <NuxtTime
          :datetime="postDated"
          month="long"
          day="2-digit"
          :locale="seoConfig.site.lang"
          year="numeric"
        />
      </span>
      <div class="flex flex-wrap lg:flex-nowrap justify-center items-center md:gap-10">
        <div>
          <h1>{{ lead?.title }}</h1>
          <RuntimeTemplateLayout
            :slug="slug"
            :template="lead?.body"
          />
          <PostButtonRef
            v-if="isAllow"
            :size="'big'"
            :slug="seoConfig.site.brandSlug"
            position="left"
            >{{ seoConfig.translates.playNow }}</PostButtonRef
          >
        </div>
      </div>

      <BreadcrumbsLayout
        v-if="breadcrumbs.length"
        :breadcrumbs="breadcrumbs"
      ></BreadcrumbsLayout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import { seoConfig } from "@@/seo.conf";
const { postDated, breadcrumbs, sections, slug } = usePost();

const lead = computed(() => sections.value[0]);
const isAllow = computed(() => breadcrumbs.value.length === 0);
</script>
