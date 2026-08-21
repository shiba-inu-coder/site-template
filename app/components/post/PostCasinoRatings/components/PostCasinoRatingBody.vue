<template>
  <!-- BOX 1  -->
  <div class="space-y-3 py-4 px-3 md:p-primary-1 bg-primary-100">
    <div class="grid md:grid-cols-3 gap-3">
      <div class="">
        <PostCasinoRatingTitle
          title="Minimální vklad"
          icon="client/deposit"
        ></PostCasinoRatingTitle>
        <div class="casino-rating__text">
          {{ casino.minimumDeposit }}
        </div>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Rychlost výplaty"
          icon="client/speed"
        ></PostCasinoRatingTitle>
        <div class="casino-rating__text">
          {{ casino.payoutsSpeed }}
        </div>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Maximální výplata"
          icon="client/money"
        ></PostCasinoRatingTitle>
        <div class="casino-rating__text">
          {{ casino.maximumCashout }}
        </div>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Počet her"
          icon="client/number-games"
        ></PostCasinoRatingTitle>
        <span class="casino-rating__text">{{ casino.numberCasinosGame }}</span>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Licence"
          icon="client/licence"
        ></PostCasinoRatingTitle>
        <span class="casino-rating__text">{{ casino.licence }}</span>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Sportovní sázení"
          icon="client/betting"
        ></PostCasinoRatingTitle>
        <div class="casino-rating__text">
          {{ casino.sportsBetting ? "Ano" : "Ne" }}
        </div>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Mobilní aplikace"
          icon="client/mobile"
        ></PostCasinoRatingTitle>

        <div
          v-if="casino.mobileApps.length"
          class="flex items-center space-x-2 mb-2 pl-8"
        >
          <svg-icon
            v-if="casino.mobileApps.includes('ios')"
            name="client/brand-apple"
            class="text-step-5 text-surface-text"
          ></svg-icon>
          <svg-icon
            v-if="casino.mobileApps.includes('android')"
            name="client/brand-android"
            class="text-step-5 text-surface-text"
          ></svg-icon>
        </div>
        <div
          v-else
          class="casino-rating__text"
        >
          Ne
        </div>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <PostCasinoRatingTitle
          title="Platební metody"
          icon="client/card"
        ></PostCasinoRatingTitle>
        <div class="pl-4">
          <PostCasinoListLogos :items="casino.paymentMethods" />
        </div>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="poskytovatelé softwaru"
          icon="client/dice"
        ></PostCasinoRatingTitle>
        <div class="pl-4">
          <PostCasinoListLogos :items="casino.softwareProviders">
          </PostCasinoListLogos>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <PostCasinoRatingTitle
          title="Nejlepší funkce"
          icon="client/list"
        ></PostCasinoRatingTitle>
        <ul class="casino-rating__text my-0">
          <li
            v-for="(benefit, i) in casino.benefits"
            :key="i"
          >
            {{ benefit }}
          </li>
        </ul>
      </div>
      <div>
        <PostCasinoRatingTitle
          title="Typy her"
          icon="client/dice"
        ></PostCasinoRatingTitle>
        <div class="casino-rating__text">
          {{ gameTypes }}
        </div>
      </div>
    </div>

    <PostCasinoRatingTitle
      title="Zákaznická podpora"
      icon="client/support"
    ></PostCasinoRatingTitle>
    <ul class="casino-rating__text my-0">
      <li
        v-for="(benefit, i) in casino.customerServices"
        :key="i"
      >
        {{ benefit }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import PostCasinoListLogos from "./PostCasinoListLogos.vue";
import PostCasinoRatingTitle from "./PostCasinoRatingTitle.vue";

const { casino } = defineProps<{
  casino: PostCasinoRatingEntity;
}>();

const gameTypes = computed(
  () =>
    [...casino.gameTypes]
      .sort((a, b) => a.order - b.order)
      .map((gameType) => gameType.title)
      ?.join(", ") || "",
);
</script>
<style scoped lang="css">
.casino-rating__text {
  margin-bottom: calc(var(--spacing) * 1);
  display: block;
  font-size: var(--text-step-3);
  line-height: 1.5;
  font-weight: 400;
  padding-left: calc(var(--spacing) * 8);
  color: var(--color-surface-text);
}
</style>
