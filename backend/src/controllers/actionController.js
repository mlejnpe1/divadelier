import Action from "../models/Actions.js";
import mongoose from "mongoose";

export async function getAllActions(_, res) {
  try {
    const actions = await Action.find().sort({ date: -1 });
    res.status(200).json(actions);
  } catch (error) {
    console.error("Error in getAllActions Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getActionById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Action not found." });
    }

    const action = await Action.findById(req.params.id);
    if (!action) return res.status(404).json({ message: "Action not found." });

    res.status(200).json(action);
  } catch (error) {
    console.error("Error in getActionById Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createAction(req, res) {
  try {
    const { title, description, date, coverImage = {} } = req.body;

    if (!title?.trim())
      return res.status(400).json({ message: "Chybí title." });

    if (!description?.trim())
      return res.status(400).json({ message: "Chybí description." });

    if (!date) return res.status(400).json({ message: "Chybí date." });

    if (!coverImage?.url?.trim())
      return res.status(400).json({ message: "Chybí titulní fotka." });

    const doc = await Action.create({
      title: title.trim(),
      description: description.trim(),
      date,
      coverImage: {
        url: coverImage.url.trim(),
        alt: String(coverImage.alt || "").trim(),
      },
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Error in createAction Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateAction(req, res) {
  try {
    const { title, description, date, coverImage } = req.body;

    const update = {};

    if (title !== undefined) update.title = String(title).trim();
    if (description !== undefined)
      update.description = String(description).trim();
    if (date !== undefined) update.date = date;

    if (coverImage !== undefined) {
      update.coverImage = {
        url: String(coverImage?.url || "").trim(),
        alt: String(coverImage?.alt || "").trim(),
      };
    }

    const doc = await Action.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ message: "Action not found." });

    return res.status(200).json(doc);
  } catch (error) {
    console.error("Error in updateAction Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteAction(req, res) {
  try {
    const deleted = await Action.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Action not found." });

    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error in deleteAction Controller.", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}
