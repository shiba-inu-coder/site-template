<template>
  <div
    class="grid grid-cols-1 gap-8 justify-center w-full"
    :class="cardsPerRowDesktop"
  >
    <template
      v-for="(item, i) in items"
      :key="i"
    >
      <div
        v-if="variant === 'text'"
        class="flex flex-col gap-2 p-4 bg-ui-card-bg rounded-primary border border-ui-card-border border-l-4 border-l-ui-marker"
      >
        <div
          v-if="item.title"
          class="text-step-5 font-medium text-ui-card-title"
          v-html="safeHTMLWrap(item.title)"
        ></div>
        <div
          v-if="item.text"
          class="text-step-7"
          v-html="safeHTMLWrap(item.text)"
        ></div>
        <PostButtonRef
          v-if="item.buttonText"
          class="mt-auto"
          size="small"
          position="left"
          :padding="false"
          :name="item.buttonText"
          :slug="item.refLink || globalRefLink || undefined"
        />
      </div>

      <component
        :is="item.refLink || globalRefLink ? 'a' : 'div'"
        v-else-if="variant === 'image-caption'"
        :href="
          item.refLink || globalRefLink
            ? useFakeRefLink(item.refLink || globalRefLink)
            : undefined
        "
        :target="item.refLink || globalRefLink ? '_blank' : undefined"
        :rel="item.refLink || globalRefLink ? 'nofollow noopener' : undefined"
        :data-id="item.refLink || globalRefLink ? 'ref_link' : undefined"
        class="flex flex-col overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
      >
        <div
          v-if="item.img"
          class="aspect-video overflow-hidden"
        >
          <NuxtImg
            loading="lazy"
            provider="cloudinary"
            :width="imgWidth"
            :height="imgHeight"
            class="w-full h-full object-cover"
            :alt="item.img.alt"
            :src="item.img.path"
            :modifiers="{ roundCorner: roundCorner }"
          />
        </div>
        <span
          v-if="item.title"
          class="p-3 text-step-8 text-ui-muted"
          v-html="safeHTMLWrap(item.title)"
        ></span>
      </component>

      <div
        v-else-if="variant === 'image-title-text'"
        class="flex flex-col overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
      >
        <div
          v-if="item.img"
          class="aspect-video overflow-hidden"
        >
          <NuxtImg
            loading="lazy"
            provider="cloudinary"
            :width="imgWidth"
            :height="imgHeight"
            class="w-full h-full object-cover"
            :alt="item.img.alt"
            :src="item.img.path"
            :modifiers="{ roundCorner: roundCorner }"
          />
        </div>
        <div class="flex flex-col gap-2 grow p-4">
          <div
            v-if="item.title"
            class="text-step-5 font-medium text-ui-card-title"
            v-html="safeHTMLWrap(item.title)"
          ></div>
          <div
            v-if="item.text"
            class="text-step-7"
            v-html="safeHTMLWrap(item.text)"
          ></div>
          <PostButtonRef
            v-if="item.buttonText"
            class="mt-auto"
            size="small"
            position="left"
            :padding="false"
            :name="item.buttonText"
            :slug="item.refLink || globalRefLink || undefined"
          />
        </div>
      </div>

      <div
        v-else-if="variant === 'horizontal'"
        class="flex overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
      >
        <div
          v-if="item.img"
          class="w-[36%] shrink-0"
        >
          <NuxtImg
            loading="lazy"
            provider="cloudinary"
            :width="imgWidth"
            :height="imgHeight"
            class="w-full h-full object-cover"
            :alt="item.img.alt"
            :src="item.img.path"
            :modifiers="{ roundCorner: roundCorner }"
          />
        </div>
        <div class="flex flex-col gap-2 grow p-4">
          <div
            v-if="item.title"
            class="text-step-5 font-medium text-ui-card-title"
            v-html="safeHTMLWrap(item.title)"
          ></div>
          <div
            v-if="item.text"
            class="text-step-7"
            v-html="safeHTMLWrap(item.text)"
          ></div>
          <PostButtonRef
            v-if="item.buttonText"
            class="mt-auto"
            size="small"
            position="left"
            :padding="false"
            :name="item.buttonText"
            :slug="item.refLink || globalRefLink || undefined"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
      >
        <div
          v-if="item.logo || item.img"
          class="flex items-center justify-center h-14 px-3 bg-ui-page-bg border-b border-ui-card-border"
        >
          <span
            v-if="item.logo"
            class="font-bold tracking-wide uppercase text-ui-heading"
            >{{ item.logo }}</span
          >
          <NuxtImg
            v-else-if="item.img"
            loading="lazy"
            provider="cloudinary"
            :width="imgWidth"
            :height="imgHeight"
            class="h-auto w-auto max-h-10 max-w-[160px] object-contain"
            :alt="item.img.alt"
            :src="item.img.path"
            :modifiers="{ roundCorner: roundCorner }"
          />
        </div>
        <div class="flex flex-col gap-2 grow p-4">
          <div
            v-if="item.score"
            class="flex items-center justify-between gap-2"
          >
            <PostStars :score="item.score" />
            <span
              class="inline-flex items-center px-2.5 py-0.5 font-bold text-step-8 rounded-full bg-ui-badge-bg text-ui-badge-text"
              >{{ item.score }}</span
            >
          </div>
          <div
            v-if="item.bonus"
            class="font-bold text-step-5 text-ui-heading"
          >
            {{ item.bonus }}
          </div>
          <div
            v-if="item.title"
            class="text-step-6 font-medium text-ui-card-title"
            v-html="safeHTMLWrap(item.title)"
          ></div>
          <div
            v-if="item.text"
            class="text-step-8 text-ui-muted"
            v-html="safeHTMLWrap(item.text)"
          ></div>
          <PostButtonRef
            v-if="item.buttonText"
            class="mt-auto"
            size="small"
            position="left"
            :padding="false"
            :name="item.buttonText"
            :slug="item.refLink || globalRefLink || undefined"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { seoConfig } from "@@/seo.conf";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { pickVariant } from "#shared/utils/block-variant";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import PostStars from "#rc/components/post/PostStars.vue";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = [
  "text",
  "image-caption",
  "image-title-text",
  "horizontal",
  "offer",
] as const;

// Не enum, а перевод: "1" и "2" писала панель до появления вариантов вёрстки,
// и записи с ними лежат в базе у каждого сайта.
const LEGACY: Record<string, string> = {
  "1": "image-caption",
  "2": "image-title-text",
};

const list = computed(() => getShortcode({ uniqId, shortcode: "gridCards" }));

const variant = computed(() => {
  const own = list.value?.data.variant;

  return pickVariant(
    VARIANTS,
    "text",
    own && LEGACY[own] ? LEGACY[own] : own,
    variantFor("gridCards"),
  );
});

const items = computed(() => list.value?.data.data ?? []);

const cardsPerRowDesktop = computed(() => {
  const data: Record<string, string> = {
    "1": "lg:grid-cols-1",
    "2": "lg:grid-cols-2",
    "3": "lg:grid-cols-3",
    "4": "lg:grid-cols-4",
    "5": "lg:grid-cols-5",
    "6": "lg:grid-cols-6",
    "7": "lg:grid-cols-7",
    "8": "lg:grid-cols-8",
    "9": "lg:grid-cols-9",
    "10": "lg:grid-cols-10",
    "11": "lg:grid-cols-11",
    "12": "lg:grid-cols-12",
  };
  return data[list.value?.data.cardsPerRowDesktop ?? "1"];
});

function isNumber(value: string) {
  return !isNaN(Number(value)) && value.trim() !== "";
}

const imgWidth = computed(() => {
  const raw = list.value?.data.imgWidth ?? "auto";
  return isNumber(raw) ? parseInt(raw) : raw;
});
const imgHeight = computed(() => {
  const raw = list.value?.data.imgHeight ?? "auto";
  return isNumber(raw) ? parseInt(raw) : raw;
});

const roundCorner = computed(
  () => list.value?.data.imgRoundCorner || seoConfig.img.modifiers.roundCorner,
);

const globalRefLink = computed(() => list.value?.data.refLink ?? "");
</script>
