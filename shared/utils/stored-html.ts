/**
 * HTML статьи из Mongo рисуется без компилятора Vue. Парсер тот же, что был у
 * рантайм-компилятора, на сервере и в браузере, — дерево совпадает с прежним,
 * и гидрация сверяет то же, что сверяла. Дальше из дерева берётся только
 * разрешённое, и `h()` строится напрямую: генерации кода и `new Function` нет,
 * поэтому выражение, дошедшее до базы в обход панели, не исполняется ни на
 * сервере, где лежат токен Vault и доступ к базе, ни в браузере.
 *
 * Компонент появляется только из маркера `<div is="vue:Name">` и только из
 * реестра вызывающего. Имя тега компонентом не становится: `<faq>` в тексте —
 * неизвестный тег, а не блок.
 */

import {
  NodeTypes,
  parse,
  type CompilerError,
  type ElementNode,
  type TemplateChildNode,
} from "@vue/compiler-dom";
import {
  camelize,
  capitalize,
  hyphenate,
  parseStringStyle,
  PatchFlags,
} from "@vue/shared";
import {
  createTextVNode,
  createVNode,
  h,
  type Component,
  type VNode,
} from "vue";

interface StoredElement {
  tag: string;
  props: Record<string, string | Record<string, string>>;
  children: StoredNode[];
  static: boolean;
}

interface StoredMarker {
  marker: string;
  attrs: Record<string, string>;
  children: StoredNode[];
}

export type StoredNode = string | StoredElement | StoredMarker;

interface ShortcodeEntry {
  component: Component;
  attrs: readonly string[];
}

export type ShortcodeRegistry = Readonly<Record<string, ShortcodeEntry>>;

/** Реестр маркеров: имя → компонент и атрибуты, которые ему можно передать. */
export const defineShortcodes = <Name extends string>(
  attrs: Record<Name, readonly string[]>,
  components: Record<NoInfer<Name>, Component>,
): ShortcodeRegistry =>
  Object.fromEntries(
    (Object.keys(attrs) as Name[]).map((name) => [
      name,
      { component: components[name], attrs: attrs[name] },
    ]),
  );

// Фигурные скобки в тексте статьи — это текст («{бонус}»), а не интерполяция:
// схлопываем их, чтобы парсер не вынул текст в узел выражения.
const collapseMustache = (val: string) =>
  val.replace(/\{{2,}/g, "{").replace(/\}{2,}/g, "}");

const ALLOWED_TAGS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "i",
  "img",
  "ins",
  "kbd",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "p",
  "picture",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "u",
  "ul",
  "var",
  "wbr",
]);

// Неизвестный тег снимается, а его текст остаётся. Эти уходят вместе с
// содержимым: у них внутри не текст страницы, а код, стили или чужой документ.
const DROPPED_TAGS = new Set([
  "applet",
  "audio",
  "canvas",
  "datalist",
  "embed",
  "frame",
  "frameset",
  "head",
  "iframe",
  "math",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "plaintext",
  "script",
  "select",
  "style",
  "svg",
  "template",
  "textarea",
  "title",
  "video",
  "xmp",
]);

const GLOBAL_ATTRS = new Set(["class", "id", "title", "lang", "dir", "role"]);

const CELL_ATTRS = [
  "colspan",
  "rowspan",
  "headers",
  "align",
  "valign",
  "width",
];
const ROW_ATTRS = ["align", "valign"];

const TAG_ATTRS: Record<string, readonly string[]> = {
  a: ["href", "target", "rel", "name", "hreflang"],
  img: ["src", "srcset", "sizes", "alt", "width", "height", "loading"],
  source: ["srcset", "sizes", "media", "type", "width", "height"],
  ol: ["start", "reversed", "type"],
  li: ["value"],
  table: ["border", "cellpadding", "cellspacing", "width", "align"],
  thead: ROW_ATTRS,
  tbody: ROW_ATTRS,
  tfoot: ROW_ATTRS,
  tr: ROW_ATTRS,
  td: CELL_ATTRS,
  th: [...CELL_ATTRS, "scope", "abbr"],
  col: ["span", "width"],
  colgroup: ["span", "width"],
  blockquote: ["cite"],
  q: ["cite"],
  del: ["cite", "datetime"],
  ins: ["cite", "datetime"],
  time: ["datetime"],
  data: ["value"],
  details: ["open"],
  p: ["align"],
  div: ["align"],
};

const DATA_OR_ARIA = /^(?:data|aria)-[a-z0-9_.-]+$/;

const URL_ATTRS = new Set(["href", "src", "srcset", "cite"]);

const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

// Значение уже раскодировано парсером (`&#106;` → `j`). Браузер выбрасывает
// из URL табы и переводы строк в любом месте и управляющие символы по краям,
// поэтому схема ищется в строке без всего невидимого. Без схемы — ссылка
// относительная.
const isSafeUrl = (value: string) =>
  value.split(",").every((candidate) => {
    const url = candidate.replace(/[\s\p{Cc}]/gu, "");
    const scheme = url.match(/^([a-z][a-z0-9+.-]*):/i)?.[1].toLowerCase();

    return !scheme || SAFE_SCHEMES.has(scheme) || /^data:image\//i.test(url);
  });

const STYLE_PROPS = new Set([
  "background-color",
  "border",
  "border-collapse",
  "color",
  "float",
  "font-size",
  "font-style",
  "font-weight",
  "height",
  "line-height",
  "list-style-type",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-width",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "text-align",
  "text-decoration",
  "text-transform",
  "vertical-align",
  "white-space",
  "width",
]);

const STYLE_FUNCTION = /([a-z-]*)\s*\(/gi;
const SAFE_STYLE_FUNCTIONS = new Set(["rgb", "rgba", "hsl", "hsla", "calc"]);

// Обратная косая черта в CSS — экранирование, им прячут `url` от проверки.
const isSafeStyleValue = (value: string) =>
  !value.includes("\\") &&
  [...value.matchAll(STYLE_FUNCTION)].every(([, name]) =>
    SAFE_STYLE_FUNCTIONS.has(name.toLowerCase()),
  );

// Инлайн-стиль из старого редактора — выравнивание, цвет, отступы. Позиция,
// z-index, display и `url()` сюда не проходят: ими накрывают страницу чужим
// слоем, прячут текст или ходят на сторонний адрес.
const safeStyle = (css: string) => {
  const style: Record<string, string> = {};

  for (const [prop, raw] of Object.entries(parseStringStyle(css))) {
    const name = prop.toLowerCase();
    const value = `${raw}`;

    if (STYLE_PROPS.has(name) && isSafeStyleValue(value)) style[name] = value;
  }

  return Object.keys(style).length ? style : null;
};

const isAllowedAttr = (tag: string, name: string) =>
  GLOBAL_ATTRS.has(name) ||
  name === "style" ||
  DATA_OR_ARIA.test(name) ||
  Boolean(TAG_ATTRS[tag]?.includes(name));

// Первый из повторов побеждает, как у HTML-парсера браузера.
const elementProps = (tag: string, node: ElementNode) => {
  const props: StoredElement["props"] = {};

  for (const prop of node.props) {
    if (prop.type !== NodeTypes.ATTRIBUTE) continue;

    const name = prop.name.toLowerCase();
    const value = prop.value?.content ?? "";

    if (Object.hasOwn(props, name) || !isAllowedAttr(tag, name)) continue;
    if (URL_ATTRS.has(name) && !isSafeUrl(value)) continue;

    if (name === "style") {
      const style = safeStyle(value);

      if (style) props.style = style;
    } else {
      props[name] = value;
    }
  }

  return props;
};

const MARKER_ATTR = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

const markerAttrs = (node: ElementNode) => {
  const attrs: Record<string, string> = {};

  for (const prop of node.props) {
    if (prop.type !== NodeTypes.ATTRIBUTE || prop.name === "is") continue;

    const name = hyphenate(prop.name);
    const value = prop.value?.content ?? "";

    if (Object.hasOwn(attrs, name) || !MARKER_ATTR.test(name)) continue;
    if (URL_ATTRS.has(name) && !isSafeUrl(value)) continue;

    attrs[name] = value;
  }

  return attrs;
};

// Та же проверка, по которой парсер Vue считает узел компонентом.
const markerName = (node: ElementNode) => {
  for (const prop of node.props) {
    if (
      prop.type === NodeTypes.ATTRIBUTE &&
      prop.name === "is" &&
      prop.value?.content.startsWith("vue:")
    )
      return prop.value.content.slice(4);
  }

  return null;
};

// Соседние текстовые куски склеиваются: браузер разберёт их одним текстовым
// узлом, и два узла Vue на его месте гидрация сочла бы расхождением.
const pushNode = (out: StoredNode[], node: StoredNode) => {
  const last = out.length - 1;

  if (typeof node === "string" && typeof out[last] === "string")
    out[last] = out[last] + node;
  else out.push(node);
};

const isStatic = (node: StoredNode) =>
  typeof node === "string" || ("tag" in node && node.static);

const toNodes = (children: TemplateChildNode[], out: StoredNode[] = []) => {
  for (const node of children) {
    if (node.type === NodeTypes.TEXT) {
      pushNode(out, node.content);
      continue;
    }

    if (node.type !== NodeTypes.ELEMENT) continue;

    const marker = markerName(node);

    if (marker !== null) {
      out.push({
        marker,
        attrs: markerAttrs(node),
        children: toNodes(node.children),
      });
      continue;
    }

    const tag = node.tag.toLowerCase();

    if (DROPPED_TAGS.has(tag)) continue;

    if (!ALLOWED_TAGS.has(tag)) {
      toNodes(node.children, out);
      continue;
    }

    const nodes = toNodes(node.children);

    out.push({
      tag,
      props: elementProps(tag, node),
      children: nodes,
      static: nodes.every(isStatic),
    });
  }

  return out;
};

const cache = new Map<string, StoredNode[]>();

export const parseStoredHtml = (
  html: string,
  onError: (error: CompilerError) => void,
): StoredNode[] => {
  const cached = cache.get(html);
  if (cached) return cached;

  const ast = parse(collapseMustache(html), { comments: false, onError });
  const nodes = toNodes(ast.children);

  cache.set(html, nodes);

  return nodes;
};

// Ровно те три написания, которые принимал `resolveComponent`: `text-image`,
// `textImage`, `TextImage`. Только собственные ключи — иначе `vue:constructor`
// нашёл бы `Object` в прототипе реестра.
const resolveEntry = (registry: ShortcodeRegistry, name: string) => {
  for (const key of [name, camelize(name), capitalize(camelize(name))])
    if (Object.hasOwn(registry, key)) return registry[key];

  return null;
};

const BASE_MARKER_ATTRS = new Set(["class", "uniq-id"]);

const isMarkerAttr = (entry: ShortcodeEntry, name: string) =>
  BASE_MARKER_ATTRS.has(name) ||
  DATA_OR_ARIA.test(name) ||
  entry.attrs.includes(name);

type Rendered = VNode | string;

// Текст среди узлов уходит готовым текстовым vnode, как у компилятора: сборка
// Vue для разработки клонирует кешированный узел вместе с детьми, и строку
// среди них она не переживает.
const toVNodes = (items: Rendered[]) =>
  items.map((item) =>
    typeof item === "string" ? createTextVNode(item) : item,
  );

const renderMarker = (node: StoredMarker, registry: ShortcodeRegistry) => {
  const entry = resolveEntry(registry, node.marker);
  if (!entry) return null;

  const props: Record<string, string> = {};

  for (const [name, value] of Object.entries(node.attrs))
    if (isMarkerAttr(entry, name)) props[name] = value;

  if (!node.children.length) return h(entry.component, props);

  return h(entry.component, props, {
    default: () => toVNodes(renderNodes(node.children, registry)),
  });
};

// Поддерево без маркеров получает ту же метку, что ставил компилятор
// (`cacheStatic`), и гидрация в проде его не сверяет: DOM остаётся таким, каким
// его разобрал браузер. Без метки каждое место, где парсер Vue и браузер
// строят разное дерево (незакрытый `<li>`, блок внутри `<p>`), стало бы
// расхождением, и Vue перерисовал бы его — прежний путь этого не делал.
// Корневой элемент компилятор не кешировал, поэтому и здесь он без метки.
const renderElement = (
  node: StoredElement,
  registry: ShortcodeRegistry,
  isRoot: boolean,
) => {
  const children = renderNodes(node.children, registry);
  const flag = node.static && !isRoot ? PatchFlags.CACHED : 0;
  const props = { ...node.props };

  if (!children.length) return createVNode(node.tag, props, null, flag);

  if (children.length === 1 && typeof children[0] === "string")
    return createVNode(node.tag, props, children[0], flag);

  return createVNode(node.tag, props, toVNodes(children), flag);
};

const renderNode = (
  node: StoredNode,
  registry: ShortcodeRegistry,
  isRoot = false,
): Rendered | null => {
  if (typeof node === "string") return node;
  if ("marker" in node) return renderMarker(node, registry);

  return renderElement(node, registry, isRoot);
};

const renderNodes = (nodes: StoredNode[], registry: ShortcodeRegistry) => {
  const out: Rendered[] = [];

  for (const node of nodes) {
    const rendered = renderNode(node, registry);
    const last = out.length - 1;

    if (rendered === null) continue;

    if (typeof rendered === "string" && typeof out[last] === "string")
      out[last] += rendered;
    else out.push(rendered);
  }

  return out;
};

/** Корни дерева — один узел или фрагмент, как отдавал скомпилированный шаблон. */
export const renderStoredHtml = (
  nodes: StoredNode[],
  registry: ShortcodeRegistry,
) => {
  if (nodes.length === 1) return renderNode(nodes[0], registry, true);

  const out = renderNodes(nodes, registry);

  return out.length === 1 ? out[0] : toVNodes(out);
};
