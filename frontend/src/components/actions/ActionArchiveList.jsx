import React from "react";
import { CalendarDays } from "lucide-react";
import { DeleteActionButton } from "../layout/ActionIconButton";

function truncateText(text, maxLength = 180) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
}

function getActionDisplayTitle(action) {
  const title = String(action?.title || "").trim();
  if (title) return title;

  const authorName = String(action?.author?.name || "").trim();
  if (authorName) return `Akce autora ${authorName}`;

  return "Akce bez názvu";
}

export default function ActionArchiveList({
  items,
  loading,
  user,
  activeYear,
  total,
  onDeleteAction,
}) {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (loading && !hasItems) {
    return (
      <div className="flex h-40 items-center justify-center rounded-[1.9rem] border border-[#d7d5d1] bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(244,240,235,0.72))] shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="rounded-[1.9rem] border border-[#d7d5d1] bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(244,240,235,0.72))] px-6 py-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#746250]">
          {activeYear ? `Archiv ${activeYear}` : "Archiv akcí"}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          {activeYear
            ? `Pro rok ${activeYear} tu zatím nejsou žádné akce`
            : "Pro vybraný rok tu zatím nejsou žádné akce"}
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.9rem] border border-[#d7d5d1] bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(244,240,235,0.72))] shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="border-b border-[#d7d5d1]/80 px-5 py-5 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7158]">
          {activeYear ? `Ročník ${activeYear}` : "Archiv akcí"}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          {Number(total || items.length)}{" "}
          {Number(total || items.length) === 1
            ? "akce"
            : Number(total || items.length) >= 2 &&
                Number(total || items.length) <= 4
              ? "akce"
              : "akcí"}
        </h3>
      </div>
      <div className="divide-y divide-[#d7d5d1]/80">
        {items.map((item) => {
          const authorName = String(item.author?.name || "").trim();
          const summary = truncateText(item.description || item.author?.bio || "");

          return (
            <article
              key={item._id}
              className="grid gap-4 px-5 py-5 transition hover:bg-white/55 md:grid-cols-[172px_minmax(0,1fr)_auto] md:px-6"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-[#6d5a45]">
                <CalendarDays size={15} />
                {item.date
                  ? new Date(item.date).toLocaleDateString("cs-CZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Bez data"}
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                  {getActionDisplayTitle(item)}
                </h3>

                {authorName ? (
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-[#9a590b]">
                    {authorName}
                  </p>
                ) : null}

                {summary ? (
                  <p className="mt-3 text-sm leading-7 text-[#5f4a35]">
                    {summary}
                  </p>
                ) : null}
              </div>

              {user ? (
                <div className="flex items-start gap-2 md:justify-end">
                  <DeleteActionButton
                    label="Smazat akci"
                    onClick={() => onDeleteAction?.(item._id)}
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
