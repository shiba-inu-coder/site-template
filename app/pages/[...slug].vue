<template>
  <BasePostView></BasePostView>
</template>
<script setup lang="ts">
import BasePostView from "#rc/views/BasePostView.vue";

const { setPost, GET_POST_BY_SLUG } = usePost();
const route = useRoute();

const params = computed(() => {
  const data = route.params.slug as string[];
  return data.filter((item) => item);
});

const slug = computed(() => params.value.join("/"));

const { data, status } = await useAsyncData(
  `post-${slug.value}`,
  () => {
    return GET_POST_BY_SLUG(slug.value);
  },
  {
    deep: false,
    server: true,
    immediate: true,
  },
);

if (data.value) {
  setPost(data.value);
  useMetaHead();
}
if (status.value === "error") {
  showError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

onBeforeRouteLeave(() => {
  clearNuxtData(`post-${slug.value}`);
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});
onScopeDispose(() => {
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});
</script>
