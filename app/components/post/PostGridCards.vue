<template>
  <div
    class="grid grid-cols-1 gap-8 justify-center w-full"
    :class="cardsPerRowDesktop"
  >
    <template
      v-for="(item, i) in list.data.data"
      :key="i"
    >
      <template v-if="list.data.variant === '1'">
        <component
          :is="item.refLink || globalRefLink ? 'a' : 'div'"
          :href="item.refLink || globalRefLink"
        >
          <div class="flex flex-col justify-center items-center">
            <div
              :style="`max-width: ${imgWidth}px; max-height: ${imgHeight}px`"
            >
              <NuxtImg
                loading="lazy"
                provider="cloudinary"
                :width="imgWidth"
                :height="imgHeight"
                class="w-full"
                :alt="item.img.alt"
                :src="item.img.path"
                :modifiers="{
                  roundCorner:
                    list.data.imgRoundCorner ||
                    seoConfig.img.modifiers.roundCorner,
                }"
              />
            </div>
            <div
              v-if="item.title"
              class="text-center text-primary-2 mt-2 font-medium text-accent-200"
              v-html="safeHTMLWrap(item.title)"
            ></div>
          </div>
        </component>
      </template>
      <template v-if="list.data.variant === '2'">
        <div
          class="flex flex-col items-center bg-primary-100 py-3 px-5 rounded-primary border-2 border-primary-300"
        >
          <div
            v-if="item.title"
            class="text-center text-primary-2 font-medium text-accent-200"
            v-html="safeHTMLWrap(item.title)"
          ></div>
          <NuxtImg
            loading="lazy"
            provider="cloudinary"
            :width="imgWidth"
            :height="imgHeight"
            class="object-fill my-3"
            :alt="item.img.alt"
            :modifiers="seoConfig.img.modifiers"
            :src="item.img.path"
          />
          <div
            v-if="item.text"
            class="text-center text-primary-4"
            v-html="safeHTMLWrap(item.text)"
          ></div>

          <a
            v-if="(item.refLink || globalRefLink) && item.buttonText"
            :href="useFakeRefLink(item.refLink || globalRefLink)"
            target="_blank"
            rel="nofollow noopener"
            data-id="ref_link"
            class="w-5/6 block bg-accent-200 px-4 py-2.5 text-center rounded-primary text-white font-medium text-primary-2 mt-3 mb-5"
          >
            {{ item.buttonText }}
          </a>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { seoConfig } from "@@/seo.conf";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();

const list = computed(() => getShortcode({ uniqId, shortcode: "gridCards" }));

const cardsPerRowDesktop = computed(() => {
  const data = {
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
  return data[list.value.data.cardsPerRowDesktop];
});

function isNumber(value) {
  return !isNaN(value) && value.trim() !== "";
}

const imgWidth = computed(() =>
  isNumber(list.value.data.imgWidth)
    ? parseInt(list.value.data.imgWidth)
    : list.value.data.imgWidth,
);
const imgHeight = computed(() =>
  isNumber(list.value.data.imgHeight)
    ? parseInt(list.value.data.imgHeight)
    : list.value.data.imgHeight,
);

const globalRefLink = computed(() => {
  return list.value.data.refLink;
});
</script>
<style lang="css">
.grid-card-title h3 {
  margin: 0px !important;
}
</style>
