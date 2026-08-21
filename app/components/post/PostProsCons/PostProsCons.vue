<template>
  <PostProsConsBase
    v-if="entry"
    :pros-list="entry.prosList"
    :cons-list="entry.consList"
  />
</template>
<script lang="ts" setup>
import PostProsConsBase from "./components/PostProsConsBase.vue";

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

// Устаревший маркер переживает свой конфиг: getShortcode тогда отдаёт
// undefined, а деструктуризация тут же роняла бы всю статью — v-if в шаблоне
// просто не рисует блок вместо этого.
const entry = computed(
  () => getShortcode({ uniqId, shortcode: "prosConsPosts" })?.data.data,
);
</script>
