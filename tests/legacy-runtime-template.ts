/**
 * Прежний путь тела статьи — чистка AST и `compile` рантайм-компилятора Vue
 * (`compileSafeTemplate`, до v1.10.0). Живёт здесь эталоном: корпус в
 * `stored-html.test.ts` сверяет с ним SSR нового рендерера строка в строку.
 */

import {
  compile,
  ElementTypes,
  NodeTypes,
  parse,
  type AttributeNode,
  type CompilerError,
  type CompilerOptions,
  type DirectiveNode,
  type TemplateChildNode,
} from "@vue/compiler-dom";
import * as Vue from "vue";
import type { RenderFunction } from "vue";

const collapseMustache = (val: string) =>
  val.replace(/\{{2,}/g, "{").replace(/\}{2,}/g, "}");

const DIRECTIVE_NAME = /^(?:v-|[:@#.])/;

const URL_ATTRS = new Set([
  "href",
  "src",
  "action",
  "formaction",
  "xlink:href",
]);

const SCRIPT_URL = /^(?:javascript|vbscript):/;

const isScriptUrl = (value: string) =>
  SCRIPT_URL.test(value.replace(/[\s\p{Cc}]/gu, "").toLowerCase());

const isSafeProp = (prop: AttributeNode | DirectiveNode) => {
  if (prop.type !== NodeTypes.ATTRIBUTE) return false;

  const name = prop.name.toLowerCase();

  if (DIRECTIVE_NAME.test(name) || name.startsWith("on") || name === "srcdoc")
    return false;

  return !(URL_ATTRS.has(name) && isScriptUrl(prop.value?.content ?? ""));
};

const cleanChildren = (children: TemplateChildNode[]) => {
  for (let i = children.length - 1; i >= 0; i--) {
    const node = children[i];

    if (node.type === NodeTypes.INTERPOLATION) {
      children.splice(i, 1);
      continue;
    }

    if (node.type !== NodeTypes.ELEMENT) continue;

    node.props = node.props.filter(isSafeProp);

    if (node.tagType === ElementTypes.TEMPLATE)
      (node as { tagType: ElementTypes }).tagType = ElementTypes.ELEMENT;

    cleanChildren(node.children);
  }
};

export const compileLegacyTemplate = (
  template: string,
  onError: (error: CompilerError) => void = () => {},
): RenderFunction => {
  // В проде комментарии парсер выбрасывал сам; тесты идут на сборке Vue для
  // разработки, где он их хранит.
  const options: CompilerOptions = {
    hoistStatic: true,
    onError,
    comments: false,
  };
  const ast = parse(collapseMustache(template), options);

  cleanChildren(ast.children);

  const { code } = compile(ast, options);
  const render = new Function("Vue", code)(Vue) as RenderFunction & {
    _rc?: boolean;
  };

  render._rc = true;

  return render;
};
