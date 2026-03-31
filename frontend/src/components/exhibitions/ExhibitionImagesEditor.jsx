import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Placeholder from "../../assets/images/placeholder.png";
import { deleteUploadedFile } from "../../utils/handleFile.js";
import { fieldClass, sectionClass } from "./exhibitionFormStyles.js";

export default function ExhibitionImagesEditor({
  draft,
  setDraft,
  unregisterPendingKey,
  isPendingKey,
  uploadManagedFile,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadGalleryFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) return;

    setIsUploading(true);

    try {
      const currentCount = Array.isArray(draft.images) ? draft.images.length : 0;

      const uploadedItems = await Promise.all(
        files.map((file, index) =>
          uploadManagedFile({
            file,
          }).then((uploaded) => ({
            url: uploaded.url,
            key: uploaded.key,
            alt: `Fotka ${currentCount + index + 1}`,
          })),
        ),
      );

      setDraft((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedItems],
      }));

      toast.success(
        files.length === 1
          ? "Fotka byla nahrána."
          : `Nahráno ${files.length} fotek.`,
      );
    } catch (error) {
      toast.error(error.message || "Upload galerie se nepodařil.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFileChange = async (event) => {
    await uploadGalleryFiles(event.target.files);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragging(false);
    await uploadGalleryFiles(event.dataTransfer.files);
  };

  const handleRemoveImage = async (index) => {
    const current = draft.images?.[index];

    try {
      if (current?.key && isPendingKey?.(current.key)) {
        await deleteUploadedFile(current.key);
        unregisterPendingKey?.(current.key);
      }

      setDraft((prev) => ({
        ...prev,
        images: (prev.images || []).filter(
          (_, imageIndex) => imageIndex !== index,
        ),
      }));
    } catch (error) {
      toast.error(error.message || "Smazání fotky se nepodařilo.");
    }
  };

  return (
    <section className={sectionClass}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">Galerie fotek</p>
          <p className="mt-1 text-sm text-gray-600">
            Nahraj víc fotek najednou. URL zůstávají skryté a popis fotky je jen
            volitelný. Když galerii nevyplníš, zobrazí se placeholder.
          </p>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-white/50 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d24]">
          {draft.images?.length || 0} fotek
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
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
        onDrop={handleDrop}
        className={`mt-4 cursor-pointer rounded-[1.7rem] border border-dashed p-5 transition ${
          isDragging
            ? "border-[#f5a623] bg-[#fff4de]/95 shadow-[0_20px_40px_rgba(245,166,35,0.18)]"
            : "border-white/55 bg-white/40 hover:border-[#f5a623]/60 hover:bg-white/52"
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
              <p className="text-base font-semibold text-[#7a4d16]">
                {isUploading
                  ? "Nahrávám galerii..."
                  : "Klikni nebo přetáhni sem fotky galerie"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#8f6024]">
                Můžeš nahrát více souborů najednou. Podporované formáty: PNG, JPG,
                WEBP, AVIF.
              </p>
            </div>

          <div className="rounded-2xl border border-white/55 bg-white/60 px-4 py-3 text-sm text-gray-600">
            {draft.images?.length
              ? "Fotky jsou připravené k uložení."
              : "Když nic nenahraješ, použije se placeholder."}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {Array.isArray(draft.images) && draft.images.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {draft.images.map((img, index) => (
            <article
              key={`${img?.url || "image"}-${index}`}
              className="overflow-hidden rounded-[1.6rem] border border-white/50 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md"
            >
              <div className="overflow-hidden border-b border-white/50 bg-white/70">
                <img
                  src={img?.url || Placeholder}
                  alt={img?.alt || `Fotka ${index + 1}`}
                  loading="lazy"
                  className="h-56 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = Placeholder;
                  }}
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-gray-800">
                    Fotka {index + 1}
                  </span>

                  {img?.key ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Cloudflare R2
                    </span>
                  ) : null}
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-gray-800">
                    Popis fotky
                    <span className="ml-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                      volitelné
                    </span>
                  </span>
                  <input
                    value={img?.alt || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => {
                        const next = [...(prev.images || [])];
                        next[index] = { ...next[index], alt: value };
                        return { ...prev, images: next };
                      });
                    }}
                    placeholder={`Když zůstane prázdné, doplní se Fotka ${index + 1}.`}
                    className={fieldClass}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100/85"
                >
                  Odebrat fotku
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article className="mt-5 overflow-hidden rounded-[1.6rem] border border-white/50 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
          <div className="overflow-hidden border-b border-white/50 bg-white/70">
            <img
              src={Placeholder}
              alt="Placeholder galerie"
              className="h-56 w-full object-cover opacity-90"
            />
          </div>

          <div className="space-y-2 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Galerie zatím nemá vlastní fotky
            </p>
            <p className="text-sm text-gray-600">
              Pokud nic nenahraješ, použije se tento placeholder i na detailu
              výstavy.
            </p>
          </div>
        </article>
      )}
    </section>
  );
}
