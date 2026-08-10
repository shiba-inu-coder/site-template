<template>
  <div
    class="w-full relative"
    :class="{
      'bg-center lg:bg-right bg-fixed bg-cover bg-no-repeat':
        introImg.isFullScreen,
      'bg-primary-200/50 py-5.5 mb-2': !introImg.isFullScreen,
    }"
    :style="
      introImg.isFullScreen
        ? `background-image: url(${CLOUDINARY_BASE_URL}f_auto,q_auto,o_30/${introImg.img.path});`
        : ''
    "
  >
    <div
      :class="{
        'bg-primary-100/80 py-6 md:py-10': introImg.isFullScreen,
      }"
    >
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
        <div
          class="flex flex-wrap lg:flex-nowrap justify-center items-center md:gap-10"
        >
          <div>
            <h1>{{ title }}</h1>
            <div
              class="text-surface-text"
              v-html="intro"
            ></div>
            <PostButtonRef
              v-if="isAllow"
              :size="'big'"
              :slug="seoConfig.site.brandSlug"
              position="left"
              >{{ seoConfig.translates.playNow }}</PostButtonRef
            >
          </div>
          <NuxtImg
            v-if="isAllow && !introImg.isFullScreen"
            provider="cloudinary"
            :height="introImg.height"
            :width="introImg.width"
            fetchpriority="high"
            :src="introImg.img.path"
            :alt="introImg.img.alt"
            :modifiers="seoConfig.img.modifiers"
          />
        </div>

        <BreadcrumbsLayout
          v-if="breadcrumbs.length"
          :breadcrumbs="breadcrumbs"
        ></BreadcrumbsLayout>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreadcrumbsLayout from "#rc/components/layout/BreadcrumbsLayout.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import { seoConfig } from "@@/seo.conf";
import { getCloudinaryBaseUrl } from "#rc/utils/get-cloudinary-base-url";
const { title, postDated, intro, breadcrumbs, introImg } = usePost();

const isAllow = computed(() => breadcrumbs.value.length === 0);
const CLOUDINARY_BASE_URL = computed(() =>
  getCloudinaryBaseUrl(useRuntimeConfig().public.CLOUDINARY_CLOUD_NAME),
);
</script>
