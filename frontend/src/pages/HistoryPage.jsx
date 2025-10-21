import React from "react";
import { motion } from "framer-motion";
import Placeholder from "../assets/images/placeholder.png";

const HistoryPage = () => {
  const historyEvents = [
    {
      year: "2005",
      image: Placeholder,
      text: "Založení Divadeliéru skupinou nadšenců z místního kulturního domu.",
    },
    {
      year: "2008",
      image: Placeholder,
      text: "První autorské představení získalo regionální ocenění.",
    },
    {
      year: "2015",
      image: Placeholder,
      text: "Otevření nové scény ve spolupráci s městem Vysoké Mýto.",
    },
    {
      year: "2022",
      image: Placeholder,
      text: "Spuštění projektu Výstavy ve výloze (VVV).",
    },
  ];

  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen flex'>
      <aside className='hidden md:flex md:flex-col md:w-1/3 lg:w-1/3 sticky top-0 h-screen bg-gray-100 p-10 shadow-inner justify-center self-start'>
        <div>
          <h1 className='text-4xl font-bold mb-6'>Historie Divadeliéru</h1>
          <p className='text-gray-700 leading-relaxed'>
            Divadeliér vznikl z touhy spojit divadlo, hudbu a vizuální umění v
            jeden celek. Od skromných začátků se stal místem, které dává prostor
            experimentu, autorské tvorbě i komunitnímu dění. Podívejme se
            společně na nejdůležitější milníky naší cesty.
          </p>
        </div>
      </aside>

      <section className='flex-1 py-20 px-6 md:px-12'>
        <div className='relative max-w-4xl mx-auto'>
          <div className='absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 h-full'></div>

          <div className='space-y-20'>
            {historyEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col md:flex-row items-center`}
              >
                <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#f5a623] rounded-full border-4 border-white shadow-lg z-10'></div>

                <div
                  className={`bg-white rounded-xl shadow-lg p-6 w-full md:w-5/12 ${
                    index % 2 === 0
                      ? "md:mr-auto md:pr-8"
                      : "md:ml-auto md:pl-8"
                  }`}
                >
                  <h2 className='text-2xl font-bold mb-4 text-center md:text-left text-[#f5a623]'>
                    {event.year}
                  </h2>
                  <img
                    src={event.image}
                    alt={event.year}
                    className='rounded-lg object-cover w-full h-48 mb-3'
                  />
                  <p className='text-gray-700'>{event.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
