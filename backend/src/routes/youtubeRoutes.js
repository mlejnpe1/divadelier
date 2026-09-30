import express from "express";
import {
  getLatestPlaylistVideo,
  getLatestSpecialPlaylistVideo,
  getPoetrycastPlaylist,
  getSpecialPlaylist,
} from "../controllers/youtubeController.js";

const router = express.Router();

router.get("/latest-playlist-video", getLatestPlaylistVideo);
router.get("/latest-special-playlist-video", getLatestSpecialPlaylistVideo);
router.get("/poetrycast-playlist", getPoetrycastPlaylist);
router.get("/special-playlist", getSpecialPlaylist);

export default router;
