import express from "express";
import { getLatestPlaylistVideo } from "../controllers/youtubeController.js";

const router = express.Router();

router.get("/latest-playlist-video", getLatestPlaylistVideo);

export default router;
