<template>
  <div
    class="rounded-primary overflow-table overflow-x-auto relative border-2 border-ui-table-row-border"
  >
    <table
      class="sm:table-auto w-full border-separate border-spacing-0 overflow-hidden text-left"
    >
      <thead v-if="showHead">
        <tr>
          <th
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            scope="col"
            class="break-words text-step-6"
            :class="[headClasses, headPadding]"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          :class="rowClasses(i)"
        >
          <td
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            class="break-words text-step-6"
            :class="[cellPadding, borderClass(i)]"
          >
            <PostDataTableRuntime :template="row[column.name]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import PostDataTableRuntime from "../PostDataTableRuntime/PostDataTableRuntime.vue";

const {
  columns,
  rows,
  density = "regular",
  head = "solid",
  striped = true,
  showTableHead = true,
} = defineProps<{
  columns: Column[];
  rows: Row[];
  density?: string;
  head?: string;
  striped?: boolean;
  showTableHead?: boolean;
}>();

const HEAD_CLASSES: Record<string, string> = {
  solid: "bg-ui-table-head-bg text-ui-table-head-text",
  subtle:
    "text-ui-muted uppercase tracking-wide border-b-2 border-ui-table-row-border",
  none: "",
};

const HEAD_PADDING: Record<string, string> = {
  regular: "p-primary-1",
  compact: "px-2 py-1.5",
};

const CELL_PADDING: Record<string, string> = {
  regular: "px-2 py-1.5",
  compact: "px-2 py-1",
};

// Два выключателя шапки живут рядом: showTableHead — поле записи старше
// модификаторов, head: none — модификатор. Гасит любой.
const showHead = computed(() => showTableHead && head !== "none");

const headClasses = computed(() => HEAD_CLASSES[head] ?? HEAD_CLASSES.solid);
const headPadding = computed(
  () => HEAD_PADDING[density] ?? HEAD_PADDING.regular,
);
const cellPadding = computed(
  () => CELL_PADDING[density] ?? CELL_PADDING.regular,
);

const rowClasses = (index: number) =>
  striped && index % 2 !== 0 ? "bg-ui-table-row-alt" : "bg-ui-table-row";

const borderClass = (index: number) =>
  rows.length - 1 !== index ? "border-b border-ui-table-row-alt" : undefined;
</script>
