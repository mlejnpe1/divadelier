import React, { useEffect, useMemo, useState } from "react";

const Gallery = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images
      .map((img) => {
        if (typeof img === "string") return { url: img, alt: "" };
        if (img && typeof img === "object") {
          return { url: String(img.url || ""), alt: String(img.alt || "") };
        }
        return { url: "", alt: "" };
      })
      .filter((x) => x.url);
  }, [images]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevImage = () => {
    setCurrentIndex((i) => (i - 1 + items.length) % items.length);
  };

  const nextImage = () => {
    setCurrentIndex((i) => (i + 1) % items.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // items.length je důležitý kvůli modulo
  }, [isOpen, items.length]);

  if (!items.length) {
    return (
      <p className='text-gray-400 text-center'>Žádné obrázky k zobrazení</p>
    );
  }

  const floatingBtn =
    "bg-black/50 backdrop-blur-sm text-white rounded-full shadow-lg " +
    "hover:bg-black/70 transition p-3";

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        {items.map((img, idx) => (
          <div
            key={idx}
            className='relative cursor-pointer group'
            onClick={() => openModal(idx)}
          >
            <img
              src={img.url}
              alt={img.alt || `Obrázek ${idx + 1}`}
              className='rounded-xl shadow-lg w-full h-48 object-cover group-hover:scale-105 transition duration-300'
              loading='lazy'
              decoding='async'
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
            <div className='absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-t from-black/40 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition' />
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'
          onClick={closeModal}
        >
          <div
            className='relative max-w-4xl w-full'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[currentIndex]?.url}
              alt={items[currentIndex]?.alt || `Obrázek ${currentIndex + 1}`}
              className='w-full max-h-[80vh] object-contain rounded-lg shadow-2xl'
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />

            <button
              onClick={prevImage}
              aria-label='Předchozí obrázek'
              className={`absolute top-1/2 left-3 -translate-y-1/2 z-10 ${floatingBtn}`}
            >
              &#10094;
            </button>

            <button
              onClick={nextImage}
              aria-label='Další obrázek'
              className={`absolute top-1/2 right-3 -translate-y-1/2 z-10 ${floatingBtn}`}
            >
              &#10095;
            </button>

            <button
              onClick={closeModal}
              aria-label='Zavřít galerii'
              className={`absolute top-3 right-3 ${floatingBtn}`}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
