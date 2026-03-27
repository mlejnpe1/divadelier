import React, { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import Placeholder from "../../assets/images/placeholder.png";
import { fieldClass, sectionClass } from "./exhibitionFormStyles.js";

export default function ExhibitionAuthorSection({
  draft,
  setDraft,
  uploadManagedFile,
  removeManagedFile,
}) {
  const authorPhotoInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const hasAuthorContent = useMemo(
    () =>
      Boolean(
        draft.author?.name ||
          draft.author?.bio ||
          draft.author?.photo ||
          draft.author?.photoKey ||
          draft.author?.website,
      ),
    [draft.author],
  );
  const [showSection, setShowSection] = useState(hasAuthorContent);

  const authorPhotoPreviewAlt = draft.author?.name?.trim() || "Fotka autora";

  const uploadAuthorPhotoFile = async (file) => {
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      await uploadManagedFile({
        file,
        previousKey: draft.author?.photoKey,
        onUploaded: (uploaded) => {
          setDraft((prev) => ({
            ...prev,
            author: {
              ...prev.author,
              photo: uploaded.url,
              photoKey: uploaded.key,
            },
          }));
        },
      });

      toast.success("Fotka autora byla nahrana.");
    } catch (error) {
      toast.error(error.message || "Upload fotky autora se nepodaril.");
    } finally {
      setIsUploading(false);
      if (authorPhotoInputRef.current) {
        authorPhotoInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAuthorPhoto = async () => {
    try {
      await removeManagedFile({
        key: draft.author?.photoKey,
        clearState: () => {
          setDraft((prev) => ({
            ...prev,
            author: {
              ...prev.author,
              photo: "",
              photoKey: "",
            },
          }));
        },
      });
    } catch (error) {
      toast.error(error.message || "Smazani fotky autora se nepodarilo.");
    }
  };

  return (
    <section className={sectionClass}>
      <button
        type="button"
        onClick={() => setShowSection((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <div>
          <p className="text-lg font-semibold text-gray-900">Autor</p>
          <p className="mt-1 text-sm text-gray-600">
            Nepovinna sekce pro medailonek a kontakt.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5d24]">
          {showSection ? "Skryt" : "Rozbalit"}
          <ChevronDown
            size={16}
            className={`ml-2 transition ${showSection ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {showSection ? (
        <div className="mt-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-gray-800">
                Jmeno autora
              </span>
              <input
                value={draft.author.name}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    author: { ...prev.author, name: event.target.value },
                  }))
                }
                placeholder="Napriklad Jana Novakova"
                className={fieldClass}
              />
            </label>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gray-800">
                  Fotka autora
                </span>

                {draft.author?.photoKey ? (
                  <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/35 bg-emerald-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Cloudflare R2
                  </span>
                ) : null}
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => authorPhotoInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    authorPhotoInputRef.current?.click();
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
                  await uploadAuthorPhotoFile(event.dataTransfer.files?.[0]);
                }}
                className={`cursor-pointer rounded-[1.5rem] border border-dashed p-4 transition ${
                  isDragging
                    ? "border-[#f5a623] bg-[#fff4de]/95 shadow-[0_20px_40px_rgba(245,166,35,0.18)]"
                    : "border-white/55 bg-white/40 hover:border-[#f5a623]/60 hover:bg-white/52"
                }`}
              >
                <div className="grid gap-4 md:grid-cols-[120px,1fr] md:items-center">
                  <div className="overflow-hidden rounded-[1.25rem] border border-white/60 bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                    <img
                      src={draft.author?.photo || Placeholder}
                      alt={authorPhotoPreviewAlt}
                      className="h-28 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = Placeholder;
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-[#7a4d16]">
                        {isUploading
                          ? "Nahravam fotku autora..."
                          : draft.author?.photo
                            ? "Klikni nebo pretahni sem novou fotku autora"
                            : "Klikni nebo pretahni sem fotku autora"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#8f6024]">
                        Volitelne. Kdyz nic nenahrajes, pouzije se placeholder.
                      </p>
                    </div>

                    <input
                      ref={authorPhotoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      onChange={async (event) => {
                        await uploadAuthorPhotoFile(event.target.files?.[0]);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveAuthorPhoto}
                disabled={!draft.author?.photo}
                className="rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Odebrat fotku autora
              </button>
            </div>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-800">
              Medailonek autora
            </span>
            <textarea
              value={draft.author.bio}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  author: { ...prev.author, bio: event.target.value },
                }))
              }
              rows={3}
              placeholder="Kratke predstaveni autora."
              className={`${fieldClass} min-h-[108px] resize-y`}
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-800">
              Web autora
            </span>
            <input
              value={draft.author.website}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  author: { ...prev.author, website: event.target.value },
                }))
              }
              placeholder="https://..."
              className={fieldClass}
            />
          </label>
        </div>
      ) : null}
    </section>
  );
}
