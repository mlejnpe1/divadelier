import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exhibition = new mongoose.model("Exhibition", exhibitionSchema);

export default Exhibition;
