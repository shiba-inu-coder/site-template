<template>
  <div class="border border-primary-200 rounded-primary p-2">
    <!-- <button
      :id="`accordion-header-${id}`"
      type="button"
      class="p-primary-1 flex items-center justify-between w-full text-accent-200 transition duration-300 ease-in-out hover:text-accent-300 border-b-2 border-primary-300"
      :class="{
        'rounded-bl-none rounded-br-none bg-primary-200 rounded-t-primary':
          isShow,
        'bg-primary-200 hover:bg-primary-300 transition duration-300 ease-in-out':
          !isShow,
      }"
      :aria-expanded="isShow"
      :aria-controls="`accordion-content-${id}`"
    > -->
    <!-- <span class="flex items-center gap-x-2 text-primary-3"> -->
    <!-- <svg-icon
          name="client/question"
          class="fill-active-200 size-5"
        ></svg-icon> -->
    <h3 class="my-0! text-left! text-primary-3">
      {{ faqItem.label }}
    </h3>
    <!-- </span> -->
    <!-- <svg-icon
        data-accordion-icon
        name="client/solid-up"
        class="m-2 text-primary-3 shrink-0"
        :class="{ 'rotate-180': isShow }"
      /> -->
    <!-- </button> -->
    <!-- <Transition name="fade"> -->
    <!-- <div
      v-show="isShow"
      :id="`accordion-content-${id}`"
      role="region"
      class="p-primary-1 rounded-b-primary text-primary-4"
      :aria-labelledby="`accordion-header-${id}`"
    > -->
    <div
      class="mt-2"
      v-html="html"
    ></div>
    <!-- </div> -->
    <!-- </Transition> -->
  </div>
</template>

<script setup lang="ts">
const { faqItem } = defineProps<{
  faqItem: { label: string; value: string };
}>();

const id = computed(() =>
  faqItem.label
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase(),
);

const html = computed(() =>
  isHTML(faqItem.value)
    ? faqItem.value
    : `<p class="m-0! text-primary-4">${faqItem.value}</p>`,
);

const isShow = ref(true);
const toggle = () => (isShow.value = !isShow.value);
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
