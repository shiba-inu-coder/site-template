export const TableContentSchema = {
  _id: false,
  data: [
    {
      _id: false,
      title: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
        type: String,
        required: true,
        trim: true,
      },
      initialContent: {
        type: String,
        required: true,
        trim: true,
      },
      isActive: {
        type: Boolean,
        required: true,
      },
    },
  ],
};
