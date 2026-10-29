import { test } from "node:test";
import assert from "node:assert/strict";
import {
  refClickDay,
  refClickKey,
  shouldCountRefClick,
} from "../shared/utils/ref-clicks.ts";
import { REF_CLICKS_TIMEZONE } from "../shared/constants/ref-clicks.ts";

test("летом сутки по Амстердаму уходят вперёд на два часа от UTC", () => {
  const late = new Date("2026-07-01T22:30:00Z");

  assert.equal(refClickDay(late, REF_CLICKS_TIMEZONE), "2026-07-02");
});

test("зимой сдвиг один час", () => {
  assert.equal(
    refClickDay(new Date("2026-01-01T23:30:00Z"), REF_CLICKS_TIMEZONE),
    "2026-01-02",
  );
  assert.equal(
    refClickDay(new Date("2026-01-01T22:30:00Z"), REF_CLICKS_TIMEZONE),
    "2026-01-01",
  );
});

test("ключ дня и домена разделяет их вертикальной чертой", () => {
  assert.equal(
    refClickKey("lizaro-bet.nl", "2026-10-29"),
    "lizaro-bet.nl|2026-10-29",
  );
});

test("считается только GET при включённом флаге и известном домене", () => {
  const ok = { method: "GET", enabled: true, domain: "lizaro-bet.nl" };

  assert.equal(shouldCountRefClick(ok), true);
  assert.equal(shouldCountRefClick({ ...ok, method: "HEAD" }), false);
  assert.equal(shouldCountRefClick({ ...ok, enabled: false }), false);
  assert.equal(shouldCountRefClick({ ...ok, enabled: undefined }), false);
  assert.equal(shouldCountRefClick({ ...ok, domain: "" }), false);
});
