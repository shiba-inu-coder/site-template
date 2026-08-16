<template>
  <BasePostView></BasePostView>
</template>
<script setup lang="ts">
import BasePostView from "#rc/views/BasePostView.vue";

const { setPost, GET_POST_BY_SLUG } = usePost();
const route = useRoute();
const slug = route.name as string;

const preview = (route.query.preview as string) || "";

const { data, status } = await useAsyncData(
  `post-${slug}${preview ? ":preview" : ""}`,
  () => {
    return GET_POST_BY_SLUG(slug, preview);
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
  clearNuxtData(`post-${slug}`);
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});
onScopeDispose(() => {
  const { $apiAbort } = useNuxtApp();
  $apiAbort();
});
</script>
