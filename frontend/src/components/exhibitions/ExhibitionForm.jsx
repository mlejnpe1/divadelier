import React from "react";
import { X } from "lucide-react";
import ExhibitionImagesEditor from "./ExhibitionImagesEditor.jsx";
import Placeholder from "../../assets/images/placeholder.png";

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
      className="bg-white rounded-xl shadow p-4 mb-6 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900">
          {isEdit ? "Upravit výstavu" : "Přidat výstavu"}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
          >
            <X size={18} />
            Zrušit
          </button>

          <button
            type="submit"
            disabled={creating}
            className="bg-[#f5a623] text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100"
          >
            {creating ? "Ukládám..." : "Uložit"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          placeholder="Název *"
          className="border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />

        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          className="border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />
      </div>

      <textarea
        value={draft.information}
        onChange={(e) =>
          setDraft((d) => ({ ...d, information: e.target.value }))
        }
        rows={3}
        placeholder="Informace... *"
        className="w-full border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <div className="space-y-2">
        <p className="font-semibold text-gray-900">Úvodní (titulní) fotka *</p>

        <div className="grid md:grid-cols-3 gap-2">
          <input
            value={draft.coverImage?.url || ""}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                coverImage: { ...(d.coverImage || {}), url: e.target.value },
              }))
            }
            placeholder="URL titulní fotky (Cloudflare)"
            className="md:col-span-2 border border-red-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
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
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 border">
            <img
              src={draft.coverImage?.url || Placeholder}
              alt={draft.coverImage?.alt || ""}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, coverImage: { url: "", alt: "" } }))
            }
            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
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
          className="border rounded-lg px-4 py-2 w-full"
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
          className="border rounded-lg px-4 py-2 w-full"
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
          className="border rounded-lg px-4 py-2 w-full"
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
          className="border rounded-lg px-4 py-2 w-full"
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
