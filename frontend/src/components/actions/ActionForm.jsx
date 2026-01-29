import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toastAction } from "../../utils/toastAction";
import { apiFetch } from "../../utils/api";
import Placeholder from "../../assets/images/placeholder.png";

const EMPTY = {
  title: "",
  description: "",
  date: "",
  coverImage: { url: "", alt: "" },
};

export default function ActionForm({ initial, onSaved, onClose }) {
  const [draft, setDraft] = useState(EMPTY);

  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    if (!initial) {
      setDraft(EMPTY);
      return;
    }

    setDraft({
      title: initial.title || "",
      description: initial.description || "",
      date: initial.date
        ? new Date(initial.date).toISOString().slice(0, 10)
        : "",
      coverImage: {
        url: initial.coverImage?.url || "",
        alt: initial.coverImage?.alt || "",
      },
    });
  }, [initial]);

  const save = async (e) => {
    e.preventDefault();

    if (!draft.title.trim()) return toast.error("Zadej název.");
    if (!draft.description.trim()) return toast.error("Zadej popis.");
    if (!draft.date) return toast.error("Zadej datum.");
    if (!draft.coverImage.url.trim())
      return toast.error("Zadej titulní fotku.");

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      date: draft.date,
      coverImage: {
        url: draft.coverImage.url.trim(),
        alt: draft.coverImage.alt?.trim() || "",
      },
    };

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
    onClose?.();
  };

  return (
    <form onSubmit={save} className="bg-white rounded-xl shadow p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">
          {isEdit ? "Upravit akci" : "Přidat akci"}
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Zrušit
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#f5a623] text-white font-semibold hover:scale-105 transition"
          >
            Uložit
          </button>
        </div>
      </div>

      <input
        placeholder="Název akce"
        value={draft.title}
        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        className="w-full border rounded-lg px-4 py-2"
      />

      <textarea
        placeholder="Popis akce"
        value={draft.description}
        onChange={(e) =>
          setDraft((d) => ({ ...d, description: e.target.value }))
        }
        className="w-full border rounded-lg px-4 py-2"
        rows={3}
      />

      <input
        type="date"
        value={draft.date}
        onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
        className="w-full border rounded-lg px-4 py-2"
      />

      <div className="space-y-2">
        <p className="font-semibold text-gray-800">Titulní fotka</p>

        <div className="grid md:grid-cols-3 gap-2">
          <input
            placeholder="URL titulní fotky"
            value={draft.coverImage.url}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                coverImage: { ...d.coverImage, url: e.target.value },
              }))
            }
            className="md:col-span-2 border rounded-lg px-4 py-2"
          />

          <input
            placeholder="Alt text"
            value={draft.coverImage.alt}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                coverImage: { ...d.coverImage, alt: e.target.value },
              }))
            }
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 border">
            <img
              src={draft.coverImage.url || Placeholder}
              alt={draft.coverImage.alt || ""}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = Placeholder;
              }}
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setDraft((d) => ({ ...d, coverImage: { url: "", alt: "" } }))
            }
            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            Odebrat fotku
          </button>
        </div>
      </div>
    </form>
  );
}
