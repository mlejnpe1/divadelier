import { useEffect, useRef, useState } from "react";
import { uploadFile, deleteUploadedFile } from "../utils/handleFile.js";

export default function useExhibitionUploadSession({
  draft,
  onClose,
  onSubmit,
}) {
  const [activeUploads, setActiveUploads] = useState(0);
  const pendingUploadKeysRef = useRef(new Set());
  const skipCleanupRef = useRef(false);
  const initialPersistedKeysRef = useRef(null);
  const uploadSlug =
    String(draft.title || "").trim() ||
    String(draft.author?.name || "").trim() ||
    (draft.date ? `exhibition-${draft.date}` : "exhibition");

  if (!initialPersistedKeysRef.current) {
    const keys = new Set();

    if (draft.coverImage?.key) {
      keys.add(draft.coverImage.key);
    }

    if (draft.author?.photoKey) {
      keys.add(draft.author.photoKey);
    }

    for (const image of draft.images || []) {
      if (image?.key) {
        keys.add(image.key);
      }
    }

    initialPersistedKeysRef.current = keys;
  }

  const registerPendingKey = (key) => {
    const normalizedKey = String(key || "").trim();
    if (!normalizedKey || initialPersistedKeysRef.current.has(normalizedKey)) {
      return;
    }

    pendingUploadKeysRef.current.add(normalizedKey);
  };

  const unregisterPendingKey = (key) => {
    const normalizedKey = String(key || "").trim();
    if (!normalizedKey) {
      return;
    }

    pendingUploadKeysRef.current.delete(normalizedKey);
  };

  const isPendingKey = (key) => {
    const normalizedKey = String(key || "").trim();
    return pendingUploadKeysRef.current.has(normalizedKey);
  };

  const getReferencedKeys = () => {
    const keys = new Set();

    if (draft.coverImage?.key) {
      keys.add(String(draft.coverImage.key).trim());
    }

    if (draft.author?.photoKey) {
      keys.add(String(draft.author.photoKey).trim());
    }

    for (const image of draft.images || []) {
      if (image?.key) {
        keys.add(String(image.key).trim());
      }
    }

    return keys;
  };

  const cleanupPendingUploads = async (keys) => {
    const cleanupKeys = Array.from(keys || pendingUploadKeysRef.current)
      .map((key) => String(key || "").trim())
      .filter(Boolean);

    if (!cleanupKeys.length) {
      return;
    }

    await Promise.all(
      cleanupKeys.map(async (key) => {
        try {
          await deleteUploadedFile(key);
        } catch (error) {
          console.error("Pending upload cleanup failed:", key, error);
        } finally {
          pendingUploadKeysRef.current.delete(key);
        }
      }),
    );
  };

  useEffect(() => {
    return () => {
      if (!skipCleanupRef.current) {
        void cleanupPendingUploads();
      }
    };
  }, []);

  const uploadManagedFile = async ({ file, previousKey = "", onUploaded }) => {
    if (!file) {
      return null;
    }

    setActiveUploads((value) => value + 1);

    try {
      const uploaded = await uploadFile({
        file,
        scope: "exhibitions",
        slug: uploadSlug,
      });

      if (
        previousKey &&
        previousKey !== uploaded.key &&
        isPendingKey(previousKey)
      ) {
        try {
          await deleteUploadedFile(previousKey);
          unregisterPendingKey(previousKey);
        } catch (deleteError) {
          console.error("Managed upload cleanup failed:", deleteError);
        }
      }

      registerPendingKey(uploaded.key);
      onUploaded?.(uploaded);

      return uploaded;
    } finally {
      setActiveUploads((value) => Math.max(0, value - 1));
    }
  };

  const removeManagedFile = async ({ key = "", clearState }) => {
    const normalizedKey = String(key || "").trim();

    if (normalizedKey && isPendingKey(normalizedKey)) {
      await deleteUploadedFile(normalizedKey);
      unregisterPendingKey(normalizedKey);
    }

    clearState?.();
  };

  const handleCancel = async () => {
    skipCleanupRef.current = true;
    await cleanupPendingUploads();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const saved = await onSubmit(event);

    if (!saved) {
      return;
    }

    const referencedKeys = getReferencedKeys();
    const orphanedPendingKeys = Array.from(pendingUploadKeysRef.current).filter(
      (key) => !referencedKeys.has(key),
    );

    if (orphanedPendingKeys.length) {
      await cleanupPendingUploads(orphanedPendingKeys);
    }

    pendingUploadKeysRef.current.clear();
    skipCleanupRef.current = true;
    onClose();
  };

  return {
    handleCancel,
    handleSubmit,
    uploadManagedFile,
    removeManagedFile,
    isPendingKey,
    registerPendingKey,
    unregisterPendingKey,
    isUploading: activeUploads > 0,
  };
}
