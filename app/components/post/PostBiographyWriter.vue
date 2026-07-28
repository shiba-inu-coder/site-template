<template>
  <div class="flex flex-col rounded-t-primary">
    <div
      class="flex items-center gap-x-4 bg-primary-200 p-primary-1 border border-primary-300 rounded-t-primary"
    >
      <NuxtImg
        loading="lazy"
        provider="cloudinary"
        height="auto"
        width="auto"
        class="rounded-sm size-12 object-cover"
        :src="writer.avatar.path"
        :alt="writer.avatar.alt"
      />
      <div class="grow space-y-1">
        <span class="block text-base font-medium">{{ writer.fullName }}</span>
        <span
          class="text-primary-5 text-white font-medium bg-accent-300 rounded-primary py-1 px-2"
          >{{ writer.position }}</span
        >
      </div>
    </div>
    <span
      class="text-primary-4 p-primary-1 border-x-2 border-b-2 border-primary-300 rounded-b-primary"
      >{{ writer.info }}</span
    >

    <!-- <div class="flex ml-2 mb-2 gap-5">
      <span
        v-for="(item, index) in socialMeadia"
        :key="index"
      >
        <a
          class="text-2xl transition duration-500 text-active-100 hover:text-active-300"
          :href="item.url"
          target="_blank"
        >
          <svg-icon :name="item.icon" />
        </a>
      </span>
    </div> -->
  </div>
</template>
<script setup lang="ts">
const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const state = computed(() => {
  return getShortcode({
    uniqId,
    shortcode: "biographyWriters",
  });
});

const writer = computed(() => state.value.data.data.writer);

// const socialMeadia = [
//   {
//     icon: "client/author-page/facebook",
//     url: "https://www.facebook.com/profile.php?id=61575679779257",
//   },
//   {
//     icon: "client/author-page/x",
//     url: "https://x.com/JakubHoraSEO",
//   },
// ];
</script>
