import React, { useMemo, useState } from "react";
import GalleryLightbox from "./GalleryLightbox.jsx";

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

  if (!items.length) {
    return (
      <p className="text-center text-gray-400">Žádné obrázky k zobrazení</p>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-white/30 blur-3xl" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {items.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => openModal(idx)}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 text-left shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || `Obrázek ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-white/10 opacity-90 transition duration-300 group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <GalleryLightbox
          items={items}
          currentIndex={currentIndex}
          onChangeIndex={setCurrentIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Gallery;
