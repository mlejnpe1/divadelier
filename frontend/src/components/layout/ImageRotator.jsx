import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageRotator = ({
  images = [],
  interval = 3000,
  className = "w-full h-96",
}) => {
  const [index, setIndex] = useState(0);

  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg relative ${className}`}
    >
      <AnimatePresence>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={`Slide ${index + 1}`}
          loading='eager'
          decoding='async'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className='absolute inset-0 w-full h-full object-cover'
        />
      </AnimatePresence>
    </div>
  );
};

export default ImageRotator;
