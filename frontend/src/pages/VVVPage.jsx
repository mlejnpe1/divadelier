import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Hero from "../components/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { motion } from "framer-motion";
import { ArrowRight, CalendarSearchIcon, Megaphone } from "lucide-react";
import Section from "../components/Section.jsx";

const VVVPage = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loadingExhibitions, setLoadingExhibitions] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/exhibitions`)
      .then((res) => res.json())
      .then((data) => setExhibitions(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingExhibitions(false));
  }, []);

  return (
    <>
      <Hero
        title='VVV – Výstavy ve výloze'
        subtitle='Aktuální výstava na dosah'
        description='Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán výstav a možnost zakoupení obrazů.'
        children={
          <div className='w-full max-w-3xl mx-auto mt-6'>
            {loadingExhibitions ? (
              <div className='flex justify-center items-center h-64 md:h-96'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
              </div>
            ) : (
              <img
                src={exhibitions[0]?.imageUrl || Placeholder}
                alt={exhibitions[0]?.title || "Aktuální výstava"}
                className='rounded-xl shadow-lg w-full object-cover h-64 md:h-96'
              />
            )}
          </div>
        }
      />
      <Section border={true}>
        <div className='flex items-center mb-8'>
          <CalendarSearchIcon className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Následující výstavy</h2>
        </div>
        <div className='flex flex-col gap-6'>
          {!loadingExhibitions && exhibitions.length > 5 ? (
            <>
              <div className='overflow-x-auto flex space-x-6 py-8 no-scrollbar'>
                <div className='absolute top-0 right-0 h-full w-16 bg-gradient-to-l pointer-events-none' />
                {exhibitions.slice(1, 6).map((exh, idx) => (
                  <div
                    key={exh._id}
                    className={`flex-shrink-0 bg-white rounded-xl shadow-lg p-4 transition-transform duration-300 hover:scale-105 ${
                      idx === 0 ? "w-80 h-96" : "w-60 h-80"
                    }`}
                  >
                    <img
                      src={exh.imageUrl || Placeholder}
                      alt={exh.title}
                      className='rounded-md w-full h-2/3 object-cover mb-2'
                    />
                    <h4 className='font-bold text-lg'>{exh.title}</h4>
                    <p className='text-gray-600 text-sm'>{exh.information}</p>
                    <p className='text-gray-400 text-xs mt-1'>
                      {new Date(exh.startDate).toLocaleDateString("cs-CZ")}
                    </p>
                  </div>
                ))}
                <div className='absolute top-1/2 right-4 transform -translate-y-1/2 animate-bounce'>
                  <ArrowRight className='w-6 h-6 text-gray-400' />
                </div>
              </div>
            </>
          ) : (
            <div className='flex justify-center items-center h-48'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
            </div>
          )}
        </div>
        <button
          className='mx-auto mt-8 px-6 py-2 bg-[#f5a623] text-white rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
          onClick={() => {
            const el = document.getElementById("fullExhibitionPlan");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Přejít na kompletní plán výstav
        </button>
      </Section>
      <Section border={true}>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='md:w-2/3'>
            <h2 className='text-3xl font-bold mb-4'>
              Máte zájem o nějaké dílo?
            </h2>
            <p className='text-gray-700 mb-6'>
              Pokud vás zaujala některá z vystavených prací, můžete si ji
              zakoupit přímo z našeho e-shopu. Prohlédněte si dostupné obrazy a
              dopřejte si kousek umění domů.
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
          <p className='text-gray-700'>
            Máte zájem o výstavu nebo chcete více informací? Napište nám zprávu
            a my se vám ozveme co nejdříve.
          </p>

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
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              required
            />
            <input
              type='email'
              placeholder='Váš email'
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              required
            />
            <textarea
              placeholder='Vaše zpráva'
              rows={4}
              className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              required
            />
            <button
              type='submit'
              className='mt-8 mx-auto bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
            >
              Odeslat zprávu
            </button>
          </form>

          <div className='text-gray-600 mt-4'>
            <p>
              Email:{" "}
              <a href='mailto:info@vvv.cz' className='text-[#f5a623]'>
                info@vvv.cz
              </a>
            </p>
            <p>
              Telefon:{" "}
              <a href='tel:+420123456789' className='text-[#f5a623]'>
                +420 123 456 789
              </a>
            </p>
          </div>
        </div>
      </Section>
      <Section id='fullExhibitionPlan'>
        <h2 className='text-3xl font-bold mb-6'>Kompletní výstavní plán</h2>

        {loadingExhibitions ? (
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
