<template>
  <div>
    <div
      v-for="(item, index) in sectionsWithBg"
      :key="item.section.uid || index"
    >
      <div
        :class="item.bg.wrapClass"
        :style="item.bg.wrapStyle"
      >
        <div :class="CONTAINER">
          <section
            :class="item.bg.boxClass"
            :style="item.bg.boxStyle"
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
import {
  normalizeSectionLayout,
  sectionBackgroundColor,
  sectionBackgroundImage,
} from "#shared/utils/section-style";

const { sections } = defineProps<{
  sections: PostSection[];
  slug?: string;
}>();

const { enabled: heroEnabled, leadBody } = useHeroContent();
const { theme } = useUiTheme();

const CONTAINER = "px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto";

const CLOUDINARY_CLOUD_NAME = useRuntimeConfig().public
  .CLOUDINARY_CLOUD_NAME as string;

/**
 * Фон и ширина одной секции. "color"/"image" несут фон сами, своей width;
 * "site" берёт --ui-section-bg и width темы целиком — width самой секции
 * здесь не в счёт, оператор явно выбрал «как у сайта»; "none" гасит фон
 * темы даже там, где он есть. full красит внешнюю обёртку (во всю ширину,
 * без скругления), container — сам <section> внутри CONTAINER (со
 * скруглением и внутренним отступом) — тем же приёмом, что «Радиус»/«Фон
 * секций по умолчанию» темы, `p-primary-1` вместо ручных py/px.
 */
const sectionBg = (section: PostSection) => {
  const layout = normalizeSectionLayout(section.layout);

  let width = layout.width;
  let color = "";
  let image = "";

  if (layout.mode === "color") {
    color = sectionBackgroundColor(layout.bg);
  } else if (layout.mode === "image") {
    image = sectionBackgroundImage(layout.image, CLOUDINARY_CLOUD_NAME);
  } else if (layout.mode === "site") {
    const themeBg = theme.value?.decor?.sectionBg;

    width = themeBg?.width === "full" ? "full" : "container";
    color = themeBg?.token ? "var(--ui-section-bg)" : "";
  }

  const hasBg = Boolean(color || image);
  const style = hasBg
    ? [
        color && `background-color:${color}`,
        image && `background-image:${image}`,
      ]
        .filter(Boolean)
        .join(";")
    : "";

  return {
    wrapClass:
      hasBg && width === "full"
        ? "w-full bg-cover bg-center bg-no-repeat p-primary-1"
        : "",
    wrapStyle: hasBg && width === "full" ? style : "",
    boxClass:
      hasBg && width !== "full"
        ? "w-full bg-cover bg-center bg-no-repeat rounded-primary p-primary-1"
        : "w-full",
    boxStyle: hasBg && width !== "full" ? style : "",
  };
};

const sectionsWithBg = computed(() =>
  sections.map((section) => ({ section, bg: sectionBg(section) })),
);
</script>
