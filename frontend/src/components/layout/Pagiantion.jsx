import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  pageCount,
  onPageChange,
  items,
  itemTypeLabel = "stránka",
}) {
  const resolvedItems =
    Array.isArray(items) && items.length
      ? items
      : Array.from({ length: pageCount }, (_, index) => ({
          value: index + 1,
          label: index + 1,
        }));

  if (resolvedItems.length <= 1) return null;

  let currentIndex = resolvedItems.findIndex((item) => item.value === page);
  if (currentIndex === -1) currentIndex = 0;

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < resolvedItems.length - 1;

  const start = Math.max(0, currentIndex - 2);
  const end = Math.min(resolvedItems.length - 1, currentIndex + 2);
  const visibleItems = resolvedItems.slice(start, end + 1);
  const currentValue = resolvedItems[currentIndex]?.value;

  const navBtn =
    "rounded-full border border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] px-3 py-2 text-[#5f4126] shadow-[0_14px_35px_rgba(95,47,0,0.08)] backdrop-blur-xl transition hover:bg-[rgba(255,240,216,0.9)] disabled:opacity-50";

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() =>
          canPrev && onPageChange(resolvedItems[currentIndex - 1].value)
        }
        disabled={!canPrev}
        className={navBtn}
        aria-label={`Předchozí ${itemTypeLabel}`}
      >
        <ChevronLeft size={18} />
      </button>

      {start > 0 && (
        <>
          <PageButton
            item={resolvedItems[0]}
            currentValue={currentValue}
            onPageChange={onPageChange}
            itemTypeLabel={itemTypeLabel}
          />
          <span className="px-1 text-[#9a6a36]/60">…</span>
        </>
      )}

      {visibleItems.map((item) => (
        <PageButton
          key={item.value}
          item={item}
          currentValue={currentValue}
          onPageChange={onPageChange}
          itemTypeLabel={itemTypeLabel}
        />
      ))}

      {end < resolvedItems.length - 1 && (
        <>
          <span className="px-1 text-[#9a6a36]/60">…</span>
          <PageButton
            item={resolvedItems[resolvedItems.length - 1]}
            currentValue={currentValue}
            onPageChange={onPageChange}
            itemTypeLabel={itemTypeLabel}
          />
        </>
      )}

      <button
        type="button"
        onClick={() =>
          canNext && onPageChange(resolvedItems[currentIndex + 1].value)
        }
        disabled={!canNext}
        className={navBtn}
        aria-label={`Další ${itemTypeLabel}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function PageButton({ item, currentValue, onPageChange, itemTypeLabel }) {
  const active = item.value === currentValue;

  return (
    <button
      type="button"
      onClick={() => onPageChange(item.value)}
      className={
        "min-w-10 border px-3 py-2 transition " +
        (active
          ? "rounded-full border-[#f5a623] bg-[#f5a623] text-white shadow-[0_16px_30px_rgba(245,166,35,0.25)]"
          : "rounded-full border-[#ffd799]/24 bg-[linear-gradient(145deg,rgba(255,248,236,0.84),rgba(255,234,196,0.45))] text-[#5f4126] shadow-[0_14px_35px_rgba(95,47,0,0.08)] backdrop-blur-xl hover:bg-[rgba(255,240,216,0.9)]")
      }
      aria-label={`${itemTypeLabel} ${item.label}`}
      aria-current={active ? "page" : undefined}
    >
      {item.label}
    </button>
  );
}
