import express from "express";
import {
  createExhibition,
  deleteExhibition,
  getAllExhibitions,
  getExhibitionById,
  updateExhibition,
} from "../controllers/exhibitionController.js";

const router = express.Router();

router.get("/", getAllExhibitions);
router.get("/:id", getExhibitionById);
router.post("/", createExhibition);
router.put("/:id", updateExhibition);
router.delete("/:id", deleteExhibition);

export default router;
