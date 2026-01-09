import express from "express";
import {
  createExhibition,
  deleteExhibition,
  getAllExhibitions,
  getExhibitionById,
  getFeaturedExhibition,
  updateExhibition,
} from "../controllers/exhibitionController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

//public
router.get("/", getAllExhibitions);
router.get("/featured", getFeaturedExhibition);
router.get("/:id", getExhibitionById);

//protected
router.use(auth);
router.post("/", createExhibition);
router.put("/:id", updateExhibition);
router.delete("/:id", deleteExhibition);

export default router;
