import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

const EshopPage = () => {
  const [items, setItems] = React.useState([]);
  const [loadingItems, setLoadingItems] = React.useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "price") return a.price - b.price;
    return 0;
  });

  useEffect(() => {
    let endpoint = `${API_URL}/api/shopitems`;
    if (activeTab === "divadelier") endpoint += "?shop_id=0";
    if (activeTab === "vvv") endpoint += "?shop_id=1";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingItems(false));
  }, [activeTab]);

  console.log(items);

  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen'>
      <header className='max-w-6xl mx-auto py-12 px-6 md:px-12 text-center'>
        <h1 className='text-4xl font-bold mb-4'>E-shop Divadelier</h1>
        <p className='text-gray-700 text-lg'>
          Objevte originální výrobky a umělecké předměty z Divadeliéru a
          aktuálních výstav ve výloze. Kontaktujte nás, pokud vás něco zaujalo!
        </p>
      </header>
      <section className='max-w-6xl mx-auto py-12 px-6 md:px-12 text-center text-gray-600'>
        <p>
          Pro více informací nás kontaktujte na emailu:{" "}
          <a href='mailto:info@divadelier.cz'>info@divadelier.cz</a>
        </p>
      </section>
      <section className='max-w-6xl mx-auto py-12 px-6 md:px-12'>
        <div className='flex justify-center mb-12 space-x-4'>
          {[
            { id: "all", label: "Vše" },
            { id: "divadelier", label: "Divadelier" },
            { id: "vvv", label: "Výstavy ve výloze" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#f5a623] text-white shadow-md scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className='flex justify-end mb-6'>
          <label className='mr-2 font-semibold' htmlFor='sort'>
            Řadit podle:
          </label>
          <select
            id='sort'
            className='border border-gray-300 rounded px-2 py-1'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value='title'>Názvu (A-Z)</option>
            <option value='price'>Ceny (nejlevnější)</option>
          </select>
        </div>
        {loadingItems ? (
          <div className='flex justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          </div>
        ) : sortedItems.length === 0 ? (
          <p className='text-gray-400 text-center'>
            Žádné produkty k zobrazení.
          </p>
        ) : (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {sortedItems.map((item, index) => (
              <motion.div
                key={item._id}
                className='bg-white rounded-xl shadow-lg overflow-hidden'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {item.image?.data ? (
                  <img
                    src={`data:${item.image.contentType};base64,${btoa(
                      String.fromCharCode(
                        ...new Uint8Array(item.image.data.data)
                      )
                    )}`}
                    alt={item.title}
                    className='w-full h-48 object-cover'
                  />
                ) : (
                  <div className='w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500'>
                    Žádný obrázek
                  </div>
                )}
                <div className='p-6 flex flex-col justify-between h-56'>
                  <div>
                    <h3 className='text-xl font-bold text-black'>
                      {item.title}
                    </h3>
                    <p className='text-gray-700 mt-1'>{item.price} Kč</p>
                  </div>
                  <a
                    href={`mailto:${item.contact}`}
                    className='mt-4 inline-block bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300 text-center'
                  >
                    Kontaktovat
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default EshopPage;
