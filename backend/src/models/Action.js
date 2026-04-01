import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, trim: true, default: "" },

    date: { type: Date, required: true },

    coverImage: {
      url: { type: String, trim: true, default: "" },
      alt: { type: String, trim: true, default: "" },
      key: { type: String, trim: true, default: "" },
    },
    author: {
      name: { type: String, required: true, trim: true },
      bio: { type: String, trim: true, default: "" },
      photo: { type: String, trim: true, default: "" },
      photoKey: { type: String, trim: true, default: "" },
      websites: [
        {
          url: { type: String, trim: true, default: "" },
          description: { type: String, trim: true, default: "" },
        },
      ],
    },
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const Action = mongoose.model("Action", actionSchema);

export default Action;
