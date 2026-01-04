import Exhibition from "../models/Exhibition.js";

export async function getAllExhibitions(_, res) {
  try {
    const exhibitions = await Exhibition.find().sort({ createdAt: -1 });
    res.status(200).json(exhibitions);
  } catch (error) {
    console.error("Error in getAllExhibition Controller.");
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
    const { title, information, date } = req.body;
    const exhibition = new Exhibition({ title, information, date });
    if (req.file) {
      exhibition.image.data = req.file.buffer;
      exhibition.image.contentType = req.file.mimetype;
    }
    const savedExhibition = await exhibition.save();
    res.status(201).json(savedExhibition);
  } catch (error) {
    console.error("Error in createExhibition controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateExhibition(req, res) {
  try {
    const { title, information, date } = req.body;
    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      {
        title,
        information,
        date,
      },
      { new: true }
    );
    if (!updatedExhibition)
      return res.status(404).json({ message: "Exhibition not found." });

    res.status(200).json(updateExhibition);
  } catch (error) {
    console.error("Error in updateExhibition controller.");
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
