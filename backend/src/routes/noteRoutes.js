import express from "express";
import {
  updateNote,
  deleteNote,
  createNote,
  getAllNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
