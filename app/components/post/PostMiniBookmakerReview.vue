<template>
  <div
    class="bg-accent-300/10 rounded-primary px-3 py-4 border-2 border-primary-300 no-format"
  >
    <div v-html="safeHTMLWrap(data.title)"></div>

    <ul>
      <li>
        <span class="font-semibold text-step-6">Licence</span>:
        {{ data.entity.licence }}
      </li>
      <li>
        <span class="font-semibold text-step-6">Sporty</span>:
        {{ sports }}
      </li>
      <li>
        <span class="font-semibold text-step-6">Platebni Metody</span>:
        {{ paymentMethods }}
      </li>
      <li>
        <span class="font-semibold text-step-6">Rok Založení</span>:
        {{ data.entity.yearEstablished }}
      </li>
      <li>
        <span class="font-semibold text-step-6">{{
          data.bonuses.length > 1 ? "Bonusy" : "Bonus"
        }}</span
        >:
        <div class="grid gap-5 grid-cols-1 md:grid-cols-2 mt-2">
          <div
            v-for="(bonus, i) in data.bonuses"
            :key="i"
            class="bg-primary-200 px-2 py-3 border-2 border-primary-100 rounded-primary"
          >
            <span class="font-semibold text-step-7 text-accent-200">
              {{ bonus.title }} {{ bonus.text }}
            </span>
          </div>
        </div>
      </li>
    </ul>

    <div
      class="my-5"
      v-html="data.text"
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

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const { data } = getShortcode({
  uniqId,
  shortcode: "miniBookmakerReviews",
});

const sports = computed(() =>
  data.entity.sports.map((el) => el.title).join(", "),
);
const paymentMethods = computed(() =>
  data.entity.paymentMethods.map((el) => el.title).join(", "),
);
</script>
