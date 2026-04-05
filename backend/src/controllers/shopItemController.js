import ShopItem from "../models/ShopItem.js";
import { deleteFromR2 } from "../lib/r2.js";

function isAdminRequest(req) {
  return Boolean(req.user?.admin);
}

function buildShopImage(image = {}, title = "") {
  const normalizedUrl = String(image?.url || "").trim();
  const normalizedTitle = String(title || "").trim();
  const normalizedAlt = String(image?.alt || "").trim();

  return {
    url: normalizedUrl,
    alt: normalizedUrl
      ? normalizedAlt ||
        (normalizedTitle ? `${normalizedTitle} - produktová fotografie` : "Produktová fotografie")
      : "",
    key: normalizedUrl ? String(image?.key || "").trim() : "",
  };
}

function normalizeShopItem(doc) {
  const title = String(doc?.title || "").trim();
  const normalizedImageUrl = String(doc?.image?.url || "").trim();

  return {
    _id: String(doc._id),
    shop_id: Number(doc.shop_id ?? 0),
    title,
    description: String(doc?.description || "").trim(),
    price: Number(doc?.price || 0),
    contact: String(doc?.contact || "").trim(),
    image: {
      url: normalizedImageUrl,
      alt:
        String(doc?.image?.alt || "").trim() ||
        (normalizedImageUrl
          ? title
            ? `${title} - produktová fotografie`
            : "Produktová fotografie"
          : ""),
      key: String(doc?.image?.key || "").trim(),
    },
    createdAt: doc.createdAt || null,
    updatedAt: doc.updatedAt || null,
  };
}

function collectShopImageKeys(item) {
  const key = String(item?.image?.key || "").trim();
  return key ? [key] : [];
}

async function cleanupR2Keys(keys, logLabel) {
  const normalizedKeys = Array.from(new Set((keys || []).filter(Boolean)));

  if (!normalizedKeys.length) {
    return [];
  }

  const cleanupResults = await Promise.allSettled(
    normalizedKeys.map((key) => deleteFromR2(key)),
  );

  const failedCleanup = cleanupResults
    .map((result, index) => ({ result, key: normalizedKeys[index] }))
    .filter(({ result }) => result.status === "rejected");

  if (failedCleanup.length) {
    console.error(
      logLabel,
      failedCleanup.map(({ key, result }) => ({
        key,
        reason: result.reason?.message || result.reason,
      })),
    );
  }

  return failedCleanup;
}

export async function getAllShopItems(req, res) {
  try {
    const { shop_id } = req.query;
    const filter = shop_id !== undefined ? { shop_id: Number(shop_id) } : {};
    const shopItems = await ShopItem.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json(shopItems.map(normalizeShopItem));
  } catch (error) {
    console.error("Error in getAllShopItem Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getShopItemById(req, res) {
  try {
    const shopItem = await ShopItem.findById(req.params.id).lean();
    if (!shopItem)
      return res.status(404).json({ message: "ShopItem not found." });
    res.status(200).json(normalizeShopItem(shopItem));
  } catch (error) {
    console.error("Error in getShopItemById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createShopItem(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ message: "Nedostatečná oprávnění." });
    }

    const { shop_id, title, description, price, contact, image = {} } = req.body;
    const normalizedTitle = String(title || "").trim();

    if (!normalizedTitle) {
      return res.status(400).json({ message: "Chybí název produktu." });
    }

    if (!Number.isFinite(Number(price))) {
      return res.status(400).json({ message: "Chybí nebo je neplatná cena." });
    }

    const shopItem = new ShopItem({
      shop_id: Number(shop_id ?? 0),
      title: normalizedTitle,
      description: String(description || "").trim(),
      price: Number(price),
      contact: String(contact || "").trim(),
      image: buildShopImage(image, normalizedTitle),
    });

    const savedShopItem = await shopItem.save();
    res.status(201).json(normalizeShopItem(savedShopItem.toObject()));
  } catch (error) {
    console.error("Error in createShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateShopItem(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ message: "Nedostatečná oprávnění." });
    }

    const { shop_id, title, description, price, contact, image } = req.body;
    const existingShopItem = await ShopItem.findById(req.params.id);

    if (!existingShopItem) {
      return res.status(404).json({ message: "ShopItem not found." });
    }

    const update = {};

    if (shop_id !== undefined) {
      update.shop_id = Number(shop_id);
    }

    if (title !== undefined) {
      const normalizedTitle = String(title || "").trim();
      if (!normalizedTitle) {
        return res.status(400).json({ message: "Chybí název produktu." });
      }
      update.title = normalizedTitle;
    }

    if (description !== undefined) {
      update.description = String(description || "").trim();
    }

    if (price !== undefined) {
      if (!Number.isFinite(Number(price))) {
        return res.status(400).json({ message: "Chybí nebo je neplatná cena." });
      }
      update.price = Number(price);
    }

    if (contact !== undefined) {
      update.contact = String(contact || "").trim();
    }

    if (image !== undefined) {
      update.image = buildShopImage(
        image,
        update.title !== undefined ? update.title : existingShopItem.title,
      );
    }

    const previousImageKeys = collectShopImageKeys(existingShopItem);
    const nextImageKeys = image !== undefined ? collectShopImageKeys(update) : previousImageKeys;
    const removedImageKeys = previousImageKeys.filter((key) => !nextImageKeys.includes(key));

    const updatedShopItem = await ShopItem.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    await cleanupR2Keys(removedImageKeys, "Shop item media cleanup failed after update:");

    res.status(200).json(normalizeShopItem(updatedShopItem.toObject()));
  } catch (error) {
    console.error("Error in updateShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteShopItem(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ message: "Nedostatečná oprávnění." });
    }

    const existingShopItem = await ShopItem.findById(req.params.id);

    if (!existingShopItem) {
      return res.status(404).json({ message: "ShopItem not found" });
    }

    const imageKeys = collectShopImageKeys(existingShopItem);
    const deletedShopItem = await ShopItem.findByIdAndDelete(req.params.id);
    const failedImageCleanup = await cleanupR2Keys(
      imageKeys,
      "Shop item media cleanup failed:",
    );

    res.status(200).json({
      item: normalizeShopItem(deletedShopItem.toObject()),
      mediaCleanupFailed: failedImageCleanup.length,
    });
  } catch (error) {
    console.error("Error in deleteShopItem controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}
