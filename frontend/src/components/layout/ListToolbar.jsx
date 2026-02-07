import React from "react";
import { Search, X } from "lucide-react";

export default function ListToolbar({ query, setQuery }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="relative w-full md:w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hledat podle názvu nebo textu..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />
        {query?.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
            aria-label="Vymazat hledání"
          >
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
