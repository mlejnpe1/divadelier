import ShopItem from "../models/ShopItem.js";

export async function getAllShopItems(req, res) {
  try {
    const { shop_id } = req.query;
    const filter = shop_id !== undefined ? { shop_id: Number(shop_id) } : {};
    const shopItems = await ShopItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(shopItems);
  } catch (error) {
    console.error("Error in getAllShopItem Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getShopItemById(req, res) {
  try {
    const shopItem = await ShopItem.findById(req.params.id);
    if (!shopItem)
      return res.status(404).json({ message: "ShopItem not found." });
    res.status(200).json(shopItem);
  } catch (error) {
    console.error("Error in getShopItemById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createShopItem(req, res) {
  try {
    const { shop_id, title, price, contact } = req.body;
    const shopItem = new ShopItem({ shop_id, title, price, contact });

    if (req.file) {
      shopItem.image.data = req.file.buffer;
      shopItem.image.contentType = req.file.mimetype;
    }

    const savedShopItem = await shopItem.save();
    res.status(201).json(savedShopItem);
  } catch (error) {
    console.error("Error in createShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateShopItem(req, res) {
  try {
    const { shop_id, title, price, contact } = req.body;
    const updatedShopItem = await ShopItem.findByIdAndUpdate(
      req.params.id,
      {
        shop_id,
        title,
        price,
        contact,
      },
      { new: true }
    );
    if (!updatedShopItem)
      return res.status(404).json({ message: "ShopItem not found." });

    res.status(200).json(updateShopItem);
  } catch (error) {
    console.error("Error in updateShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteShopItem(req, res) {
  try {
    const deletedShopItem = await ShopItem.findByIdAndDelete(req.params.id);

    if (!deletedShopItem)
      return res.status(404).json({ message: "ShopItem not found" });

    res.status(200).send(deletedShopItem);
  } catch (error) {
    console.error("Error in deleteShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}
