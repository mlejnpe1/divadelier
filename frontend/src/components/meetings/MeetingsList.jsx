import React from "react";
import MeetingCard from "./MeetingCard.jsx";

export default function MeetingsList({
  meetings,
  user,
  onEdit,
  onDelete,
  onSelect,
  getMeetingVisual,
}) {
  if (!Array.isArray(meetings) || meetings.length === 0) {
    return <p className="text-gray-400">Žádné schůzky k zobrazení</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {meetings.map((m, index) => (
        <MeetingCard
          key={m._id}
          meeting={m}
          user={user}
          onEdit={() => onEdit(m)}
          onDelete={() => onDelete(m._id)}
          onSelect={() => onSelect?.(m._id)}
          visual={getMeetingVisual?.(m, index)}
        />
      ))}
    </div>
  );
}
