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
        <img
          v-if="item.img?.path"
          v-bind="cardImage(item.img)"
          class="w-full h-full object-cover"
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
          v-if="item.img?.path"
          :class="imgBoxClass"
        >
          <img
            v-bind="cardImage(item.img)"
            :class="imgFitClass"
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
          v-if="item.img?.path"
          :class="imgBoxClass"
        >
          <img
            v-bind="cardImage(item.img)"
            :class="imgFitClass"
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
import { imageLoading } from "#shared/utils/image-candidates";
import { imageSizes } from "#shared/utils/image-sizes";

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

// Вертикальная обложка стоит в боксе 16:9 и вписывается целиком (обложки
// игр почти квадратные — cover резал их пополам). У горизонтальной бокса
// с пропорцией нет, колонка тянется по высоте текста, и contain оставил бы
// в ней полосы — там картинка заполняет колонку.
const imgFitClass = computed(() =>
  horizontal.value
    ? "w-full h-full object-cover"
    : "w-full h-full object-contain",
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

const pixels = (raw: string | undefined) => {
  const value = `${raw ?? ""}`.trim();

  return /^\d+(\.\d+)?(px)?$/.test(value) ? parseInt(value) : undefined;
};

// imgWidth/imgHeight записи — размер, заданный оператором руками («auto» по
// умолчанию), а не размер файла.
const ownSize = computed(() => ({
  width: pixels(list.value?.data.imgWidth),
  height: pixels(list.value?.data.imgHeight),
}));

const roundCorner = computed(
  () =>
    list.value?.data.imgRoundCorner ||
    siteConfig.value.img.modifiers.roundCorner,
);

const $img = useCloudinaryImage();
const imageLayout = useImageLayout();
const buildImage = useResponsiveImage();

const sizes = computed(() =>
  imageSizes(
    {
      kind: "card",
      perRow: Number(list.value?.data.cardsPerRowDesktop ?? 1),
      horizontal: variant.value !== "image" && horizontal.value,
    },
    imageLayout.value,
  ),
);

// Вертикальная карточка держит место своим aspect-video, и картинка в нём
// вписывается целиком — размеры оригинала там ничего не решают. У
// горизонтальной и у image высоту до загрузки держат только они.
const withDimensions = computed(
  () => variant.value === "image" || horizontal.value,
);

const cardImage = (img: PostShortcodeImage) => {
  const { width, height } = ownSize.value;

  // Размер задан руками — он же остаётся и в трансформации, как было при
  // NuxtImg: 1x/2x от заданного вместо лестницы по оригиналу.
  if (width || height) {
    const { src, srcset } = $img.getSizes(img.path, {
      provider: "cloudinary",
      modifiers: { roundCorner: roundCorner.value, width, height },
    });

    return { src, srcset, width, height, ...imageLoading(false), alt: img.alt };
  }

  const {
    width: fileWidth,
    height: fileHeight,
    ...attrs
  } = buildImage(img, sizes.value, { roundCorner: roundCorner.value });

  return {
    ...attrs,
    ...(withDimensions.value && fileWidth
      ? { width: fileWidth, height: fileHeight }
      : {}),
    ...imageLoading(false),
    alt: img.alt,
  };
};

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
