export const BonusBoxSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      variant: {
        type: String,
        default: "",
        trim: true,
      },
      label: {
        type: String,
        default: "",
        trim: true,
      },
      amount: {
        type: String,
        default: "",
        trim: true,
      },
      terms: {
        type: String,
        default: "",
        trim: true,
      },
      // Промокод: корешок варианта ticket. Пусто — корешок не рисуется.
      code: {
        type: String,
        default: "",
        trim: true,
      },
      refLink: {
        type: String,
        default: "",
        trim: true,
      },
      buttonText: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
];
