<template>
  <PostButtonRef
    :slug="slug"
    size="medium"
    variant="link"
    :padding="false"
    position="left"
  >
    <template #default> <slot></slot> </template
  ></PostButtonRef>
</template>
<script setup lang="ts">
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

const { slug } = defineProps<{
  slug: string;
}>();
</script>
