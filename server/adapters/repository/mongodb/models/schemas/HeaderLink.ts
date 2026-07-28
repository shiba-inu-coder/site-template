import { Schema } from "mongoose";
import { PostModel } from "../post.model";

export const HeaderLinkSchema = {
  _id: false,
  type: {
    type: String,
    enum: ["link", "group"],
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: PostModel.modelName,
  },
  title: {
    type: String,
    required: true,
  },
  children: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: PostModel.modelName,
      },
      type: {
        type: String,
        enum: ["link"],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
};
