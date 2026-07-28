<template>
  <div v-show="isShow">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { debounce } from "#shared/utils/debounce";

const props = withDefaults(
  defineProps<{
    scrollY?: number;
    immediate?: boolean;
    hide?: boolean;
  }>(),
  {
    scrollY: 0,
    immediate: false,
    hide: true,
  },
);

const isShow = ref(false);

onMounted(() => {
  if (props.immediate) {
    handleScroll();
  }

  window.addEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  isShow.value = props.hide
    ? !(
        window.scrollY + window.innerHeight >=
        document.documentElement.offsetHeight - 5
      ) && window.scrollY > props.scrollY
    : true;
};

onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>
