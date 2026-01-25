import React from "react";
import { X } from "lucide-react";

export default function MeetingForm({
  isEdit,
  draft,
  setDraft,
  creating,
  onClose,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow p-4 mb-6 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900">
          {isEdit ? "Upravit schůzku" : "Přidat schůzku"}
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

      <input
        value={draft.title}
        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        placeholder="Název (povinné)"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <textarea
        value={draft.information}
        onChange={(e) =>
          setDraft((d) => ({ ...d, information: e.target.value }))
        }
        rows={3}
        placeholder="Informace (povinné)"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <input
        value={draft.day_in_week}
        onChange={(e) =>
          setDraft((d) => ({ ...d, day_in_week: e.target.value }))
        }
        placeholder="Den v týdnu (povinné) – např. Pátek 19:00"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />
    </form>
  );
}
