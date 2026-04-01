import React from "react";
import ActionCard from "./ActionCard.jsx";

export default function TimelineList({
  items,
  loading,
  user,
  onEditAction,
  onDeleteAction,
}) {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (loading && !hasItems) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] px-6 py-10 text-center shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#9a590b]">
          Přehled akcí
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          Zatím tu nejsou žádné akce k zobrazení
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <ActionCard
          key={item._id}
          action={item}
          user={user}
          onEdit={() => onEditAction?.(item)}
          onDelete={() => onDeleteAction?.(item._id)}
        />
      ))}
    </div>
  );
}
