import React, { useEffect } from "react";
import HeroImageRotator from "./HeroImageRotator";

const Hero = () => {
  return (
    <section
      className='bg-gray-50 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 bg-gradient-to-r from-[#f5a623]/20 via-[#ffffff]/40 to-[#ffffff]'
      style={{ height: "calc(100vh - 4rem)" }}
    >
      {/* Text */}
      <div className='md:w-1/2 text-center md:text-left mb-10 md:mb-0'>
        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
          Vítejte v <span className='text-[#f5a623]'>Divadeliéru</span>
        </h1>
        <p className='text-gray-600 text-lg md:text-xl mb-6'>
          Prkna, která znamenají svět.
        </p>
        <p className='text-gray-600 text-lg md:text-xl mb-6'>
          Divadlo Di, Dr. Zdiv, Divan, TV VV, Výstavy ve výloze, přednášky,
          koncerty
        </p>
        <p className='text-gray-600 text-lg md:text-xl mb-6'>
          a další kulturní akce...
        </p>
        <button className='bg-[#f5a623] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 transition'>
          Prohlédnout domovskou scénu
        </button>
      </div>

      {/* Image */}
      <div className='md:w-1/2 h-auto flex justify-center z-10'>
        <HeroImageRotator />
      </div>
    </section>
  );
};

export default Hero;
