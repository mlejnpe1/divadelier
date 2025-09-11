import express from "express";
import {
  createMeeting,
  deleteMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);
router.post("/", createMeeting);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

export default router;
