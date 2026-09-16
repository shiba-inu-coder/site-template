<template>
  <div
    v-if="writer"
    class="flex gap-4"
    :class="ROOT_CLASSES[variant]"
  >
    <NuxtImg
      v-if="writer.avatar?.path"
      loading="lazy"
      provider="cloudinary"
      height="auto"
      width="auto"
      class="shrink-0 rounded-full object-cover border-2 border-ui-marker"
      :class="AVATAR_CLASSES[variant]"
      :src="writer.avatar.path"
      :alt="writer.avatar.alt"
    />
    <div>
      <span
        class="font-semibold text-ui-heading"
        :class="variant === 'inline' ? 'inline' : 'block text-step-6'"
        >{{ writer.fullName }}</span
      >
      <span
        v-if="writer.position"
        class="text-step-9 text-ui-muted"
        :class="variant === 'inline' ? 'inline' : 'block'"
        >{{ variant === "inline" ? " · " : "" }}{{ writer.position }}</span
      >
      <p
        v-if="writer.info && SHOW_INFO[variant]"
        class="mt-1.5 mb-0! text-step-8"
      >
        {{ writer.info }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { pickVariant } from "#shared/utils/block-variant";

const { uniqId, variant: forcedVariant = "" } = defineProps<{
  uniqId: string;
  // Шапка статьи ставит вариант руками: там автор всегда строкой под H1,
  // что бы ни стояло в теме.
  variant?: string;
}>();

const { getShortcode } = usePost();
const { variantFor } = useUiTheme();

const VARIANTS = ["card", "inline", "banner", "centered", "signature"] as const;

type BioVariant = (typeof VARIANTS)[number];

const ROOT_CLASSES: Record<BioVariant, string> = {
  card: "items-center p-4 bg-ui-card-bg border border-ui-card-border rounded-primary",
  inline: "items-center gap-x-2.5 flex-wrap text-step-8",
  banner:
    "items-center p-5 bg-linear-to-br from-ui-panel-bg to-ui-card-bg border border-ui-panel-border rounded-primary",
  centered:
    "flex-col items-center text-center max-w-[420px] mx-auto p-5 bg-ui-card-bg border border-ui-card-border rounded-primary",
  signature:
    "items-center justify-end text-right pt-3.5 border-t border-ui-panel-border",
};

const AVATAR_CLASSES: Record<BioVariant, string> = {
  card: "size-16",
  inline: "size-8",
  banner: "size-22",
  centered: "size-20",
  // Подпись читается справа налево: сначала имя, потом лицо.
  signature: "size-12 order-last",
};

const SHOW_INFO: Record<BioVariant, boolean> = {
  card: true,
  inline: false,
  banner: true,
  centered: true,
  signature: false,
};

const entry = computed(() =>
  getShortcode({ uniqId, shortcode: "biographyWriters" }),
);

const writer = computed(() => entry.value?.data.data.writer);

const variant = computed(() =>
  pickVariant(
    VARIANTS,
    "card",
    forcedVariant,
    entry.value?.data.variant,
    variantFor("biography"),
  ),
);
</script>
