<template>
  <div class="max-w-340 mx-auto flex flex-col items-center my-5 px-5">
    <div
      class="flex max-w-[850px] w-full contact-form flex-col border-2 border-primary-100 p-4 rounded-primary bg-primary-200 sm:p-6 lg:p-8"
    >
      <form class="w-full space-y-4">
        <!-- Grid -->
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
            class="py-3 px-4 block w-full border-2 border-primary-100 outline-none bg-primary-100 rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          />
        </div>
        <!-- End Grid -->

        <!-- Grid -->
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
            class="py-3 px-4 block w-full border-2 border-primary-100 outline-none bg-primary-100 rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          />
          <span
            v-if="!isValidEmail"
            class="text-step-9 mt-1 text-status-negative"
            >{{ seoConfig.translates.contacts.invalidEmail }}</span
          >
        </div>
        <!-- End Grid -->

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
            class="py-3 px-4 block w-full outline-none border-2 border-primary-100 bg-primary-100 rounded-primary text-step-8 disabled:opacity-50 disabled:pointer-events-none"
          ></textarea>
        </div>
        <!-- End Grid -->

        <div class="mt-6 grid">
          <button
            :disabled="isDisabled"
            type="submit"
            class="rounded-primary px-3 py-2.5 justify-center font-medium inline-flex items-center gap-x-2 whitespace-pre-wrap focus:outline-none focus:ring-2 text-center border border-transparent bg-active-200 text-surface-text hover:bg-active-300 disabled:opacity-50 disabled:pointer-events-none"
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
