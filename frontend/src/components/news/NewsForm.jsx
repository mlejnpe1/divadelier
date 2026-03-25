import React from "react";
import { X } from "lucide-react";

export default function NewsForm({
  value,
  onChange,
  creating,
  onSubmit,
  onClose,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="relative mb-6 space-y-4 overflow-hidden rounded-[1.9rem] border border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] p-5 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
            Redakce
          </p>
          <p className="mt-1 font-semibold text-[#4a2c14]">Přidat aktualitu</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-[#ffd799]/24 bg-[rgba(255,214,145,0.16)] px-4 py-2 text-[#5f4126] transition hover:bg-[rgba(255,214,145,0.26)]"
          >
            <X size={18} />
            Zrušit
          </button>

          <button
            type="submit"
            disabled={creating}
            className="rounded-full bg-[#f5a623] px-5 py-2 font-semibold text-white shadow-[0_16px_30px_rgba(245,166,35,0.28)] transition hover:scale-[1.02] hover:bg-[#e39a1b] disabled:opacity-60 disabled:hover:scale-100"
          >
            {creating ? "Ukládám..." : "Uložit"}
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Text aktuality (povinné)"
        className="relative w-full rounded-[1.4rem] border border-[#ffd799]/24 bg-white/55 px-4 py-3 text-[#4a2c14] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
      />
    </form>
  );
}
