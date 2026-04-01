import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function GalleryLightbox({
  items,
  currentIndex,
  onChangeIndex,
  onClose,
}) {
  const thumbRefs = useRef([]);

  const prevImage = () => {
    onChangeIndex((i) => (i - 1 + items.length) % items.length);
  };

  const nextImage = () => {
    onChangeIndex((i) => (i + 1) % items.length);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  useEffect(() => {
    const activeThumb = thumbRefs.current[currentIndex];
    if (!activeThumb) return;

    activeThumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentIndex]);

  const floatingBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 " +
    "bg-white/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] " +
    "backdrop-blur-xl transition hover:bg-white/18";

  const accentBtn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#000]/45 " +
    "bg-[#000]/14 text-[#000] shadow-[0_12px_30px_rgba(0,0,0,0.22)] " +
    "backdrop-blur-xl transition hover:bg-[#f5a623]/22";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/78 p-4 backdrop-blur-xl sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -left-12 top-8 h-28 w-28 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="pointer-events-none absolute right-4 top-4 h-32 w-32 rounded-full bg-white/14 blur-3xl" />

        <div className="relative border-b border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#f5a623]">
                Galerie
              </p>
              <p className="mt-2 text-sm text-white/82">
                {currentIndex + 1} / {items.length}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Zavřít galerii"
              className={accentBtn}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative px-4 pb-4 pt-5 sm:px-6 sm:pb-6">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <img
              src={items[currentIndex]?.url}
              alt={items[currentIndex]?.alt || `Obrázek ${currentIndex + 1}`}
              className="max-h-[72vh] w-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

            <button
              type="button"
              onClick={prevImage}
              aria-label="Předchozí obrázek"
              className={`absolute left-3 top-1/2 -translate-y-1/2 sm:left-5 ${floatingBtn}`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Další obrázek"
              className={`absolute right-3 top-1/2 -translate-y-1/2 sm:right-5 ${floatingBtn}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {items.length > 1 && (
            <div className="mt-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div
                className="grid min-w-full grid-flow-col gap-3"
                style={{
                  gridAutoColumns: "minmax(5.5rem, calc((100% - 3rem) / 5))",
                }}
              >
                {items.map((img, idx) => {
                  const isActive = idx === currentIndex;

                  return (
                    <button
                      key={`${img.url}-${idx}`}
                      ref={(el) => {
                        thumbRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => onChangeIndex(idx)}
                      className={`group relative overflow-hidden rounded-2xl border transition ${
                        isActive
                          ? "border-white/40 bg-white/12 shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]"
                      }`}
                      aria-label={`Zobrazit obrázek ${idx + 1}`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `Miniatura ${idx + 1}`}
                        className="h-16 w-full object-cover sm:h-20"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
