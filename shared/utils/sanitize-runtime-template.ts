/**
 * Контент приходит из Mongo и компилируется рантайм-компилятором Vue, а не
 * вставляется как HTML. Поэтому опасны не только теги: `{{ … }}` станет
 * интерполяцией, а `:prop`/`v-…`/`@click` — живой директивой с доступом к
 * контексту рендера. Панель чистит этим же приёмом только `sections[].body`
 * и `content` (appspro, article-html-sanitize.js), так что здесь стоит вторая
 * линия: `dataTables`, FAQ и `gridCards` до сайта доходят сырыми.
 *
 * Хранимая форма шорткода — `<div is="vue:Component" attr="value">` со
 * статическими атрибутами, поэтому вырезание директив ничего не ломает.
 */

const collapseMustache = (val: string) =>
  val.replace(/\{{2,}/g, "{").replace(/\}{2,}/g, "}");

const DIRECTIVE_ATTR = /\s(?:v-[a-zA-Z0-9_-]+|[:@#][^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;

const OPEN_TAG = /<[a-zA-Z][^>]*>/g;

export const sanitizeRuntimeTemplate = (val?: string) => {
  if (!val) return "";

  // Директивы режутся только внутри открывающих тегов: двоеточие и собака
  // в обычном тексте (время, e-mail) должны остаться как есть.
  return collapseMustache(val).replace(OPEN_TAG, (tag) =>
    tag.replace(DIRECTIVE_ATTR, ""),
  );
};
