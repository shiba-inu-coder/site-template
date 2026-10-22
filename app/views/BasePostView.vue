<template>
  <div id="article">
    <slot>
      <component
        :is="BrandHero"
        v-if="BrandHero"
      />
      <template v-if="!needsContent">
        <div
          class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto pt-4 md:pt-6"
        >
          <PostMetaLayout></PostMetaLayout>
        </div>
        <PostSections
          :sections="sections"
          :slug="slug"
        />
      </template>
      <div
        v-else
        class="px-2.5 md:px-4 xl:px-0 w-full max-w-7xl mx-auto relative"
      >
        <RuntimeTemplateLayout
          :slug="slug"
          :template="content"
        />
      </div>
      <StickyCtaLayout
        v-if="stickyVariant !== 'none'"
        :variant="stickyVariant"
      ></StickyCtaLayout>
      <ButtonFastUpLayout></ButtonFastUpLayout>
    </slot>
  </div>
</template>
<script setup lang="ts">
import PostMetaLayout from "#rc/components/layout/PostMetaLayout.vue";
import RuntimeTemplateLayout from "#rc/components/layout/RuntimeTemplateLayout.vue";
import StickyCtaLayout from "#rc/components/layout/StickyCtaLayout.vue";
import { getBrandPart } from "#rc/utils/brand";
import PostSections from "#rc/components/post/PostSections.vue";
import ButtonFastUpLayout from "#rc/components/layout/ButtonFastUpLayout.vue";
import { pickVariant } from "#shared/utils/block-variant";
import { postNeedsContent } from "#shared/utils/post-content";

const { content, sections, slug } = usePost();

const { frame } = useUiTheme();

const BrandHero = getBrandPart("Hero");

const needsContent = computed(() =>
  postNeedsContent({ sections: sections.value }),
);

const stickyVariant = computed(() =>
  pickVariant(
    ["none", "bar", "bar-float", "button"] as const,
    "none",
    frame.value.sticky,
  ),
);

usePostSchema();
</script>
