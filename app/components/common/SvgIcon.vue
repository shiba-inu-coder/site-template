<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
  >
    <use :href="`${spriteUrl}#${name.replace(/\//g, '-')}`" />
  </svg>
</template>

<script lang="ts" setup>
import spriteUrl from "#rc/assets/icons-gen/icons.svg?url";

defineProps<{ name: string }>();
</script>

<style scoped>
.svg-icon {
  vertical-align: middle;
}
</style>
