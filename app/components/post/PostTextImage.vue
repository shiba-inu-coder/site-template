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
        :class="imgClass"
        :style="imgStyle"
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
import { imageDimensions, imageLoading } from "#shared/utils/image-candidates";
import { imageSizes } from "#shared/utils/image-sizes";
import { parsePixelSize } from "#shared/utils/pixel-size";
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { resolveTextImageSide, textImageRole } from "#shared/utils/text-image";
import type { TextImageSide as Side } from "#shared/utils/text-image";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();
const priorityImage = usePriorityImage();
const layout = useImageLayout();
const buildImage = useResponsiveImage();
const $img = useCloudinaryImage();

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
    imgWidth: "auto",
    imgHeight: "auto",
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

const isPriority = computed(
  () =>
    priorityImage.value?.place === "lead" &&
    priorityImage.value.uniqId === uniqId,
);

// imgWidth/imgHeight — размер, вписанный оператором («auto» — как решает
// раскладка), а не размер файла.
const ownSize = computed(() => ({
  width: parsePixelSize(data.value.imgWidth),
  height: parsePixelSize(data.value.imgHeight),
}));

const picture = computed(() => {
  const img = data.value.img;

  if (!img?.path) {
    return null;
  }

  const { width, height } = ownSize.value;
  const roundCorner = data.value.imgRoundCorner;
  const own = {
    ...imageLoading(isPriority.value),
    alt: img.alt,
  };

  // Заданная ширина остаётся и в трансформации (1x/2x от неё), а не лестница
  // по оригиналу: файл шире места на странице тут не нужен. Обе стороны
  // сразу — обрезка, поэтому fit: cover.
  if (width) {
    const { src, srcset } = $img.getSizes(img.path, {
      provider: "cloudinary",
      modifiers: {
        roundCorner,
        width,
        height,
        ...(height ? { fit: "cover" } : {}),
      },
    });
    const file = imageDimensions(img);
    const attrHeight =
      height ?? (file && Math.round((width * file.height) / file.width));

    return {
      src,
      srcset,
      width,
      ...(attrHeight ? { height: attrHeight } : {}),
      ...own,
    };
  }

  const {
    width: fileWidth,
    height: fileHeight,
    ...attrs
  } = buildImage(img, imageSizes(textImageRole(side.value), layout.value), {
    roundCorner,
  });

  // Высота без ширины режет картинку по высоте: размеры файла в атрибутах
  // обещали бы другую пропорцию, и браузер резервировал бы не то место.
  return {
    ...attrs,
    ...(!height && fileWidth ? { width: fileWidth, height: fileHeight } : {}),
    ...own,
  };
});

// Классы перечислены целиком по той же причине, что и GRID_COLS. Ширина в
// пикселях не умещается в колонку на телефоне — max-w-full её сжимает, а
// aspect-ratio держит пропорцию заданной пары. Картинка уже своей колонки
// встаёт по её центру, а не к левому краю.
const imgClass = computed(() => {
  const { width, height } = ownSize.value;

  if (width && height) {
    return "block mx-auto max-w-full h-auto object-cover";
  }

  if (width) {
    return "block mx-auto max-w-full h-auto";
  }

  return height ? "w-full object-cover" : "w-full h-auto";
});

const imgStyle = computed(() => {
  const { width, height } = ownSize.value;

  if (width && height) {
    return { width: `${width}px`, aspectRatio: `${width} / ${height}` };
  }

  if (width) {
    return { width: `${width}px` };
  }

  return height ? { height: `${height}px` } : undefined;
});

usePriorityImagePreload(
  computed(() => (isPriority.value ? picture.value : null)),
);

// Без картинки колонка всегда одна — иначе пустая вторая колонка осталась бы
// рядом с текстом (старый блок с картинкой прямо в HTML текста).
const gridColsClass = computed(() =>
  picture.value ? GRID_COLS[side.value] : "",
);
</script>
