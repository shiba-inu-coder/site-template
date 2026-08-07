export const TextImageSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
        trim: true,
      },
      // HTML: блок для того и нужен, чтобы рядом с картинкой лежала вёрстка.
      text: {
        type: String,
        trim: true,
        default: "",
      },
      // path и alt обязательны оба или ни одного — редактор шлёт null,
      // пока путь не заполнен.
      img: {
        type: {
          path: {
            type: String,
            required: true,
            trim: true,
          },
          alt: {
            type: String,
            required: true,
            trim: true,
          },
        },
        default: null,
      },
      // Сторона обтекания на десктопе и порядок на мобиле, где float снят.
      imgSide: {
        type: String,
        enum: ["left", "right"],
        default: "right",
      },
      imgMobileSide: {
        type: String,
        enum: ["top", "bottom"],
        default: "top",
      },
      imgWidth: {
        type: String,
        default: "auto",
      },
      imgHeight: {
        type: String,
        default: "auto",
      },
      imgRoundCorner: {
        type: String,
        default: "0",
      },
      buttonText: {
        type: String,
        trim: true,
        default: "",
      },
      refLink: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
];
