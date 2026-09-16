<template>
  <div
    v-if="data"
    class="bg-ui-accent-strong/10 rounded-primary px-3 py-4 border-2 border-ui-card-border no-format"
  >
    <div v-html="safeHTMLWrap(data.title)"></div>

    <ul>
      <li>
        <span class="font-semibold text-step-6">{{ t.licence }}</span
        >:
        {{ data.entity.licence }}
      </li>
      <li>
        <span class="font-semibold text-step-6">{{ t.sportsBetting }}</span
        >:
        {{ sports }}
      </li>
      <li>
        <span class="font-semibold text-step-6">{{ t.paymentMethods }}</span
        >:
        {{ paymentMethods }}
      </li>
      <li>
        <span class="font-semibold text-step-6">{{ t.foundedYear }}</span
        >:
        {{ data.entity.yearEstablished }}
      </li>
      <li>
        <span class="font-semibold text-step-6">{{
          data.bonuses.length > 1 ? t.bonuses : t.bonus
        }}</span
        >:
        <div class="grid gap-5 grid-cols-1 md:grid-cols-2 mt-2">
          <div
            v-for="(bonus, i) in data.bonuses"
            :key="i"
            class="bg-ui-panel-bg px-2 py-3 border-2 border-ui-input-border rounded-primary"
          >
            <span class="font-semibold text-step-7 text-ui-heading">
              {{ bonus.title }} {{ bonus.text }}
            </span>
          </div>
        </div>
      </li>
    </ul>

    <div
      class="my-5"
      v-html="safeHTMLWrap(data.text)"
    ></div>

    <PostProsConsBase
      :pros-list="data.prosCons.prosList"
      :cons-list="data.prosCons.consList"
    ></PostProsConsBase>

    <div class="flex justify-center mt-5">
      <div
        :style="`max-width: ${data.img.width}px; max-height: ${data.img.height}px`"
      >
        <NuxtImg
          loading="lazy"
          provider="cloudinary"
          :src="data.img.src"
          :format="data.img.format"
          :alt="data.img.alt"
          :width="data.img.width"
          :height="data.img.height"
          :modifiers="{ roundCorner: data.img.roundCorner }"
          :sizes="`(min-width: 600px) 100vh, ${data.img.width}`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PostProsConsBase from "#rc/components/post/PostProsCons/components/PostProsConsBase.vue";
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { seoConfig } from "@@/seo.conf";

const t = seoConfig.translates.entity;

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

// Устаревший маркер переживает свой конфиг: getShortcode тогда отдаёт
// undefined, а деструктуризация тут же роняла бы всю статью — v-if в шаблоне
// просто не рисует карточку вместо этого.
const data = computed(
  () => getShortcode({ uniqId, shortcode: "miniBookmakerReviews" })?.data,
);

const sports = computed(
  () => data.value?.entity.sports.map((el) => el.title).join(", ") ?? "",
);
const paymentMethods = computed(
  () =>
    data.value?.entity.paymentMethods.map((el) => el.title).join(", ") ?? "",
);
</script>
