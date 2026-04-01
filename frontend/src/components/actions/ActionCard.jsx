import React from "react";
import { ArrowRight, CalendarDays } from "lucide-react";
import Placeholder from "../../assets/images/placeholder.png";
import {
  DeleteActionButton,
  EditActionButton,
} from "../layout/ActionIconButton";
import Button from "../layout/Button";

function truncateText(text, maxLength = 220) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}...`;
}

function getActionDisplayTitle(action) {
  const title = String(action?.title || "").trim();
  if (title) return title;

  const authorName = String(action?.author?.name || "").trim();
  if (authorName) return `Akce autora ${authorName}`;

  return "Akce bez názvu";
}

export default function ActionCard({ action, user, onEdit, onDelete }) {
  const previewImage = action.coverImage?.url || Placeholder;
  const displayTitle = getActionDisplayTitle(action);
  const authorName = String(action.author?.name || "").trim();

  return (
    <article className="group relative overflow-hidden rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-5 shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ffd799]/35 hover:shadow-[0_30px_70px_rgba(95,47,0,0.16)] md:p-6">
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
            alt={action.coverImage?.alt || displayTitle}
            className="relative h-64 w-full object-contain p-4 md:h-full"
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = Placeholder;
            }}
          />
        </div>

        <div className="flex flex-1 flex-col rounded-[1.6rem] border border-[#ffd799]/24 bg-white/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
              Akce
            </span>

            {action.date ? (
              <span className="inline-flex items-center gap-2 text-sm text-[#8c6a43]">
                <CalendarDays size={14} />
                {new Date(action.date).toLocaleDateString("cs-CZ")}
              </span>
            ) : null}
          </div>

          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900">
            {displayTitle}
          </h3>

          {authorName ? (
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#9a590b]">
              {authorName}
            </p>
          ) : null}

          <p className="mt-4 text-[1rem] leading-relaxed text-[#4a2c14]">
            {truncateText(action.description || action.author?.bio || "")}
          </p>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              to={`/akce/${action._id}`}
              variant="secondary"
              size="sm"
              className="border-[#ffd799]/30 bg-[rgba(255,214,145,0.16)] text-[#5f4126] shadow-none hover:bg-[rgba(255,214,145,0.26)]"
            >
              Více informací <ArrowRight className="h-4 w-4" />
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <EditActionButton label="Upravit akci" onClick={onEdit} />
                <DeleteActionButton label="Smazat akci" onClick={onDelete} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
