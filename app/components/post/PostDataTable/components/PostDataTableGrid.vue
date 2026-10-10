<template>
  <div
    class="rounded-primary overflow-table overflow-x-auto relative border-2 border-ui-table-row-border"
    :class="mobileCards ? CARDS_WRAP : undefined"
  >
    <table
      class="sm:table-auto w-full border-separate border-spacing-0 overflow-hidden text-left"
      :class="mobileCards ? CARDS_TABLE : undefined"
    >
      <thead
        v-if="showHead"
        :class="mobileCards ? CARDS_HEAD : undefined"
      >
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
      <tbody :class="mobileCards ? CARDS_BODY : undefined">
        <tr
          v-for="(row, i) in rows"
          :key="i"
          :class="[rowClasses(i), mobileCards ? CARDS_ROW : undefined]"
        >
          <td
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
            class="break-words text-step-6"
            :class="[
              cellPadding,
              borderClass(i),
              mobileCards
                ? CARDS_CELL[dataTableCellKind(row[column.name], column.title)]
                : undefined,
            ]"
            :data-label="mobileCards ? column.title : undefined"
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
import {
  dataTableCellKind,
  type DataTableCellKind,
} from "#shared/utils/data-table-cell";

const {
  columns,
  rows,
  density = "regular",
  head = "solid",
  striped = true,
  showTableHead = true,
  mobileCards = false,
} = defineProps<{
  columns: Column[];
  rows: Row[];
  density?: string;
  head?: string;
  striped?: boolean;
  showTableHead?: boolean;
  mobileCards?: boolean;
}>();

// Ниже sm та же таблица рисуется карточками — только классами, один DOM на
// оба вида: условный рендер разошёлся бы при гидрации. Классы литералами,
// иначе `@config` их не соберёт.
const CARDS_WRAP =
  "max-sm:overflow-visible max-sm:rounded-none max-sm:border-0";
const CARDS_TABLE = "max-sm:block max-sm:overflow-visible";
const CARDS_HEAD = "max-sm:hidden";
const CARDS_BODY = "max-sm:flex max-sm:flex-col max-sm:gap-3";
const CARDS_ROW =
  "max-sm:flex max-sm:flex-col max-sm:overflow-hidden max-sm:rounded-primary max-sm:border-2 max-sm:border-ui-table-row-border max-sm:p-1";

const CARDS_CELL: Record<DataTableCellKind, string> = {
  logo: "max-sm:block max-sm:border-b-0 max-sm:pb-2 max-sm:text-center",
  button: "max-sm:block max-sm:border-b-0 max-sm:pt-2 max-sm:[&_a]:w-full",
  labeled:
    "max-sm:flex max-sm:items-center max-sm:justify-between max-sm:gap-3 max-sm:border-b-0 max-sm:border-t max-sm:border-ui-table-row-alt max-sm:first:border-t-0 max-sm:text-right max-sm:before:shrink-0 max-sm:before:text-left max-sm:before:text-ui-muted max-sm:before:content-[attr(data-label)]",
  plain: "max-sm:block max-sm:border-b-0",
};

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
