import { Schema } from "mongoose";

const HeaderLinkSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
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

export const NavigationSchema = new Schema(
  {
    headerLinks: { type: [HeaderLinkSchema], default: () => [] },
    footerLinks: { type: [FooterLinkSchema], default: () => [] },
    footerTitle: { type: String, default: "", trim: true },
    footerBody: { type: String, default: "" },
    explicit: { type: Boolean, default: false },
  },
  { _id: false },
);
