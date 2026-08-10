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

/**
 * Статья, собранная конструктором AppsPro. Каждая секция — свой фон, своя
 * ширина и свои отступы, поэтому общей обёртки `max-w-7xl` над ними нет:
 * контейнер ставит либо сама секция, либо её содержимое.
 *
 * Полноширинная секция обходится без `100vw` и отрицательного маргина, которые
 * нужны запасному HTML-пути: там разметка живёт внутри общего контейнера и
 * выбирается из него силой. Здесь секция и так во всю ширину страницы, а в
 * колонку загоняется её внутренность. Побочно это снимает и горизонтальный
 * скролл, ради которого тому пути нужен `overflow-x: clip`.
 *
 * Тело секции компилируется тем же `RuntimeTemplateLayout`, что и цельный
 * `content`: шорткоды внутри работают без единой правки, потому что
 * `shortcodesConfig` лежит на посте целиком, а `uniqId` адресует блок по всей
 * статье, а не внутри секции.
 */

defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

// Шкала контейнера из docs/ui.md, литералом: класс, собранный из кусков, до
// сборки не доедет — `@config` в tailwind.css отключает автосканирование.
const CONTAINER = "px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto";

const CLOUDINARY_CLOUD_NAME = useRuntimeConfig().public
  .CLOUDINARY_CLOUD_NAME as string;
</script>
