<template>
  <PostProsConsBase
    :pros-list="prosList"
    :cons-list="consList"
  />
</template>
<script lang="ts" setup>
import PostProsConsBase from "./components/PostProsConsBase.vue";

const { uniqId } = defineProps<{
  uniqId: string;
}>();

const { getShortcode } = usePost();

const {
  data: {
    data: { prosList, consList },
  },
} = getShortcode({
  uniqId,
  shortcode: "prosConsPosts",
});
</script>
