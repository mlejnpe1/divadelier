import express from "express";
import {
  createShopItem,
  deleteShopItem,
  getAllShopItems,
  getShopItemById,
  updateShopItem,
} from "../controllers/shopItemController.js";

const router = express.Router();

//public
router.get("/", getAllShopItems);
router.get("/:id", getShopItemById);

//protected
router.post("/", createShopItem);
router.put("/:id", updateShopItem);
router.delete("/:id", deleteShopItem);

export default router;
