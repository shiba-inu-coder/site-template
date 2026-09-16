<template>
  <footer>
    <div class="px-5 border-t border-ui-panel-bg">
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
          class="col-span-5 md:col-span-4 leading-5 text-step-9 font-normal text-ui-text"
        >
          <div v-html="seoConfig.layout.footer.body"></div>
        </div>
      </div>
    </div>
    <div
      class="flex-col-reverse bg-ui-footer-bg md:flex-row items-center flex flex-wrap justify-around py-3 text-step-8 gap-4"
    >
      <nuxt-link
        v-for="{ link, name } in seoConfig.layout.footer.links"
        :key="link"
        :to="link"
        class="app-link"
      >
        {{ name }}
      </nuxt-link>
    </div>
    <div
      class="bg-ui-footer-bg-alt flex-wrap flex-col gap-5 md:px-0 pb-6 pt-6 flex justify-center items-center mt-5"
    >
      <p class="text-ui-text text-step-9 uppercase text-center">
        {{ seoConfig.layout.footer.title }}
      </p>
      <nuxt-link
        v-if="seoConfig.logo.src"
        to="/"
      >
        <NuxtImg
          provider="cloudinary"
          loading="lazy"
          v-bind="logoSize(32, 180)"
          class="h-auto w-auto max-h-8 max-w-[180px] object-contain"
          :alt="seoConfig.logo.alt"
          :src="seoConfig.logo.src"
        />
      </nuxt-link>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { logoSize } from "#rc/utils/logo-size";
import { seoConfig } from "@@/seo.conf";
</script>
