import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, Plus, X } from "lucide-react";
import Placeholder from "../../assets/images/placeholder.png";
import { fieldClass, sectionClass } from "./actionFormStyles.js";

export default function ActionAuthorSection({
  draft,
  setDraft,
  uploadManagedFile,
  removeManagedFile,
}) {
  const authorPhotoInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSection, setShowSection] = useState(true);

  const authorPhotoPreviewAlt = draft.author?.name?.trim() || "Fotka autora";
  const authorWebsites = Array.isArray(draft.author?.websites)
    ? draft.author.websites
    : [{ url: "", description: "" }];

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

      toast.success("Fotka autora byla nahrána.");
    } catch (error) {
      toast.error(error.message || "Upload fotky autora se nepodařil.");
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
      toast.error(error.message || "Smazání fotky autora se nepodařilo.");
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
            Povinné je alespoň jméno autora. Ostatní údaje jsou volitelné.
          </p>
        </div>

        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a5d24]">
          {showSection ? "Skrýt" : "Rozbalit"}
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
                Jméno autora *
              </span>
              <input
                required
                value={draft.author?.name || ""}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    author: { ...prev.author, name: event.target.value },
                  }))
                }
                placeholder="Například Jana Nováková"
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
                          ? "Nahrávám fotku autora..."
                          : draft.author?.photo
                            ? "Klikni nebo přetáhni sem novou fotku autora"
                            : "Klikni nebo přetáhni sem fotku autora"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[#8f6024]">
                        Volitelné. Když nic nenahraješ, použije se placeholder.
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
              value={draft.author?.bio || ""}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  author: { ...prev.author, bio: event.target.value },
                }))
              }
              rows={3}
              placeholder="Krátké představení autora."
              className={`${fieldClass} min-h-[108px] resize-y`}
            />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-semibold text-gray-800">
              Weby autora
            </span>
            <div className="space-y-3">
              {authorWebsites.map((website, index) => (
                <div
                  key={index}
                  className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_52px]"
                >
                  <input
                    value={website?.description || ""}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const nextWebsites = Array.isArray(prev.author?.websites)
                          ? [...prev.author.websites]
                          : [{ url: "", description: "" }];
                        nextWebsites[index] = {
                          ...nextWebsites[index],
                          description: event.target.value,
                        };

                        return {
                          ...prev,
                          author: {
                            ...prev.author,
                            websites: nextWebsites,
                          },
                        };
                      })
                    }
                    placeholder={`Popis odkazu${index > 0 ? ` ${index + 1}` : ""}`}
                    className={fieldClass}
                  />

                  <input
                    value={website?.url || ""}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const nextWebsites = Array.isArray(prev.author?.websites)
                          ? [...prev.author.websites]
                          : [{ url: "", description: "" }];
                        nextWebsites[index] = {
                          ...nextWebsites[index],
                          url: event.target.value,
                        };

                        return {
                          ...prev,
                          author: {
                            ...prev.author,
                            websites: nextWebsites,
                          },
                        };
                      })
                    }
                    placeholder={`https://...${index > 0 ? ` (${index + 1})` : ""}`}
                    className={fieldClass}
                  />

                  {authorWebsites.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => {
                          const nextWebsites = (
                            Array.isArray(prev.author?.websites)
                              ? prev.author.websites
                              : [{ url: "", description: "" }]
                          ).filter((_, websiteIndex) => websiteIndex !== index);

                          return {
                            ...prev,
                            author: {
                              ...prev.author,
                              websites: nextWebsites.length
                                ? nextWebsites
                                : [{ url: "", description: "" }],
                            },
                          };
                        })
                      }
                      className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl border border-red-200/70 bg-red-50/75 text-red-600 transition hover:bg-red-100/85"
                      aria-label={`Odebrat web autora ${index + 1}`}
                    >
                      <X size={18} />
                    </button>
                  ) : null}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    author: {
                      ...prev.author,
                      websites: [
                        ...(Array.isArray(prev.author?.websites)
                          ? prev.author.websites
                          : [{ url: "", description: "" }]),
                        { url: "", description: "" },
                      ],
                    },
                  }))
                }
                className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm font-medium text-[#8a5d24] transition hover:bg-white/75"
              >
                <Plus size={16} />
                Přidat další web
              </button>
            </div>
          </label>
        </div>
      ) : null}
    </section>
  );
}
