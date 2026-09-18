<template>
  <div>
    <!-- Полоса фона — своей обёрткой, а не отрицательными полями на
         контейнере: `#article` и так во всю ширину, и фону хватает обычного
         блока вокруг центрированной колонки. -->
    <div
      v-for="(section, index) in sections"
      :key="section.uid || index"
      :class="isBand(index) ? 'band' : ''"
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

const { frame } = useUiTheme();
const { enabled: heroEnabled, leadBody } = useHeroContent();

const CONTAINER = "w-full max-w-7xl mx-auto";

// Полосу получает каждая вторая секция, начиная со второй: первая — лид, и
// подложка под ним спорила бы с хиро.
const isBand = (index: number) => Boolean(frame.value.bands) && index % 2 === 1;
</script>
