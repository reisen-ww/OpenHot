// A daily's front-page picture comes from the item its lead is about: the editors' lead matched to an
// item by title, never simply the first highlight.
import "./setup.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ReportCitation } from "@aihot/contracts/site";
import { leadItemOf } from "@aihot/backend/publication/reports";

const cite = (itemId: string, title: string, available = true) => ({ itemId, title, available }) as ReportCitation;
const arena = cite("a", "Zig 0.14 编译器发布，性能大幅提升");
const binance = cite("b", "某期刊撤稿阿尔茨海默论文，披露数据造假与图像重复等问题");

test("an editors' lead is matched to the item it is written about", () => {
  assert.equal(leadItemOf("某期刊撤稿阿尔茨海默论文，披露数据造假问题", [arena, binance], [arena, binance])?.itemId, "b");
});

test("a lead that matches no item clearly has no item", () => {
  assert.equal(leadItemOf("多家机构发布新的技术方案，行业竞争加剧", [arena], [arena, binance]), undefined);
});

test("without an editors' lead the first highlight leads", () => {
  assert.equal(leadItemOf(undefined, [arena], [binance, arena])?.itemId, "a");
});

test("a withdrawn highlight never leads the front page", () => {
  const withdrawn = cite("w", "已下架", false);
  assert.equal(leadItemOf(undefined, [withdrawn, arena], [withdrawn, arena, binance])?.itemId, "a");
});
