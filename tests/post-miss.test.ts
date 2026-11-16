import { test } from "node:test";
import assert from "node:assert/strict";

import { postMissAction } from "../shared/utils/post-miss.ts";

const spa = { isClient: true, isHydrating: false };

test("postMissAction: 404 при переходе внутри SPA отдаёт адрес ноде", () => {
  assert.equal(postMissAction({ ...spa, statusCode: 404 }), "reload");
});

test("postMissAction: после полной загрузки показывает 404, а не грузит снова", () => {
  assert.equal(
    postMissAction({ isClient: false, isHydrating: false, statusCode: 404 }),
    "error",
  );
  assert.equal(
    postMissAction({ isClient: true, isHydrating: true, statusCode: 404 }),
    "error",
  );
});

test("postMissAction: обрыв сети и отмена запроса страницу не перезагружают", () => {
  assert.equal(postMissAction({ ...spa }), "error");
  assert.equal(postMissAction({ ...spa, statusCode: 500 }), "error");
});
