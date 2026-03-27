import React from "react";
import { ArrowRight, CalendarDays, Edit2, Trash2 } from "lucide-react";
import Placeholder from "../../assets/images/placeholder.png";
import Button from "../layout/Button";

function truncateText(text, maxLength = 220) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}...`;
}

export default function ExhibitionCard({
  exhibition: exh,
  index,
  user,
  onEdit,
  onDelete,
}) {
  const previewImage = exh.coverImage?.url || Placeholder;

  return (
    <article
      className="group relative overflow-hidden rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-5 shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ffd799]/35 hover:shadow-[0_30px_70px_rgba(95,47,0,0.16)] md:p-6"
    >
      <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-stretch">
        <div className="relative overflow-hidden rounded-[1.6rem] border border-[#ffd799]/24 bg-[radial-gradient(circle_at_top,rgba(255,248,236,0.68),rgba(255,234,196,0.18))] md:w-56 md:min-w-56">
          <img
            src={previewImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,236,0.18),rgba(95,47,0,0.12))]" />
          <img
            src={previewImage}
            alt={exh.coverImage?.alt || exh.title || "Titulni fotka vystavy"}
            className="relative h-64 w-full object-contain p-4 md:h-full"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex flex-1 flex-col rounded-[1.6rem] border border-[#ffd799]/24 bg-white/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
              Vystava
            </span>

            {exh.date ? (
              <span className="inline-flex items-center gap-2 text-sm text-[#8c6a43]">
                <CalendarDays size={14} />
                {new Date(exh.date).toLocaleDateString("cs-CZ")}
              </span>
            ) : null}
          </div>

          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900">
            {exh.title}
          </h3>

          <p className="mt-4 text-[1rem] leading-relaxed text-[#4a2c14]">
            {truncateText(exh.information)}
          </p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              to={`/vvv/${exh._id}`}
              variant="secondary"
              size="sm"
              className="border-[#ffd799]/30 bg-[rgba(255,214,145,0.16)] text-[#5f4126] shadow-none hover:bg-[rgba(255,214,145,0.26)]"
            >
              Vice informaci <ArrowRight className="h-4 w-4" />
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-full p-2 text-blue-600 transition hover:bg-blue-200/70"
                  aria-label="Upravit vystavu"
                  title="Upravit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-full p-2 text-red-600 transition hover:bg-red-200/70"
                  aria-label="Smazat vystavu"
                  title="Smazat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
