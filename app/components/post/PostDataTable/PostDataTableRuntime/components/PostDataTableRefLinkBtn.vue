<template>
  <PostButtonRef
    :slug="slug"
    table-cell
    size="small-medium"
    variant="table"
    :padding="false"
  >
    <template #default>
      <slot></slot>
    </template>
  </PostButtonRef>
</template>
<script setup lang="ts">
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

const { slug } = defineProps<{
  slug: string;
}>();
</script>
