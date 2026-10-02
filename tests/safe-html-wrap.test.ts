import { test } from "node:test";
import assert from "node:assert/strict";
import { safeHTMLWrap } from "../shared/utils/safeHTMLWrap.ts";

test("внешняя ссылка из сгенерированного текста сохраняет rel и target", () => {
  const html = safeHTMLWrap(
    '<a href="https://other.com/" rel="noopener noreferrer nofollow" target="_blank">x</a>',
  );

  assert.match(html, /rel="noopener noreferrer nofollow"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /href="https:\/\/other\.com\/"/);
});

test("mailto: по-прежнему теряет href", () => {
  const html = safeHTMLWrap(
    '<a href="mailto:support@example.com">support@example.com</a>',
  );

  assert.doesNotMatch(html, /href=/);
  assert.match(html, /support@example\.com/);
});

test("атрибуты вне списка срезаются", () => {
  const html = safeHTMLWrap(
    '<a href="/x/" onclick="alert(1)" style="color:red">x</a>',
  );

  assert.equal(html, '<a href="/x/">x</a>');
});
