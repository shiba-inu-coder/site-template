<template>
  <nav
    class="bg-primary-300 p-primary-1 fixed left-0 right-0 top-0 z-50 px-3 md:px-8"
  >
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center space-x-3">
        <nuxt-link
          :to="refLink"
          target="_blank"
          data-id="ref_link"
          class="font-bold bg-primary-200 transition ease-in-out duration-500 hover:bg-primary-100 px-7 py-3 rounded-primary"
        >
          {{ seoConfig.translates.auth.login }}
        </nuxt-link>
        <nuxt-link
          :to="refLink"
          target="_blank"
          data-id="ref_link"
          class="hidden md:block font-bold bg-active-300 text-primary-300 transition ease-in-out duration-500 hover:bg-active-100 px-7 py-3 rounded-primary"
        >
          {{ seoConfig.translates.auth.register }}
        </nuxt-link>
      </div>
      <div class="flex items-center gap-3.5">
        <nuxt-link
          to="/"
          data-id="ref_link"
          class="mr-5"
        >
          <NuxtImg
            provider="cloudinary"
            width="120"
            height="auto"
            :alt="seoConfig.logo.alt"
            :src="seoConfig.logo.src"
          />
        </nuxt-link>
        <nuxt-link
          v-for="(headerLink, i) in seoConfig.layout.header.links"
          :key="i"
          :to="refLink"
          data-id="ref_link"
          class="transition hidden lg:block ease-in-out duration-500 hover:text-active-200 font-semibold"
        >
          {{ headerLink }}
        </nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useFakeRefLink } from "#rc/composables/useFakeRefLink";
import { seoConfig } from "@@/seo.conf";

const emit = defineEmits<{
  (e: "toggle"): void;
}>();

const refLink = useFakeRefLink({
  type: "casino",
  slug: "mafia-casino",
});
</script>
