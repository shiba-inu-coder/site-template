export const GridCardSchema = [
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
        required: true,
        trim: true,
      },
      refLink: {
        type: String,
        default: "",
        trim: true,
      },
      refLinkType: {
        type: String,
        enum: ["casino", "bookmaker"],
        default: "casino",
      },
      cardsPerRowDesktop: {
        type: String,
        default: "1",
      },
      imgHeight: {
        type: String,
        default: "auto",
      },
      imgWidth: {
        type: String,
        default: "auto",
      },
      imgRoundCorner: {
        type: String,
        default: "0",
      },
      data: [
        {
          _id: false,
          title: {
            type: String,
            trim: true,
            default: "",
          },
          text: {
            type: String,
            trim: true,
            default: "",
          },
          buttonText: {
            type: String,
            trim: true,
            default: "",
          },
          refLink: {
            type: String,
            default: "",
            trim: true,
          },
          refLinkType: {
            type: String,
            enum: ["casino", "bookmaker"],
            default: "casino",
          },
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
        },
      ],
    },
  },
];
