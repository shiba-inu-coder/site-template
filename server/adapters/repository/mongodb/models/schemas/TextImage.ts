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
      // Блок теперь одного вида, и сайт поле не читает; панель пишет его,
      // пока не обновлена, а база у них общая.
      variant: {
        type: String,
        default: "",
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
      imgHint: {
        type: String,
        trim: true,
        default: "",
      },
      // full — значение старой записи, сайт читает его как top.
      imgSide: {
        type: String,
        enum: ["left", "right", "top", "bottom", "full"],
        default: "right",
      },
      // Мобильная сторона и ширина колонки ушли вместе с вариантами: сбоку
      // картинка всегда половина, на телефоне всегда сверху. Сайт их не
      // читает, панель пишет, пока не обновлена.
      imgMobileSide: {
        type: String,
        enum: ["top", "bottom"],
        default: "top",
      },
      imgColumn: {
        type: String,
        enum: ["33", "50"],
        default: "50",
      },
      imgRoundCorner: {
        type: String,
        default: "0",
      },
      // Из дошорткодовой эпохи: кнопка была отдельным полем записи, пока
      // текст не поглотил её в шорткоде 2a. Старые записи ещё несут оба поля.
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
