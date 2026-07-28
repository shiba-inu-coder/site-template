<template>
  <div class="bg-white w-screen h-screen text-gray-950">
    LOADING...

    <!-- <div
      class="w-full h-full bg-white rounded-lg shadow-md flex flex-col justify-center items-center text-center p-3"
    >
      <NuxtImg
        provider="cloudinary"
        width="250"
        height="auto"
        alt="logo"
        preload
        src="mezinarodnicasino-cz/logo"
        class="pb-8"
      ></NuxtImg>
      <span class="text-xl md:text-3xl text-gray-600"
        >Je čas se bavit! Budete přesměrováni do kasina .</span
      >
      <div
        class="w-full sm:w-[600px] h-4 relative bg-slate-200 border border-gray-300 overflow-hidden rounded-md mt-5"
      >
        <span
          style="width: 100%"
          class="block h-full"
          ><span class="progress bg-blue-200 block h-full"></span
        ></span>
      </div>
      <span class="text-base text-gray-600 py-6"
        >Pokud není odesláno po 1 sekundách</span
      >
      <nuxt-link
        data-id="ref_link"
        :to="'/'"
        class="whitespace-nowrap focus:outline-hidden text-white bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:ring-blue-200 font-normal rounded-lg text-2xl text-center py-4 px-10"
      >
        Klikněte zde
      </nuxt-link>
    </div> -->
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

useHead({
  title: "Redirecting",
  meta: [
    {
      // hid: "robots",
      name: "robots",
      content: `nofollow noindex`,
    },
  ],
});
const { $api } = useNuxtApp();

onBeforeRouteLeave(() => {
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});
onScopeDispose(() => {
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});

onMounted(async () => {
  const res = await $api()<string>(
    buildURL("/api/v1/public/seo/redirect/:slug/:type", {
      slug: useRoute().params.name,
      type: "bookmaker",
    }),
  );
  await navigateTo(res, {
    external: true,
    redirectCode: 307,
  });
});
</script>
<style>
/* .progress {
  animation: progressBar 3s ease-in-out;
  animation-fill-mode: both;
}

@keyframes progressBar {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
} */
</style>
