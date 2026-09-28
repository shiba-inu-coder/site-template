/**
 * Контент приходит из Mongo и компилируется рантайм-компилятором Vue — при
 * SSR на сервере и в браузере. Выражение в `:prop`/`v-…`/`@click`/`{{ … }}`
 * исполняется с доступом к контексту рендера, а через
 * `$options.constructor.constructor` это произвольный JS в процессе сайта, где
 * лежат токен Vault и доступ к базе. Панель чистит контент до записи; здесь
 * вторая линия на случай, если что-то дошло до базы в обход неё.
 *
 * Чистится AST того же парсера, который потом компилирует шаблон, а не текст:
 * у регулярки своё мнение о границах тега (`>` внутри значения атрибута), и
 * любое расхождение двух парсеров — готовый обход.
 *
 * Маркер шорткода — `<div is="vue:Component" attr="value">` со статическими
 * атрибутами, чистка его не задевает.
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

// Фигурные скобки в тексте статьи — это текст («{бонус}»), а не интерполяция:
// схлопываем их, чтобы текст остался на странице, а не пропал вместе с узлом.
const collapseMustache = (val: string) =>
  val.replace(/\{{2,}/g, "{").replace(/\}{2,}/g, "}");

// Внутри `v-pre` парсер отдаёт `:x`/`@click` статическими атрибутами. Они
// ничего не исполняют, но `setAttribute("@click")` в браузере может бросить
// при монтировании, поэтому режем и их.
const DIRECTIVE_NAME = /^(?:v-|[:@#.])/;

const URL_ATTRS = new Set([
  "href",
  "src",
  "action",
  "formaction",
  "xlink:href",
]);

const SCRIPT_URL = /^(?:javascript|vbscript):/;

// Значение уже раскодировано парсером (`&#106;` → `j`). Браузер выбрасывает
// из URL табы и переводы строк в любом месте и управляющие символы по краям,
// поэтому схема проверяется без всего невидимого.
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

    // `<template>` парсер помечает шаблонным по его `v-if`/`v-for`/`#slot`.
    // Без директивы такой узел не соберёт ни одна трансформация, и codegen
    // упадёт на пустом codegenNode — возвращаем ему тип, который парсер дал бы
    // тегу без директив.
    if (node.tagType === ElementTypes.TEMPLATE)
      (node as { tagType: ElementTypes }).tagType = ElementTypes.ELEMENT;

    cleanChildren(node.children);
  }
};

const cache = new Map<string, RenderFunction>();

export const compileSafeTemplate = (
  template: string,
  onError: (error: CompilerError) => void,
): RenderFunction => {
  const cached = cache.get(template);
  if (cached) return cached;

  const options: CompilerOptions = { hoistStatic: true, onError };
  const ast = parse(collapseMustache(template), options);

  cleanChildren(ast.children);

  // Сборка — как у `compile` из `vue` (compileToFunction): код получает
  // рантайм тем же экземпляром `vue`, что и приложение, а `_rc` включает
  // прокси для `with (_ctx)` в сгенерированном коде.
  const { code } = compile(ast, options);
  const render = new Function("Vue", code)(Vue) as RenderFunction & {
    _rc?: boolean;
  };

  render._rc = true;
  cache.set(template, render);

  return render;
};
