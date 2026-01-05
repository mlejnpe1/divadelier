import Special from "../models/Special.js";

export async function getAllSpecials(_, res) {
  try {
    const special = await Special.find().sort({ createdAt: -1 });
    res.status(200).json(special);
  } catch (error) {
    console.error("Error in getAllSpecial Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getSpecialById(req, res) {
  try {
    const special = await Special.findById(req.params.id);
    if (!special)
      return res.status(404).json({ message: "Special not found." });
    res.status(200).json(special);
  } catch (error) {
    console.error("Error in getSpecialById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createSpecial(req, res) {
  try {
    const { name, link } = req.body;
    const special = new Special({ name, link });
    const savedSpecial = await special.save();
    res.status(201).json(savedSpecial);
  } catch (error) {
    console.error("Error in createSpecial controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateSpecial(req, res) {
  try {
    const { name, link } = req.body;
    const updatedSpecial = await Special.findByIdAndUpdate(
      req.params.id,
      {
        name,
        link,
      },
      { new: true }
    );
    if (!updatedSpecial)
      return res.status(404).json({ message: "Special not found." });

    res.status(200).json(updatedSpecial);
  } catch (error) {
    console.error("Error in updateSpecial controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteSpecial(req, res) {
  try {
    const deletedSpecial = await Special.findByIdAndDelete(req.params.id);

    if (!deletedSpecial)
      return res.status(404).json({ message: "Special not found" });

    res.status(200).send(deletedSpecial);
  } catch (error) {
    console.error("Error in deleteSpecial controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}
