import React from "react";
import SpecialCard from "./SpecialCard.jsx";

export default function SpecialsList({ specials, user, onEdit, onDelete }) {
  if (!Array.isArray(specials) || specials.length === 0) {
    return <p className="text-gray-400">Žádné speciály k zobrazení</p>;
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
