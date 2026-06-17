import express from "express";
import {
  getLatestPlaylistVideo,
  getLatestSpecialPlaylistVideo,
} from "../controllers/youtubeController.js";

const router = express.Router();

router.get("/latest-playlist-video", getLatestPlaylistVideo);
router.get("/latest-special-playlist-video", getLatestSpecialPlaylistVideo);

export default router;
