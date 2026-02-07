import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    coverImage: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Action = mongoose.model("Action", actionSchema);

export default Action;
