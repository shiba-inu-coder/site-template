<template>
  <div
    class="grid grid-cols-1 gap-8 justify-center w-full"
    :class="cardsPerRowDesktop"
  >
    <template
      v-for="(item, i) in items"
      :key="i"
    >
      <component
        :is="refLinkOf(item) ? 'a' : 'div'"
        v-if="variant === 'image'"
        v-bind="refAttrs(item)"
        class="block overflow-hidden rounded-primary border border-ui-card-border"
      >
        <NuxtImg
          v-if="item.img"
          loading="lazy"
          provider="cloudinary"
          :width="imgWidth"
          :height="imgHeight"
          class="w-full h-full object-cover"
          :alt="item.img.alt"
          :src="item.img.path"
          :modifiers="{ roundCorner: roundCorner }"
        />
      </component>

      <component
        :is="refLinkOf(item) ? 'a' : 'div'"
        v-else-if="variant === 'image-caption'"
        v-bind="refAttrs(item)"
        class="flex overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
        :class="horizontal ? 'items-center' : 'flex-col'"
      >
        <div
          v-if="item.img"
          :class="imgBoxClass"
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
        v-else
        class="flex overflow-hidden bg-ui-card-bg rounded-primary border border-ui-card-border"
        :class="horizontal ? '' : 'flex-col'"
      >
        <div
          v-if="item.img"
          :class="imgBoxClass"
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
            :slug="refLinkOf(item) || undefined"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { resolveGridCardsLayout } from "#shared/utils/grid-cards-layout";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

type GridCardItem = PostGridCard["data"]["data"][number];

const siteConfig = useSiteConfig();

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

const list = computed(() => getShortcode({ uniqId, shortcode: "gridCards" }));

const layout = computed(() =>
  resolveGridCardsLayout(
    list.value?.data.variant,
    variantFor("gridCards"),
    list.value?.data.horizontal,
  ),
);

const variant = computed(() => layout.value.variant);

// У состава image рядом с картинкой нечего класть, поэтому флаг он не читает.
const horizontal = computed(() => layout.value.horizontal);

const imgBoxClass = computed(() =>
  horizontal.value ? "w-[36%] shrink-0" : "aspect-video overflow-hidden",
);

const items = computed(() => list.value?.data.data ?? []);

// md — та же граница мобильного/десктопа, что и везде в шаблоне: ниже неё
// карточки всегда в одну колонку, сколько бы ни задал оператор.
const cardsPerRowDesktop = computed(() => {
  const data: Record<string, string> = {
    "1": "md:grid-cols-1",
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-3",
    "4": "md:grid-cols-4",
    "5": "md:grid-cols-5",
    "6": "md:grid-cols-6",
    "7": "md:grid-cols-7",
    "8": "md:grid-cols-8",
    "9": "md:grid-cols-9",
    "10": "md:grid-cols-10",
    "11": "md:grid-cols-11",
    "12": "md:grid-cols-12",
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
  () =>
    list.value?.data.imgRoundCorner ||
    siteConfig.value.img.modifiers.roundCorner,
);

const globalRefLink = computed(() => list.value?.data.refLink ?? "");

const refLinkOf = (item: GridCardItem) => item.refLink || globalRefLink.value;

const refAttrs = (item: GridCardItem) =>
  refLinkOf(item)
    ? {
        href: useFakeRefLink(refLinkOf(item)),
        target: "_blank",
        rel: "nofollow noopener",
        "data-id": "ref_link",
      }
    : {};
</script>
