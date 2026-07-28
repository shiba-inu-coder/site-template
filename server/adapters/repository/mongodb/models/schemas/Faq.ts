export const FaqSchema = {
  _id: false,
  data: [
    {
      _id: false,
      label: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
};
