import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    information: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    coverImage: {
      url: { type: String, required: true, trim: true },
      alt: { type: String, trim: true, default: "" },
    },
    images: [
      {
        url: { type: String, trim: true, default: "" },
        alt: { type: String, trim: true, default: "" },
      },
    ],
    author: {
      name: { type: String, trim: true, default: "" },
      bio: { type: String, trim: true, default: "" },
      photo: { type: String, trim: true, default: "" },
      website: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const Exhibition = new mongoose.model("Exhibition", exhibitionSchema);

export default Exhibition;
