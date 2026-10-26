import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  pickRefSlug,
  pruneRefs,
  refLabelSlug,
  resolveRefSlug,
} from "../shared/utils/ref-link.ts";
import {
  REF_BLOCK,
  REF_KEY,
  STANDARD_REF_BLOCKS,
} from "../shared/constants/ref-buttons.ts";

const refs = {
  defaultSlug: "goldbet-casino",
  blocks: { lobby: "glorion-casino" },
  buttons: { "lobby.gates-of-olympus": "goldbet-casino", "hero.cta": "x" },
};

test("кнопка главнее блока, блок главнее казино по умолчанию", () => {
  const key = "lobby.gates-of-olympus";

  assert.equal(pickRefSlug(refs, { key, block: "lobby" }), "goldbet-casino");
  assert.equal(
    pickRefSlug(refs, { key: "lobby.other", block: "lobby" }),
    "glorion-casino",
  );
  assert.equal(
    pickRefSlug(refs, { key: "footer.ref.a", block: "footer" }),
    "goldbet-casino",
  );
});

test("блок без кнопки и кнопка без блока", () => {
  assert.equal(pickRefSlug(refs, { block: "lobby" }), "glorion-casino");
  assert.equal(
    pickRefSlug(refs, { key: "lobby.gates-of-olympus" }),
    "goldbet-casino",
  );
});

test("пустые refs ничего не выбирают, brandSlug подхватывает", () => {
  for (const empty of [null, undefined, {}, { blocks: {}, buttons: {} }]) {
    assert.equal(pickRefSlug(empty, { key: "a", block: "b" }), "");
    assert.equal(
      resolveRefSlug(empty, { key: "a", block: "b", brandSlug: "brand" }),
      "brand",
    );
  }

  assert.equal(resolveRefSlug(null, { key: "a" }), "");
});

test("выбор панели главнее brandSlug", () => {
  assert.equal(
    resolveRefSlug(refs, { key: "a", block: "b", brandSlug: "brand" }),
    "goldbet-casino",
  );
});

test("ключ из прототипа не считается выбором", () => {
  assert.equal(pickRefSlug({ blocks: {} }, { block: "constructor" }), "");
  assert.equal(pickRefSlug({ buttons: {} }, { key: "__proto__" }), "");
});

test("pruneRefs убирает снятое казино из всех трёх мест", () => {
  assert.deepEqual(pruneRefs(refs, ["glorion-casino"]), {
    defaultSlug: "",
    blocks: { lobby: "glorion-casino" },
    buttons: {},
  });
  assert.equal(pruneRefs(null, ["a"]), null);
  assert.deepEqual(pruneRefs({}, []), {
    defaultSlug: "",
    blocks: {},
    buttons: {},
  });
});

test("refLabelSlug: диакритика, пробелы, регистр", () => {
  assert.equal(refLabelSlug("Přihlášení "), "prihlaseni");
  assert.equal(refLabelSlug("Hrát  hned!"), "hrat-hned");
  assert.equal(refLabelSlug("Registrace"), "registrace");
});

test("стандартные ключи в списке совпадают с теми, что зовут компоненты", () => {
  const declared = STANDARD_REF_BLOCKS.flatMap((b) =>
    b.buttons.map((x) => x.key),
  );
  const used: Record<string, string> = {
    [REF_KEY.heroCta]: "app/components/layout/PostHeroLayout.vue",
    [REF_KEY.stickyCta]: "app/components/layout/StickyCtaLayout.vue",
  };

  assert.deepEqual(declared.sort(), Object.keys(used).sort());

  for (const [key, file] of Object.entries(used)) {
    const name = Object.entries(REF_KEY).find(([, v]) => v === key)![0];
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

    assert.match(source, new RegExp(`REF_KEY\\.${name}\\b`));
  }

  for (const { block, buttons } of STANDARD_REF_BLOCKS) {
    assert.ok(Object.values(REF_BLOCK).includes(block));

    for (const { key } of buttons) {
      assert.ok(key.startsWith(`${block}.`));
    }
  }
});

test("кнопки таблицы идут мимо выбора панели", () => {
  for (const file of [
    "PostDataTableRefLinkBtn.vue",
    "PostDataTableRefLink.vue",
  ]) {
    const source = readFileSync(
      new URL(
        `../app/components/post/PostDataTable/PostDataTableRuntime/components/${file}`,
        import.meta.url,
      ),
      "utf8",
    );

    assert.match(source, /\btable-cell\b/);
  }
});
