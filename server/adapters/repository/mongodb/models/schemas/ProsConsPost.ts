export const ProsConsPostSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      data: {
        _id: false,
        prosList: {
          type: [String],
          default: [],
        },
        consList: {
          type: [String],
          default: [],
        },
      },
    },
  },
];
