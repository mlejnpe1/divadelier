import React from "react";
import { X } from "lucide-react";
import Button from "../layout/Button";

export default function SpecialForm({
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
          {isEdit ? "Upravit speciál" : "Přidat speciál"}
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
        value={draft.name}
        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
        placeholder="Název (povinné)"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <textarea
        value={draft.information}
        onChange={(e) =>
          setDraft((d) => ({ ...d, information: e.target.value }))
        }
        rows={3}
        placeholder="Informace (volitelné)"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />

      <input
        value={draft.link}
        onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
        placeholder="Odkaz (povinné) – https://..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />
    </form>
  );
}
