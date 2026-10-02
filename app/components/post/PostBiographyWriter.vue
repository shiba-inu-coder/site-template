<template>
  <div
    v-if="writer"
    class="grid grid-cols-1 gap-4 p-4 bg-ui-card-bg border border-ui-card-border rounded-primary md:grid-cols-[96px_1fr] md:items-start"
  >
    <NuxtImg
      v-if="writer.avatar?.path"
      loading="lazy"
      provider="cloudinary"
      height="auto"
      width="auto"
      class="size-24 shrink-0 rounded-full object-cover border-2 border-ui-marker"
      :src="writer.avatar.path"
      :alt="writer.avatar.alt"
    />
    <div :class="writer.avatar?.path ? '' : 'md:col-span-2'">
      <span class="block font-semibold text-step-6 text-ui-heading">{{
        writer.fullName
      }}</span>
      <span
        v-if="writer.position"
        class="block text-step-9 text-ui-muted"
        >{{ writer.position }}</span
      >
      <p
        v-if="writer.info"
        class="mt-1.5 mb-0! text-step-8"
      >
        {{ writer.info }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const entry = computed(() =>
  getShortcode({ uniqId, shortcode: "biographyWriters" }),
);

const writer = computed(() => entry.value?.data.data.writer);
</script>
