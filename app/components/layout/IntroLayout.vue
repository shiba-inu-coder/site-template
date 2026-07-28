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
        ? `background-image: url(https://res.cloudinary.com/duhutcvan/image/upload/f_auto,q_auto,o_30/${introImg.img.path});`
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
          class="text-primary-5 text-accent-200 font-medium block"
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
              class="text-white"
              v-html="intro"
            ></div>
            <PostButtonRef
              v-if="isAllow"
              :size="'big'"
              slug="mafia-casino"
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
            :modifiers="{ roundCorner: '15' }"
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
const { title, postDated, intro, breadcrumbs, introImg } = usePost();

const isAllow = computed(() => breadcrumbs.value.length === 0);
</script>
