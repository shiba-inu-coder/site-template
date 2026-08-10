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

// Токен предпросмотра входит в ключ: иначе SSR отдал бы черновику payload,
// собранный для обычного посетителя, — то есть 404.
const preview = computed(() => (route.query.preview as string) || "");

const { data, status } = await useAsyncData(
  `post-${slug.value}${preview.value ? ":preview" : ""}`,
  () => {
    return GET_POST_BY_SLUG(slug.value, preview.value);
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
