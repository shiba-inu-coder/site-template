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
      // Блок теперь одного вида, и сайт поле не читает; панель пишет его,
      // пока не обновлена, а база у них общая.
      variant: {
        type: String,
        default: "",
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
