import mongoose from "mongoose";

const actionHeroPosterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "actions-page-hero",
      trim: true,
    },
    image: {
      data: { type: Buffer, default: null },
      contentType: { type: String, trim: true, default: "" },
      filename: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

const ActionHeroPoster = mongoose.model(
  "ActionHeroPoster",
  actionHeroPosterSchema,
);

export default ActionHeroPoster;
