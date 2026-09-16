export const DataTableSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      // Вариант вёрстки: classic | ranking | rows | compare | key-value.
      variant: {
        type: String,
        default: "",
        trim: true,
      },
      // Модификаторы поверх варианта, а не варианты.
      density: {
        type: String,
        enum: ["compact", "regular", ""],
        default: "",
      },
      head: {
        type: String,
        enum: ["solid", "subtle", "none", ""],
        default: "",
      },
      striped: {
        type: Boolean,
        default: true,
      },
      showTableHead: {
        type: Boolean,
        default: true,
      },
      btnName: {
        type: String,
        trim: true,
        default: "",
      },
      // Кнопка карточек варианта compare; в остальных вариантах ссылка живёт
      // в самой ячейке через RefLinkBtn.
      refLink: {
        type: String,
        trim: true,
        default: "",
      },
      defaultCountRows: {
        type: String,
        default: 5,
      },
      rows: {
        type: Array,
        required: true,
      },
      columns: [
        {
          _id: false,
          title: {
            type: String,
            required: true,
            trim: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
    },
  },
];
