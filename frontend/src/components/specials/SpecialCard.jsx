import React from "react";
import { ExternalLink, Edit2, Trash2 } from "lucide-react";

export default function SpecialCard({ special, user, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {special.name}
          </h3>
          {special.information ? (
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {special.information}
            </p>
          ) : (
            <p className="text-gray-400 mt-2 italic">Bez popisu</p>
          )}
        </div>

        {user && (
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="p-2 rounded-md hover:bg-blue-50 text-blue-700"
              aria-label="Upravit"
            >
              <Edit2 size={18} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-md hover:bg-red-50 text-red-700"
              aria-label="Smazat"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <a
        href={special.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[#f5a623] font-semibold hover:underline break-all"
      >
        Otevřít odkaz <ExternalLink size={16} />
      </a>
    </div>
  );
}
