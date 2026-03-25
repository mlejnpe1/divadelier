import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < pageCount;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  const navBtn =
    "rounded-full border border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] px-3 py-2 text-[#5f4126] shadow-[0_14px_35px_rgba(95,47,0,0.08)] backdrop-blur-xl transition hover:bg-[rgba(255,240,216,0.9)] disabled:opacity-50";

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(page - 1)}
        disabled={!canPrev}
        className={navBtn}
        aria-label="Předchozí stránka"
      >
        <ChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <PageButton p={1} page={page} onPageChange={onPageChange} />
          <span className="px-1 text-[#9a6a36]/60">…</span>
        </>
      )}

      {pages.map((p) => (
        <PageButton key={p} p={p} page={page} onPageChange={onPageChange} />
      ))}

      {end < pageCount && (
        <>
          <span className="px-1 text-[#9a6a36]/60">…</span>
          <PageButton
            p={pageCount}
            page={page}
            onPageChange={onPageChange}
          />
        </>
      )}

      <button
        type="button"
        onClick={() => canNext && onPageChange(page + 1)}
        disabled={!canNext}
        className={navBtn}
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
        "min-w-10 border px-3 py-2 transition " +
        (active
          ? "rounded-full border-[#f5a623] bg-[#f5a623] text-white shadow-[0_16px_30px_rgba(245,166,35,0.25)]"
          : "rounded-full border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] text-[#5f4126] shadow-[0_14px_35px_rgba(95,47,0,0.08)] backdrop-blur-xl hover:bg-[rgba(255,240,216,0.9)]")
      }
      aria-current={active ? "page" : undefined}
    >
      {p}
    </button>
  );
}
