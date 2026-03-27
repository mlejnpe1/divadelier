import React from "react";
import { X } from "lucide-react";
import ExhibitionImagesEditor from "./ExhibitionImagesEditor.jsx";
import Placeholder from "../../assets/images/placeholder.png";
import Button from "../layout/Button";

export default function ExhibitionForm({
  isEdit,
  draft,
  setDraft,
  creating,
  onClose,
  onSubmit,
  newImageUrl,
  setNewImageUrl,
  newImageAlt,
  setNewImageAlt,
  onAddImage,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900">
          {isEdit ? "Upravit výstavu" : "Přidat výstavu"}
        </p>

        <div className="flex gap-2">
          <Button type="button" onClick={onClose} variant="secondary">
            <X size={18} />
            Zrušit
          </Button>

          <Button
            type="submit"
            disabled={creating}
            className="disabled:hover:translate-y-0 disabled:hover:scale-100"
          >
            {creating ? "Ukládám..." : "Uložit"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Název *"
          className="rounded-lg border border-red-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />

        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          className="rounded-lg border border-red-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />
      </div>

      <textarea
        value={draft.information}
        onChange={(e) =>
          setDraft((d) => ({ ...d, information: e.target.value }))
        }
        rows={3}
        placeholder="Informace... *"
        className="w-full rounded-lg border border-red-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <div className="space-y-2">
        <p className="font-semibold text-gray-900">Úvodní (titulní) fotka *</p>

        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={draft.coverImage?.url || ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                coverImage: { ...(d.coverImage || {}), url: e.target.value },
              }))
            }
            placeholder="URL titulní fotky (Cloudflare)"
            className="rounded-lg border border-red-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623] md:col-span-2"
          />

          <input
            value={draft.coverImage?.alt || ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                coverImage: { ...(d.coverImage || {}), alt: e.target.value },
              }))
            }
            placeholder="Alt text"
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-20 w-28 overflow-hidden rounded-lg border bg-gray-100">
            <img
              src={draft.coverImage?.url || Placeholder}
              alt={draft.coverImage?.alt || ""}
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, coverImage: { url: "", alt: "" } }))
            }
            className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
          >
            Odebrat titulní fotku
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold">Autor</p>

        <input
          value={draft.author.name}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              author: { ...d.author, name: e.target.value },
            }))
          }
          placeholder="Jméno autora"
          className="w-full rounded-lg border px-4 py-2"
        />

        <input
          value={draft.author.photo}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              author: { ...d.author, photo: e.target.value },
            }))
          }
          placeholder="URL fotky autora"
          className="w-full rounded-lg border px-4 py-2"
        />

        <textarea
          value={draft.author.bio}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              author: { ...d.author, bio: e.target.value },
            }))
          }
          placeholder="Medailonek autora"
          rows={3}
          className="w-full rounded-lg border px-4 py-2"
        />

        <input
          value={draft.author.website}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              author: { ...d.author, website: e.target.value },
            }))
          }
          placeholder="Web autora (volitelné)"
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <ExhibitionImagesEditor
        draft={draft}
        setDraft={setDraft}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        newImageAlt={newImageAlt}
        setNewImageAlt={setNewImageAlt}
        onAddImage={onAddImage}
      />
    </form>
  );
}
