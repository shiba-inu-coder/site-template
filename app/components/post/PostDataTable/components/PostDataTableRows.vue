<template>
  <div class="grid gap-4">
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="grid grid-cols-2 gap-x-4 gap-y-3 items-center p-4 bg-ui-card-bg rounded-primary border border-ui-card-border md:grid-cols-none md:grid-flow-col md:auto-cols-fr"
      :class="density === 'compact' ? 'p-3' : undefined"
    >
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
      >
        <span
          v-if="columnIndex > 0"
          class="block text-step-9 uppercase tracking-wide text-ui-muted"
          >{{ column.title }}</span
        >
        <div
          class="text-step-7"
          :class="
            columnIndex === 0 ? 'font-bold text-ui-card-title' : undefined
          "
        >
          <PostDataTableRuntime :template="row[column.name]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostDataTableRuntime from "../PostDataTableRuntime/PostDataTableRuntime.vue";

defineProps<{
  columns: Column[];
  rows: Row[];
  density?: string;
}>();
</script>
