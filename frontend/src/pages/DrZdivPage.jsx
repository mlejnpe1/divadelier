import React from "react";
import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { Megaphone, Calendar, DownloadIcon, Spotlight } from "lucide-react";
import { motion } from "framer-motion";
import handleDownload from "../utils/handleDownload";

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

  const about = [
    { text: "Přinášíme nové nápady a divadelní tvorbu pro všechny generace." },
    {
      text: "Přirozenou hrou s divadelními prostředky ke správné technice hlasu, dobrému slovnímu projevu a prezentačním dovednostem. Zážitek na jevišti, budování spolupráce, přátelská atmosféra, spoustu legrace a hlavně divadlo.",
    },
    {
      text: "Každá skupina ročně realizuje dvě představení – stínové vánoční divadlo ve výlohách Divadeliéru a závěrečné představení na jevišti v M-klubu. Možnost účastnit se ojedinělé originální akce Letu andělů.",
    },
    {
      text: "Děti v Dr. ZDIVu objevoují nejen sebe, ale i celý proces vzniku divadelního představení.",
    },
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
        title='Dr. ZDIV'
        subtitle='Dětské divadelní skupiny plné energie a hravosti.'
        description='Přinášíme nové nápady a divadelní tvorbu pro všechny generace.'
        children={
          loadingNews ? (
            <div className='flex justify-center items-center bg-white rounded-xl shadow-lg p-6 max-w-sm w-full h-48'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
            </div>
          ) : latestNews ? (
            <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full h-'>
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
      <section className='pt-20 px-6 md:px-12 border-b border-gray-300 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center mb-8'>
            <Spotlight className='w-9 h-9 text-[#f5a623] mr-3' />
            <h2 className='text-3xl font-bold'>
              Objev v sobě herce s Dr. ZDIVem
            </h2>
          </div>
          {about.map((item, index) => (
            <motion.p
              key={index}
              className='text-gray-700 mb-6'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.text}
            </motion.p>
          ))}
        </div>
      </section>
      <section className='py-20 px-6 md:px-12 border-b border-gray-300 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center mb-8'>
            <Calendar className='w-8 h-8 text-[#f5a623] mr-3' />
            <h2 className='text-3xl font-bold'>Rozpis skupin</h2>
          </div>
          <div className='grid gap-8 md:grid-cols-2'>
            {loadingMeetings ? (
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
            ) : (
              meetings.map((meeting, index) => (
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
                      Kdy se scházíme: {meeting.day_in_week}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
      <section className='pt-20 px-6 md:px-12 border-b border-gray-300 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center mb-8'>
            <h2 className='text-3xl font-bold'>
              Přihlášení a informace o kurzu
            </h2>
          </div>
          <p>
            Skupiny Dr. ZDIV vede{" "}
            <a href='/' className='text-[#f5a623]'>
              Mgr.Adéla Pellarová
            </a>{" "}
            (DAMU).
          </p>
          <h3 className='text-xl font-semibold py-3'>
            Přihlášení do Dr. ZDIV:
          </h3>
          <p>
            U Adély Pellarové na tel.: 777 076 901 nebo emailem
            divadelier@divadelier.cz získáte odpovědi na všechny Vaše další
            případné dotazy a obdržíte zde i přihlášku nebo si ji můžete
            stáhnout zde.
          </p>
          <div className='flex flex-row gap-4 my-3'>
            <a
              onClick={() => handleDownload()}
              className='flex flex-row gap-1 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 transition cursor-pointer'
            >
              Stáhnout přihlášku
              <DownloadIcon size={20} />
            </a>
          </div>
          <p>Kurzovné činí 1700,-Kč za pololetí.</p>
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
          {loadingNews ? (
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          ) : (
            news.map((n, index) => (
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
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DrZdivPage;
