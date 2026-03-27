import React from "react";
import { X } from "lucide-react";
import Button from "../layout/Button";

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
      className="mb-6 space-y-3 rounded-xl bg-white p-4 shadow"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900">
          {isEdit ? "Upravit schůzku" : "Přidat schůzku"}
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

      <input
        value={draft.title}
        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        placeholder="Název (povinné)"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <textarea
        value={draft.information}
        onChange={(e) =>
          setDraft((d) => ({ ...d, information: e.target.value }))
        }
        rows={3}
        placeholder="Informace (povinné)"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <input
        value={draft.day_in_week}
        onChange={(e) =>
          setDraft((d) => ({ ...d, day_in_week: e.target.value }))
        }
        placeholder="Den v týdnu (povinné) – např. Pátek 19:00"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />
    </form>
  );
}
