import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CourseVariantCard from "./CourseVariantCard";

const CourseCard = ({ course, isFirst }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4, once: false });
  const isCustomCourse = course.title === "Kurzy na míru";

  return (
    <motion.section
      ref={ref}
      style={{
        minHeight: isFirst ? "95vh" : "75vh",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: isInView ? 1 : 0,
        scale: isInView ? 1 : 0.98,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='max-h-max border-b border-gray-300 flex align-middle'
    >
      <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12'>
        <motion.div
          className='flex-1'
          animate={{
            opacity: isInView ? 1 : 0.5,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-[#f5a623]'>
            {course.title}
          </h2>
          <p className='text-lg text-gray-700 mb-8'>{course.description}</p>

          {isCustomCourse ? (
            <div className='flex flex-col md:flex-row gap-6'>
              <CourseVariantCard
                title='Individuální'
                text='Lekce přizpůsobené pro vás, tempo dle potřeb.'
                delay={0}
              />
              <CourseVariantCard
                title='Skupinové'
                text='Lekce pro více účastníků, ideální pro skupiny.'
                delay={0.2}
              />
            </div>
          ) : (
            <motion.button
              className='bg-[#f5a623] text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Více informací
            </motion.button>
          )}
        </motion.div>

        {!isCustomCourse && (
          <motion.div
            className='flex-1 rounded-3xl overflow-hidden shadow-2xl'
            animate={{
              opacity: isInView ? 1 : 0.5,
              scale: isInView ? 1 : 0.95,
            }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={course.image}
              alt={course.title}
              className='object-cover w-full h-[300px] md:h-[400px]'
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default CourseCard;
