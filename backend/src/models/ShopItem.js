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
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    contact: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      url: {
        type: String,
        trim: true,
        default: "",
      },
      alt: {
        type: String,
        trim: true,
        default: "",
      },
      key: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

const ShopItem = new mongoose.model("ShopItem", shopItemSchema);

export default ShopItem;
