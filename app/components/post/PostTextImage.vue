<template>
  <div
    class="grid grid-cols-1 gap-4 md:gap-6 items-center"
    :class="gridColsClass"
  >
    <div
      v-if="data.img"
      :class="IMAGE_ORDER[side]"
    >
      <NuxtImg
        loading="lazy"
        provider="cloudinary"
        class="w-full h-auto"
        :src="data.img.path"
        :alt="data.img.alt"
        :sizes="SIZES[side]"
        :modifiers="{ roundCorner: data.imgRoundCorner }"
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
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";

type Side = "left" | "right" | "top" | "bottom";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();

// text приходит абзацами и инлайн-разметкой шире общего списка
// safeHTMLWrap — extraTags расширяет allowlist только для этого вызова.
const TEXT_TAGS = ["p", "em", "u", "s", "sup", "sub", "blockquote"];

const SIDES: readonly string[] = ["left", "right", "top", "bottom"];

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

const SIZES: Record<Side, string> = {
  left: "xs:100vw md:50vw",
  right: "xs:100vw md:50vw",
  top: "xs:100vw xl:1280px",
  bottom: "xs:100vw xl:1280px",
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

// full писала панель, пока положение было модификатором вариантов: одна
// колонка, картинка первой — это и есть top. Запись старше самой сетки может
// не нести стороны вовсе.
const side = computed<Side>(() => {
  const raw = data.value.imgSide;

  if (raw === "full") {
    return "top";
  }

  return SIDES.includes(raw) ? (raw as Side) : "right";
});

// Без картинки колонка всегда одна — иначе пустая вторая колонка осталась бы
// рядом с текстом (старый блок с картинкой прямо в HTML текста).
const gridColsClass = computed(() =>
  data.value.img ? GRID_COLS[side.value] : "",
);
</script>
