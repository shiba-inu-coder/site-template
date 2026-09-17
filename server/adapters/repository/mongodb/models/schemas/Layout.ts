import { Schema } from "mongoose";

// Пункт меню ссылается сам на себя одним уровнем вложенности (группа с
// выпадающим списком). Mongoose не даёт сослаться на схему внутри её же
// литерала, поэтому `children` добавляется отдельным `add` после создания.
const HeaderItemSchema = new Schema(
  {
    kind: { type: String, default: "page", trim: true },
    label: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    style: { type: String, default: "link", trim: true },
    position: { type: String, default: "left", trim: true },
  },
  { _id: false },
);

HeaderItemSchema.add({
  children: { type: [HeaderItemSchema], default: () => [] },
});

const HeaderTopbarSchema = new Schema(
  {
    items: { type: [String], default: () => [] },
    note: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const HeaderCtaSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const FooterLinkSchema = new Schema(
  {
    name: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const FooterLegalLogoSchema = new Schema(
  {
    src: { type: String, default: "", trim: true },
    alt: { type: String, default: "", trim: true },
  },
  { _id: false },
);

export const LayoutSchema = new Schema(
  {
    header: {
      type: new Schema(
        {
          items: { type: [HeaderItemSchema], default: () => [] },
          topbar: { type: HeaderTopbarSchema, default: () => ({}) },
          cta: { type: HeaderCtaSchema, default: () => ({}) },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    footer: {
      type: new Schema(
        {
          title: { type: String, default: "", trim: true },
          body: { type: String, default: "" },
          links: { type: [FooterLinkSchema], default: () => [] },
          legalLogos: { type: [FooterLegalLogoSchema], default: () => [] },
          paymentLogos: { type: [FooterLegalLogoSchema], default: () => [] },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
    breadcrumbs: {
      type: new Schema(
        {
          homeLabel: { type: String, default: "", trim: true },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
  },
  { _id: false },
);
