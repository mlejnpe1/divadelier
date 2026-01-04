import express from "express";
import {
  createMeeting,
  deleteMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

//public
router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);

//protected
router.post("/", createMeeting);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

export default router;
