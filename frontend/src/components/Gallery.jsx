import React, { useState } from "react";

const Gallery = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <p className='text-gray-400 text-center'>Žádné obrázky k zobrazení</p>
    );
  }

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Obrázek ${idx + 1}`}
            className='rounded-xl shadow-lg w-full h-48 object-cover hover:scale-105 transform transition duration-300 cursor-pointer'
            onClick={() => openModal(idx)}
            loading='lazy'
          />
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
              src={images[currentIndex]}
              alt={`Obrázek ${currentIndex + 1}`}
              className='w-full max-h-[80vh] object-contain rounded-lg shadow-2xl'
            />

            <button
              onClick={prevImage}
              className='absolute top-1/2 left-2 -translate-y-1/2 text-yellow-500 text-3xl font-bold hover:text-yellow-600'
            >
              &#10094;
            </button>
            <button
              onClick={nextImage}
              className='absolute top-1/2 right-2 -translate-y-1/2 text-yellow-500 text-3xl font-bold hover:text-yellow-600'
            >
              &#10095;
            </button>

            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-yellow-500 text-2xl font-bold hover:text-yellow-600'
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
