<template>
  <div
    class="border-2 rounded-2xl border-primary-300 bg-primary-200 shadow-xl shadow-accent-300 mb-10 mx-1.5"
  >
    <div
      class="grid grid-cols-12 items-center justify-between px-4 py-4 md:py-8 gap-4"
    >
      <div
        class="col-span-full grid items-start grid-cols-3 justify-between space-y-3 lg:col-span-3 h-full"
      >
        <div
          class="col-span-5 gap-y-2.5 flex flex-col items-center justify-center order-1 lg:order-2 h-full"
        >
          <NuxtImg
            provider="cloudinary"
            width="130"
            height="130"
            loading="lazy"
            :src="casino.logo.path"
            :alt="casino.logo.alt"
            :modifiers="seoConfig.img.modifiers"
          ></NuxtImg>
          <div
            class="inline-flex items-center space-x-2 rounded-lg order-3 col-span-3 lg:col-span-5 justify-center lg:justify-center"
          >
            <svg-icon
              class="text-2xl mb-[2.6px] text-yellow-300"
              name="client/star"
            ></svg-icon>
            <span class="text-primary-2">
              <span class="font-medium text-accent-300">{{
                casino.rating
              }}</span
              >/5</span
            >
          </div>
        </div>
      </div>

      <div class="col-span-full lg:col-span-5 h-full space-y-2">
        <div class="grid grid-cols-3 h-full gap-4">
          <PostCasinoReviewInfo title="Minimální vklad">
            {{ casino.minimumDeposit }}</PostCasinoReviewInfo
          >
          <PostCasinoReviewInfo title="Licence"
            >{{ casino.licence }}
          </PostCasinoReviewInfo>
          <PostCasinoReviewInfo
            title="Počet her"
            col
            >{{ casino.numberCasinosGame }}</PostCasinoReviewInfo
          >
          <PostCasinoReviewInfo
            class="col-span-full"
            title="Maximální výplata"
            col
            >{{ casino.maximumCashout }}</PostCasinoReviewInfo
          >
        </div>
        <!-- <ul class="not-format space-y-4.5 rounded-md w-full">

        </ul> -->
      </div>

      <div
        class="col-span-full text-center flex flex-col justify-between h-full lg:col-span-4 bg-primary-100 border-2 border-primary-300 p-primary-1 rounded-primary"
      >
        <div class="flex flex-col gap-y-3 mb-3">
          <span class="flex justify-center items-center">
            <svg-icon
              name="client/gift"
              class="text-xl text-active-300"
            ></svg-icon>
            <span class="pl-3 text-sm uppercase font-medium"
              >Uvítací Bonus</span
            ></span
          >
          <span class="font-medium text-center text-primary-1 text-accent-300">
            {{ entityBonus.title }}
            {{ entityBonus.text }}
          </span>
        </div>

        <PostButtonRef
          :slug="casino.slug"
          size="big"
          :padding="false"
          >Hrát nyní
        </PostButtonRef>
      </div>
    </div>
    <div>
      <div class="bg-primary-300 border-y-2 border-primary-100">
        <nav
          class="-mb-0.5 flex justify-start px-5 gap-x-6 text-base overflow-x-auto"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            v-for="(category, i) in categories"
            :key="i"
            type="button"
            :class="{
              'font-medium  border-x-transparent border-t-transparent border-active-300 text-active-200':
                activeIndex === i,
              'text-white border-transparent': activeIndex !== i,
            }"
            class="py-4 px-1 items-center gap-x-2 border border-b-2 whitespace-nowrap hover:text-active-300 focus:outline-hidden focus:text-active-300"
            role="tab"
            @click="setActiveIndex(i)"
          >
            {{ category }}
          </button>
        </nav>
      </div>
      <div class="p-2.5 md:p-5">
        <PostCasinoReviewGeneral
          v-show="activeIndex === 0"
          :mobile-apps="casino.mobileApps"
          :benefits="casino.benefits"
          :website="casino.website"
          :languages="casino.languages"
          :slug="casino.slug"
          :owner="casino.owner"
          :year-established="casino.yearEstablished"
          :customer-services="casino.customerServices"
        ></PostCasinoReviewGeneral>
        <PostCasinoReviewGames
          v-show="activeIndex === 1"
          :software-providers="casino.softwareProviders"
          :number-casinos-game="casino.numberCasinosGame"
          :sports-betting="casino.sportsBetting"
          :game-types="casino.gameTypes"
        ></PostCasinoReviewGames>
        <PostCasinoReviewBonuses
          v-show="activeIndex === 2"
          :bonuses="casino.bonuses"
          :is-vip-program="casino.isVipProgram"
          :slug="casino.slug"
        ></PostCasinoReviewBonuses>
        <PostCasinoReviewPayments
          v-show="activeIndex === 3"
          :payment-methods="casino.paymentMethods"
          :minimum-deposit="casino.minimumDeposit"
          :maximum-cashout="casino.maximumCashout"
          :payouts-speed="casino.payoutsSpeed"
        ></PostCasinoReviewPayments>
        <PostCasinoReviewSafety
          v-show="activeIndex === 4"
          :licence="casino.licence"
          :safety="casino.safety"
        ></PostCasinoReviewSafety>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PostCasinoReviewGeneral from "./components/PostCasinoReviewGeneral.vue";
import PostCasinoReviewGames from "./components/PostCasinoReviewGames.vue";
import PostCasinoReviewBonuses from "./components/PostCasinoReviewBonuses.vue";
import PostCasinoReviewPayments from "./components/PostCasinoReviewPayments.vue";
import PostCasinoReviewSafety from "./components/PostCasinoReviewSafety.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import PostCasinoReviewInfo from "./components/PostCasinoReviewInfo.vue";
import { seoConfig } from "@@/seo.conf";

const { casino } = defineProps<{
  casino: Omit<
    ICasino<
      Pick<IGameType, "title" | "order">,
      Pick<ISoftwareProvider, "title" | "logo">,
      Pick<IPaymentMethod, "title" | "logo">,
      unknown,
      Pick<IBonus, "title" | "text">
    >,
    "refLink"
  >;
  entityBonus: Pick<IBonus, "title" | "text">;
}>();

const categories = ["Obecné", "Hry", "Bonusy", "Platební metody", "Bezpečnost"];

const activeIndex = ref(0);
const setActiveIndex = (index: number) => (activeIndex.value = index);
</script>
