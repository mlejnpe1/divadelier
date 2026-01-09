import News from "../models/News.js";

export async function getAllNews(_, res) {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    console.error("Error in getAllNews Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getNewsById(req, res) {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found." });
    res.status(200).json(news);
  } catch (error) {
    console.error("Error in getNewsById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createNews(req, res) {
  try {
    const { information } = req.body;
    const news = new News({ information });
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error("Error in createNews controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateNews(req, res) {
  try {
    const { information } = req.body;
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        information,
      },
      { new: true }
    );
    if (!updatedNews)
      return res.status(404).json({ message: "News not found." });

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error("Error in updateNews controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteNews(req, res) {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews)
      return res.status(404).json({ message: "News not found" });

    res.status(200).send(deletedNews);
  } catch (error) {
    console.error("Error in deleteNews controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getNearestNews(req, res) {
  try {
    const nearest = await News.findOne().sort({ createdAt: -1 });

    if (!nearest)
      return res.status(404).json({ message: "No upcoming news found." });

    res.status(200).json(nearest);
  } catch (error) {
    console.error("Error in getNearestNews Controller.", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
