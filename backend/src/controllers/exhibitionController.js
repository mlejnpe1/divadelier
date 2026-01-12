import Exhibition from "../models/Exhibition.js";
import mongoose from "mongoose";

export async function getAllExhibitions(_, res) {
  try {
    const exhibitions = await Exhibition.find().sort({ date: -1 });
    res.status(200).json(exhibitions);
  } catch (error) {
    console.error("Error in getAllExhibition Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getExhibitionById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition)
      return res.status(404).json({ message: "Exhibition not found." });
    res.status(200).json(exhibition);
  } catch (error) {
    console.error("Error in getExhibitionById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createExhibition(req, res) {
  try {
    const { title, information, date, images = [], author = {} } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: "Chybí title." });
    if (!information?.trim())
      return res.status(400).json({ message: "Chybí information." });
    if (!date) return res.status(400).json({ message: "Chybí date." });

    const doc = await Exhibition.create({
      title: title.trim(),
      information: information.trim(),
      date,
      images: Array.isArray(images)
        ? images
            .filter((x) => x?.url)
            .map((x) => ({
              url: String(x.url).trim(),
              alt: String(x.alt || "").trim(),
            }))
        : [],
      author: {
        name: String(author?.name || "").trim(),
        bio: String(author?.bio || "").trim(),
        photo: String(author?.photo || "").trim(),
        website: String(author?.website || "").trim(),
      },
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Error in createExhibition Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateExhibition(req, res) {
  try {
    const { title, information, date, images, author } = req.body;

    const update = {};
    if (title !== undefined) update.title = String(title).trim();
    if (information !== undefined)
      update.information = String(information).trim();
    if (date !== undefined) update.date = date;

    if (images !== undefined) {
      update.images = Array.isArray(images)
        ? images
            .filter((x) => x?.url)
            .map((x) => ({
              url: String(x.url).trim(),
              alt: String(x.alt || "").trim(),
            }))
        : [];
    }

    if (author !== undefined) {
      update.author = {
        name: String(author?.name || "").trim(),
        bio: String(author?.bio || "").trim(),
        photo: String(author?.photo || "").trim(),
        website: String(author?.website || "").trim(),
      };
    }

    const doc = await Exhibition.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Exhibition not found." });
    res.status(200).json(doc);
  } catch (error) {
    console.error("Error in updateExhibition Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteExhibition(req, res) {
  try {
    const deletedExhibition = await Exhibition.findByIdAndDelete(req.params.id);

    if (!deletedExhibition)
      return res.status(404).json({ message: "Exhibition not found" });

    res.status(200).send(deletedExhibition);
  } catch (error) {
    console.error("Error in deleteExhibition controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getFeaturedExhibition(req, res) {
  try {
    const now = new Date();

    let exhibition = await Exhibition.findOne({
      startDate: { $gte: now },
    }).sort({ startDate: 1 });

    if (!exhibition) {
      exhibition = await Exhibition.findOne().sort({ createdAt: -1 });
    }

    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found." });
    }

    return res.status(200).json(exhibition);
  } catch (error) {
    console.error("Error in getFeaturedExhibition Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
