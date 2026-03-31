import React from "react";
import { motion as Motion } from "framer-motion";
import Placeholder from "../../assets/images/placeholder.png";
import { Calendar } from "lucide-react";
import {
  DeleteActionButton,
  EditActionButton,
} from "../layout/ActionIconButton";

export default function TimelineCard({
  item,
  index,
  user,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onClick={onOpen}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-[1.01] transition flex flex-col md:flex-row gap-6"
    >
      <img
        src={item.coverImage?.url || Placeholder}
        alt={item.coverImage?.alt || item.title || "Titulní fotka"}
        className="w-full md:w-56 h-48 object-cover flex-shrink-0"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.src = Placeholder;
        }}
      />

      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100">
              {item.kind === "exhibition" ? "Výstava" : "Akce"}
            </span>

            <h3 className="text-xl font-bold mt-2">{item.title}</h3>
          </div>

          {user && (
            <div className="flex gap-2">
              <EditActionButton
                onClick={onEdit}
                stopPropagation={true}
              />

              <DeleteActionButton
                onClick={onDelete}
                stopPropagation={true}
              />
            </div>
          )}
        </div>

        <p className="text-gray-700 mt-2">{item.description}</p>

        {item.date && (
          <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
            <Calendar size={16} />
            {new Date(item.date).toLocaleDateString("cs-CZ")}
          </p>
        )}
      </div>
    </Motion.div>
  );
}
