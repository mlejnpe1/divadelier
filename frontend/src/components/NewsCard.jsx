import React from "react";
import { Trash2 } from "lucide-react";

export default function NewsCard({ item, user, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-700">{item.information}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("cs-CZ")
            : ""}
        </p>

        {user && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-md hover:bg-red-50 text-red-700"
            aria-label="Smazat aktualitu"
            title="Smazat"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
