import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hyphenate, PatchFlags } from "@vue/shared";
import { compile, createSSRApp, h, type Component, type VNode } from "vue";
import { renderToString } from "vue/server-renderer";
import {
  defineShortcodes,
  parseStoredHtml,
  renderStoredHtml,
} from "../shared/utils/stored-html.ts";
import {
  ARTICLE_SHORTCODE_ATTRS,
  TABLE_CELL_SHORTCODE_ATTRS,
} from "../shared/constants/shortcodes.ts";
import { compileLegacyTemplate } from "./legacy-runtime-template.ts";

// Заглушки с именами и пропами настоящих блоков: пропы уходят в `data-props`,
// атрибуты мимо пропов — на корень, как у настоящего компонента.
const stub = (
  name: string,
  props: Record<string, unknown> = {},
): Component => ({
  name,
  props,
  render(this: { $props: object; $slots: any }) {
    return h(
      `x-${hyphenate(name)}`,
      { "data-props": JSON.stringify(this.$props) },
      this.$slots.default?.(),
    );
  },
});

const STUBS = {
  ButtonRef: stub("ButtonRef", {
    variant: String,
    position: String,
    size: String,
    fullWidth: Boolean,
    padding: { type: Boolean, default: true },
    name: String,
    showMobileIcon: Boolean,
    slug: String,
  }),
  BiographyWriter: stub("BiographyWriter", {
    uniqId: String,
    compact: Boolean,
  }),
  TableContent: stub("TableContent"),
  Faq: stub("Faq"),
  GridCards: stub("GridCards", { uniqId: String }),
  ProsConsPost: stub("ProsConsPost", { uniqId: String }),
  DataTable: stub("DataTable", { uniqId: String }),
  ContactUs: stub("ContactUs"),
  TextImage: stub("TextImage", { uniqId: String }),
  Image: stub("Image", {
    name: String,
    alt: String,
    width: String,
    height: String,
    inline: Boolean,
  }),
  RefLink: stub("RefLink", { slug: String }),
  RefLinkBtn: stub("RefLinkBtn", { slug: String }),
};

const ARTICLE = defineShortcodes(ARTICLE_SHORTCODE_ATTRS, STUBS);
const CELL = defineShortcodes(TABLE_CELL_SHORTCODE_ATTRS, STUBS);

const renderNew = (
  template: string,
  registry = ARTICLE,
  errors: unknown[] = [],
) =>
  renderToString(
    createSSRApp({
      render: () =>
        renderStoredHtml(
          parseStoredHtml(template, (e) => errors.push(e)),
          registry,
        ),
    }),
  );

const renderOld = (template: string) =>
  renderToString(
    createSSRApp({
      render: compileLegacyTemplate(template),
      components: STUBS,
    }),
  );

const body = (html: string) => `<div>${html}</div>`;
const cell = (html: string) => `<span>${html}</span>`;

const CORPUS: Record<string, string> = {
  "сущности и NBSP": body(
    `<p>Ціна&nbsp;100&nbsp;₴ &amp; більше &lt;b&gt; &quot;лапки&quot; &#169; &copy; &#x2014; &hellip;</p>`,
  ),
  "pre с отступами": body(
    `<pre>\n  рядок 1\n    рядок 2\n</pre><pre><code>a  b\n\tc</code></pre>`,
  ),
  "таблица с tbody": body(
    `<table><thead><tr><th>Бренд</th><th colspan="2">Бонус</th></tr></thead>` +
      `<tbody><tr><td>Goldbet</td><td>100%</td><td rowspan="1">до 5 000 ₴</td></tr></tbody></table>`,
  ),
  "таблица без tbody": body(
    `<table><tr><td>1</td></tr> <tr><td>2</td></tr><tfoot><tr><td>Σ</td></tr></tfoot></table>`,
  ),
  комментарии: body(
    `<p>до<!-- службове -->після</p><!-- між блоками --><p>далі</p>`,
  ),
  "void-теги": body(
    `<p>рядок<br>другий<br/>третій</p><hr><img src="https://res.cloudinary.com/x/a.png" alt="лого" width="120" height="40">`,
  ),
  "битые закрытия": body(`<p><b>жирний</p></span><i>курсив`),
  "лишний закрывающий div": body(`текст</div><p>після</p>`),
  "незакрытые li": body(`<ul><li>один<li>два</ul>`),
  "блочный маркер внутри p": body(
    `<p>Текст <div class="shortcode" is="vue:text-image" data-name="Text Image" uniq-id="textimg-1">&nbsp;</div> далі</p>`,
  ),
  "div внутри p": body(`<p>до<div>блок</div>після</p>`),
  "все маркеры статьи": body(
    [
      `<div class="shortcode" is="vue:button-ref" data-name="Button Ref" uniq-id="btn-1" name="Грати" position="left" size="medium" variant="solid">&nbsp;</div>`,
      `<div class="shortcode" is="vue:button-ref" data-name="Button Ref" uniq-id="btn-2">&nbsp;</div>`,
      `<div class="shortcode" is="vue:text-image" data-name="Text Image" uniq-id="textimg-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:grid-cards" data-name="Grid Cards" uniq-id="grid-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:data-table" data-name="Data Table" uniq-id="table-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:pros-cons-post" data-name="Pros Cons" uniq-id="pc-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:faq" data-name="FAQ" uniq-id="faq-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:table-content" data-name="Table Content" uniq-id="toc-1">&nbsp;</div>`,
      `<div class="shortcode" is="vue:biography-writer" data-name="Biography" uniq-id="bio-1" compact>&nbsp;</div>`,
      `<div class="shortcode" is="vue:contact-us" data-name="Contact Us" uniq-id="contact-1">&nbsp;</div>`,
    ].join("\n"),
  ),
  "старый content": body(
    `<h2 id="bonusy">Бонуси</h2>\n<p>Вітальний пакет <strong>до 5 000 ₴</strong> і <em>200 FS</em>. ` +
      `Деталі на <a href="https://example.com/terms/" target="_blank" rel="nofollow noopener">сайті</a>.</p>\n` +
      `<ul>\n  <li>Депозит від 100 ₴</li>\n  <li>Вейджер x35</li>\n</ul>\n` +
      `<h3>Як отримати</h3><ol><li>Зареєструватися</li><li>Поповнити</li></ol>` +
      `<blockquote>Цитата</blockquote><p style="text-align: center; color: rgb(10, 20, 30)">По центру</p>` +
      `<figure><img src="/a.png" alt="a"><figcaption>Підпис</figcaption></figure>`,
  ),
};

const CELL_CORPUS: Record<string, string> = {
  "иконка inline": cell(
    `<div is="vue:image" inline name="payments/visa" alt="Visa"></div> Visa`,
  ),
  "иконка блоком": cell(
    `<div is="vue:image" name="payments/visa" width="60"></div>`,
  ),
  "ref-link с текстом": cell(
    `Goldbet <div is="vue:ref-link" slug="goldbet-casino">Грати зараз</div>`,
  ),
  "ref-link-btn с текстом": cell(
    `<div is="vue:ref-link-btn" slug="goldbet-casino">Отримати бонус</div>`,
  ),
  "RefLink в PascalCase": cell(
    `<div is="vue:RefLink" slug="goldbet-casino">Грати</div>`,
  ),
  "простой текст": cell(`12 655`),
};

for (const [name, template] of Object.entries(CORPUS)) {
  test(`корпус статьи: ${name}`, async () => {
    assert.equal(await renderNew(template), await renderOld(template));
  });
}

for (const [name, template] of Object.entries(CELL_CORPUS)) {
  test(`корпус ячейки: ${name}`, async () => {
    assert.equal(await renderNew(template, CELL), await renderOld(template));
  });
}

const REAL = JSON.parse(
  readFileSync(
    new URL("./fixtures/section-bodies.json", import.meta.url),
    "utf8",
  ),
) as { sections: { uid: string; body: string }[] };

for (const section of REAL.sections) {
  test(`реальная секция ${section.uid}`, async () => {
    const template = body(section.body);

    assert.equal(await renderNew(template), await renderOld(template));
  });
}

test("корпус: неизвестный маркер не рисует ничего, текст вокруг склеен", async () => {
  const template = body(
    `до <div class="shortcode" is="vue:casino-ratings" uniq-id="r-1">&nbsp;</div> після`,
  );

  assert.match(await renderOld(template), /<casino-ratings/);
  assert.equal(await renderNew(template), "<div>до  після</div>");
});

const PAYLOAD = `$options.constructor.constructor('globalThis.__pwned = true; return 6*7')()`;

// Имя атрибута обрывается на пробеле и `=`, поэтому в динамическом аргументе
// присваивание спрятано в `\x3d`.
const ARG_PAYLOAD = String.raw`$options.constructor.constructor('globalThis.__pwned\x3dtrue')()`;

const seenAttrs: Record<string, unknown>[] = [];

// Слушатели при SSR в HTML не попадают, так что снятый `@click` виден только
// по `$attrs`, которые заглушка запоминает.
const Probe: Component = {
  render(this: { $attrs: Record<string, unknown>; $slots: any }) {
    seenAttrs.push({ ...this.$attrs });

    return h("x-probe", null, this.$slots.default?.());
  },
};

const PROBE = defineShortcodes({ Probe: ["foo", "x", "y", "prop"] }, { Probe });

test("контроль: у компилятора Vue выражение из атрибута исполняется при SSR", async () => {
  delete (globalThis as any).__pwned;

  const html = await renderToString(
    createSSRApp({ render: compile(`<span :data-x="${PAYLOAD}">t</span>`) }),
  );

  assert.match(html, /data-x="42"/);
  assert.equal((globalThis as any).__pwned, true);
  delete (globalThis as any).__pwned;
});

test("выражение из атрибута не исполняется", async () => {
  const html = await renderNew(body(`<span :data-x="${PAYLOAD}">t</span>`));

  assert.equal(html, "<div><span>t</span></div>");
  assert.equal((globalThis as any).__pwned, undefined);
});

test("`>` в значении атрибута не прячет привязку за ним", async () => {
  const html = await renderNew(body(`<span title=">" :id="'x'">t</span>`));

  assert.equal(html, `<div><span title="&gt;">t</span></div>`);
});

test("директивы с аргументами и модификаторами до маркера не доходят", async () => {
  seenAttrs.length = 0;

  const html = await renderNew(
    body(
      `<div is="vue:probe" :foo.bar="1" @click.prevent="go()" v-bind:x="2" v-on:[y]="z" .prop="3" data-keep="1"></div>` +
        `<p v-html="'<b>html</b>'">text</p>` +
        `<p v-text="'replaced'">own</p>` +
        `<i v-if="false">if</i>`,
    ),
    PROBE,
  );

  assert.deepEqual(seenAttrs[0], { "data-keep": "1" });
  assert.equal(
    html,
    '<div><x-probe data-keep="1"></x-probe><p>text</p><p>own</p><i>if</i></div>',
  );
});

test("выражение в динамическом аргументе не исполняется", async () => {
  for (const attr of [
    `v-bind:[${ARG_PAYLOAD}]="1"`,
    `:[${ARG_PAYLOAD}]="1"`,
    `v-on:[${ARG_PAYLOAD}]="1"`,
    `@[${ARG_PAYLOAD}]="1"`,
  ]) {
    delete (globalThis as any).__pwned;
    await renderNew(
      body(`<div is="vue:probe" ${attr}></div><b ${attr}>t</b>`),
      PROBE,
    );
    assert.equal((globalThis as any).__pwned, undefined, attr);
  }
});

test("v-pre не оставляет синтаксис директив атрибутами", async () => {
  const html = await renderNew(body(`<p v-pre :x="y" @click="z">{{ a }}</p>`));

  assert.equal(html, "<div><p>{ a }</p></div>");
});

test("обработчики on*, srcdoc и свойства vnode снимаются в любом регистре", async () => {
  seenAttrs.length = 0;

  const html = await renderNew(
    body(
      `<img src="/a.png" onerror="alert(1)" OnLoad="alert(2)" ONCLICK="alert(3)">` +
        `<p innerHTML="<img src=x onerror=alert(4)>" textContent="x" key="k" ref="r" is="x">t</p>` +
        `<div is="vue:probe" onClick="alert(5)" onmouseover="alert(6)" innerHTML="<b>7</b>" key="k"></div>`,
    ),
    PROBE,
  );

  assert.equal(
    html,
    `<div><img src="/a.png"><p>t</p><x-probe></x-probe></div>`,
  );
  assert.deepEqual(seenAttrs[0], {});
});

test("схема javascript:/vbscript: снимается, как её ни прячь", async () => {
  const html = await renderNew(
    body(
      [
        `<a href="javascript:alert(1)">1</a>`,
        `<a href=" JaVaScRiPt:alert(2)">2</a>`,
        `<a href="java&#x09;script:alert(3)">3</a>`,
        `<a href="&#106;avascript:alert(4)">4</a>`,
        `<a href="&#x6A;&#x61;vascript&colon;alert(5)">5</a>`,
        `<a href="&NewLine;java&Tab;script:alert(6)">6</a>`,
        `<a href=&#106;avascript:alert(7)>7</a>`,
        `<img src="vbscript:msgbox(8)" srcset="/a.png 1x, javascript:alert(8) 2x">`,
        `<a href="data:text/html,<script>alert(9)</script>">9</a>`,
        `<blockquote cite="javascript:alert(10)">10</blockquote>`,
      ].join(""),
    ),
  );

  assert.doesNotMatch(html, /script:|&#|&colon;|data:/i);
  assert.doesNotMatch(html, /href=|src=|cite=/);
});

test("обычные ссылки и картинки остаются", async () => {
  const html = await renderNew(
    body(
      `<a href="https://example.com/a/?b=1&amp;c=2">x</a>` +
        `<a href="/go/brand/" rel="nofollow">y</a>` +
        `<a href="mailto:support@example.com">z</a>` +
        `<a href="tel:+380001112233">t</a>` +
        `<a href="#section-1">w</a>` +
        `<img src="data:image/png;base64,iVBORw0KGgo=" alt="p">` +
        `<img src="//res.cloudinary.com/x/a.png" srcset="/a.png 1x, /b.png 2x">`,
    ),
  );

  assert.equal(
    html,
    `<div><a href="https://example.com/a/?b=1&amp;c=2">x</a>` +
      `<a href="/go/brand/" rel="nofollow">y</a>` +
      `<a href="mailto:support@example.com">z</a>` +
      `<a href="tel:+380001112233">t</a>` +
      `<a href="#section-1">w</a>` +
      `<img src="data:image/png;base64,iVBORw0KGgo=" alt="p">` +
      `<img src="//res.cloudinary.com/x/a.png" srcset="/a.png 1x, /b.png 2x"></div>`,
  );
});

test("текст с e-mail, временем и знаками директив не трогается", async () => {
  const html = await renderNew(
    body(
      `<p>Пишите на support@example.com с 10:30 до 22:00, @бонус :) и #1 — ставка > 100 ₴</p>`,
    ),
  );

  assert.equal(
    html,
    `<div><p>Пишите на support@example.com с 10:30 до 22:00, @бонус :) и #1 — ставка &gt; 100 ₴</p></div>`,
  );
});

test("фигурные скобки остаются текстом, а не интерполяцией", async () => {
  const html = await renderNew(
    body(`<p>Бонус {{ 6*7 }} и {{{x}}} и {одна}</p>`),
  );

  assert.equal(html, "<div><p>Бонус { 6*7 } и {x} и {одна}</p></div>");
});

test("маркер получает только атрибуты из реестра", async () => {
  const html = await renderNew(
    body(
      `<div class="shortcode" is="vue:text-image" data-name="Text Image" uniq-id="textimg-2" img-side="left" style="position:fixed" href="/x"></div>`,
    ),
  );

  assert.equal(
    html,
    `<div><x-text-image data-props="{&quot;uniqId&quot;:&quot;textimg-2&quot;}" class="shortcode" data-name="Text Image"></x-text-image></div>`,
  );
});

test("имя маркера разрешается как у resolveComponent, но только по своим ключам", async () => {
  const names = [
    "text-image",
    "textImage",
    "TextImage",
    "faq",
    "pros-cons-post",
  ];
  const html = await renderNew(
    body(names.map((name) => `<div is="vue:${name}"></div>`).join("")),
  );

  assert.equal(
    html.match(/<x-[a-z-]+/g)?.join(","),
    "<x-text-image,<x-text-image,<x-text-image,<x-faq,<x-pros-cons-post",
  );

  for (const name of [
    "constructor",
    "__proto__",
    "toString",
    "hasOwnProperty",
    "script",
    "style",
    "iframe",
    "Teleport",
    "component",
    "svg-icon",
    "FAQ",
    "bad name",
  ]) {
    assert.equal(
      await renderNew(body(`а<div is="vue:${name}">alert(1)</div>б`)),
      "<div>аб</div>",
      name,
    );
  }
});

test("пустой атрибут маркера — пустая строка, Boolean-проп сам даёт true", async () => {
  const html = await renderNew(
    cell(`<div is="vue:image" inline name="payments/visa"></div>`),
    CELL,
  );
  const props = JSON.parse(
    html.match(/data-props="([^"]*)"/)![1].replaceAll("&quot;", '"'),
  );

  assert.equal(props.inline, true);
  assert.equal(props.name, "payments/visa");
  assert.equal(props.width, undefined);

  const button = await renderNew(body(`<div is="vue:button-ref" name></div>`));

  assert.match(button, /&quot;name&quot;:&quot;&quot;/);
});

test("содержимое маркера — слот default", async () => {
  const html = await renderNew(
    cell(
      `<div is="vue:ref-link-btn" slug="goldbet-casino">Отримати <b>бонус</b></div>`,
    ),
    CELL,
  );

  assert.match(
    html,
    /<x-ref-link-btn[^>]*>Отримати <b>бонус<\/b><\/x-ref-link-btn>/,
  );
});

test("белый список тегов: опасное уходит с содержимым, незнакомое — без тега", async () => {
  const html = await renderNew(
    body(
      `<script>alert(1)</script><style>p{}</style><template>шаблон</template>` +
        `<iframe src="https://example.com/"></iframe><noscript>ns</noscript><textarea>ta</textarea>` +
        `<svg><a><animate attributeName="href" values="javascript:alert(2)"/><text>svg</text></a></svg>` +
        `<math><mi>x</mi></math>` +
        `<font color="red">червоний</font> <center>центр</center> <faq>тег</faq> ` +
        `<form action="/x"><button>кнопка</button><input value="v"></form>`,
    ),
  );

  assert.equal(html, "<div>червоний центр тег кнопка</div>");
});

test("инлайн-стиль: остаётся оформление, уходят слои, прятки и url()", async () => {
  const html = await renderNew(
    body(
      `<p style="text-align:center; color: rgb(1, 2, 3); font-weight:700; ` +
        `position:fixed; z-index:99; display:none; top:0; ` +
        `background:url(https://example.com/t.png); background-color:image-set('x.png' 1x); ` +
        `width: expression(alert(1)); margin: \\75rl(x)">t</p>` +
        `<p style="position:absolute">u</p>`,
    ),
  );

  assert.equal(
    html,
    `<div><p style="text-align:center;color:rgb(1, 2, 3);font-weight:700;">t</p><p>u</p></div>`,
  );
});

test("из повторённых атрибутов побеждает первый", async () => {
  const html = await renderNew(
    body(`<a href="/a/" href="javascript:x" class="one" class="two">a</a>`),
  );

  assert.equal(html, `<div><a href="/a/" class="one">a</a></div>`);
});

test("битая разметка не роняет рендер", async () => {
  const errors: unknown[] = [];
  const html = await renderNew(
    body(`<p><b>жирный</p></span><i>курсив`),
    ARTICLE,
    errors,
  );

  assert.ok(errors.length > 0);
  assert.match(html, /жирный/);
  assert.match(html, /курсив/);
});

test("поддерево без маркеров помечено статичным для гидрации, корень и путь к маркеру — нет", () => {
  const root = renderStoredHtml(
    parseStoredHtml(
      body(
        `<p>текст <b>жирний</b></p><div><div is="vue:faq"></div><p>поруч</p></div>`,
      ),
      () => {},
    ),
    ARTICLE,
  ) as VNode;
  const [lead, wrapper] = root.children as VNode[];

  assert.equal(root.patchFlag, 0);
  assert.equal(lead.patchFlag, PatchFlags.CACHED);
  assert.equal(wrapper.patchFlag, 0);
  assert.equal((wrapper.children as VNode[])[1].patchFlag, PatchFlags.CACHED);
});

test("та же строка разбирается один раз", () => {
  const noop = () => {};

  assert.equal(
    parseStoredHtml("<div>кеш</div>", noop),
    parseStoredHtml("<div>кеш</div>", noop),
  );
});
