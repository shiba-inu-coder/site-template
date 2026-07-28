<template>
  <div>
    <div
      class="rounded-primary overflow-table overflow-x-auto relative border-2 border-primary-100"
    >
      <table
        class="sm:table-auto w-full border-separate border-spacing-0 overflow-hidden text-left"
      >
        <thead
          v-if="state.data.showTableHead"
          class="bg-primary-300 text-white"
        >
          <tr class="">
            <th
              v-for="(column, columnIndex) in state.data.columns"
              :key="columnIndex"
              scope="col"
              class="break-words p-primary-1 text-primary-3"
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
              'bg-primary-200': i % 2 === 0,
              'bg-primary-300': i % 2 !== 0,
            }"
          >
            <td
              v-for="(column, columnIndex) in state.data.columns"
              :key="columnIndex"
              :class="{
                'last:rounded-primary': columnIndex === 0,
                'border-b border-primary-300': formatedRows.length - 1 !== i,
              }"
              class="break-words px-2 py-1.5 text-primary-3"
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
        class="bg-primary-100 border-2 border-accent-200 text-accent-200 hover:border-accent-200 hover:text-white font-medium hover:bg-accent-300 transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
        @click="setCount(state.data.rows.length)"
      >
        {{ seoConfig.translates.showMore }}
      </button>
      <button
        v-show="!isShowMoreBtn"
        type="button"
        class="bg-primary-100 border-2 border-accent-200 text-accent-200 hover:border-accent-200 hover:text-white font-medium hover:bg-accent-300 transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
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
