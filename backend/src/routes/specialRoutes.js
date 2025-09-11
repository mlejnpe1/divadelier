import express from "express";
import {
  createSpecial,
  deleteSpecial,
  getAllSpecials,
  getSpecialById,
  updateSpecial,
} from "../controllers/specialController.js";

const router = express.Router();

router.get("/", getAllSpecials);
router.get("/:id", getSpecialById);
router.post("/", createSpecial);
router.put("/:id", updateSpecial);
router.delete("/:id", deleteSpecial);

export default router;
