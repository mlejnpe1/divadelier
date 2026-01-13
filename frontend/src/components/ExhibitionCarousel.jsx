import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Placeholder from "../assets/images/placeholder.png";

export default function ExhibitionCarousel({ items = [], loading }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(carousel);

    carousel.addEventListener("scroll", updateScrollButtons);

    return () => {
      observer.disconnect();
      carousel.removeEventListener("scroll", updateScrollButtons);
    };
  }, [items]);

  return (
    <div className='relative'>
      {loading ? (
        <div className='flex justify-center items-center h-48'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
        </div>
      ) : items.length === 0 ? (
        <p className='text-gray-400 text-center'>Žádné nadcházející výstavy.</p>
      ) : (
        <>
          <div
            ref={carouselRef}
            className='overflow-x-auto flex space-x-6 py-8 no-scrollbar scroll-smooth'
          >
            {items.map((exh, idx) => (
              <div
                key={exh._id}
                className={`flex-shrink-0 bg-white rounded-xl shadow-lg p-4 transition-transform duration-300 hover:scale-105 ${
                  idx === 0 ? "w-80 h-96" : "w-60 h-80"
                }`}
              >
                <img
                  src={exh.coverImage?.url || Placeholder}
                  alt={exh.coverImage?.alt || ""}
                  className='rounded-md w-full h-2/3 object-cover mb-2'
                />
                <h4 className='font-bold text-lg'>{exh.title}</h4>
                <p className='text-gray-600 text-sm'>{exh.information}</p>
                <p className='text-gray-400 text-xs mt-1'>
                  {new Date(exh.date).toLocaleDateString("cs-CZ")}
                </p>
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#f9cc81] rounded-full shadow p-2 hover:bg-[#f5a623] transition z-10'
            >
              <ArrowLeft className='w-6 h-6' />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#f9cc81] rounded-full shadow p-2 hover:bg-[#f5a623] transition z-10'
            >
              <ArrowRight className='w-6 h-6' />
            </button>
          )}
        </>
      )}
    </div>
  );
}
