<template>
  <div
    v-if="verdict.title || verdict.text || verdict.score"
    class="my-5"
  >
    <div
      v-if="variant === 'split'"
      class="grid grid-cols-1 overflow-hidden bg-ui-card-bg border border-ui-card-border rounded-primary md:grid-cols-[160px_1fr]"
    >
      <div
        class="flex flex-col items-center justify-center gap-1.5 p-5 text-center bg-ui-cta-bg text-ui-cta-text"
      >
        <span
          v-if="verdict.score"
          class="font-bold text-step-1 leading-none"
          >{{ verdict.score
          }}<span class="text-step-7 opacity-85"> / 5</span></span
        >
        <PostStars :score="verdict.score" />
      </div>
      <div class="grid gap-2.5 p-5">
        <h3
          v-if="verdict.title"
          class="mt-0! mb-0! text-step-4"
        >
          {{ verdict.title }}
        </h3>
        <div
          v-if="verdict.text"
          v-html="safeHTMLWrap(verdict.text, TEXT_TAGS)"
        ></div>
        <div
          v-if="badges.length"
          class="flex flex-wrap gap-1.5"
        >
          <span
            v-for="(badge, index) in badges"
            :key="index"
            class="inline-flex px-3 py-1 text-step-9 font-semibold rounded-full bg-ui-panel-bg border border-ui-panel-border"
            >{{ badge }}</span
          >
        </div>
        <PostButtonRef
          v-if="verdict.buttonText"
          size="medium"
          position="left"
          :padding="false"
          :name="verdict.buttonText"
          :slug="verdict.refLink || undefined"
        />
      </div>
    </div>

    <div
      v-else-if="variant === 'quote'"
      class="grid gap-2.5 py-1.5 pl-5 border-l-4 border-ui-marker"
    >
      <h3
        v-if="verdict.title"
        class="mt-0! mb-0! italic text-step-3"
      >
        {{ verdict.title }}
      </h3>
      <div
        v-if="verdict.text"
        class="text-step-6"
        v-html="safeHTMLWrap(verdict.text, TEXT_TAGS)"
      ></div>
      <div
        v-if="badges.length"
        class="flex flex-wrap gap-1.5"
      >
        <span
          v-for="(badge, index) in badges"
          :key="index"
          class="inline-flex px-3 py-1 text-step-9 font-semibold rounded-full bg-ui-panel-bg border border-ui-panel-border"
          >{{ badge }}</span
        >
      </div>
      <span
        v-if="verdict.score"
        class="font-bold text-step-6 text-ui-heading"
        >{{ verdict.score }} / 5</span
      >
      <PostButtonRef
        v-if="verdict.buttonText"
        size="medium"
        position="left"
        :padding="false"
        :name="verdict.buttonText"
        :slug="verdict.refLink || undefined"
      />
    </div>

    <div
      v-else-if="variant === 'strip'"
      class="grid grid-cols-1 gap-4 items-center px-5 py-3.5 bg-ui-panel-bg border border-ui-panel-border rounded-primary md:grid-cols-[auto_1fr_auto]"
    >
      <span
        v-if="verdict.score"
        class="font-bold text-step-2 leading-none text-ui-heading"
        >{{ verdict.score }}</span
      >
      <div>
        <h3
          v-if="verdict.title"
          class="mt-0! mb-0! text-step-5"
        >
          {{ verdict.title }}
        </h3>
        <div
          v-if="verdict.text"
          class="text-step-8"
          v-html="safeHTMLWrap(verdict.text, TEXT_TAGS)"
        ></div>
      </div>
      <PostButtonRef
        v-if="verdict.buttonText"
        class="shrink-0"
        size="medium"
        :padding="false"
        :name="verdict.buttonText"
        :slug="verdict.refLink || undefined"
      />
    </div>

    <div
      v-else
      class="grid gap-3 p-5 bg-ui-card-bg border border-ui-card-border rounded-primary"
    >
      <div class="flex items-center gap-4">
        <span
          v-if="verdict.score"
          class="font-bold text-step-1 leading-none text-ui-heading"
          >{{ verdict.score
          }}<span class="text-step-7 text-ui-muted"> / 5</span></span
        >
        <h3
          v-if="verdict.title"
          class="my-0! text-step-4"
        >
          {{ verdict.title }}
        </h3>
      </div>
      <div
        v-if="verdict.text"
        v-html="safeHTMLWrap(verdict.text, TEXT_TAGS)"
      ></div>
      <div
        v-if="badges.length"
        class="flex flex-wrap gap-1.5"
      >
        <span
          v-for="(badge, index) in badges"
          :key="index"
          class="inline-flex px-3 py-1 text-step-9 font-semibold rounded-full bg-ui-panel-bg border border-ui-panel-border"
          >{{ badge }}</span
        >
      </div>
      <PostButtonRef
        v-if="verdict.buttonText"
        size="medium"
        position="left"
        :padding="false"
        :name="verdict.buttonText"
        :slug="verdict.refLink || undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostButtonRef from "#rc/components/post/PostButtonRef.vue";
import PostStars from "#rc/components/post/PostStars.vue";
import { safeHTMLWrap } from "#shared/utils/safeHTMLWrap";
import { pickVariant } from "#shared/utils/block-variant";

const { verdictBox } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["card", "split", "quote", "strip"] as const;

// Вердикт — абзац с разметкой, а не строка: тот же список тегов, что у
// текста в блоке «картинка + текст».
const TEXT_TAGS = ["p", "em", "u", "s", "sup", "sub", "blockquote"];

// Больше пяти пилюль перестают читаться и переносятся в третью строку.
const MAX_BADGES = 5;

const verdict = computed(() => verdictBox.value);

const badges = computed(() =>
  (verdict.value.badges ?? []).slice(0, MAX_BADGES),
);

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "card",
    verdict.value.variant,
    variantFor("verdictBox"),
  ),
);
</script>
