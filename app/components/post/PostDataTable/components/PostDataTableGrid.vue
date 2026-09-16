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
            v-if="isRanking"
            scope="col"
            class="w-px text-center text-step-6"
            :class="[headClasses, headPadding]"
          >
            #
          </th>
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
            v-if="isRanking"
            class="w-px text-center font-bold text-step-4 text-ui-heading"
            :class="[cellPadding, highlightClass(i), borderClass(i)]"
          >
            {{ i + 1 }}
          </td>
          <td
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            class="break-words text-step-6"
            :class="[
              cellPadding,
              highlightClass(i),
              borderClass(i),
              isRanking && columnIndex === 0
                ? 'font-bold text-ui-heading'
                : undefined,
            ]"
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
  variant,
  density = "regular",
  head = "solid",
  striped = true,
  showTableHead = true,
} = defineProps<{
  columns: Column[];
  rows: Row[];
  variant: string;
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

const isRanking = computed(() => variant === "ranking");

// Два выключателя шапки живут рядом: showTableHead — поле записи с той эпохи,
// когда вариантов не было, head: none — модификатор варианта. Гасит любой.
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

// Подсветка топа — заливка поверх фона строки, а не вместо него: 16 % маркера
// на том же ряду, что и остальные, иначе первая строка выпала бы из полос.
const highlightClass = (index: number) =>
  isRanking.value && index === 0 ? "bg-ui-marker/16" : undefined;

const borderClass = (index: number) =>
  rows.length - 1 !== index ? "border-b border-ui-table-row-alt" : undefined;
</script>
