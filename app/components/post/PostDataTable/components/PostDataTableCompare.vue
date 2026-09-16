<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="flex flex-col overflow-hidden bg-ui-card-bg rounded-primary border"
      :class="i === 0 ? 'border-ui-marker' : 'border-ui-card-border'"
    >
      <div
        v-if="firstColumn"
        class="px-4 py-3 font-bold text-step-6 bg-ui-table-head-bg text-ui-table-head-text"
      >
        <PostDataTableRuntime :template="row[firstColumn.name]" />
      </div>
      <ul class="not-format px-4 grow">
        <li
          v-for="(column, columnIndex) in restColumns"
          :key="columnIndex"
          class="flex justify-between gap-3 py-2 text-step-8 border-b border-ui-table-row-border last:border-b-0"
        >
          <span class="text-ui-muted">{{ column.title }}</span>
          <span class="font-bold text-right">
            <PostDataTableRuntime :template="row[column.name]" />
          </span>
        </li>
      </ul>
      <PostButtonRef
        v-if="btnName"
        class="px-4 pb-4 pt-3"
        size="small"
        :padding="false"
        :full-width="true"
        :name="btnName"
        :slug="refLink || undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostDataTableRuntime from "../PostDataTableRuntime/PostDataTableRuntime.vue";
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";

const {
  columns,
  btnName = "",
  refLink = "",
} = defineProps<{
  columns: Column[];
  rows: Row[];
  btnName?: string;
  refLink?: string;
}>();

// Первая колонка становится шапкой карточки, остальные — её строками.
const firstColumn = computed(() => columns[0]);
const restColumns = computed(() => columns.slice(1));
</script>
