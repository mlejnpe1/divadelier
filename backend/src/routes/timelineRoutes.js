import express from "express";
import {
  getTimeline,
  getFeaturedTimelineItem,
} from "../controllers/timelineController.js";

const router = express.Router();

router.get("/", getTimeline);
router.get("/featured", getFeaturedTimelineItem);

export default router;
