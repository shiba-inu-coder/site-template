// Синглтон: вердикт редакции в статье один.
export const VerdictBoxSchema = {
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
  title: {
    type: String,
    default: "",
    trim: true,
  },
  // HTML: абзац вердикта редактор пишет разметкой.
  text: {
    type: String,
    default: "",
    trim: true,
  },
  badges: {
    type: [String],
    default: [],
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
};
