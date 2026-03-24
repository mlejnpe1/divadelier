import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MotionImage = motion.img;

const ImageRotator = ({ images = [], interval = 4000, className = "" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((prev) => {
        return (prev + 1) % images.length;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [images, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.6rem] ${className}`}
    >
      <div className="relative h-full min-h-[20rem] w-full">
        <AnimatePresence mode="wait">
          <MotionImage
            key={images[index]}
            src={images[index]}
            alt={`Slide ${index + 1}`}
            loading="eager"
            decoding="async"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Soft gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10" />

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, dotIndex) => {
            const isActive = dotIndex === index;

            return (
              <button
                key={dotIndex}
                type="button"
                aria-label={`Přejít na snímek ${dotIndex + 1}`}
                onClick={() => {
                  setIndex(dotIndex);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageRotator;
