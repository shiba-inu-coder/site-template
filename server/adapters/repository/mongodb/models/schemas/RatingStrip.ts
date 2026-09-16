// Синглтон: полоса оценки под H1 в статье одна, поэтому объект, а не массив,
// и без uniqId.
export const RatingStripSchema = {
  _id: false,
  variant: {
    type: String,
    default: "",
    trim: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  facts: [
    {
      _id: false,
      label: {
        type: String,
        default: "",
        trim: true,
      },
      // Для варианта bars это число 0–5, для остальных — любая строка
      // («до 24 ч», «3 800+»).
      value: {
        type: String,
        default: "",
        trim: true,
      },
    },
  ],
};
