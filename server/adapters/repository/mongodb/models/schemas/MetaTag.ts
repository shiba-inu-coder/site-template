export const MetaTagSchema = {
  _id: false,
  title: {
    type: String,
    default: "",
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  keyword: {
    type: String,
    default: "",
    trim: true,
  },
  canonical: {
    type: String,
    default: "",
    trim: true,
  },
  robots: {
    type: String,
    default: "",
    trim: true,
  },
  lang: {
    type: String,
    default: "",
    trim: true,
  },
  alternates: {
    type: [
      {
        _id: false,
        hreflang: { type: String, required: true, trim: true },
        href: { type: String, required: true, trim: true },
      },
    ],
    default: [],
  },
};
