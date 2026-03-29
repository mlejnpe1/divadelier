import React from "react";
import SpecialCard from "./SpecialCard.jsx";

export default function SpecialsList({ specials, user, onEdit, onDelete }) {
  if (!Array.isArray(specials) || specials.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-white/45 bg-white/45 px-6 py-10 text-center text-[#8c6a43] shadow-[0_16px_40px_rgba(95,47,0,0.08)] backdrop-blur-xl">
        Žádné Specialy k zobrazení
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {specials.map((s) => (
        <SpecialCard
          key={s._id}
          special={s}
          user={user}
          onEdit={() => onEdit(s)}
          onDelete={() => onDelete(s._id)}
        />
      ))}
    </div>
  );
}
