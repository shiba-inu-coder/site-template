<template>
  <div>
    <div
      v-if="variant === 'overlay'"
      class="relative overflow-hidden rounded-primary"
    >
      <NuxtImg
        v-if="data.img"
        loading="lazy"
        provider="cloudinary"
        class="w-full h-full object-cover aspect-[21/9]"
        :src="data.img.path"
        :alt="data.img.alt"
        :sizes="SIZES.full"
        :modifiers="{ roundCorner: data.imgRoundCorner }"
      />
      <div
        v-if="data.text"
        class="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-linear-to-t from-ui-page-bg/90 to-transparent"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>
    </div>

    <div
      v-else-if="variant === 'card'"
      class="grid grid-cols-1 gap-4 md:gap-6 items-start p-4 bg-ui-card-bg rounded-primary border border-ui-card-border"
      :class="cardColsClass"
    >
      <div
        v-if="data.img"
        :class="imageOrderClass"
      >
        <NuxtImg
          loading="lazy"
          provider="cloudinary"
          class="w-full h-auto rounded-primary"
          :src="data.img.path"
          :alt="data.img.alt"
          :sizes="SIZES[sizeKey]"
          :modifiers="{ roundCorner: data.imgRoundCorner }"
        />
      </div>
      <div
        v-if="data.text"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>
    </div>

    <div v-else-if="variant === 'caption'">
      <figure
        v-if="data.img"
        class="m-0"
      >
        <NuxtImg
          loading="lazy"
          provider="cloudinary"
          class="w-full h-full object-cover aspect-[21/9] rounded-t-primary"
          :src="data.img.path"
          :alt="data.img.alt"
          :sizes="SIZES.full"
          :modifiers="{ roundCorner: data.imgRoundCorner }"
        />
        <figcaption
          v-if="data.imgHint"
          class="px-4 py-2 text-step-9 text-ui-muted bg-ui-panel-bg border border-t-0 border-ui-panel-border rounded-b-primary"
        >
          {{ data.imgHint }}
        </figcaption>
      </figure>
      <div
        v-if="data.text"
        class="mt-4"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>
    </div>

    <div v-else-if="variant === 'banner'">
      <NuxtImg
        v-if="data.img"
        loading="lazy"
        provider="cloudinary"
        class="w-full h-full object-cover aspect-[21/7] rounded-t-primary"
        :src="data.img.path"
        :alt="data.img.alt"
        :sizes="SIZES.full"
        :modifiers="{ roundCorner: data.imgRoundCorner }"
      />
      <div
        v-if="data.text"
        class="px-5 py-4 bg-ui-panel-bg border border-ui-panel-border rounded-b-primary"
        :class="data.img ? 'border-t-0' : 'rounded-t-primary'"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:gap-6 items-start"
      :class="gridColsClass"
    >
      <div
        v-if="data.img"
        :class="imageOrderClass"
      >
        <NuxtImg
          loading="lazy"
          provider="cloudinary"
          class="w-full h-auto"
          :src="data.img.path"
          :alt="data.img.alt"
          :sizes="SIZES[sizeKey]"
          :modifiers="{ roundCorner: data.imgRoundCorner }"
        />
      </div>

      <div
        v-if="data.text"
        v-html="safeHTMLWrap(data.text, TEXT_TAGS)"
      ></div>
    </div>

    <div
      v-if="data.buttonText"
      class="mt-4"
    >
      <PostButtonRef
        :name="data.buttonText"
        :slug="data.refLink || undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { pickVariant } from "#shared/utils/block-variant";

const { uniqId } = defineProps<{ uniqId: string }>();
const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

// text приходит абзацами и инлайн-разметкой шире общего списка
// safeHTMLWrap — extraTags расширяет allowlist только для этого вызова.
const TEXT_TAGS = ["p", "em", "u", "s", "sup", "sub", "blockquote"];

const VARIANTS = ["split", "overlay", "card", "caption", "banner"] as const;

// Классы перечислены целиком: tailwind.config.js сканирует только .vue,
// контент из базы он не видит, поэтому собранные строкой варианты
// (`md:grid-cols-${...}`) в сборку не попадут.
const GRID_COLS: Record<string, string> = {
  "left-33": "md:grid-cols-[1fr_2fr]",
  "left-50": "md:grid-cols-2",
  "right-33": "md:grid-cols-[2fr_1fr]",
  "right-50": "md:grid-cols-2",
  full: "",
};

// Вариант card держит картинку уже своей рамкой, и колонка у него своя —
// 2fr/3fr по макету, сторона при этом остаётся модификатором.
const CARD_COLS: Record<string, string> = {
  left: "md:grid-cols-[2fr_3fr]",
  right: "md:grid-cols-[3fr_2fr]",
  full: "",
};

const SIZES: Record<string, string> = {
  "33": "xs:100vw md:33vw",
  "50": "xs:100vw md:50vw",
  full: "xs:100vw xl:1280px",
};

const MOBILE_ORDER: Record<PostTextImage["data"]["imgMobileSide"], string> = {
  top: "order-first",
  bottom: "order-last",
};

const DESKTOP_ORDER: Record<"left" | "right", string> = {
  left: "md:order-first",
  right: "md:order-last",
};

const VALID_SIDES = ["left", "right", "full"];

const FALLBACK: PostTextImage = {
  data: {
    uniqId: "",
    text: "",
    img: null,
    imgHint: "",
    imgSide: "right",
    imgMobileSide: "top",
    imgColumn: "50",
    imgRoundCorner: "0",
    buttonText: "",
    refLink: "",
  },
};

// Маркер в тексте может пережить удаление своей записи из конфига.
// Запись может быть и старше самой сетки: imgSide вне left/right/full → right,
// нет imgColumn → 50, imgMobileSide не top/bottom → top.
const data = computed(() => {
  const raw = (getShortcode({ uniqId, shortcode: "textImages" }) || FALLBACK)
    .data;
  return {
    ...raw,
    imgSide: VALID_SIDES.includes(raw.imgSide) ? raw.imgSide : "right",
    imgColumn: raw.imgColumn === "33" ? "33" : "50",
    imgMobileSide: raw.imgMobileSide === "bottom" ? "bottom" : "top",
  };
});

const variant = computed(() =>
  pickVariant(VARIANTS, "split", data.value.variant, variantFor("textImage")),
);

// full — одна колонка на всю ширину, второй записи в GRID_COLS у неё нет.
// Без картинки колонка тоже всегда одна — иначе пустая вторая колонка
// осталась бы рядом с текстом (старый блок с картинкой прямо в HTML текста).
const gridColsClass = computed(() => {
  if (!data.value.img) return "";
  const side = data.value.imgSide;
  return side === "full"
    ? GRID_COLS.full
    : GRID_COLS[`${side}-${data.value.imgColumn}`];
});

const cardColsClass = computed(() =>
  data.value.img ? CARD_COLS[data.value.imgSide] : "",
);

const sizeKey = computed(() => {
  const side = data.value.imgSide;
  return side === "full" ? "full" : data.value.imgColumn;
});

// full всегда первая и сверху, независимо от imgMobileSide.
const imageOrderClass = computed(() => {
  const side = data.value.imgSide;
  return side === "full"
    ? "order-first"
    : [MOBILE_ORDER[data.value.imgMobileSide], DESKTOP_ORDER[side]].join(" ");
});
</script>
