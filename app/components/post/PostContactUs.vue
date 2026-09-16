<template>
  <div class="max-w-340 mx-auto flex flex-col items-center my-5 px-5">
    <div
      class="contact-form max-w-[850px] w-full"
      :class="WRAPPER_CLASSES[variant]"
    >
      <div
        v-if="variant === 'split' && seoConfig.site.name"
        class="content-start"
      >
        <h3 class="mt-0! text-step-4">{{ seoConfig.site.name }}</h3>
      </div>

      <form
        class="w-full space-y-4"
        @submit.prevent
      >
        <div>
          <label
            for="firstname-contacts-1"
            class="block mb-2 text-step-8 font-medium"
            >{{ seoConfig.translates.contacts.nameLabel }}</label
          >
          <input
            id="name-contacts-1"
            v-model="form.name"
            type="text"
            name="name-contacts-1"
            class="py-3 px-4 block w-full border-2 border-ui-input-border outline-none bg-ui-input-bg rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>

        <div>
          <label
            for="email-contacts-1"
            class="block mb-2 text-step-8 font-medium"
            >{{ seoConfig.translates.contacts.emailLabel }}</label
          >
          <input
            id="email-contacts-1"
            v-model="form.email"
            type="email"
            name="email-contacts-1"
            autocomplete="email"
            class="py-3 px-4 block w-full border-2 border-ui-input-border outline-none bg-ui-input-bg rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          />
          <span
            v-if="!isValidEmail"
            class="text-step-9 mt-1 text-status-negative"
            >{{ seoConfig.translates.contacts.invalidEmail }}</span
          >
        </div>

        <div class="col-span-full">
          <label
            for="message-contacts-1"
            class="block mb-2 text-step-8 font-medium"
            >{{ seoConfig.translates.contacts.messageLabel }}</label
          >
          <textarea
            id="message-contacts-1"
            v-model="form.message"
            name="about-contacts-1"
            rows="4"
            class="py-3 px-4 block w-full outline-none border-2 border-ui-input-border bg-ui-input-bg rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          ></textarea>
        </div>

        <div class="mt-6 grid">
          <button
            :disabled="isDisabled"
            type="submit"
            class="rounded-primary px-3 py-2.5 justify-center font-medium inline-flex items-center gap-x-2 whitespace-pre-wrap focus:outline-none focus:ring-2 text-center border border-transparent bg-ui-cta-bg text-ui-cta-text hover:bg-ui-cta-hover disabled:opacity-50 disabled:pointer-events-none"
          >
            {{ seoConfig.translates.contacts.submit }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { seoConfig } from "@@/seo.conf";
import { pickVariant } from "#shared/utils/block-variant";

const { variantFor } = useUiTheme();

// У контактов нет своей записи в конфиге статьи: форма одна на сайт, и
// вариант ей задаёт только тема.
const VARIANTS = ["card", "plain", "split"] as const;

const WRAPPER_CLASSES: Record<(typeof VARIANTS)[number], string> = {
  card: "flex flex-col border-2 border-ui-input-border p-4 rounded-primary bg-ui-panel-bg sm:p-6 lg:p-8",
  plain: "flex flex-col",
  split:
    "grid gap-6 p-5 bg-ui-card-bg border border-ui-card-border rounded-primary md:grid-cols-[1fr_1.2fr]",
};

const variant = computed(() =>
  pickVariant(VARIANTS, "card", variantFor("contact")),
);

const form = ref({
  name: "",
  email: "",
  message: "",
});

const isValidEmail = computed(() => {
  if (!form.value.email.length) {
    return true;
  } else {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(form.value.email);
  }
});

const isDisabled = computed(
  () =>
    !form.value.name ||
    !form.value.email ||
    !form.value.message ||
    !isValidEmail.value,
);
</script>
