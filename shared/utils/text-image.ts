import type { ImageRole } from "./image-sizes.ts";

export type TextImageSide = "left" | "right" | "top" | "bottom";

const SIDES: readonly string[] = ["left", "right", "top", "bottom"];

// full писала панель, пока положение было модификатором вариантов: одна
// колонка, картинка первой — это и есть top. Запись старше самой сетки может
// не нести стороны вовсе.
export const resolveTextImageSide = (raw: unknown): TextImageSide => {
  if (raw === "full") {
    return "top";
  }

  return SIDES.includes(raw as string) ? (raw as TextImageSide) : "right";
};

export const textImageRole = (side: TextImageSide): ImageRole =>
  side === "left" || side === "right" ? { kind: "half" } : { kind: "column" };
