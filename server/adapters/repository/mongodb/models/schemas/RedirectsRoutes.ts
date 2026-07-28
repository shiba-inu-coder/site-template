export const RedirectsRoutesSchema = [
  {
    _id: false,
    oldRoute: { type: String, required: true, trim: true },
    newRoute: { type: String, required: true, trim: true },
  },
];
