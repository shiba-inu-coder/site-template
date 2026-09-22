<template>
  <nav
    v-if="tableContent.length"
    class="toc-block max-w-[420px] text-step-7 bg-ui-panel-bg border border-ui-panel-border rounded-primary"
  >
    <component
      :is="variant === 'accordion' ? 'details' : 'div'"
      class="group p-4"
    >
      <summary
        v-if="variant === 'accordion'"
        class="flex items-center justify-between gap-3 cursor-pointer list-none text-step-9 uppercase tracking-wide text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover group-open:mb-2 [&::-webkit-details-marker]:hidden"
      >
        {{ siteConfig.translates.tableContent }}
        <svg-icon
          name="client/solid-up"
          class="size-5 shrink-0 transition duration-500 ease-in-out group-open:rotate-180"
        />
      </summary>
      <span
        v-else
        class="block mb-2 text-step-9 uppercase tracking-wide text-ui-heading"
      >
        {{ siteConfig.translates.tableContent }}
      </span>

      <ol class="not-format grid gap-1.5 pl-0 list-none">
        <li
          v-for="(contentItem, index) in tableContent"
          :key="index"
        >
          <a
            :title="contentItem.title"
            :href="`#${contentItem.value}`"
            class="text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover"
            @click.prevent="scrollTo(contentItem.value)"
          >
            {{ contentItem.title }}
          </a>
        </li>
      </ol>
    </component>
  </nav>
</template>

<script setup lang="ts">
import { pickVariant } from "#shared/utils/block-variant";

const siteConfig = useSiteConfig();

const { tableContent, tableContentEntry } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["list", "accordion"] as const;

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "list",
    tableContentEntry.value.variant,
    variantFor("toc"),
  ),
);

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
