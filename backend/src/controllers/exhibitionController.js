import mongoose from "mongoose";
import Exhibition from "../models/Exhibition.js";
import { deleteFromR2 } from "../lib/r2.js";

function collectExhibitionMediaKeys(exhibition) {
  const keys = new Set();

  const coverKey = String(exhibition?.coverImage?.key || "").trim();
  if (coverKey) {
    keys.add(coverKey);
  }

  for (const image of exhibition?.images || []) {
    const imageKey = String(image?.key || "").trim();
    if (imageKey) {
      keys.add(imageKey);
    }
  }

  const authorPhotoKey = String(exhibition?.author?.photoKey || "").trim();
  if (authorPhotoKey) {
    keys.add(authorPhotoKey);
  }

  return Array.from(keys);
}

function getRemovedMediaKeys(previousExhibition, nextData) {
  const previousKeys = new Set(collectExhibitionMediaKeys(previousExhibition));
  const nextKeys = new Set(collectExhibitionMediaKeys(nextData));

  return Array.from(previousKeys).filter((key) => !nextKeys.has(key));
}

function buildCoverImage(coverImage, title) {
  const normalizedUrl = String(coverImage?.url || "").trim();
  const normalizedTitle = String(title || "").trim();
  const normalizedAlt = String(coverImage?.alt || "").trim();

  return {
    url: normalizedUrl,
    alt: normalizedUrl
      ? normalizedAlt ||
        (normalizedTitle
          ? `${normalizedTitle} - titulni fotka`
          : "Titulni fotka vystavy")
      : "",
    key: String(coverImage?.key || "").trim(),
  };
}

function buildGalleryImages(images) {
  return (Array.isArray(images) ? images : [])
    .map((image, index) => ({
      url: String(image?.url || "").trim(),
      alt: String(image?.alt || "").trim() || `Fotka ${index + 1}`,
      key: String(image?.key || "").trim(),
    }))
    .filter((image) => image.url);
}

function buildAuthor(author = {}) {
  const normalizedPhoto = String(author?.photo || "").trim();

  return {
    name: String(author?.name || "").trim(),
    bio: String(author?.bio || "").trim(),
    photo: normalizedPhoto,
    photoKey: normalizedPhoto ? String(author?.photoKey || "").trim() : "",
    website: String(author?.website || "").trim(),
  };
}

async function cleanupR2Keys(keys, logLabel) {
  const normalizedKeys = Array.from(new Set((keys || []).filter(Boolean)));

  if (!normalizedKeys.length) {
    return [];
  }

  const cleanupResults = await Promise.allSettled(
    normalizedKeys.map((key) => deleteFromR2(key)),
  );

  const failedMediaCleanup = cleanupResults
    .map((result, index) => ({ result, key: normalizedKeys[index] }))
    .filter(({ result }) => result.status === "rejected");

  if (failedMediaCleanup.length) {
    console.error(
      logLabel,
      failedMediaCleanup.map(({ key, result }) => ({
        key,
        reason: result.reason?.message || result.reason,
      })),
    );
  }

  return failedMediaCleanup;
}

export async function getAllExhibitions(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(
      1,
      Math.min(50, parseInt(req.query.limit || "5", 10)),
    );

    const filter = {};
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: rx }, { information: rx }, { "author.name": rx }];
    }

    const total = await Exhibition.countDocuments(filter);
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pageCount);

    const items = await Exhibition.find(filter)
      .sort({ date: -1, _id: 1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      items,
      total,
      page: safePage,
      limit,
      pageCount,
    });
  } catch (error) {
    console.error("Error in getAllExhibitions controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getExhibitionById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    return res.status(200).json(exhibition);
  } catch (error) {
    console.error("Error in getExhibitionById controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createExhibition(req, res) {
  try {
    const {
      title,
      information,
      date,
      coverImage = {},
      images = [],
      author = {},
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Chybi title." });
    }

    if (!information?.trim()) {
      return res.status(400).json({ message: "Chybi information." });
    }

    if (!date) {
      return res.status(400).json({ message: "Chybi date." });
    }

    const normalizedTitle = String(title).trim();
    const normalizedCoverImage = buildCoverImage(coverImage, normalizedTitle);
    const cleanedImages = buildGalleryImages(images);

    const doc = await Exhibition.create({
      title: normalizedTitle,
      information: String(information).trim(),
      date,
      coverImage: normalizedCoverImage,
      images: cleanedImages,
      author: buildAuthor(author),
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Error in createExhibition controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateExhibition(req, res) {
  try {
    const { title, information, date, coverImage, images, author } = req.body;
    const existingExhibition = await Exhibition.findById(req.params.id);

    if (!existingExhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    const update = {};

    if (title !== undefined) {
      update.title = String(title).trim();
    }

    if (information !== undefined) {
      update.information = String(information).trim();
    }

    if (date !== undefined) {
      update.date = date;
    }

    if (coverImage !== undefined) {
      update.coverImage = buildCoverImage(
        coverImage,
        update.title !== undefined ? update.title : existingExhibition.title,
      );
    }

    if (images !== undefined) {
      update.images = buildGalleryImages(images);
    }

    if (author !== undefined) {
      update.author = buildAuthor(author);
    }

    const nextExhibitionShape = {
      coverImage:
        update.coverImage !== undefined
          ? update.coverImage
          : existingExhibition.coverImage,
      images:
        update.images !== undefined ? update.images : existingExhibition.images,
    };

    const removedMediaKeys = getRemovedMediaKeys(
      existingExhibition,
      nextExhibitionShape,
    );

    const doc = await Exhibition.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    await cleanupR2Keys(
      removedMediaKeys,
      "Exhibition media cleanup failed after update:",
    );

    return res.status(200).json(doc);
  } catch (error) {
    console.error("Error in updateExhibition controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteExhibition(req, res) {
  try {
    const exhibition = await Exhibition.findById(req.params.id);

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    const mediaKeys = collectExhibitionMediaKeys(exhibition);

    await Exhibition.findByIdAndDelete(req.params.id);

    const failedMediaCleanup = await cleanupR2Keys(
      mediaKeys,
      "Exhibition media cleanup failed:",
    );

    return res.status(200).json({
      exhibition,
      mediaCleanupFailed: failedMediaCleanup.length,
    });
  } catch (error) {
    console.error("Error in deleteExhibition controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getFeaturedExhibition(req, res) {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    let exhibition = await Exhibition.findOne({
      date: { $gte: startOfToday },
    }).sort({ date: 1 });

    if (!exhibition) {
      exhibition = await Exhibition.findOne().sort({ date: -1 });
    }

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    return res.status(200).json(exhibition);
  } catch (error) {
    console.error("Error in getFeaturedExhibition controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getCarouselExhibitions(req, res) {
  try {
    const limit = Math.max(
      1,
      Math.min(20, parseInt(req.query.limit || "6", 10)),
    );

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const upcoming = await Exhibition.find({
      date: { $gte: startOfToday },
    })
      .sort({ date: 1, _id: 1 })
      .limit(limit)
      .lean();

    if (upcoming.length > 0) {
      return res.status(200).json({ items: upcoming });
    }

    const recentPast = await Exhibition.find({
      date: { $exists: true, $ne: null },
    })
      .sort({ date: -1, _id: 1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ items: recentPast });
  } catch (error) {
    console.error("Error in getCarouselExhibitions controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
