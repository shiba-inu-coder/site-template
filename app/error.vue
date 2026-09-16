<template>
  <div
    id="site"
    class="font-primary"
    v-bind="frameAttrs"
  >
    <section
      id="error"
      class="flex min-h-screen items-center flex-col bg-ui-card-bg"
    >
      <HeaderLayout></HeaderLayout>
      <main
        class="grid min-h-[85vh] place-items-center px-6 py-24 sm:py-32 lg:px-8"
      >
        <div class="text-center">
          <p class="text-step-1 font-semibold text-ui-heading">
            {{ error.statusCode }}
          </p>
          <p class="mt-6 text-step-3 font-medium text-pretty text-ui-text">
            {{
              error.statusCode === 404
                ? siteConfig.translates.error.notFound
                : error.message
            }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <nuxt-link
              to="/"
              trailing-slash="append"
              prefetch-on="interaction"
              class="cta-button rounded-primary bg-ui-cta-bg px-3.5 py-2.5 text-step-7 font-semibold text-ui-cta-text shadow-xs hover:bg-ui-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-cta-hover"
              >{{ siteConfig.translates.error.backHome }}</nuxt-link
            >
          </div>
        </div>
      </main>
    </section>
  </div>
</template>

<script lang="ts" setup>
import HeaderLayout from "#rc/components/layout/HeaderLayout.vue";

defineProps<{
  error: any;
}>();

const siteConfig = useSiteConfig();
const { frameAttrs } = useUiTheme();

useMetaHead();
</script>
