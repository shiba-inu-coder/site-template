import { Schema } from "mongoose";
import { UI_TOKENS } from "#shared/utils/ui-theme";

const colorRampFields = () => ({
  300: { type: String },
  200: { type: String },
  100: { type: String },
});

// Известные сейчас ui-токены (см. `shared/utils/ui-theme.ts` и блок
// `/* UI scheme */` в `tailwind.css`) — описаны явно, а strict: false на
// подсхеме ниже не режет токен, которого этот образ ещё не знает: панель и
// сайт обновляются не одним деплоем.
const SchemeSchema = new Schema(
  Object.fromEntries(UI_TOKENS.map((token) => [token, { type: String }])),
  { _id: false, strict: false },
);

const VARIANT_BLOCKS = ["toc", "gridCards", "faq", "buttonRef"] as const;

// Та же логика, что у SchemeSchema: блоки известны, strict: false тем не
// менее не роняет ни вариант блока, добавленного позже, ни ключ блока,
// который вариантов больше не имеет, а в старой теме ещё лежит.
const VariantsSchema = new Schema(
  Object.fromEntries(VARIANT_BLOCKS.map((block) => [block, { type: String }])),
  { _id: false, strict: false },
);

// Форма зеркалит `UiTheme` из `shared/utils/ui-theme.ts`. `frame`/`decor`/
// `accents` — Mixed: 4c/4e ещё не решили точный набор полей, и додумывать
// его здесь означает мигрировать схему второй раз.
export const UiThemeSchema = new Schema(
  {
    templateId: { type: String },
    templateName: { type: String },
    mode: { type: String, enum: ["dark", "light"] },

    colors: {
      primary: colorRampFields(),
      active: colorRampFields(),
      accent: colorRampFields(),
    },

    scheme: { type: SchemeSchema, default: () => ({}) },

    type: {
      display: {
        family: { type: String },
        weight: { type: Number },
        case: { type: String, enum: ["none", "upper"] },
        tracking: { type: String },
      },
      body: {
        family: { type: String },
      },
      scale: { type: String, enum: ["compact", "regular", "display"] },
      h1Align: { type: String, enum: ["left", "center"] },
    },

    geometry: {
      radius: { type: String },
      borders: { type: Number, enum: [0, 1, 2] },
      shadow: { type: String, enum: ["none", "soft", "glow"] },
      density: { type: String, enum: ["tight", "regular", "airy"] },
    },

    frame: { type: Schema.Types.Mixed, default: () => ({}) },
    variants: { type: VariantsSchema, default: () => ({}) },
    decor: { type: Schema.Types.Mixed, default: () => ({}) },
    accents: { type: Schema.Types.Mixed, default: () => ({}) },

    updatedAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);
