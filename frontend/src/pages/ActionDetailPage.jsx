import React from "react";
import { useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import PlaceholderImg from "../assets/images/placeholder.png";
import Gallery from "../components/Gallery";
import { motion } from "framer-motion";
import { useFetch } from "../hooks/useFetch";

const ActionDetailPage = () => {
  const { id } = useParams();
  const { data: action, loading, error } = useFetch(`/api/exhibitions/${id}`);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-solid'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Chyba: {error}</p>
      </div>
    );
  }

  if (!action || action.message) {
    return (
      <div className='text-center mt-20 text-gray-600'>
        <p>{action?.message || "Akce nenalezena"}</p>
        <div className='mt-6 text-yellow-500 hover:text-yellow-600 font-semibold'>
          <ArrowLeft className='inline-block mr-2 w-4 h-4' />
          <a href='/akce'></a>
        </div>
      </div>
    );
  }

  const photosToShow =
    action.photos && action.photos.length > 0
      ? action.photos
      : [
          "https://picsum.photos/400/300?random=1",
          "https://picsum.photos/400/300?random=2",
          "https://picsum.photos/400/300?random=3",
          "https://picsum.photos/400/300?random=4",
          "https://picsum.photos/400/300?random=5",
          "https://picsum.photos/400/300?random=6",
          "https://picsum.photos/400/300?random=7",
          "https://picsum.photos/400/300?random=8",
        ];

  return (
    <section className='max-w-6xl mx-auto bg-gray-50 min-h-screen text-gray-800'>
      <div className=' mx-auto py-6 md:px-12 border-b border-gray-200'>
        <a
          href='/akce'
          className='flex items-center text-yellow-500 mb-8 hover:underline'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          Zpět na přehled akcí
        </a>

        <div className='flex flex-col md:flex-row gap-10 mb-16'>
          <motion.img
            //src={action.poster || action.imageUrl}
            src={PlaceholderImg}
            alt={action.title}
            className='rounded-xl shadow-lg w-full md:w-1/2 object-cover'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            className='md:w-1/2 flex flex-col justify-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-4xl font-bold mb-4'>{action.title}</h1>
            <p className='text-gray-500 text-sm mb-2'>
              {new Date(action.date).toLocaleDateString("cs-CZ")}
            </p>
            <p className='text-gray-700 mb-6 leading-relaxed'>
              {action.information}
            </p>
          </motion.div>
        </div>
      </div>
      <section className='mt-16 mx-auto px-6 md:px-12 mb-20'>
        <h2 className='text-2xl font-bold mb-6'>Fotky z akce</h2>
        <Gallery images={photosToShow} />
      </section>
    </section>
  );
};

export default ActionDetailPage;
