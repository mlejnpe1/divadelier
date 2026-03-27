import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Placeholder from "../../assets/images/placeholder.png";
import { fieldClass, sectionClass } from "./exhibitionFormStyles.js";

export default function ExhibitionCoverField({
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
    "Titulni fotka vystavy";

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

      toast.success("Titulni fotka byla nahrana.");
    } catch (error) {
      toast.error(error.message || "Upload titulni fotky se nepodaril.");
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
      toast.error(error.message || "Smazani titulni fotky se nepodarilo.");
    }
  };

  return (
    <section className={sectionClass}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">Titulni fotka</p>
          <p className="mt-1 text-sm text-gray-600">
            Hlavni fotka je volitelna. Kdyz ji nenahrajes, zobrazi se
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
                  ? "Nahravam titulni fotku..."
                  : draft.coverImage?.url
                    ? "Klikni nebo pretahni sem novou titulni fotku"
                    : "Klikni nebo pretahni sem titulni fotku"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#8f6024]">
                Podporovane formaty: PNG, JPG, WEBP, AVIF.
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
                ? "Titulni fotka je pripravena k ulozeni."
                : "Kdyz nic nenahrajes, pouzije se placeholder."}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-semibold text-gray-800">
            Popis titulni fotky
            <span className="ml-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
              volitelne
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
            placeholder="Kdyz zustane prazdne, doplni se automaticky."
            className={fieldClass}
          />
        </label>

        <button
          type="button"
          onClick={handleRemoveCoverImage}
          disabled={!draft.coverImage?.url}
          className="rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Odebrat titulni fotku
        </button>
      </div>
    </section>
  );
}
