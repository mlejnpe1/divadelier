import React from "react";
import ExhibitionCard from "./ExhibitionCard.jsx";

export default function ExhibitionList({
  exhibitions,
  loading,
  user,
  onEdit,
  onDelete,
}) {
  const hasExhibitions = Array.isArray(exhibitions) && exhibitions.length > 0;

  if (loading && !hasExhibitions) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  if (!hasExhibitions) {
    return (
      <div className="rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] px-6 py-10 text-center shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#9a590b]">
          VVV přehled
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          Zatím tu nejsou žádné výstavy k zobrazení
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exhibitions.map((exh, index) => (
        <ExhibitionCard
          key={exh._id}
          exhibition={exh}
          index={index}
          user={user}
          onEdit={() => onEdit(exh)}
          onDelete={() => onDelete(exh._id)}
        />
      ))}
    </div>
  );
}
