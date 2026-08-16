<template>
  <div>
    <section
      v-for="(section, index) in sections"
      :key="section.uid || index"
      class="w-full bg-cover bg-center bg-no-repeat"
      :class="section.layout?.width === 'full' ? '' : CONTAINER"
      :style="sectionStyle(section.layout, CLOUDINARY_CLOUD_NAME)"
    >
      <div :class="section.layout?.width === 'full' ? CONTAINER : ''">
        <!-- id на заголовке, а не только на секции: оглавление ищет якорь
             через getElementById и скроллит к самому заголовку. Тот же id
             ставит запасной HTML-путь в панели. -->
        <h2
          v-if="section.title"
          :id="section.uid || undefined"
        >
          {{ section.title }}
        </h2>
        <RuntimeTemplateLayout
          :slug="slug"
          :template="section.body"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import { sectionStyle } from "#shared/utils/section-style";

defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

const CONTAINER = "px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto";

const CLOUDINARY_CLOUD_NAME = useRuntimeConfig().public
  .CLOUDINARY_CLOUD_NAME as string;
</script>
