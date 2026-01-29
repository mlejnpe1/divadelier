import express from "express";
import {
  getAllActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
} from "../controllers/actionController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllActions);
router.get("/:id", getActionById);

router.use(auth);
router.post("/", createAction);
router.put("/:id", updateAction);
router.delete("/:id", deleteAction);

export default router;
