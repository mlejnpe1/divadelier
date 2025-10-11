import React from "react";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const DrZdivPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  const gradientBackgrounds = [
    "from-purple-500/70 via-pink-500/50 to-yellow-300/30",
    "from-green-500/70 via-teal-500/50 to-blue-300/30",
    "from-red-500/70 via-orange-400/50 to-yellow-200/30",
    "from-indigo-600/70 via-purple-500/50 to-pink-300/30",
  ];

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/meetings`)
      .then((res) => res.json())
      .then((data) => setMeetings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingMeetings(false));

    fetch(`${API_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingNews(false));
  }, []);

  const latestNews = news[0];

  return (
    <div className='bg-gray-50 text-gray-800 min-h-screen'>
      <Hero
        title='DR.Zdiv'
        subtitle='Divadelní skupina plná energie a hravosti'
        description='Přinášíme nové nápady a divadelní tvorbu pro všechny generace.'
        children={
          latestNews ? (
            <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full'>
              <div className='flex items-center mb-8'>
                <Megaphone className='w-8 h-8 text-[#f5a623] mr-3' />
                <h2 className='text-3xl font-bold'>Aktualita</h2>
              </div>
              <p className='text-gray-700 mb-2'>{latestNews.information}</p>
              <p className='text-gray-500 text-sm'>
                {new Date(latestNews.createdAt).toLocaleDateString("cs-CZ")}
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById("newsSection");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className='bg-[#f5a623] text-white px-6 py-2 mt-3 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
              >
                Zobrazit všechny aktuality
              </button>
            </div>
          ) : (
            <p className='text-gray-400'>Žádné aktuality k zobrazení</p>
          )
        }
      />

      <section className='max-w-6xl mx-auto py-20 px-6 md:px-12'>
        <div className='flex items-center mb-8'>
          <h2 className='text-3xl font-bold'>Rozpis skupin</h2>
        </div>
        <div className='grid gap-8 md:grid-cols-2'>
          {meetings.map((meeting, index) => (
            <motion.div
              key={meeting._id}
              className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  gradientBackgrounds[index % gradientBackgrounds.length]
                }`}
              />

              <div className='relative p-6 flex flex-col justify-end h-64'>
                <h3 className='text-xl md:text-2xl font-bold text-black'>
                  {meeting.title}
                </h3>
                <p className='text-black/90 text-sm md:text-base mt-1'>
                  {meeting.information}
                </p>
                <p className='text-black text-xs mt-2 italic'>
                  Den: {meeting.day_in_week}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id='newsSection'
        className='max-w-6xl mx-auto py-20 px-6 md:px-12'
      >
        <div className='flex items-center mb-8'>
          <Megaphone className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Aktuality</h2>
        </div>
        <div className='space-y-6'>
          {news.map((n, index) => (
            <motion.div
              key={n._id}
              className='bg-white rounded-xl shadow p-6'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <p className='text-gray-700'>{n.information}</p>
              <p className='text-sm text-gray-500 mt-2'>
                {new Date(n.createdAt).toLocaleDateString("cs-CZ")}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DrZdivPage;
