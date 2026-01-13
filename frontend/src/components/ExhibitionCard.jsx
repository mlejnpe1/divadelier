import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Edit2, Trash2 } from "lucide-react";
import Placeholder from "../assets/images/placeholder.png";

export default function ExhibitionCard({
  exhibition: exh,
  index,
  user,
  onEdit,
  onDelete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className='bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start'
    >
      <img
        src={exh.coverImage?.url || Placeholder}
        alt={exh.title || "Titulní fotka"}
        className='rounded-md w-full md:w-48 h-48 object-cover flex-shrink-0'
        loading='lazy'
        decoding='async'
      />
      <div className='flex-1'>
        <h3 className='text-xl font-bold mb-2'>{exh.title}</h3>
        <p className='text-gray-700 mb-1'>{exh.information}</p>
        {exh.date && (
          <p className='text-gray-400 text-sm'>
            Od: {new Date(exh.date).toLocaleDateString("cs-CZ")}
          </p>
        )}
        <a
          href={`/vvv/${exh._id}`}
          className='text-yellow-500 font-semibold hover:underline mt-6'
        >
          Více informací <ArrowRight className='inline-block ml-2 w-4 h-4' />
        </a>

        {user && (
          <div className='mt-6 flex space-x-2'>
            <Edit2
              className='cursor-pointer text-blue-600 hover:bg-blue-200 rounded-md'
              onClick={onEdit}
            />
            <Trash2
              className='cursor-pointer text-red-600 hover:bg-red-200 rounded-md'
              onClick={onDelete}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
