<template>
  <div
    v-if="picture || data.text || data.buttonText"
    class="grid grid-cols-1 gap-4 md:gap-6 items-center"
    :class="gridColsClass"
  >
    <div
      v-if="picture"
      :class="IMAGE_ORDER[side]"
    >
      <img
        v-bind="picture"
        class="w-full h-auto"
      />
    </div>

    <div v-if="data.text || data.buttonText">
      <div
        v-if="data.text"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>

      <PostButtonRef
        v-if="data.buttonText"
        :name="data.buttonText"
        :position="data.buttonPosition"
        :size="data.buttonSize"
        :variant="data.buttonVariant || undefined"
        :slug="data.refLink || undefined"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import { imageLoading } from "#shared/utils/image-candidates";
import { imageSizes } from "#shared/utils/image-sizes";
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { resolveTextImageSide, textImageRole } from "#shared/utils/text-image";
import type { TextImageSide as Side } from "#shared/utils/text-image";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();
const { photo: heroPhoto } = useHeroContent();
const layout = useImageLayout();
const buildImage = useResponsiveImage();

// text приходит абзацами и инлайн-разметкой шире общего списка
// safeHTMLWrap — extraTags расширяет allowlist только для этого вызова.
const TEXT_TAGS = ["p", "em", "u", "s", "sup", "sub", "blockquote"];

// Классы перечислены целиком: tailwind.config.js сканирует только .vue,
// контент из базы он не видит, поэтому собранные строкой классы
// (`md:grid-cols-${...}`) в сборку не попадут.
const GRID_COLS: Record<Side, string> = {
  left: "md:grid-cols-2",
  right: "md:grid-cols-2",
  top: "",
  bottom: "",
};

// На телефоне колонка одна, и картинка сбоку встаёт над текстом.
const IMAGE_ORDER: Record<Side, string> = {
  left: "order-first",
  right: "order-first md:order-last",
  top: "order-first",
  bottom: "order-last",
};

const FALLBACK: PostTextImage = {
  data: {
    uniqId: "",
    text: "",
    img: null,
    imgHint: "",
    imgSide: "right",
    imgRoundCorner: "0",
    buttonText: "",
    buttonPosition: "left",
    buttonSize: "small",
    buttonVariant: "outline",
    refLink: "",
  },
};

// Маркер в тексте может пережить удаление своей записи из конфига.
const data = computed(
  () => (getShortcode({ uniqId, shortcode: "textImages" }) || FALLBACK).data,
);

const side = computed(() => resolveTextImageSide(data.value.imgSide));

// Картинка, уехавшая в хиро, здесь не рисуется, а текст и кнопка блока
// остаются в лиде.
const picture = computed(() => {
  const img = data.value.img;

  if (!img?.path || heroPhoto.value?.uniqId === uniqId) {
    return null;
  }

  return {
    ...buildImage(img, imageSizes(textImageRole(side.value), layout.value), {
      roundCorner: data.value.imgRoundCorner,
    }),
    ...imageLoading(false),
    alt: img.alt,
  };
});

// Без картинки колонка всегда одна — иначе пустая вторая колонка осталась бы
// рядом с текстом (старый блок с картинкой прямо в HTML текста).
const gridColsClass = computed(() =>
  picture.value ? GRID_COLS[side.value] : "",
);
</script>
