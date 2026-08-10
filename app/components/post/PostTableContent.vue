<template>
  <div>
    <button
      :id="`accordion-header-post-table-content`"
      type="button"
      class="p-primary-1 border-active-200 bg-primary-300 rounded-primary flex items-center justify-between w-full text-active-200 transition duration-500 ease-in-out hover:text-active-300"
      :class="{
        'rounded-bl-none rounded-br-none rounded-t-primary border-y-2 border-x-2 ':
          isShow,
        'border-2 ': !isShow,
      }"
      :aria-expanded="isShow"
      :aria-controls="`accordion-content-post-table-content`"
      @click="toggle"
    >
      <span class="text-step-4 font-semibold px-3">
        {{ seoConfig.translates.tableContent }}
      </span>
      <svg-icon
        data-accordion-icon
        name="client/solid-up"
        class="mr-1 size-5 shrink-0"
        :class="{ 'rotate-180': isShow }"
      />
    </button>
    <Transition name="fade">
      <div
        v-show="isShow"
        :id="`accordion-content-post-table-content`"
        role="region"
        class="bg-active-100/10 p-primary-1 rounded-b-primary text-step-7 border-x-2 border-b-2 border-active-200"
        :aria-labelledby="`accordion-header-post-table-content`"
      >
        <ul>
          <li
            v-for="(contentItem, index) in tableContent"
            :key="index"
          >
            <a
              :title="contentItem.title"
              :href="`#${contentItem.value}`"
              class="block text-step-5 transition duration-500 ease-in-out hover:text-active-200"
              @click.prevent="scrollTo(contentItem.value)"
            >
              {{ contentItem.title }}
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { seoConfig } from "@@/seo.conf";

const isShow = ref(false);
const toggle = () => (isShow.value = !isShow.value);

const { tableContent } = usePost();

onMounted(() => {
  const id = useRoute().hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
});

const scrollTo = (id: string) => {
  history.pushState(null, "", `#${id}`);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
    });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
