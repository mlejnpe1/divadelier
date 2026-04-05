import express from "express";
import {
  createShopItem,
  deleteShopItem,
  getAllShopItems,
  getShopItemById,
  updateShopItem,
} from "../controllers/shopItemController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

//public
router.get("/", getAllShopItems);
router.get("/:id", getShopItemById);

//protected
router.use(auth);
router.post("/", createShopItem);
router.put("/:id", updateShopItem);
router.delete("/:id", deleteShopItem);

export default router;
