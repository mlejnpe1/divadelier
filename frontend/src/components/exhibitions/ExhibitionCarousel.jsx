import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import Placeholder from "../../assets/images/placeholder.png";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("cs-CZ");
}

function truncateText(text, maxLength = 92) {
  const normalized = String(text || "").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}...`;
}

function getExhibitionDisplayTitle(exhibition) {
  const title = String(exhibition?.title || "").trim();
  if (title) return title;

  const authorName = String(exhibition?.author?.name || "").trim();
  if (authorName) return `Vystava autora ${authorName}`;

  return "Vystava bez nazvu";
}

export default function ExhibitionCarousel({ items = [], loading }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateScrollButtons();

    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(carousel);
    carousel.addEventListener("scroll", updateScrollButtons);

    return () => {
      observer.disconnect();
      carousel.removeEventListener("scroll", updateScrollButtons);
    };
  }, [items]);

  if (loading) {
    return (
      <div className="flex h-56 items-center justify-center rounded-[2rem] border border-white/40 bg-white/35 shadow-[0_20px_55px_rgba(15,23,42,0.12)] backdrop-blur-md">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-white/40 bg-white/35 px-6 py-12 text-center shadow-[0_20px_55px_rgba(15,23,42,0.12)] backdrop-blur-md">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#9a6a2a]">
          VVV prehled
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
          Zatim tu nejsou zadne dalsi vystavy
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Jakmile pribydou nove terminy, objevi se tady v tomhle prehledu.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-[rgba(255,248,236,0.7)] to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-[rgba(255,248,236,0.7)] to-transparent md:block" />

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-4 no-scrollbar scroll-smooth md:gap-6"
      >
        {items.map((exh) => {
          const previewImage = exh.coverImage?.url || Placeholder;
          const displayTitle = getExhibitionDisplayTitle(exh);

          return (
            <Link
              key={exh._id}
              to={`/vvv/${exh._id}`}
              className="group relative flex min-h-[392px] w-[18rem] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ffd799]/35 hover:shadow-[0_30px_70px_rgba(95,47,0,0.16)] md:w-[18rem]"
            >
              <div className="relative h-56 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,248,236,0.68),rgba(255,234,196,0.18))]">
                <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
                <img
                  src={previewImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-50 transition duration-700 group-hover:scale-[1.16]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,236,0.18),rgba(95,47,0,0.12))]" />
                <img
                  src={previewImage}
                  alt={exh.coverImage?.alt || displayTitle}
                  className="relative h-full w-full object-contain p-4 transition duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="relative flex flex-1 flex-col p-4">
                <div className="rounded-[1.6rem] border border-[#ffd799]/24 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm">
                  <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-semibold leading-tight tracking-tight text-gray-900">
                    {displayTitle}
                  </h3>

                  <p className="mt-3 min-h-[3.5rem] text-sm leading-relaxed text-gray-600">
                    {truncateText(exh.information, 84)}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
                      {formatDate(exh.date) || "Pripravujeme"}
                    </div>

                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffd799]/30 bg-[rgba(255,214,145,0.16)] text-[#9a590b] shadow-[0_10px_24px_rgba(95,47,0,0.08)] backdrop-blur-md transition duration-300 group-hover:bg-[#f5a623] group-hover:text-white">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {canScrollLeft ? (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/80 text-[#9a6a2a] shadow-[0_18px_35px_rgba(15,23,42,0.16)] backdrop-blur-md transition duration-300 hover:bg-[#f5a623] hover:text-white"
          aria-label="Posunout vystavy doleva"
        >
          <ArrowLeft size={20} />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/55 bg-white/80 text-[#9a6a2a] shadow-[0_18px_35px_rgba(15,23,42,0.16)] backdrop-blur-md transition duration-300 hover:bg-[#f5a623] hover:text-white"
          aria-label="Posunout vystavy doprava"
        >
          <ArrowRight size={20} />
        </button>
      ) : null}
    </div>
  );
}
