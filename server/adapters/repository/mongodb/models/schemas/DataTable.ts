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
      showTableHead: {
        type: Boolean,
        default: true,
      },
      btnName: {
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
