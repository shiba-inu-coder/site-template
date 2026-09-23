<template>
  <div>
    <div
      v-for="(section, index) in sections"
      :key="section.uid || index"
    >
      <div :class="CONTAINER">
        <section class="w-full">
          <!-- id на заголовке, а не только на секции: оглавление ищет якорь
               через getElementById и скроллит к самому заголовку. Тот же id
               ставит запасной HTML-путь в панели. -->
          <component
            :is="index === 0 ? 'h1' : 'h2'"
            v-if="section.title && !(index === 0 && heroEnabled)"
            :id="section.uid || undefined"
          >
            {{ section.title }}
          </component>
          <RuntimeTemplateLayout
            :slug="slug"
            :template="index === 0 && heroEnabled ? leadBody : section.body"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";

defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

const { enabled: heroEnabled, leadBody } = useHeroContent();

const CONTAINER = "px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto";
</script>
