<template>
  <footer>
    <!-- Bottom Section -->
    <div class="px-5 border-t border-primary-200">
      <!-- <div class="flex gap-8 py-6 overflow-x-scroll">
        <NuxtImg
          v-for="(paymentIcon, index) in paymentIcons"
          :key="index"
          height="25"
          width="150"
          loading="lazy"
          class="payment-icon"
          :src="paymentIcon.url"
          :alt="paymentIcon.name"
        />
      </div> -->

      <div class="grid grid-cols-1 py-6">
        <div
          class="flex items-center justify-center space-x-5 col-span-5 md:col-span-1 mb-6"
        >
          <a
            v-for="(gamblingIcon, i) in seoConfig.layout.footer.legalLogos"
            :key="i"
            :href="gamblingIcon.src"
          >
            <NuxtImg
              loading="lazy"
              width="auto"
              provider="cloudinary"
              height="50"
              :src="gamblingIcon.src"
              :alt="gamblingIcon.alt"
            />
          </a>
        </div>
        <div
          class="col-span-5 md:col-span-4 leading-5 text-step-9 font-normal text-surface-text"
        >
          <p v-html="seoConfig.layout.footer.disclaimer"></p>
          <p v-html="seoConfig.layout.footer.notice"></p>
        </div>
      </div>
    </div>
    <div
      class="flex-col-reverse bg-primary-200 md:flex-row items-center flex flex-wrap justify-around py-3 text-step-8 gap-4"
    >
      <!-- <div class="flex space-x-3.5"> -->
      <nuxt-link
        v-for="{ link, name } in seoConfig.layout.footer.links"
        :key="link"
        :to="link"
        class="app-link"
      >
        {{ name }}
      </nuxt-link>
      <!-- </div> -->
    </div>
    <div
      class="bg-primary-300 flex-wrap flex-col gap-5 md:px-0 pb-6 pt-6 flex justify-center items-center mt-5"
    >
      <p class="text-surface-text text-step-9 uppercase text-center">
        {{ seoConfig.layout.footer.title }}
      </p>
      <nuxt-link to="/">
        <NuxtImg
          provider="cloudinary"
          loading="lazy"
          v-bind="logoSize(32)"
          :alt="seoConfig.logo.alt"
          :src="seoConfig.logo.src"
        />
      </nuxt-link>
    </div>
  </footer>
</template>

<script setup lang="ts">
// import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { logoSize } from "#rc/utils/logo-size";
import { seoConfig } from "@@/seo.conf";

// Payment Icons
// import astropay from "/img/payments/astropay.svg";
// import binance from "/img/payments/binance.svg";
// import bitcoin from "/img/payments/bitcoin.svg";
// import bitcoincash from "/img/payments/bitcoincash.svg";
// import cardano from "/img/payments/cardano.svg";
// import dash from "/img/payments/dash.svg";
// import dogecoin from "/img/payments/dogecoin.svg";
// import eos from "/img/payments/eos.svg";
// import ethereum from "/img/payments/ethereum.svg";
// import gemini from "/img/payments/gemini.svg";
// import interac from "/img/payments/interac.svg";
// import monero from "/img/payments/monero.svg";
// import muchbetter from "/img/payments/muchbetter.svg";
// import nem from "/img/payments/nem.svg";
// import neo from "/img/payments/neo.svg";
// import neteller from "/img/payments/neteller.svg";
// import noda from "/img/payments/noda.svg";
// import paxos from "/img/payments/paxos.svg";
// import payop from "/img/payments/payop.svg";
// import ripple from "/img/payments/ripple.svg";
// import skrill from "/img/payments/skrill.svg";
// import stellar from "/img/payments/stellar.svg";
// import tether from "/img/payments/tether.svg";
// import tron from "/img/payments/tron.svg";
// import trustly from "/img/payments/trustly.svg";
// import usdcoin from "/img/payments/usdcoin.svg";
// import visa from "/img/payments/visa.svg";
// import zcash from "/img/payments/zcash.svg";

// // Social Media Icons
// // import TelegramSocialMedia from "/img/socialMeadia/telegram.svg";
// // import InstagramSocialMedia from "/img/socialMeadia/instagram.svg";
// import TwitterSocialMedia from "/img/socialMeadia/twitter.svg";
// import WeftSocialMedia from "/img/socialMeadia/weft.svg";

// const socialMediaIcons = [
//   {
//     alt: "telegram",
//     src: TelegramSocialMedia,
//   },
//   {
//     alt: "instagram",
//     src: InstagramSocialMedia,
//   },
//   {
//     alt: "x",
//     src: TwitterSocialMedia,
//   },
//   {
//     alt: "weft",
//     src: WeftSocialMedia,
//   },
// ];

// const paymentIcons = [
//   { name: "visa", url: visa },
//   { name: "ethereum", url: ethereum },
//   { name: "bitcoin", url: bitcoin },
//   { name: "tether", url: tether },
//   { name: "dash", url: dash },
//   { name: "monero", url: monero },
//   { name: "dogecoin", url: dogecoin },
//   { name: "neo", url: neo },
//   { name: "cardano", url: cardano },
//   { name: "bitcoincash", url: bitcoincash },
//   { name: "ripple", url: ripple },
//   { name: "nem", url: nem },
//   { name: "stellar", url: stellar },
//   { name: "binance", url: binance },
//   { name: "usdcoin", url: usdcoin },
//   { name: "eos", url: eos },
//   { name: "gemini", url: gemini },
//   { name: "paxos", url: paxos },
//   { name: "skrill", url: skrill },
//   { name: "neteller", url: neteller },
//   { name: "trustly", url: trustly },
//   { name: "payop", url: payop },
//   { name: "astropay", url: astropay },
//   { name: "tron", url: tron },
//   { name: "muchbetter", url: muchbetter },
//   { name: "interac", url: interac },
//   { name: "noda", url: noda },
//   { name: "zcash", url: zcash },
// ];
</script>

<style>
.payment-icon {
  display: block;
  width: 150px;
  height: 35px;
  /* backface-visibility: hidden;
  mix-blend-mode: luminosity;
  filter: grayscale(1);
  opacity: 0.75; */
}

.payment-icon:hover {
  /* filter: grayscale(0);
  opacity: 1;
  transition: 0.3s;
  mix-blend-mode: normal; */
}
</style>
