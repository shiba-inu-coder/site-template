<template>
  <div>
    <div
      v-for="(item, index) in sectionsWithBg"
      :key="item.section.uid || index"
      :class="item.bg.gap ? 'my-6' : ''"
    >
      <div
        :class="WRAP_CLASS[item.bg.target]"
        :style="item.bg.target === 'wrap' ? item.bg.style : ''"
      >
        <div :class="CONTAINER">
          <section
            :class="BOX_CLASS[item.bg.target]"
            :style="item.bg.target === 'box' ? item.bg.style : ''"
          >
            <!-- id на заголовке, а не только на секции: оглавление ищет якорь
                 через getElementById и скроллит к самому заголовку. Тот же id
                 ставит запасной HTML-путь в панели. -->
            <component
              :is="index === 0 ? 'h1' : 'h2'"
              v-if="item.section.title && !(index === 0 && heroEnabled)"
              :id="item.section.uid || undefined"
            >
              {{ item.section.title }}
            </component>
            <RuntimeTemplateLayout
              :slug="slug"
              :template="
                index === 0 && heroEnabled ? leadBody : item.section.body
              "
            />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import { resolveSectionBg } from "#shared/utils/section-style";
import type { SectionBgPlacement } from "#shared/utils/section-style";

const { sections } = defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

const { enabled: heroEnabled, leadBody } = useHeroContent();
const { theme } = useUiTheme();

const CONTAINER = "px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto";

const WRAP_CLASS: Record<SectionBgPlacement["target"], string> = {
  none: "",
  wrap: "w-full bg-cover bg-center bg-no-repeat p-primary-1",
  box: "",
};

const BOX_CLASS: Record<SectionBgPlacement["target"], string> = {
  none: "w-full",
  wrap: "w-full",
  box: "w-full bg-cover bg-center bg-no-repeat rounded-primary p-primary-1",
};

const CLOUDINARY_CLOUD_NAME = useRuntimeConfig().public
  .CLOUDINARY_CLOUD_NAME as string;

const sectionsWithBg = computed(() =>
  sections.map((section) => ({
    section,
    bg: resolveSectionBg(
      section.layout,
      theme.value?.decor,
      CLOUDINARY_CLOUD_NAME,
    ),
  })),
);
</script>
