import React from "react";
import { motion } from "framer-motion";
import PlaceholderImg from "../assets/images/placeholder.png";

const CourseVariantCard = ({ title, text, delay }) => (
  <motion.div
    className='flex-1 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center'
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <h3 className='text-2xl font-semibold mb-2'>{title}</h3>
    <p className='text-gray-600 mb-4'>{text}</p>
    <motion.button
      className='bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Více informací
    </motion.button>
    <img
      src={PlaceholderImg}
      alt={title}
      className='w-full h-48 md:h-60 object-cover rounded-xl mt-6'
    />
  </motion.div>
);

export default CourseVariantCard;
