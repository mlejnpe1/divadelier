import React from "react";
import { useNavigate } from "react-router";
import TimelineCard from "./TimelineCard";

export default function TimelineList({
  items,
  user,
  onEditAction,
  onDeleteAction,
  onEditExhibition,
  onDeleteExhibition,
}) {
  const navigate = useNavigate();

  if (!items || items.length === 0)
    return <p className="text-gray-400">Nic nenalezeno</p>;

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const href =
          item.kind === "exhibition" ? `/vvv/${item._id}` : `/akce/${item._id}`;

        return (
          <TimelineCard
            key={`${item.kind}:${item._id}`}
            item={item}
            index={index}
            user={user}
            onOpen={() => navigate(href)}
            onEdit={() => {
              if (item.kind === "action") onEditAction?.(item);
              else onEditExhibition?.(item);
            }}
            onDelete={() => {
              if (item.kind === "action") onDeleteAction?.(item._id);
              else onDeleteExhibition?.(item._id);
            }}
          />
        );
      })}
    </div>
  );
}
