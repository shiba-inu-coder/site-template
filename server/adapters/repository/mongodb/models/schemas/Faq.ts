export const FaqSchema = {
  _id: false,
  variant: {
    type: String,
    default: "",
    trim: true,
  },
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
