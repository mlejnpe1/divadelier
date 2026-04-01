import mongoose from "mongoose";
import Action from "../models/Action.js";
import { deleteFromR2 } from "../lib/r2.js";

function collectActionMediaKeys(action) {
  const keys = new Set();

  const coverKey = String(action?.coverImage?.key || "").trim();
  if (coverKey) {
    keys.add(coverKey);
  }

  const authorPhotoKey = String(action?.author?.photoKey || "").trim();
  if (authorPhotoKey) {
    keys.add(authorPhotoKey);
  }

  return Array.from(keys);
}

function getRemovedMediaKeys(previousAction, nextData) {
  const previousKeys = new Set(collectActionMediaKeys(previousAction));
  const nextKeys = new Set(collectActionMediaKeys(nextData));

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
          : "Titulni fotka akce")
      : "",
    key: String(coverImage?.key || "").trim(),
  };
}

function normalizeAuthorWebsites(author = {}) {
  const rawItems = Array.isArray(author?.websites)
    ? author.websites
    : author?.website
      ? [{ url: author.website, description: "" }]
      : [];

  return rawItems
    .map((website) => {
      if (typeof website === "string") {
        return { url: String(website).trim(), description: "" };
      }

      return {
        url: String(website?.url || "").trim(),
        description: String(website?.description || "").trim(),
      };
    })
    .filter((website) => website.url);
}

function buildAuthor(author = {}) {
  const normalizedPhoto = String(author?.photo || "").trim();

  return {
    name: String(author?.name || "").trim(),
    bio: String(author?.bio || "").trim(),
    photo: normalizedPhoto,
    photoKey: normalizedPhoto ? String(author?.photoKey || "").trim() : "",
    websites: normalizeAuthorWebsites(author),
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

export async function getAllActions(_, res) {
  try {
    const actions = await Action.find().sort({ date: -1, _id: 1 }).lean();
    return res.status(200).json(actions);
  } catch (error) {
    console.error("Error in getAllActions controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getActionById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Action not found." });
    }

    const action = await Action.findById(req.params.id);
    if (!action) {
      return res.status(404).json({ message: "Action not found." });
    }

    return res.status(200).json(action);
  } catch (error) {
    console.error("Error in getActionById controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function createAction(req, res) {
  try {
    const { title, description, date, coverImage = {}, author = {} } = req.body;

    if (!String(title || "").trim()) {
      return res.status(400).json({ message: "Chybi title." });
    }

    if (!date) {
      return res.status(400).json({ message: "Chybi date." });
    }

    if (!String(author?.name || "").trim()) {
      return res.status(400).json({ message: "Chybi author.name." });
    }

    const normalizedTitle = String(title || "").trim();

    const doc = await Action.create({
      title: normalizedTitle,
      description: String(description || "").trim(),
      date,
      coverImage: buildCoverImage(coverImage, normalizedTitle),
      author: buildAuthor(author),
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Error in createAction controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateAction(req, res) {
  try {
    const { title, description, date, coverImage, author } = req.body;
    const existingAction = await Action.findById(req.params.id);

    if (!existingAction) {
      return res.status(404).json({ message: "Action not found." });
    }

    const update = {};

    if (title !== undefined) {
      update.title = String(title).trim();
    }

    if (description !== undefined) {
      update.description = String(description || "").trim();
    }

    if (date !== undefined) {
      update.date = date;
    }

    if (coverImage !== undefined) {
      update.coverImage = buildCoverImage(
        coverImage,
        update.title !== undefined ? update.title : existingAction.title,
      );
    }

    if (author !== undefined) {
      const nextAuthor = buildAuthor(author);
      if (!nextAuthor.name) {
        return res.status(400).json({ message: "Chybi author.name." });
      }
      update.author = nextAuthor;
    }

    const nextActionShape = {
      coverImage:
        update.coverImage !== undefined
          ? update.coverImage
          : existingAction.coverImage,
      author:
        update.author !== undefined ? update.author : existingAction.author,
    };

    const removedMediaKeys = getRemovedMediaKeys(
      existingAction,
      nextActionShape,
    );

    const doc = await Action.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    await cleanupR2Keys(
      removedMediaKeys,
      "Action media cleanup failed after update:",
    );

    return res.status(200).json(doc);
  } catch (error) {
    console.error("Error in updateAction controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteAction(req, res) {
  try {
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({ message: "Action not found." });
    }

    const mediaKeys = collectActionMediaKeys(action);

    await Action.findByIdAndDelete(req.params.id);

    const failedMediaCleanup = await cleanupR2Keys(
      mediaKeys,
      "Action media cleanup failed:",
    );

    return res.status(200).json({
      action,
      mediaCleanupFailed: failedMediaCleanup.length,
    });
  } catch (error) {
    console.error("Error in deleteAction controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
