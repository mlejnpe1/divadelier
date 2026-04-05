import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Expand, X } from "lucide-react";

export default function ShopImageLightbox({ item, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item?.image?.url) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/82 p-4 backdrop-blur-xl md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="pointer-events-none absolute right-6 top-4 h-32 w-32 rounded-full bg-white/14 blur-3xl" />

        <div className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white">
              Detail produktu
            </p>
            <h3 className="mt-2 truncate text-lg font-semibold text-white">
              {item.title || "Produkt"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zavřít náhled produktu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:bg-white/18"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative flex justify-center px-4 py-5 sm:px-6 sm:py-6">
          <div className="group relative w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <img
              src={item.image.url}
              alt={item.image.alt || item.title || "Produkt"}
              className="max-h-[78vh] w-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
