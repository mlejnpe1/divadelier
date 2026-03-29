import React from "react";
import { X } from "lucide-react";
import Button from "../layout/Button";

const inputClassName =
  "w-full rounded-[1.2rem] border border-white/55 bg-white/70 px-4 py-3 text-[#4a2c14] shadow-[0_12px_32px_rgba(95,47,0,0.08)] backdrop-blur-md transition placeholder:text-[#9a7d5f] focus:outline-none focus:ring-2 focus:ring-[#f5a623]";

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
      className="relative overflow-hidden rounded-[1.8rem] border border-white/50 bg-[linear-gradient(155deg,rgba(255,249,239,0.82),rgba(255,238,211,0.46))] p-5 shadow-[0_20px_48px_rgba(95,47,0,0.1)] backdrop-blur-xl md:p-6"
    >
      <div className="pointer-events-none absolute -left-8 top-0 h-24 w-24 rounded-full bg-white/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[#f5a623]/12 blur-3xl" />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a36]">
              TV VV
            </p>
            <p className="text-xl font-bold text-[#3d2514]">
              {isEdit ? "Upravit speciál" : "Přidat speciál"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="border-white/60 bg-white/70 text-[#4a2c14] shadow-[0_12px_30px_rgba(95,47,0,0.08)] backdrop-blur-md hover:bg-white"
            >
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

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#5f4126]">
              Název speciálu
            </span>
            <input
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              placeholder="Název (povinné)"
              className={inputClassName}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#5f4126]">Popis</span>
            <textarea
              value={draft.information}
              onChange={(e) =>
                setDraft((d) => ({ ...d, information: e.target.value }))
              }
              rows={4}
              placeholder="Informace (volitelné)"
              className={`${inputClassName} min-h-[132px] resize-y`}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#5f4126]">Odkaz</span>
            <input
              value={draft.link}
              onChange={(e) =>
                setDraft((d) => ({ ...d, link: e.target.value }))
              }
              placeholder="Odkaz (povinné) – https://..."
              className={inputClassName}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
