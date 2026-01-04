import React, { useRef } from "react";
import Hero from "../components/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { motion } from "framer-motion";
import { ArrowRight, CalendarSearchIcon, Megaphone } from "lucide-react";
import Section from "../components/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import ExhibitionCarousel from "../components/ExhibitionCarousel.jsx";

const VVVPage = () => {
  const { data, loading, error } = useFetch("/api/exhibitions");
  const exhibitions = data || [];

  const featuredExhibition = exhibitions[0] || null;
  const nextExhibitions = exhibitions.slice(0, 10);

  return (
    <>
      <Hero
        title='VVV – Výstavy ve výloze'
        subtitle='Aktuální výstava na dosah'
        description='Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán výstav a možnost zakoupení obrazů.'
      >
        <div className='w-full max-w-3xl mx-auto mt-6'>
          {loading ? (
            <div className='flex justify-center items-center h-64 md:h-96'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
            </div>
          ) : (
            <img
              src={featuredExhibition?.imageUrl || Placeholder}
              alt={featuredExhibition?.title || "Aktuální výstava"}
              className='rounded-xl shadow-lg w-full object-cover h-64 md:h-96'
            />
          )}
        </div>
      </Hero>

      <Section border={true}>
        <div className='flex items-center mb-8'>
          <CalendarSearchIcon className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Následující výstavy</h2>
        </div>
        <ExhibitionCarousel items={nextExhibitions} loading={loading} />
      </Section>

      <Section border={true}>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='md:w-2/3'>
            <h2 className='text-3xl font-bold mb-4'>
              Máte zájem o nějaké dílo?
            </h2>
            <p className='text-gray-700 mb-6'>
              Pokud vás zaujala některá z vystavených prací, můžete si ji
              zakoupit přímo z našeho e-shopu.
            </p>
            <a href='/eshop' target='_blank' rel='noopener noreferrer'>
              <button className='mt-8 mx-auto bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'>
                Přejít na e-shop
              </button>
            </a>
          </div>
          <div className='md:w-1/3 mt-6 md:mt-0'>
            <img
              src={Placeholder}
              alt='Ukázka produktů z e-shopu'
              className='rounded-lg shadow-lg object-cover w-full h-48 md:h-64'
            />
          </div>
        </div>
      </Section>

      <Section border={true}>
        <div className='flex items-center mb-8'>
          <Megaphone className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Kontaktujte nás</h2>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6 space-y-6'>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              alert("Zpráva odeslána! (zde bude volání API)");
            }}
          >
            <input
              type='text'
              placeholder='Vaše jméno'
              required
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
            />
            <input
              type='email'
              placeholder='Váš email'
              required
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
            />
            <textarea
              placeholder='Vaše zpráva'
              rows={4}
              required
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
            />
            <button
              type='submit'
              className='mt-8 mx-auto bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
            >
              Odeslat zprávu
            </button>
          </form>
        </div>
      </Section>

      <Section id='fullExhibitionPlan' border={true}>
        <h2 className='text-3xl font-bold mb-6'>Kompletní výstavní plán</h2>
        {loading ? (
          <div className='flex justify-center items-center h-48'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          </div>
        ) : exhibitions.length === 0 ? (
          <p className='text-gray-400'>Žádné výstavy k zobrazení</p>
        ) : (
          <div className='space-y-6'>
            {exhibitions.map((exh, index) => (
              <motion.div
                key={exh._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start'
              >
                <img
                  src={exh.imageUrl || Placeholder}
                  alt={exh.title}
                  className='rounded-md w-full md:w-48 h-48 object-cover flex-shrink-0'
                />
                <div className='flex-1'>
                  <h3 className='text-xl font-bold mb-2'>{exh.title}</h3>
                  <p className='text-gray-700 mb-1'>{exh.information}</p>
                  <p className='text-gray-400 text-sm'>
                    Od: {new Date(exh.startDate).toLocaleDateString("cs-CZ")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default VVVPage;
