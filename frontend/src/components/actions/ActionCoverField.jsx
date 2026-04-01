import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Placeholder from "../../assets/images/placeholder.png";
import { fieldClass, sectionClass } from "./actionFormStyles.js";

export default function ActionCoverField({
  draft,
  setDraft,
  uploadManagedFile,
  removeManagedFile,
}) {
  const coverInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const coverPreviewAlt =
    draft.coverImage?.alt?.trim() ||
    draft.title?.trim() ||
    draft.author?.name?.trim() ||
    "Titulní fotka akce";

  const uploadCoverFile = async (file) => {
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      await uploadManagedFile({
        file,
        previousKey: draft.coverImage?.key,
        onUploaded: (uploaded) => {
          setDraft((prev) => ({
            ...prev,
            coverImage: {
              ...prev.coverImage,
              url: uploaded.url,
              key: uploaded.key,
            },
          }));
        },
      });

      toast.success("Titulní fotka byla nahrána.");
    } catch (error) {
      toast.error(error.message || "Upload titulní fotky se nepodařil.");
    } finally {
      setIsUploading(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCoverImage = async () => {
    try {
      await removeManagedFile({
        key: draft.coverImage?.key,
        clearState: () => {
          setDraft((prev) => ({
            ...prev,
            coverImage: {
              ...prev.coverImage,
              url: "",
              alt: "",
              key: "",
            },
          }));
        },
      });
    } catch (error) {
      toast.error(error.message || "Smazání titulní fotky se nepodařilo.");
    }
  };

  return (
    <section className={sectionClass}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">Titulní fotka</p>
          <p className="mt-1 text-sm text-gray-600">
            Hlavní fotka je volitelná. Když ji nenahraješ, zobrazí se
            placeholder.
          </p>
        </div>

        {draft.coverImage?.key ? (
          <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/35 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Cloudflare R2
          </span>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => coverInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            coverInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={async (event) => {
          event.preventDefault();
          setIsDragging(false);
          await uploadCoverFile(event.dataTransfer.files?.[0]);
        }}
        className={`mt-4 cursor-pointer rounded-[1.7rem] border border-dashed p-4 transition md:p-5 ${
          isDragging
            ? "border-[#f5a623] bg-[#fff4de]/95 shadow-[0_20px_40px_rgba(245,166,35,0.18)]"
            : "border-white/55 bg-white/40 hover:border-[#f5a623]/60 hover:bg-white/52"
        }`}
      >
        <div className="grid gap-4 md:grid-cols-[220px,1fr] md:items-center">
          <div className="overflow-hidden rounded-[1.4rem] border border-white/60 bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <img
              src={draft.coverImage?.url || Placeholder}
              alt={coverPreviewAlt}
              className="h-44 w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = Placeholder;
              }}
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-base font-semibold text-[#7a4d16]">
                {isUploading
                  ? "Nahrávám titulní fotku..."
                  : draft.coverImage?.url
                    ? "Klikni nebo přetáhni sem novou titulní fotku"
                    : "Klikni nebo přetáhni sem titulní fotku"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#8f6024]">
                Podporované formáty: PNG, JPG, WEBP, AVIF.
              </p>
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={async (event) => {
                await uploadCoverFile(event.target.files?.[0]);
              }}
              className="hidden"
            />

            <div className="rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-gray-600">
              {draft.coverImage?.url
                ? "Titulní fotka je připravena k uložení."
                : "Když nic nenahraješ, použije se placeholder."}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-semibold text-gray-800">
            Popis titulní fotky
            <span className="ml-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
              volitelné
            </span>
          </span>
          <input
            value={draft.coverImage?.alt || ""}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                coverImage: {
                  ...(prev.coverImage || {}),
                  alt: event.target.value,
                },
              }))
            }
            placeholder="Když zůstane prázdné, doplní se automaticky."
            className={fieldClass}
          />
        </label>

        <button
          type="button"
          onClick={handleRemoveCoverImage}
          disabled={!draft.coverImage?.url}
          className="rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Odebrat titulní fotku
        </button>
      </div>
    </section>
  );
}
