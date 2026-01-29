import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < pageCount;

  // jednoduché okno stránek okolo aktuální
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
        aria-label="Předchozí stránka"
      >
        <ChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <PageButton p={1} page={page} onPageChange={onPageChange} />
          <span className="px-1 text-gray-400">…</span>
        </>
      )}

      {pages.map((p) => (
        <PageButton key={p} p={p} page={page} onPageChange={onPageChange} />
      ))}

      {end < pageCount && (
        <>
          <span className="px-1 text-gray-400">…</span>
          <PageButton p={pageCount} page={page} onPageChange={onPageChange} />
        </>
      )}

      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
        aria-label="Další stránka"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function PageButton({ p, page, onPageChange }) {
  const active = p === page;
  return (
    <button
      type="button"
      onClick={() => onPageChange(p)}
      className={
        "min-w-10 px-3 py-2 rounded-lg border transition " +
        (active
          ? "bg-[#f5a623] text-white border-[#f5a623]"
          : "bg-white hover:bg-gray-50")
      }
      aria-current={active ? "page" : undefined}
    >
      {p}
    </button>
  );
}
