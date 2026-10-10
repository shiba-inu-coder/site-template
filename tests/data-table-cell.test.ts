import { test } from "node:test";
import assert from "node:assert/strict";
import { dataTableCellKind } from "../shared/utils/data-table-cell.ts";

const LOGO =
  '<div is="vue:image" logo name="a/b" alt="Goldbet" width="auto" height="60"></div>';
const BTN = '<div is="vue:ref-link-btn" slug="goldbet">Играть</div>';

test("лого казино — ячейка без подписи", () => {
  assert.equal(dataTableCellKind(LOGO, "Казино"), "logo");
});

test("булев logo может стоять до is", () => {
  assert.equal(
    dataTableCellKind('<div logo is="vue:image" name="x"></div>', "Казино"),
    "logo",
  );
});

test("слово logo в значении атрибута — не признак", () => {
  assert.equal(
    dataTableCellKind('<div is="vue:image" name="x" alt="logo"></div>', "Лого"),
    "labeled",
  );
});

test("иконка без logo — обычная ячейка с подписью", () => {
  assert.equal(
    dataTableCellKind('<div is="vue:image" inline name="x"></div>', "Метод"),
    "labeled",
  );
});

test("кнопка с рефкой — без подписи, даже если внутри картинка", () => {
  assert.equal(dataTableCellKind(BTN, "Играть"), "button");
  assert.equal(
    dataTableCellKind(
      '<div is="vue:ref-link-btn" slug="x"><div is="vue:image" logo name="y"></div></div>',
      "Играть",
    ),
    "button",
  );
});

test("текстовая рефка остаётся подписанной ячейкой", () => {
  assert.equal(
    dataTableCellKind(
      '<div is="vue:ref-link" slug="x">Goldbet</div>',
      "Казино",
    ),
    "labeled",
  );
});

test("колонка без заголовка идёт без подписи", () => {
  assert.equal(dataTableCellKind("100%", ""), "plain");
  assert.equal(dataTableCellKind("100%", "   "), "plain");
  assert.equal(dataTableCellKind("100%", undefined), "plain");
});

test("пустая ячейка не падает", () => {
  assert.equal(dataTableCellKind(undefined, "Бонус"), "labeled");
});
