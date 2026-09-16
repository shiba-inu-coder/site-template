import { Schema } from "mongoose";
import { WriterModel } from "../writer.model";

export const BiographyWriterSchema = [
  {
    _id: false,
    data: {
      _id: false,
      uniqId: {
        type: String,
        required: true,
      },
      variant: {
        type: String,
        default: "",
        trim: true,
      },
      data: {
        _id: false,
        writer: {
          required: true,
          trim: true,
          type: Schema.Types.ObjectId,
          ref: WriterModel.modelName,
        },
      },
    },
  },
];
