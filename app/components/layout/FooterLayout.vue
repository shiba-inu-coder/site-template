<template>
  <footer class="site-footer bg-ui-footer-bg text-ui-text">
    <div
      v-if="siteConfig.logo.src || body || legalLogos.length || links.length"
      class="flex flex-col items-center gap-6 px-5 py-8 md:px-8"
    >
      <NuxtImg
        v-if="siteConfig.logo.src"
        provider="cloudinary"
        v-bind="logoSize(siteConfig.logo, 50, 240)"
        class="h-auto w-auto max-h-[50px] max-w-[240px] object-contain"
        :alt="siteConfig.logo.alt"
        :src="siteConfig.logo.src"
      />

      <div
        v-if="body"
        class="w-full text-left text-step-9 leading-5"
        v-html="body"
      ></div>

      <div
        v-if="legalLogos.length"
        class="flex flex-wrap justify-center gap-4"
      >
        <NuxtImg
          v-for="(gamblingIcon, i) in legalLogos"
          :key="i"
          loading="lazy"
          width="auto"
          provider="cloudinary"
          height="50"
          :src="gamblingIcon.src"
          :alt="gamblingIcon.alt"
        />
      </div>

      <div
        v-if="links.length"
        class="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-step-8"
      >
        <nuxt-link
          v-for="{ link, name } in links"
          :key="link"
          :to="link"
          class="app-link"
        >
          {{ name }}
        </nuxt-link>
      </div>
    </div>

    <p
      v-if="copyright"
      class="bg-ui-footer-bg-alt px-5 py-3 text-center text-step-9 text-ui-muted md:px-8"
    >
      {{ copyright }}
    </p>
  </footer>
</template>

<script setup lang="ts">
import { logoSize } from "#rc/utils/logo-size";

const siteConfig = useSiteConfig();
const domainName = useRuntimeConfig().public.DOMAIN_NAME as string | undefined;

const body = computed(() => siteConfig.value.layout.footer.body);
const links = computed(() => siteConfig.value.layout.footer.links || []);
const legalLogos = computed(
  () => siteConfig.value.layout.footer.legalLogos || [],
);

// `footer.title` — готовая строка «домен © год права» на языке сайта, её
// собирает панель при «Применить». Сайт без записи бренда её не имеет, а
// строка с годом в подвале нужна и ему — собирается из домена образа.
const copyright = computed(() => {
  const { title } = siteConfig.value.layout.footer;

  if (title) {
    return title;
  }

  return domainName ? `© ${new Date().getFullYear()} ${domainName}` : "";
});
</script>
