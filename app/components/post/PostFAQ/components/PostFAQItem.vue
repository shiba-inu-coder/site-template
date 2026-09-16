<template>
  <div
    v-if="variant === 'accordion'"
    class="bg-ui-panel-bg border border-ui-panel-border rounded-primary overflow-hidden"
  >
    <h3 class="my-0!">
      <button
        :id="`accordion-header-${id}`"
        type="button"
        class="w-full flex items-center justify-between gap-3 p-primary-1 text-left! text-step-6 text-ui-link transition duration-500 ease-in-out hover:text-ui-link-hover"
        :aria-expanded="isShow"
        :aria-controls="`accordion-content-${id}`"
        @click="toggle"
      >
        {{ faqItem.label }}
        <svg-icon
          data-accordion-icon
          name="client/solid-up"
          class="size-5 shrink-0 transition duration-500 ease-in-out"
          :class="{ 'rotate-180': isShow }"
        />
      </button>
    </h3>
    <div
      v-show="isShow"
      :id="`accordion-content-${id}`"
      role="region"
      :aria-labelledby="`accordion-header-${id}`"
      class="px-2 pb-3.5 text-step-7"
      v-html="safeHTMLWrap(html)"
    ></div>
  </div>

  <div
    v-else-if="variant === 'numbered'"
    class="relative py-3.5 pl-11 border-b border-ui-panel-border last:border-b-0"
  >
    <span class="absolute left-0 top-3.5 font-bold text-step-6 text-ui-marker">
      {{ number }}
    </span>
    <h3 class="my-0! text-left! text-step-6">
      {{ faqItem.label }}
    </h3>
    <div
      class="mt-1.5 text-step-7"
      v-html="safeHTMLWrap(html)"
    ></div>
  </div>

  <div
    v-else-if="variant === 'chat'"
    class="grid gap-1.5"
  >
    <h3
      class="my-0! text-left! justify-self-end max-w-[80%] px-3.5 py-2 text-step-7 bg-ui-cta-bg text-ui-cta-text rounded-primary rounded-br-none"
    >
      {{ faqItem.label }}
    </h3>
    <div
      class="max-w-[80%] px-3.5 py-2.5 text-step-7 bg-ui-panel-bg border border-ui-panel-border rounded-primary rounded-bl-none"
      v-html="safeHTMLWrap(html)"
    ></div>
  </div>

  <div
    v-else
    class="p-4 bg-ui-panel-bg border border-ui-panel-border rounded-primary"
  >
    <h3 class="my-0! text-left! text-step-6">
      {{ faqItem.label }}
    </h3>
    <div
      class="mt-1.5 text-step-7"
      v-html="safeHTMLWrap(html)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";

const {
  faqItem,
  variant = "list",
  index = 0,
} = defineProps<{
  faqItem: { label: string; value: string };
  variant?: string;
  index?: number;
}>();

// Индекс в хвосте — не украшение: заголовок вопроса на чешском или русском
// после вычистки не-ASCII превращается в пустую строку, и все id аккордеона в
// статье совпали бы, увезя aria-controls в первый попавшийся ответ.
const id = computed(
  () =>
    `${faqItem.label
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .toLowerCase()}-${index}`,
);

const html = computed(() =>
  isHTML(faqItem.value)
    ? faqItem.value
    : `<p class="m-0! text-step-7">${faqItem.value}</p>`,
);

const number = computed(() => String(index + 1).padStart(2, "0"));

// Первый вопрос раскрыт: свёрнутый целиком аккордеон не показывает, что он
// вообще раскрывается. Остальные держат ответ в DOM (v-show), а не выкидывают
// его — иначе ответы пропали бы из индекса.
const isShow = ref(index === 0);
const toggle = () => (isShow.value = !isShow.value);
</script>
