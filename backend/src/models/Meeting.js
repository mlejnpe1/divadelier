import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    day_in_week: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Meeting = new mongoose.model("Meeting", meetingSchema);

export default Meeting;
