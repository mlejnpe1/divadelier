import React from "react";
import { Clock3, Megaphone, Trash2 } from "lucide-react";

export default function NewsCard({ item, user, onDelete }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-6 shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ffd799]/35 hover:shadow-[0_30px_70px_rgba(95,47,0,0.16)]">
      <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
            <Megaphone size={14} />
            Aktualita
          </span>

          <span className="inline-flex items-center gap-2 text-sm text-[#8c6a43]">
            <Clock3 size={14} />
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("cs-CZ")
              : ""}
          </span>
        </div>

        <p className="text-[1.02rem] leading-relaxed text-[#4a2c14]">
          {item.information}
        </p>

        <div className="mt-5 flex items-center justify-end gap-3">
          {user && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-[#ffd799]/30 bg-[rgba(255,214,145,0.16)] p-2 text-[#a13a27] transition hover:bg-red-500/12"
              aria-label="Smazat aktualitu"
              title="Smazat"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
