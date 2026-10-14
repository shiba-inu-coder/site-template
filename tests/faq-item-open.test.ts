// Компоненты в тестах не рендерятся (сборка Nuxt нужна для автоимпортов), так
// что держим само намерение: ответ раскрыт у любого вопроса, а не только у
// первого, и клик его сворачивает.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(
  new URL(
    "../app/components/post/PostFAQ/components/PostFAQItem.vue",
    import.meta.url,
  ),
  "utf8",
);

test("PostFAQItem: состояние по умолчанию не зависит от индекса вопроса", () => {
  assert.match(source, /const isShow = ref\(true\);/);
  assert.doesNotMatch(source, /ref\(index\b/);
});

test("PostFAQItem: клик переключает состояние, ответ остаётся в DOM через v-show", () => {
  assert.match(
    source,
    /const toggle = \(\) => \(isShow\.value = !isShow\.value\);/,
  );
  assert.match(source, /v-show="isShow"/);
});
