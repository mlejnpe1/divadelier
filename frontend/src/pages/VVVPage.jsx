import React, { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { motion } from "framer-motion";
import {
  CalendarSearchIcon,
  Megaphone,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import Section from "../components/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import ExhibitionCarousel from "../components/ExhibitionCarousel.jsx";

const VVVPage = () => {
  const { data, loading, error } = useFetch("/api/exhibitions");
  const [exhibitions, setExhibitions] = useState([]);
  const { user } = useAuth();

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingInfo, setEditingInfo] = useState("");
  const [editingDate, setEditingDate] = useState("");

  const featuredExhibition = exhibitions[0] || null;
  const nextExhibitions = exhibitions.slice(0, 6);

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (data) setExhibitions(data);
  }, [data]);

  const handleDelete = async (id) => {
    if (!confirm("Opravdu smazat tuto výstavu?")) return;

    try {
      const res = await fetch(`${api_url}/api/exhibitions/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Chyba ${res.status}`);
      }

      setExhibitions((prev) => prev.filter((exh) => exh._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`${api_url}/api/exhibitions/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTitle,
          information: editingInfo,
          date: editingDate,
        }),
      });

      if (!res.ok) throw new Error("Nepodařilo se aktualizovat výstavu");

      const updatedExh = await res.json();
      setExhibitions((prev) =>
        prev.map((exh) => (exh._id === id ? updatedExh : exh))
      );

      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

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
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold'>Kompletní výstavní plán</h2>
          {user && (
            <button className='bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition'>
              Přidat výstavu
            </button>
          )}
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-48'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          </div>
        ) : exhibitions?.length === 0 ? (
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
                  {editingId === exh._id ? (
                    <>
                      <input
                        type='text'
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className='border border-gray-300 rounded px-2 py-1 w-full mb-2'
                      />
                      <textarea
                        value={editingInfo}
                        onChange={(e) => setEditingInfo(e.target.value)}
                        className='border border-gray-300 rounded px-2 py-1 w-full'
                      />
                      <input
                        type='date'
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                        className='border border-gray-300 rounded px-2 py-1 w-full mb-2'
                      />
                      <div className='mt-2 flex space-x-2'>
                        <button
                          className='bg-green-500 text-white px-3 py-1 rounded'
                          onClick={() => handleEdit(exh._id)}
                        >
                          Uložit
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className='bg-gray-300 px-3 py-1 rounded'
                        >
                          Zrušit
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className='text-xl font-bold mb-2'>{exh.title}</h3>
                      <p className='text-gray-700 mb-1'>{exh.information}</p>
                      <p className='text-gray-400 text-sm'>
                        Od:{" "}
                        {new Date(exh.startDate).toLocaleDateString("cs-CZ")}
                      </p>

                      {user && (
                        <div className='mt-6 flex space-x-2'>
                          <Edit2
                            className='cursor-pointer text-blue-600 hover:bg-blue-200 rounded-md'
                            onClick={() => {
                              setEditingId(exh._id);
                              setEditingTitle(exh.title);
                              setEditingInfo(exh.information);
                            }}
                          />
                          <Trash2
                            className='cursor-pointer text-red-600 hover:bg-red-200 rounded-md'
                            onClick={() => handleDelete(exh._id)}
                          />
                        </div>
                      )}
                    </>
                  )}
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
