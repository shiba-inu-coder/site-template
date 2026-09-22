<template>
  <footer class="site-footer">
    <div
      v-if="variant === 'columns' || variant === 'disclaimer'"
      class="grid gap-6 px-5 py-8 md:grid-cols-[1.4fr_1fr_1fr] md:px-8"
    >
      <div>
        <p
          v-if="siteConfig.layout.footer.title"
          class="mb-2 font-semibold text-ui-heading"
        >
          {{ siteConfig.layout.footer.title }}
        </p>
        <nuxt-link
          v-if="siteConfig.logo.src"
          to="/"
          class="logo inline-block"
        >
          <NuxtImg
            provider="cloudinary"
            loading="lazy"
            v-bind="logoSize(siteConfig.logo, 32, 180)"
            class="h-auto max-h-8 w-auto max-w-[180px] object-contain"
            :alt="siteConfig.logo.alt"
            :src="siteConfig.logo.src"
          />
        </nuxt-link>
      </div>
      <div
        v-if="links.length"
        class="grid content-start gap-1.5 text-step-8"
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
      <div
        v-if="legalLogos.length"
        class="flex flex-wrap items-center gap-4"
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
    </div>

    <div
      v-if="variant === 'centered'"
      class="grid justify-items-center gap-4 px-5 py-8 text-center"
    >
      <nuxt-link
        v-if="siteConfig.logo.src"
        to="/"
        class="logo"
      >
        <NuxtImg
          provider="cloudinary"
          loading="lazy"
          v-bind="logoSize(siteConfig.logo, 32, 180)"
          class="h-auto max-h-8 w-auto max-w-[180px] object-contain"
          :alt="siteConfig.logo.alt"
          :src="siteConfig.logo.src"
        />
      </nuxt-link>
      <div class="flex flex-wrap justify-center gap-4 text-step-8">
        <nuxt-link
          v-for="{ link, name } in links"
          :key="link"
          :to="link"
          class="app-link"
        >
          {{ name }}
        </nuxt-link>
      </div>
      <div
        v-if="legalLogos.length"
        class="flex flex-wrap items-center justify-center gap-4"
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
      <p
        v-if="siteConfig.layout.footer.title"
        class="text-step-9 uppercase text-ui-text"
      >
        {{ siteConfig.layout.footer.title }}
      </p>
    </div>

    <div
      v-if="variant === 'disclaimer'"
      class="border-t border-ui-panel-border px-5 py-4 text-step-9 text-ui-muted md:px-8"
    >
      <div
        v-if="legalLogos.length"
        class="mb-2 flex flex-wrap items-center gap-2"
      >
        <span
          v-for="(gamblingIcon, i) in legalLogos"
          :key="i"
          class="rounded-primary border border-ui-panel-border px-2 py-1 text-ui-text"
        >
          {{ gamblingIcon.alt }}
        </span>
      </div>
      <div v-html="siteConfig.layout.footer.body"></div>
    </div>

    <div
      v-else-if="variant !== 'minimal'"
      class="border-t border-ui-panel-bg px-5 py-6 text-step-9 leading-5 font-normal text-ui-text md:px-8"
    >
      <div v-html="siteConfig.layout.footer.body"></div>
    </div>

    <div
      class="flex flex-wrap items-center justify-center gap-4 bg-ui-footer-bg px-5 py-3 text-step-8 md:px-8"
    >
      <template v-if="variant === 'minimal'">
        <nuxt-link
          v-for="{ link, name } in links"
          :key="link"
          :to="link"
          class="app-link"
        >
          {{ name }}
        </nuxt-link>
      </template>
      <p
        v-if="variant !== 'centered' && siteConfig.layout.footer.title"
        class="text-step-9 uppercase text-ui-text"
      >
        {{ siteConfig.layout.footer.title }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { logoSize } from "#rc/utils/logo-size";
import { pickVariant } from "#shared/utils/block-variant";

const siteConfig = useSiteConfig();

const VARIANTS = ["columns", "minimal", "centered", "disclaimer"] as const;

const variant = computed(() => pickVariant(VARIANTS, "columns"));

const links = computed(() => siteConfig.value.layout.footer.links || []);
const legalLogos = computed(
  () => siteConfig.value.layout.footer.legalLogos || [],
);
</script>
