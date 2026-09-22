<template>
  <aside class="hidden md:sticky md:top-24 md:grid md:gap-4 md:self-start">
    <PostTableContent v-if="hasOwnToc" />
    <nav
      v-else-if="autoToc.length"
      class="rounded-primary border border-ui-panel-border bg-ui-panel-bg p-4 text-step-7"
    >
      <span
        class="mb-2 block text-step-9 uppercase tracking-wide text-ui-heading"
      >
        {{ siteConfig.translates.tableContent }}
      </span>
      <ol class="not-format grid list-decimal gap-1.5 pl-5">
        <li
          v-for="item in autoToc"
          :key="item.uid"
        >
          <a
            :href="`#${item.uid}`"
            class="text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover"
          >
            {{ item.title }}
          </a>
        </li>
      </ol>
    </nav>

    <div
      v-if="showOffer && hasOffer"
      class="grid gap-2 rounded-primary border border-ui-card-border bg-ui-card-bg p-4 text-center"
    >
      <NuxtImg
        v-if="entity?.logo?.path"
        provider="cloudinary"
        width="auto"
        height="40"
        class="mx-auto h-auto max-h-10 w-auto object-contain"
        :src="entity.logo.path"
        :alt="entity.logo.alt"
        :modifiers="siteConfig.img.modifiers"
      />
      <span
        v-if="entity?.title"
        class="font-semibold text-ui-heading"
        >{{ entity.title }}</span
      >
      <span
        v-if="bonus"
        class="font-bold text-step-6 text-ui-accent-soft"
        >{{ bonus }}</span
      >
      <CtaButtonLayout
        v-if="hasCta"
        full-width
        :label="buttonLabel"
        :link="buttonLink"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import CtaButtonLayout from "#rc/components/layout/CtaButtonLayout.vue";
import PostTableContent from "#rc/components/post/PostTableContent.vue";

const { showOffer = false } = defineProps<{
  // `toc-offer` против `toc`: колонка либо только оглавление, либо ещё и
  // карточка казино, о котором страница.
  showOffer?: boolean;
}>();

const siteConfig = useSiteConfig();
const { sections, tableContent } = usePost();
const { entity, bonus, buttonLabel, buttonLink, hasCta, hasOffer } =
  usePageOffer();

const hasOwnToc = computed(() => tableContent.value.length > 0);

// Оглавления в статье может не быть вовсе — тогда колонка собирает его сама
// по заголовкам секций. Первая секция — это H1 страницы, и в список она не
// идёт.
const autoToc = computed(() =>
  hasOwnToc.value
    ? []
    : sections.value
        .slice(1)
        .filter((section) => section.uid && section.title)
        .map((section) => ({ uid: section.uid, title: section.title })),
);
</script>
