<template>
  <div>
    <PostDataTableRows
      v-if="variant === 'rows'"
      :columns="data.columns"
      :rows="formatedRows"
      :density="density"
    />
    <PostDataTableCompare
      v-else-if="variant === 'compare'"
      :columns="data.columns"
      :rows="formatedRows"
      :btn-name="data.btnName"
      :ref-link="data.refLink"
    />
    <PostDataTableKeyValue
      v-else-if="variant === 'key-value'"
      :columns="data.columns"
      :rows="formatedRows"
      :density="density"
      :striped="striped"
    />
    <PostDataTableGrid
      v-else
      :columns="data.columns"
      :rows="formatedRows"
      :variant="variant"
      :density="density"
      :head="head"
      :striped="striped"
      :show-table-head="data.showTableHead"
    />

    <div
      v-if="data.rows.length > defaultCountRows"
      class="mt-10 mb-4.5 flex justify-center"
    >
      <button
        v-show="isShowMoreBtn"
        type="button"
        class="bg-ui-card-bg border-2 border-ui-link text-ui-link hover:border-ui-link-hover hover:text-ui-cta-text font-medium hover:bg-ui-cta-hover transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
        @click="setCount(data.rows.length)"
      >
        {{ siteConfig.translates.showMore }}
      </button>
      <button
        v-show="!isShowMoreBtn"
        type="button"
        class="bg-ui-card-bg border-2 border-ui-link text-ui-link hover:border-ui-link-hover hover:text-ui-cta-text font-medium hover:bg-ui-cta-hover transition ease-in-out duration-500 px-3.5 rounded-primary py-2.5"
        @click="setCount(defaultCountRows)"
      >
        {{ siteConfig.translates.showLess }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostDataTableGrid from "./components/PostDataTableGrid.vue";
import PostDataTableRows from "./components/PostDataTableRows.vue";
import PostDataTableCompare from "./components/PostDataTableCompare.vue";
import PostDataTableKeyValue from "./components/PostDataTableKeyValue.vue";
import { pickVariant } from "#shared/utils/block-variant";

const siteConfig = useSiteConfig();

const { uniqId } = defineProps({
  uniqId: {
    type: String,
    required: true,
  },
});

const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = [
  "classic",
  "ranking",
  "rows",
  "compare",
  "key-value",
] as const;

// Маркер в статье может пережить свою запись в конфиге.
const FALLBACK: PostDataTable = {
  data: {
    uniqId: "",
    btnName: "",
    refLink: "",
    defaultCountRows: "0",
    showTableHead: false,
    columns: [],
    rows: [],
  },
};

const data = computed(
  () => (getShortcode({ uniqId, shortcode: "dataTables" }) || FALLBACK).data,
);

const variant = computed(() =>
  pickVariant(VARIANTS, "classic", data.value.variant, variantFor("dataTable")),
);

// Модификаторы живут на записи, а не в теме: одна таблица в статье бывает
// плотным досье, соседняя — обычной сеткой.
const density = computed(() => data.value.density || "regular");
const head = computed(() => data.value.head || "solid");
const striped = computed(() => data.value.striped !== false);

const formatedRows = computed(() => data.value.rows.slice(0, count.value));
const isShowMoreBtn = computed(() => data.value.rows.length > count.value);
const defaultCountRows = computed(() => Number(data.value.defaultCountRows));

const count = ref(defaultCountRows.value);
const setCount = (val: number) => (count.value = val);

onMounted(() => setCount(defaultCountRows.value));
</script>
