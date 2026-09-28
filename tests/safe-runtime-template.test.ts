import { test } from "node:test";
import assert from "node:assert/strict";
import { compile, createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { compileSafeTemplate } from "../shared/utils/safe-runtime-template.ts";

const PAYLOAD = `$options.constructor.constructor('globalThis.__pwned = true; return 6*7')()`;

// Имя атрибута обрывается на пробеле и `=`, поэтому в динамическом аргументе
// присваивание спрятано в `\x3d`.
const ARG_PAYLOAD = String.raw`$options.constructor.constructor('globalThis.__pwned\x3dtrue')()`;

const DYNAMIC_ARGS = [
  `<probe v-bind:[${ARG_PAYLOAD}]="1"></probe>`,
  `<probe :[${ARG_PAYLOAD}]="1"></probe>`,
  `<probe v-on:[${ARG_PAYLOAD}]="1"></probe>`,
  `<probe @[${ARG_PAYLOAD}]="1"></probe>`,
];

const seenAttrs: Record<string, unknown>[] = [];

const components = {
  // Слушатели при SSR в HTML не попадают, так что снятый `@click` виден только
  // по `$attrs`, которые заглушка запоминает.
  Probe: {
    render(this: { $attrs: Record<string, unknown>; $slots: any }) {
      seenAttrs.push({ ...this.$attrs });

      return h("x-probe", null, this.$slots.default?.());
    },
  },
  TextImage: {
    props: ["uniqId", "imgSide"],
    render(this: { uniqId: string; imgSide: string }) {
      return h("x-text-image", {
        "data-uniq": this.uniqId,
        "data-side": this.imgSide,
      });
    },
  },
  RefLink: {
    props: ["slug"],
    render(this: { slug: string; $slots: any }) {
      return h("a", { href: `/go/${this.slug}/` }, this.$slots.default?.());
    },
  },
};

const renderSafe = (html: string, wrapper = "div", errors: unknown[] = []) =>
  renderToString(
    createSSRApp({
      render: compileSafeTemplate(`<${wrapper}>${html}</${wrapper}>`, (e) =>
        errors.push(e),
      ),
      components,
    }),
  );

test("контроль: без чистки выражение из атрибута исполняется при SSR", async () => {
  delete (globalThis as any).__pwned;

  const html = await renderToString(
    createSSRApp({ render: compile(`<span :data-x="${PAYLOAD}">t</span>`) }),
  );

  assert.match(html, /data-x="42"/);
  assert.equal((globalThis as any).__pwned, true);
  delete (globalThis as any).__pwned;
});

test("compileSafeTemplate: выражение из атрибута не исполняется", async () => {
  const html = await renderSafe(`<span :data-x="${PAYLOAD}">t</span>`);

  assert.equal(html, "<div><span>t</span></div>");
  assert.equal((globalThis as any).__pwned, undefined);
});

test("compileSafeTemplate: `>` в значении атрибута не прячет привязку за ним", async () => {
  const html = await renderSafe(`<span title=">" :id="'x'">t</span>`);

  assert.equal(html, `<div><span title="&gt;">t</span></div>`);
});

test("compileSafeTemplate: директивы с аргументами и модификаторами снимаются все", async () => {
  seenAttrs.length = 0;

  const html = await renderSafe(
    `<probe :foo.bar="1" @click.prevent="go()" v-bind:x="2" v-on:[y]="z" .prop="3" data-keep="1"></probe>` +
      `<p v-html="'<b>html</b>'">text</p>` +
      `<p v-text="'replaced'">own</p>` +
      `<probe><template #default>slot</template></probe>` +
      `<i v-if="false">if</i>`,
  );

  assert.deepEqual(seenAttrs[0], { "data-keep": "1" });
  assert.doesNotMatch(html, /<b>html<\/b>|replaced/);
  assert.match(html, /<p>text<\/p><p>own<\/p>/);
  assert.match(html, /<x-probe><template>slot<\/template><\/x-probe>/);
  assert.match(html, /<i>if<\/i>/);
});

test("compileSafeTemplate: выражение в динамическом аргументе не исполняется", async () => {
  for (const template of DYNAMIC_ARGS) {
    delete (globalThis as any).__pwned;
    await renderToString(
      createSSRApp({ render: compile(`<div>${template}</div>`), components }),
    );
    assert.equal((globalThis as any).__pwned, true, `контроль: ${template}`);
    delete (globalThis as any).__pwned;

    await renderSafe(template);
    assert.equal((globalThis as any).__pwned, undefined, template);
  }
});

test("compileSafeTemplate: v-pre не оставляет синтаксис директив атрибутами", async () => {
  const html = await renderSafe(`<p v-pre :x="y" @click="z">{{ a }}</p>`);

  assert.equal(html, "<div><p>{ a }</p></div>");
});

test("compileSafeTemplate: обработчики on* и srcdoc снимаются в любом регистре", async () => {
  seenAttrs.length = 0;

  const html = await renderSafe(
    `<img src="/a.png" onerror="alert(1)" OnLoad="alert(2)" ONCLICK="alert(3)">` +
      `<iframe srcdoc="<script>alert(4)</script>" SrcDoc="x"></iframe>` +
      `<probe onClick="alert(5)" onmouseover="alert(6)"></probe>`,
  );

  assert.equal(
    html,
    `<div><img src="/a.png"><iframe></iframe><x-probe></x-probe></div>`,
  );
  assert.deepEqual(seenAttrs[0], {});
});

test("compileSafeTemplate: схема javascript:/vbscript: снимается, как её ни прячь", async () => {
  const html = await renderSafe(
    [
      `<a href="javascript:alert(1)">1</a>`,
      `<a href=" JaVaScRiPt:alert(2)">2</a>`,
      `<a href="java&#x09;script:alert(3)">3</a>`,
      `<a href="&#106;avascript:alert(4)">4</a>`,
      `<a href="&#x6A;&#x61;vascript&colon;alert(5)">5</a>`,
      `<a href="&NewLine;java&Tab;script:alert(6)">6</a>`,
      `<a href=&#106;avascript:alert(7)>7</a>`,
      `<iframe src="vbscript:msgbox(7)"></iframe>`,
      `<form action="javascript:alert(8)"><button formaction="javascript:alert(9)">9</button></form>`,
      `<svg><a xlink:href="javascript:alert(10)"><text>10</text></a></svg>`,
    ].join(""),
  );

  assert.doesNotMatch(html, /script:|&#|&colon;/i);
  assert.doesNotMatch(html, /href=|src=|action=/);
});

test("compileSafeTemplate: обычные ссылки остаются", async () => {
  const html = await renderSafe(
    `<a href="https://example.com/a/?b=1&amp;c=2">x</a>` +
      `<a href="/go/brand/" rel="nofollow">y</a>` +
      `<a href="mailto:support@example.com">z</a>` +
      `<a href="#section-1">w</a>`,
  );

  assert.equal(
    html,
    `<div><a href="https://example.com/a/?b=1&amp;c=2">x</a>` +
      `<a href="/go/brand/" rel="nofollow">y</a>` +
      `<a href="mailto:support@example.com">z</a>` +
      `<a href="#section-1">w</a></div>`,
  );
});

test("compileSafeTemplate: текст с e-mail, временем и знаками директив не трогается", async () => {
  const html = await renderSafe(
    `<p>Пишите на support@example.com с 10:30 до 22:00, @бонус :) и #1 — ставка > 100 ₴</p>`,
  );

  assert.equal(
    html,
    `<div><p>Пишите на support@example.com с 10:30 до 22:00, @бонус :) и #1 — ставка &gt; 100 ₴</p></div>`,
  );
});

test("compileSafeTemplate: фигурные скобки остаются текстом, а не интерполяцией", async () => {
  const html = await renderSafe(`<p>Бонус {{ 6*7 }} и {{{x}}} и {одна}</p>`);

  assert.equal(html, "<div><p>Бонус { 6*7 } и {x} и {одна}</p></div>");
});

test("compileSafeTemplate: маркер шорткода доходит до компонента со своими атрибутами", async () => {
  const html = await renderSafe(
    `<div class="shortcode" is="vue:text-image" uniq-id="text-image-2" img-side="left"></div>`,
  );

  assert.equal(
    html,
    `<div><x-text-image data-uniq="text-image-2" data-side="left" class="shortcode"></x-text-image></div>`,
  );
});

test("compileSafeTemplate: ячейка таблицы с реф-ссылкой сохраняет текст ссылки", async () => {
  const html = await renderSafe(
    `Goldbet <div is="vue:RefLink" slug="goldbet-casino">Грати зараз</div>`,
    "span",
  );

  assert.equal(
    html,
    `<span>Goldbet <a href="/go/goldbet-casino/">Грати зараз</a></span>`,
  );
});

test("compileSafeTemplate: битая разметка не роняет рендер", async () => {
  const errors: unknown[] = [];
  const html = await renderSafe(
    `<p><b>жирный</p></span><i>курсив`,
    "div",
    errors,
  );

  assert.ok(errors.length > 0);
  assert.match(html, /жирный/);
  assert.match(html, /курсив/);
});

test("compileSafeTemplate: тот же шаблон компилируется один раз", () => {
  const noop = () => {};

  assert.equal(
    compileSafeTemplate("<div>кеш</div>", noop),
    compileSafeTemplate("<div>кеш</div>", noop),
  );
});
