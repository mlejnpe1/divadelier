import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { toastAction } from "../../utils/toastAction";
import { apiFetch } from "../../utils/api";
import Button from "../layout/Button";
import ActionBasicFields from "./ActionBasicFields.jsx";
import ActionCoverField from "./ActionCoverField.jsx";
import ActionAuthorSection from "./ActionAuthorSection.jsx";
import useActionUploadSession from "../../hooks/useActionUploadSession.js";

function createEmptyDraft() {
  return {
    title: "",
    description: "",
    date: "",
    coverImage: { url: "", alt: "", key: "" },
    author: {
      name: "",
      bio: "",
      photo: "",
      photoKey: "",
      websites: [{ url: "", description: "" }],
    },
  };
}

function toInputDate(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeAuthorWebsites(author = {}) {
  const rawWebsites = Array.isArray(author?.websites)
    ? author.websites
    : author?.website
      ? [{ url: author.website, description: "" }]
      : [];

  const websites = rawWebsites
    .map((website) => {
      if (typeof website === "string") {
        return { url: String(website).trim(), description: "" };
      }

      return {
        url: String(website?.url || "").trim(),
        description: String(website?.description || "").trim(),
      };
    })
    .filter((website) => website.url || website.description);

  return websites.length ? websites : [{ url: "", description: "" }];
}

function buildDraft(initial) {
  if (!initial) {
    return createEmptyDraft();
  }

  return {
    title: initial.title || "",
    description: initial.description || "",
    date: toInputDate(initial.date),
    coverImage: {
      url: initial.coverImage?.url || "",
      alt: initial.coverImage?.alt || "",
      key: initial.coverImage?.key || "",
    },
    author: {
      name: initial.author?.name || "",
      bio: initial.author?.bio || "",
      photo: initial.author?.photo || "",
      photoKey: initial.author?.photoKey || "",
      websites: normalizeAuthorWebsites(initial.author),
    },
  };
}

export default function ActionForm({
  initial,
  onSaved,
  onClose,
  className = "",
  onRegisterRequestClose,
}) {
  const [draft, setDraft] = useState(() => buildDraft(initial));
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    setDraft(buildDraft(initial));
  }, [initial]);

  const saveAction = async () => {
    if (!draft.title.trim()) {
      toast.error("Zadej název akce.");
      return null;
    }

    if (!draft.date) {
      toast.error("Zadej datum akce.");
      return null;
    }

    if (!draft.author?.name?.trim()) {
      toast.error("Zadej jméno autora.");
      return null;
    }

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      date: draft.date,
      coverImage: {
        url: draft.coverImage?.url?.trim() || "",
        alt: draft.coverImage?.alt?.trim() || "",
        key: draft.coverImage?.key?.trim() || "",
      },
      author: {
        name: draft.author?.name?.trim() || "",
        bio: draft.author?.bio?.trim() || "",
        photo: draft.author?.photo?.trim() || "",
        photoKey: draft.author?.photoKey?.trim() || "",
        websites: (Array.isArray(draft.author?.websites)
          ? draft.author.websites
          : []
        )
          .map((website) => ({
            url: String(website?.url || "").trim(),
            description: String(website?.description || "").trim(),
          }))
          .filter((website) => website.url),
      },
    };

    setSaving(true);

    try {
      const saved = await toastAction(
        () =>
          apiFetch(isEdit ? `/api/actions/${initial._id}` : "/api/actions", {
            method: isEdit ? "PUT" : "POST",
            body: payload,
          }),
        {
          loading: isEdit ? "Ukládám změny..." : "Přidávám akci...",
          success: isEdit ? "Akce aktualizována." : "Akce přidána.",
          error: isEdit ? "Nepodařilo se uložit." : "Nepodařilo se přidat.",
        },
      );

      onSaved?.(saved);
      return saved;
    } finally {
      setSaving(false);
    }
  };

  const {
    handleCancel,
    handleSubmit,
    uploadManagedFile,
    removeManagedFile,
    isUploading,
  } = useActionUploadSession({
    draft,
    onClose,
    onSubmit: saveAction,
  });

  useEffect(() => {
    onRegisterRequestClose?.(() => handleCancel());
    return () => {
      onRegisterRequestClose?.(null);
    };
  }, [handleCancel, onRegisterRequestClose]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative overflow-hidden rounded-[2rem] border border-white/50 bg-[linear-gradient(145deg,rgba(255,255,255,0.76),rgba(255,247,237,0.62))] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl md:p-7 ${className}`}
    >
      <div className="pointer-events-none absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/35 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              {isEdit ? "Upravit akci" : "Přidat akci"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Povinný je název, datum a jméno autora. Ostatní položky můžeš
              doplnit i později.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCancel} variant="secondary">
              <X size={18} />
              Zrušit
            </Button>

            <Button
              type="submit"
              disabled={saving || isUploading}
              className="disabled:hover:translate-y-0 disabled:hover:scale-100"
            >
              {saving ? "Ukládám..." : "Uložit akci"}
            </Button>
          </div>
        </div>

        <ActionBasicFields draft={draft} setDraft={setDraft} />

        <ActionCoverField
          draft={draft}
          setDraft={setDraft}
          uploadManagedFile={uploadManagedFile}
          removeManagedFile={removeManagedFile}
        />

        <ActionAuthorSection
          draft={draft}
          setDraft={setDraft}
          uploadManagedFile={uploadManagedFile}
          removeManagedFile={removeManagedFile}
        />
      </div>
    </form>
  );
}
