<template>
  <div>
    <!-- CONTAINER больше не несёт своего px: горизонталь теперь задаёт
         padding.left/right оператора. Инлайновый style ниже пишет padding
         полным шорткэндом — будь у CONTAINER свой px-* на том же <section>,
         инлайн стабильно бы его перетирал (все четыре стороны разом). -->
    <div
      v-for="(section, index) in sections"
      :key="section.uid || index"
      :class="section.layout?.width === 'full' ? '' : CONTAINER"
    >
      <section
        class="w-full bg-cover bg-center bg-no-repeat"
        :style="sectionStyle(section.layout, CLOUDINARY_CLOUD_NAME)"
      >
        <div :class="section.layout?.width === 'full' ? CONTAINER : ''">
          <!-- id на заголовке, а не только на секции: оглавление ищет якорь
               через getElementById и скроллит к самому заголовку. Тот же id
               ставит запасной HTML-путь в панели. -->
          <component
            :is="index === 0 ? 'h1' : 'h2'"
            v-if="section.title"
            :id="section.uid || undefined"
          >
            {{ section.title }}
          </component>
          <RuntimeTemplateLayout
            :slug="slug"
            :template="section.body"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import { sectionStyle } from "#shared/utils/section-style";

defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

const CONTAINER = "w-full max-w-7xl mx-auto";

const CLOUDINARY_CLOUD_NAME = useRuntimeConfig().public
  .CLOUDINARY_CLOUD_NAME as string;
</script>
