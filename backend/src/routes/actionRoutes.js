import express from "express";
import {
  getAllActions,
  getFeaturedAction,
  archiveOldActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
} from "../controllers/actionController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllActions);
router.get("/featured", getFeaturedAction);
router.get("/:id", getActionById);

router.use(auth);
router.post("/archive-old", archiveOldActions);
router.post("/", createAction);
router.put("/:id", updateAction);
router.delete("/:id", deleteAction);

export default router;
