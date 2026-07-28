<template>
  <PostShowOnScroll>
    <button
      type="button"
      class="bg-primary-200 border-2 border-active-300 group hover:border-accent-300 transition duration-500 ease-in-out rounded-full fixed right-5 bottom-[3%] z-20 size-15 lg:h-14 lg:w-14 flex items-center justify-center outline-none cursor-pointer"
      @click="onClick"
    >
      <svg-icon
        name="arrow-up"
        class="size-7 fill-active-200 group-hover:fill-accent-300"
      />
    </button>
  </PostShowOnScroll>
</template>

<script lang="ts" setup>
import PostShowOnScroll from "#rc/components/layout/PostShowOnScroll.vue";
const onClick = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
</script>
