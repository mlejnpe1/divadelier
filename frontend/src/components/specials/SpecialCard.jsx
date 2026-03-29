import React from "react";
import { ExternalLink, Edit2, Trash2 } from "lucide-react";
import Button from "../layout/Button";

export default function SpecialCard({ special, user, onEdit, onDelete }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#ffd799]/28 bg-[linear-gradient(155deg,rgba(255,249,239,0.82),rgba(255,238,211,0.46))] p-6 shadow-[0_24px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_75px_rgba(95,47,0,0.16)]">
      <div className="pointer-events-none absolute -right-10 top-0 h-24 w-24 rounded-full bg-[#f5a623]/12 blur-3xl transition duration-300 group-hover:bg-[#f5a623]/18" />
      <div className="pointer-events-none absolute left-0 top-0 h-20 w-20 rounded-full bg-white/45 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6a36]">
            TV VV Speciál
          </p>
          <h3 className="text-xl font-bold text-[#3d2514] md:text-2xl">
            {special.name}
          </h3>
          {special.information ? (
            <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[#6b4b2b]">
              {special.information}
            </p>
          ) : (
            <p className="mt-3 italic text-[#9a7d5f]">Bez popisu</p>
          )}
        </div>

        {user && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full border border-white/50 bg-white/60 p-2 text-[#8a5a11] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Upravit"
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full border border-white/50 bg-white/60 p-2 text-[#b45309] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
              aria-label="Smazat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-white/45 pt-5">
        <Button
          href={special.link}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
          className="w-fit shrink-0 border-white/60 bg-white/70 text-[#4a2c14] shadow-[0_12px_30px_rgba(95,47,0,0.1)] backdrop-blur-md hover:bg-white"
        >
          Přejí na YT <ExternalLink size={16} />
        </Button>
      </div>
    </article>
  );
}
