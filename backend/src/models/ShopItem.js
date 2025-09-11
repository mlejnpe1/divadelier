import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    shop_id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { getters: true },
  }
);

const ShopItem = new mongoose.model("ShopItem", shopItemSchema);

export default ShopItem;
