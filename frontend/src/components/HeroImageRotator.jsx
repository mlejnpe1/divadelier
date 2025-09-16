import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroImage1 from "../assets/images/hero-component/hero1.webp";
import HeroImage2 from "../assets/images/hero-component/hero2.webp";
import HeroImage3 from "../assets/images/hero-component/hero3.webp";

const images = [HeroImage1, HeroImage2, HeroImage3];

function HeroImageRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-3/4 md:w-full rounded-xl overflow-hidden shadow-lg relative h-80 md:h-96'>
      <AnimatePresence>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt='Divadeliér'
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 1 }}
          className='absolute inset-0 w-full h-full object-cover'
        />
      </AnimatePresence>
    </div>
  );
}

export default HeroImageRotator;
