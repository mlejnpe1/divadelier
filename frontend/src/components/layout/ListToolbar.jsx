import React from "react";
import { Search, X } from "lucide-react";

export default function ListToolbar({ query, setQuery }) {
  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="relative w-full md:max-w-lg">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a6a36]"
          size={18}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hledat podle názvu, textu nebo autora..."
          className="w-full rounded-full border border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] py-2 pl-10 pr-10 text-[#4a2c14] shadow-[0_14px_35px_rgba(95,47,0,0.08)] backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
        />
        {query?.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-[#f5a623]/10"
            aria-label="Vymazat hledání"
          >
            <X size={18} className="text-[#8c6a43]" />
          </button>
        )}
      </div>
    </div>
  );
}
