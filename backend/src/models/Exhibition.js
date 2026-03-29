import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    information: { type: String, trim: true, default: "" },
    date: { type: Date, required: true },
    coverImage: {
      url: { type: String, trim: true, default: "" },
      alt: { type: String, trim: true, default: "" },
      key: { type: String, trim: true, default: "" },
    },
    images: [
      {
        url: { type: String, trim: true, default: "" },
        alt: { type: String, trim: true, default: "" },
        key: { type: String, trim: true, default: "" },
      },
    ],
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
  },
  {
    timestamps: true,
  },
);

const Exhibition = new mongoose.model("Exhibition", exhibitionSchema);

export default Exhibition;
