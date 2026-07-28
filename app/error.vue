<template>
  <section
    id="error"
    class="flex min-h-screen items-center flex-col bg-primary-100"
  >
    <HeaderLayout></HeaderLayout>
    <main
      class="grid min-h-[85vh] place-items-center px-6 py-24 sm:py-32 lg:px-8"
    >
      <div class="text-center">
        <p class="text-5xl font-semibold text-accent-300">
          {{ error.statusCode }}
        </p>
        <p class="mt-6 text-2xl font-medium text-pretty text-white">
          {{
            error.statusCode === 404
              ? "Stránka nenalezena – vraťme se na hlavní stránku"
              : error.message
          }}
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <nuxt-link
            to="/"
            trailing-slash="append"
            prefetch-on="interaction"
            class="rounded-md bg-accent-200 px-3.5 py-2.5 text-base font-semibold text-white shadow-xs hover:bg-accent-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
            >Zpět na hlavní stránku</nuxt-link
          >
        </div>
      </div>
    </main>
  </section>
</template>

<script lang="ts" setup>
import HeaderLayout from "#rc/components/layout/HeaderLayout.vue";

defineProps<{
  error: any;
}>();

useMetaHead();
</script>
