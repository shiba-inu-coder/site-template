<template>
  <div
    class="grid max-w-[640px] overflow-hidden rounded-primary border-2 border-ui-table-row-border"
  >
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="grid grid-cols-1 gap-x-4 text-step-7 border-b border-ui-table-row-border last:border-b-0 sm:grid-cols-[200px_1fr]"
      :class="[
        density === 'compact' ? 'px-4 py-1.5' : 'px-4 py-2.5',
        striped && i % 2 !== 0 ? 'bg-ui-table-row-alt' : 'bg-ui-table-row',
      ]"
    >
      <span
        v-if="firstColumn"
        class="font-semibold text-ui-muted"
      >
        <PostDataTableRuntime :template="row[firstColumn.name]" />
      </span>
      <span class="flex flex-wrap gap-x-3">
        <PostDataTableRuntime
          v-for="(column, columnIndex) in restColumns"
          :key="columnIndex"
          :template="row[column.name]"
        />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostDataTableRuntime from "../PostDataTableRuntime/PostDataTableRuntime.vue";

const {
  columns,
  density = "regular",
  striped = true,
} = defineProps<{
  columns: Column[];
  rows: Row[];
  density?: string;
  striped?: boolean;
}>();

// Досье: первая колонка — название параметра, всё остальное — его значение.
// Колонок может быть и больше двух, тогда значения встают в одну строку.
const firstColumn = computed(() => columns[0]);
const restColumns = computed(() => columns.slice(1));
</script>
