import express from "express";
import multer from "multer";

import { auth } from "../middleware/auth.js";
import { buildR2Key, uploadToR2, deleteFromR2 } from "../lib/r2.js";

const router = express.Router();

const ALLOWED_SCOPES = new Set(["exhibitions", "actions", "misc"]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

const upload = multer({
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

function handleUploadError(error, res) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large. Maximum size is 8 MB.",
      });
    }

    return res.status(400).json({
      message: "Invalid upload.",
    });
  }

  if (error?.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      message: "Invalid file type.",
      allowedMimeTypes: Array.from(ALLOWED_MIME_TYPES),
    });
  }

  return res.status(500).json({
    message: "Upload failed.",
  });
}

router.post("/", auth, (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      console.error("R2 upload failed:", error);
      return handleUploadError(error, res);
    }

    try {
      const { file } = req;
      const { scope, slug } = req.body;
      const normalizedScope = String(scope || "").trim().toLowerCase();

      if (!file) {
        return res.status(400).json({
          message: "Missing file.",
        });
      }

      if (!normalizedScope) {
        return res.status(400).json({
          message: "Missing scope.",
        });
      }

      if (!ALLOWED_SCOPES.has(normalizedScope)) {
        return res.status(400).json({
          message: "Invalid scope.",
          allowedScopes: Array.from(ALLOWED_SCOPES),
        });
      }

      const key = buildR2Key({
        scope: normalizedScope,
        slug,
        filename: file.originalname,
      });

      const { url } = await uploadToR2({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      return res.status(201).json({
        url,
        key,
        filename: file.originalname,
      });
    } catch (error) {
      console.error("R2 upload failed:", error);

      return res.status(500).json({
        message: "Upload failed.",
      });
    }
  });
});

router.delete("/", auth, async (req, res) => {
  try {
    const key = String(req.body?.key || "").trim();

    if (!key) {
      return res.status(400).json({
        message: "Missing key.",
      });
    }

    await deleteFromR2(key);

    return res.status(200).json({
      message: "File deleted successfully.",
      key,
    });
  } catch (error) {
    console.error("R2 delete failed:", error);

    return res.status(500).json({
      message: "Delete failed.",
    });
  }
});

export default router;
