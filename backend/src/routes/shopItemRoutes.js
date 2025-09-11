import express from "express";
import {
  createShopItem,
  deleteShopItem,
  getAllShopItems,
  getShopItemById,
  updateShopItem,
} from "../controllers/shopItemController.js";

const router = express.Router();

router.get("/", getAllShopItems);
router.get("/:id", getShopItemById);
router.post("/", createShopItem);
router.put("/:id", updateShopItem);
router.delete("/:id", deleteShopItem);

export default router;
