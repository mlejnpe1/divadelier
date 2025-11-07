import React from "react";
import { motion } from "framer-motion";
import AboutImage from "../assets/images/about.webp";

const About = () => {
  return (
    <section className='bg-gray-50 py-20 px-6 md:px-20'>
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24'>
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
            O <span className='text-[#f5a623]'>Divadeliéru</span>
          </h2>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            Divadeliér je otevřený prostor pro divadelní tvorbu, koncerty,
            přednášky i výstavy.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed mb-4'>
            Přinášíme živou kulturu do srdce města a dáváme prostor začínajícím
            i zkušeným umělcům.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Chceme, aby si každý našel své místo – ať už jako divák, účinkující,
            nebo organizátor.
          </p>
        </motion.div>
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className='flex justify-center'
        >
          <img
            src={AboutImage}
            alt='O Divadeliéru'
            className='rounded-xl shadow-md w-full h-auto'
          ></img>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
