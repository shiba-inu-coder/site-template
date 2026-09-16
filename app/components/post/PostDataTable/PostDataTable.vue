<template>
  <div>
    <div
      class="rounded-primary overflow-table overflow-x-auto relative border-2 border-ui-table-row-border"
    >
      <table
        class="sm:table-auto w-full border-separate border-spacing-0 overflow-hidden text-left"
      >
        <thead
          v-if="state.data.showTableHead"
          class="bg-ui-table-head-bg text-ui-table-head-text"
        >
          <tr class="">
            <th
              v-for="(column, columnIndex) in state.data.columns"
              :key="columnIndex"
              scope="col"
              class="break-words p-primary-1 text-step-6"
            >
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in formatedRows"
            :key="i"
            :class="{
              'bg-ui-table-row': i % 2 === 0,
              'bg-ui-table-row-alt': i % 2 !== 0,
            }"
          >
            <td
              v-for="(column, columnIndex) in state.data.columns"
              :key="columnIndex"
              :class="{
                'last:rounded-primary': columnIndex === 0,
                'border-b border-ui-table-row-alt':
                  formatedRows.length - 1 !== i,
              }"
              class="break-words px-2 py-1.5 text-step-6"
            >
              <PostDataTableRuntime :template="row[column.name]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="state.data.rows.length > defaultCountRows"
      class="mt-10 mb-4.5 flex justify-center"
    >
      <button
        v-show="isShowMoreBtn"
        type="button"
        class="bg-ui-card-bg border-2 border-ui-link text-ui-link hover:border-ui-link-hover hover:text-ui-cta-text font-medium hover:bg-ui-cta-hover transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
        @click="setCount(state.data.rows.length)"
      >
        {{ seoConfig.translates.showMore }}
      </button>
      <button
        v-show="!isShowMoreBtn"
        type="button"
        class="bg-ui-card-bg border-2 border-ui-link text-ui-link hover:border-ui-link-hover hover:text-ui-cta-text font-medium hover:bg-ui-cta-hover transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
        @click="setCount(defaultCountRows)"
      >
        {{ seoConfig.translates.showLess }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostDataTableRuntime from "./PostDataTableRuntime/PostDataTableRuntime.vue";
import { seoConfig } from "@@/seo.conf";

const { uniqId } = defineProps({
  uniqId: {
    type: String,
    required: true,
  },
});

const { getShortcode } = usePost();

const state = computed(
  () =>
    getShortcode({
      uniqId,
      shortcode: "dataTables",
    }) || {
      data: {
        uniqId: "",
        btnName: "",
        refLink: "",
        defaultCountRows: "0",
        showTableHead: false,
        columns: [],
        rows: [],
      },
    },
);

const formatedRows = computed(() =>
  state.value.data.rows.slice(0, count.value),
);
const isShowMoreBtn = computed(
  () => state.value.data.rows.length > count.value,
);
const defaultCountRows = computed(() =>
  Number(state.value.data.defaultCountRows),
);

const count = ref(defaultCountRows.value);
const setCount = (val: number) => (count.value = val);

onMounted(() => setCount(defaultCountRows.value));
</script>
