import express from "express";
import multer from "multer";
import {
  getAllActions,
  getFeaturedAction,
  archiveOldActions,
  getActionHeroPoster,
  getActionHeroPosterFile,
  getActionById,
  createAction,
  upsertActionHeroPoster,
  updateAction,
  deleteAction,
} from "../controllers/actionController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE = 8 * 1024 * 1024;

const heroPosterUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error("INVALID_FILE_TYPE"));
      return;
    }

    cb(null, true);
  },
});

function handleHeroPosterUploadError(error, res) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Soubor je příliš velký. Maximum je 8 MB.",
      });
    }

    return res.status(400).json({
      message: "Neplatný upload plakátu.",
    });
  }

  if (error?.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      message: "Neplatný typ souboru.",
      allowedMimeTypes: Array.from(ALLOWED_MIME_TYPES),
    });
  }

  return res.status(500).json({
    message: "Upload plakátu se nepodařil.",
  });
}

router.get("/", getAllActions);
router.get("/featured", getFeaturedAction);
router.get("/hero-poster", getActionHeroPoster);
router.get("/hero-poster/file", getActionHeroPosterFile);
router.get("/:id", getActionById);

router.use(auth);
router.post("/archive-old", archiveOldActions);
router.put("/hero-poster", (req, res) => {
  heroPosterUpload.single("file")(req, res, (error) => {
    if (error) {
      console.error("Action hero poster upload failed:", error);
      return handleHeroPosterUploadError(error, res);
    }

    return upsertActionHeroPoster(req, res);
  });
});
router.post("/", createAction);
router.put("/:id", updateAction);
router.delete("/:id", deleteAction);

export default router;
