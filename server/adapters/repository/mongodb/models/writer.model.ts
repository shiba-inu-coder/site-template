import { model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { EntityModel, type IWriter, type IWriterModel } from "#shared/types";

const ModelSchema = new Schema<IWriter, IWriterModel>(
  {
    username: {
      type: String,
      validate: {
        validator: function (v: string): boolean {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid username`,
      },
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: [true, "Please add a full name"],
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please add a last name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please add an email"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    avatar: {
      type: {
        path: {
          type: String,
          trim: true,
          default: "",
        },
        alt: {
          type: String,
          trim: true,
          default: "",
        },
      },
      required: true,
    },
    position: {
      type: String,
      trim: true,
      required: [true, "Please add a position"],
    },
    info: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
).plugin(uniqueValidator, {
  message: 'Duplicate value! Please change "{PATH}" to the unique value!',
});

export const WriterModel: IWriterModel = model<IWriter, IWriterModel>(
  EntityModel.Writer,
  ModelSchema,
);
