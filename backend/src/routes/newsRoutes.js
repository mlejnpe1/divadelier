import express from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from "../controllers/newsController.js";

const router = express.Router();

//public
router.get("/", getAllNews);
router.get("/:id", getNewsById);

//protected
router.post("/", createNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;
