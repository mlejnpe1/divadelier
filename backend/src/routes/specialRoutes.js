import express from "express";
import {
  createSpecial,
  deleteSpecial,
  getAllSpecials,
  getSpecialById,
  updateSpecial,
} from "../controllers/specialController.js";

const router = express.Router();

//public
router.get("/", getAllSpecials);
router.get("/:id", getSpecialById);

//protected
router.post("/", createSpecial);
router.put("/:id", updateSpecial);
router.delete("/:id", deleteSpecial);

export default router;
