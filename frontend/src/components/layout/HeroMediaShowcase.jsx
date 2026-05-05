import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MotionImage = motion.img;

export default function HeroMediaShowcase({
  images = [],
  interval = 4000,
  heightClassName = "h-[320px] md:h-[480px] lg:h-[560px]",
  badges = [],
  badgesAlignment = "left",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [images, interval]);

  const badgesPositionClassName =
    badgesAlignment === "right"
      ? "left-7 right-7 top-7 flex justify-end"
      : "left-7 right-7 top-7 flex justify-start";

  return (
    <div className="relative w-full max-w-[900px]">
      <div className="pointer-events-none absolute inset-6 rounded-[3rem] bg-orange-300/16 blur-3xl md:inset-4" />

      <div className="relative overflow-hidden rounded-[2rem] shadow-[0_28px_75px_rgba(60,28,0,0.22)]">
        {images.length > 0 ? (
          <div
            className={`relative w-full overflow-hidden rounded-[1.6rem] ${heightClassName}`}
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
        ) : (
          <div
            className={`w-full rounded-[1.6rem] bg-white/25 ${heightClassName}`}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d1700]/28 via-transparent to-white/8" />

        {badges.length > 0 && (
          <div
            className={`pointer-events-none absolute ${badgesPositionClassName} flex-wrap gap-3`}
          >
            {badges.map((badge) => (
              <div
                key={badge}
                className="rounded-full border border-white/24 bg-white/18 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
