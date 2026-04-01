import mongoose from "mongoose";
import Action from "../models/Action.js";
import ActionHeroPoster from "../models/ActionHeroPoster.js";
import { deleteFromR2 } from "../lib/r2.js";

const ACTION_HERO_POSTER_KEY = "actions-page-hero";

function normalizeAction(doc) {
  const authorWebsites = Array.isArray(doc.author?.websites)
    ? doc.author.websites
        .map((website) => ({
          url: String(website?.url || "").trim(),
          description: String(website?.description || "").trim(),
        }))
        .filter((website) => website.url || website.description)
    : doc.author?.website
      ? [{ url: String(doc.author.website).trim(), description: "" }]
      : [];

  return {
    _id: String(doc._id),
    title: doc.title || "",
    description: doc.description || "",
    date: doc.date || null,
    coverImage: {
      url: String(doc.coverImage?.url || ""),
      alt: String(doc.coverImage?.alt || ""),
      key: String(doc.coverImage?.key || ""),
    },
    author: {
      name: String(doc.author?.name || ""),
      bio: String(doc.author?.bio || ""),
      photo: String(doc.author?.photo || ""),
      photoKey: String(doc.author?.photoKey || ""),
      websites: authorWebsites,
    },
    archived: Boolean(doc.archived),
    archivedAt: doc.archivedAt || null,
  };
}

function matchesQuery(item, q) {
  if (!q) {
    return true;
  }

  const search = q.toLowerCase();
  return (
    String(item.title || "")
      .toLowerCase()
      .includes(search) ||
    String(item.description || "")
      .toLowerCase()
      .includes(search)
  );
}

function toValidTime(value) {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) {
    return null;
  }

  return time;
}

function getMonthKey(value) {
  const time = toValidTime(value);
  if (time === null) {
    return null;
  }

  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getYearNumber(value) {
  const time = toValidTime(value);
  if (time === null) {
    return null;
  }

  return new Date(time).getFullYear();
}

function getCurrentYear() {
  return new Date(Date.now()).getFullYear();
}

function getPendingArchiveItems(items, currentYear) {
  return items.filter((item) => {
    const itemYear = getYearNumber(item.date);
    return !item.archived && itemYear !== null && itemYear < currentYear;
  });
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const aDate = toValidTime(a.date);
    const bDate = toValidTime(b.date);

    if (aDate === null && bDate === null) {
      return 0;
    }
    if (aDate === null) {
      return 1;
    }
    if (bDate === null) {
      return -1;
    }

    return bDate - aDate;
  });
}

function pickFeatured(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  function parseToLocalDateOnly(value) {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return null;
      }
      return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const stringValue = String(value);
    const exactDateMatch = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(
      stringValue,
    );
    if (exactDateMatch) {
      return new Date(
        Number(exactDateMatch[1]),
        Number(exactDateMatch[2]) - 1,
        Number(exactDateMatch[3]),
      );
    }

    const parsedDate = new Date(stringValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    );
  }

  function dateKeyLocal(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const todayKey = dateKeyLocal(todayDateOnly);

  const scored = items
    .map((item) => {
      const date = parseToLocalDateOnly(item.date);
      if (!date) {
        return null;
      }

      const key = dateKeyLocal(date);
      const dayDiff = Math.round(
        (date.getTime() - todayDateOnly.getTime()) / 86400000,
      );
      const bucket = key === todayKey ? 0 : dayDiff >= 0 ? 1 : 2;
      const distance = key === todayKey ? 0 : Math.abs(dayDiff);

      return { item, bucket, distance };
    })
    .filter(Boolean);

  if (!scored.length) {
    return items[0];
  }

  scored.sort((a, b) => {
    if (a.bucket !== b.bucket) {
      return a.bucket - b.bucket;
    }
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return 0;
  });

  return scored[0].item;
}

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

function isAdminRequest(req) {
  return Boolean(req.user?.admin);
}

function normalizeActionHeroPoster(doc) {
  const hasPoster = Boolean(doc?.image?.contentType);

  return {
    hasPoster,
    filename: hasPoster ? String(doc.image?.filename || "").trim() : "",
    updatedAt: doc?.updatedAt || null,
  };
}

export async function getAllActions(req, res) {
  try {
    const view = String(req.query.view || "current").trim().toLowerCase();
    const q = String(req.query.q || "").trim();
    const requestedMonth = String(req.query.month || "").trim();
    const requestedYear = parseInt(req.query.year || "", 10);
    const currentYear = getCurrentYear();

    let items = (await Action.find().lean()).map(normalizeAction);

    if (q) {
      items = items.filter((item) => matchesQuery(item, q));
    }

    items = sortByDateDesc(items);
    const pendingArchiveItems = getPendingArchiveItems(items, currentYear);
    const pendingArchiveYears = Array.from(
      new Set(
        pendingArchiveItems
          .map((item) => getYearNumber(item.date))
          .filter((year) => Number.isInteger(year)),
      ),
    ).sort((a, b) => b - a);

    if (view === "archive") {
      const archiveItems = items.filter((item) => {
        const itemYear = getYearNumber(item.date);
        return item.archived || (itemYear !== null && itemYear < currentYear);
      });

      const years = Array.from(
        new Set(archiveItems.map((item) => getYearNumber(item.date)).filter(Boolean)),
      ).sort((a, b) => b - a);

      const activeYear = years.includes(requestedYear) ? requestedYear : years[0] || null;
      const filteredItems = activeYear
        ? archiveItems.filter((item) => getYearNumber(item.date) === activeYear)
        : [];

      return res.status(200).json({
        mode: "archive",
        items: filteredItems,
        total: filteredItems.length,
        page: activeYear && years.length ? years.indexOf(activeYear) + 1 : 1,
        pageCount: years.length,
        year: activeYear,
        years,
        pendingArchiveCount: pendingArchiveItems.length,
        pendingArchiveYears,
      });
    }

    const currentItems = items.filter((item) => {
      const itemYear = getYearNumber(item.date);
      return !item.archived && itemYear === currentYear;
    });

    const months = Array.from(
      new Set(currentItems.map((item) => getMonthKey(item.date)).filter(Boolean)),
    );
    const currentMonth = getMonthKey(Date.now());
    const activeMonth = months.includes(requestedMonth)
      ? requestedMonth
      : months.includes(currentMonth)
          ? currentMonth
          : months[0] || null;

    const filteredItems = activeMonth
      ? currentItems.filter((item) => getMonthKey(item.date) === activeMonth)
      : [];

    return res.status(200).json({
      mode: "current",
      items: filteredItems,
      total: filteredItems.length,
      page: activeMonth && months.length ? months.indexOf(activeMonth) + 1 : 1,
      pageCount: months.length,
      year: currentYear,
      month: activeMonth,
      months,
      pendingArchiveCount: pendingArchiveItems.length,
      pendingArchiveYears,
    });
  } catch (error) {
    console.error("Error in getAllActions controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getFeaturedAction(_, res) {
  try {
    const currentYear = getCurrentYear();
    const items = sortByDateDesc(
      (await Action.find().lean())
        .map(normalizeAction)
        .filter((item) => {
          const itemYear = getYearNumber(item.date);
          return !item.archived && itemYear === currentYear;
        }),
    );
    const featured = pickFeatured(items);

    if (!featured) {
      return res.status(404).json({ message: "Action not found." });
    }

    return res.status(200).json(featured);
  } catch (error) {
    console.error("Error in getFeaturedAction controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function archiveOldActions(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ message: "Nedostatečná oprávnění." });
    }

    const currentYear = getCurrentYear();
    const archiveBefore = new Date(Date.UTC(currentYear, 0, 1));
    const candidates = await Action.find({
      date: { $lt: archiveBefore },
      archived: { $ne: true },
    });

    if (!candidates.length) {
      return res.status(200).json({
        archivedCount: 0,
        failedCount: 0,
        totalCandidates: 0,
        failedItems: [],
      });
    }

    let archivedCount = 0;
    const failedItems = [];

    for (const action of candidates) {
      const mediaKeys = collectActionMediaKeys(action);
      const failedMediaCleanup = await cleanupR2Keys(
        mediaKeys,
        `Action media cleanup failed during archive for ${action._id}:`,
      );

      if (failedMediaCleanup.length) {
        failedItems.push({
          _id: String(action._id),
          title: String(action.title || "").trim(),
          failedKeys: failedMediaCleanup.map(({ key }) => key),
        });
        continue;
      }

      action.coverImage = {
        url: "",
        alt: "",
        key: "",
      };
      action.author = {
        name: String(action.author?.name || "").trim(),
        bio: String(action.author?.bio || "").trim(),
        photo: "",
        photoKey: "",
        websites: normalizeAuthorWebsites(action.author),
      };
      action.archived = true;
      action.archivedAt = new Date();

      await action.save();
      archivedCount += 1;
    }

    return res.status(200).json({
      archivedCount,
      failedCount: failedItems.length,
      totalCandidates: candidates.length,
      failedItems,
    });
  } catch (error) {
    console.error("Error in archiveOldActions controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getActionHeroPoster(req, res) {
  try {
    const poster = await ActionHeroPoster.findOne({
      key: ACTION_HERO_POSTER_KEY,
    }).select("image.filename image.contentType updatedAt");

    return res.status(200).json(normalizeActionHeroPoster(poster));
  } catch (error) {
    console.error("Error in getActionHeroPoster controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function getActionHeroPosterFile(req, res) {
  try {
    const poster = await ActionHeroPoster.findOne({
      key: ACTION_HERO_POSTER_KEY,
    }).select("image");

    if (!poster?.image?.data?.length || !poster?.image?.contentType) {
      return res.status(404).json({ message: "Action hero poster not found." });
    }

    const filename = String(poster.image?.filename || "actions-hero-poster");

    res.set("Content-Type", poster.image.contentType);
    res.set("Content-Disposition", `inline; filename="${filename}"`);
    res.set("Cache-Control", "public, max-age=300");

    return res.send(poster.image.data);
  } catch (error) {
    console.error("Error in getActionHeroPosterFile controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function upsertActionHeroPoster(req, res) {
  try {
    if (!isAdminRequest(req)) {
      return res.status(403).json({ message: "Nedostatečná oprávnění." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Chybí soubor plakátu." });
    }

    const poster = await ActionHeroPoster.findOneAndUpdate(
      { key: ACTION_HERO_POSTER_KEY },
      {
        key: ACTION_HERO_POSTER_KEY,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          filename: req.file.originalname,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json(normalizeActionHeroPoster(poster));
  } catch (error) {
    console.error("Error in upsertActionHeroPoster controller.", error);
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
