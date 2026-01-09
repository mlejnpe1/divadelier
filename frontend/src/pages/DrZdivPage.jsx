import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Section from "../components/Section";
import {
  Megaphone,
  Calendar,
  DownloadIcon,
  Spotlight,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import handleDownload from "../utils/handleDownload";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { confirmToast } from "../utils/confirmToast";
import { toastAction } from "../utils/toastAction";
import { apiFetch } from "../utils/api";

const EMPTY_MEETING_DRAFT = { title: "", information: "", day_in_week: "" };

const DrZdivPage = () => {
  const { data: nearestNewsData, loading: loadingNearestNews } =
    useFetch("/api/news/nearest");

  const [nearestNews, setNearestNews] = useState(null);

  useEffect(() => {
    if (nearestNewsData !== undefined) setNearestNews(nearestNewsData);
  }, [nearestNewsData]);

  const refreshNearestNews = async () => {
    try {
      setNearestNews(await apiFetch("/api/news/nearest"));
    } catch (e) {
      if (String(e.message).includes("404")) setNearestNews(null);
      else console.error(e);
    }
  };

  const { data: newsdata, loading: loadingNews } = useFetch("/api/news");

  const { user } = useAuth();

  const [news, setNews] = useState(newsdata || []);
  const [creatingNews, setCreatingNews] = useState(false);
  const [newsText, setNewsText] = useState("");

  useEffect(() => {
    if (newsdata) setNews(newsdata);
  }, [newsdata]);

  const handleCreateNews = async (e) => {
    e.preventDefault();

    const info = newsText.trim();
    if (!info) return toast.error("Zadej text aktuality.");

    setCreatingNews(true);
    try {
      const created = await toastAction(
        () =>
          apiFetch("/api/news", {
            method: "POST",
            body: { information: info },
          }),
        {
          loading: "Přidávám aktualitu...",
          success: "Aktualita přidána.",
          error: "Nepodařilo se přidat aktualitu.",
        }
      );

      setNews((prev) => [created, ...prev]);
      setNewsText("");
      setNearestNews(created);
    } finally {
      setCreatingNews(false);
    }
  };

  const handleDeleteNews = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto aktualitu?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(() => apiFetch(`/api/news/${id}`, { method: "DELETE" }), {
      loading: "Mažu aktualitu...",
      success: "Aktualita smazána.",
      error: "Nepodařilo se smazat aktualitu.",
    });

    setNews((prev) => prev.filter((n) => n._id !== id));

    if (nearestNews?._id === id) setNearestNews(null);
    await refreshNearestNews();
  };

  const { data: meetingsdata, loading: loadingMeetings } =
    useFetch("/api/meetings");

  const [meetings, setMeetings] = useState([]);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [draftMeeting, setDraftMeeting] = useState(EMPTY_MEETING_DRAFT);

  const [creatingMeeting, setCreatingMeeting] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);

  const resetDraftMeeting = () => setDraftMeeting(EMPTY_MEETING_DRAFT);

  const openCreateMeeting = () => {
    setEditingMeetingId(null);
    resetDraftMeeting();
    setShowCreateMeeting(true);
  };

  const openEditMeeting = (m) => {
    setEditingMeetingId(m._id);
    setDraftMeeting({
      title: m.title || "",
      information: m.information || "",
      day_in_week: m.day_in_week || "",
    });
    setShowCreateMeeting(true);
    requestAnimationFrame(() => {
      document
        .getElementById("groupsSection")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (meetingsdata) setMeetings(meetingsdata);
  }, [meetingsdata]);

  const handleDeleteMeeting = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto schůzku?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(
      () => apiFetch(`/api/meetings/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu schůzku...",
        success: "Schůzka smazána.",
        error: "Nepodařilo se smazat schůzku.",
      }
    );

    setMeetings((prev) => prev.filter((m) => m._id !== id));

    if (editingMeetingId === id) {
      setEditingMeetingId(null);
      resetDraftMeeting();
    }
  };

  const handleSaveMeeting = async (e) => {
    e?.preventDefault?.();

    const title = draftMeeting.title.trim();
    const information = draftMeeting.information.trim();
    const day_in_week = draftMeeting.day_in_week.trim();

    if (!title) return toast.error("Zadej název schůzky.");
    if (!information) return toast.error("Zadej informace.");
    if (!day_in_week) return toast.error("Zadej informaci o čase.");

    setCreatingMeeting(true);
    try {
      const isEdit = Boolean(editingMeetingId);

      const saved = await toastAction(
        () =>
          apiFetch(
            isEdit ? `/api/meetings/${editingMeetingId}` : "/api/meetings",
            {
              method: isEdit ? "PUT" : "POST",
              body: { title, information, day_in_week },
            }
          ),
        {
          loading: isEdit ? "Ukládám změny..." : "Přidávám schůzku...",
          success: isEdit ? "Schůzka aktualizována." : "Schůzka přidána.",
          error: isEdit
            ? "Chyba při ukládání."
            : "Nepodařilo se přidat schůzku.",
        }
      );

      setMeetings((prev) =>
        isEdit
          ? prev.map((m) => (m._id === saved._id ? saved : m))
          : [saved, ...prev]
      );

      setEditingMeetingId(null);
      resetDraftMeeting();
      setShowCreateMeeting(false);
    } finally {
      setCreatingMeeting(false);
    }
  };

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

  return (
    <>
      <Hero
        title='Dr. ZDIV'
        subtitle='Dětské divadelní skupiny plné energie a hravosti.'
        description='Přinášíme nové nápady a divadelní tvorbu pro všechny generace.'
        buttonText='Rozpis skupin'
        onButtonClick={() => {
          const el = document.getElementById("groupsSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        children={
          loadingNearestNews ? (
            <div className='flex justify-center items-center bg-white rounded-xl shadow-lg p-6 max-w-sm w-full h-48'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
            </div>
          ) : nearestNews ? (
            <div className='bg-white rounded-xl shadow-lg p-6 max-w-sm w-full h-'>
              <div className='flex items-center mb-8'>
                <Megaphone className='w-8 h-8 text-[#f5a623] mr-3' />
                <h2 className='text-3xl font-bold'>Aktualita</h2>
              </div>
              <p className='text-gray-700 mb-2'>{nearestNews.information}</p>
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
      <Section border={true}>
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
      </Section>
      <Section id='groupsSection' border={true}>
        <div className='flex items-center gap-2 mb-4'>
          <Calendar className='w-8 h-8 text-[#f5a623]' />
          <h2 className='text-3xl font-bold mr-4'>Rozpis skupin</h2>
          {user && (
            <button
              onClick={openCreateMeeting}
              className='flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition'
            >
              <Plus size={18} />
              Přidat schůzku
            </button>
          )}
        </div>

        {user && showCreateMeeting && (
          <form
            onSubmit={handleSaveMeeting}
            className='bg-white rounded-xl shadow p-4 mb-6 space-y-3'
          >
            <div className='flex items-center justify-between'>
              <p className='font-semibold text-gray-900'>
                {editingMeetingId ? "Upravit schůzku" : "Přidat schůzku"}
              </p>

              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => {
                    setEditingMeetingId(null);
                    resetDraftMeeting();
                    setShowCreateMeeting(false);
                  }}
                  className='px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition'
                >
                  Zrušit
                </button>

                <button
                  type='submit'
                  disabled={creatingMeeting}
                  className='bg-[#f5a623] text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100'
                >
                  {creatingMeeting ? "Ukládám..." : "Uložit"}
                </button>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-3'>
              <input
                value={draftMeeting.title}
                onChange={(e) =>
                  setDraftMeeting((d) => ({ ...d, title: e.target.value }))
                }
                placeholder='Název'
                className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />

              <input
                value={draftMeeting.day_in_week}
                onChange={(e) =>
                  setDraftMeeting((d) => ({
                    ...d,
                    day_in_week: e.target.value,
                  }))
                }
                placeholder='Čas schůzky (např. Pondělí od 14:00 do 15:00)'
                className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />
            </div>

            <textarea
              value={draftMeeting.information}
              onChange={(e) =>
                setDraftMeeting((d) => ({ ...d, information: e.target.value }))
              }
              rows={3}
              placeholder='Informace...'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
            />
          </form>
        )}

        <div className='grid gap-8 md:grid-cols-2'>
          {loadingMeetings ? (
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting._id}
                className='relative p-6 flex flex-col justify-end h-64 border-[#f5a623] border-solid border-2 rounded-lg bg-white'
              >
                <h3 className='text-xl md:text-2xl font-bold text-black'>
                  {meeting.title}
                </h3>
                <p className='text-black/90 text-sm md:text-base mt-1'>
                  {meeting.information}
                </p>
                <p className='text-black text-xs mt-2 italic'>
                  Kdy se scházíme: {meeting.day_in_week}
                </p>
                {user && (
                  <div className='mt-6 flex justify-end space-x-2'>
                    <Edit2
                      className='cursor-pointer text-blue-600 hover:bg-blue-200 rounded-md'
                      onClick={() => openEditMeeting(meeting)}
                    />
                    <Trash2
                      className='cursor-pointer text-red-600 hover:bg-red-200 rounded-md'
                      onClick={() => handleDeleteMeeting(meeting._id)}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Section>
      <Section border={true}>
        <div className='flex items-center mb-8'>
          <h2 className='text-3xl font-bold'>Přihlášení a informace o kurzu</h2>
        </div>
        <p>
          Skupiny Dr. ZDIV vede{" "}
          <a href='/' className='text-[#f5a623]'>
            Mgr.Adéla Pellarová
          </a>{" "}
          (DAMU).
        </p>
        <h3 className='text-xl font-semibold py-3'>Přihlášení do Dr. ZDIV:</h3>
        <p>
          U Adély Pellarové na tel.: 777 076 901 nebo emailem
          divadelier@divadelier.cz získáte odpovědi na všechny Vaše další
          případné dotazy a obdržíte zde i přihlášku nebo si ji můžete stáhnout
          zde.
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
      </Section>
      <Section>
        <div className='flex items-center mb-8'>
          <Megaphone className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Aktuality</h2>
        </div>
        <div className='space-y-6' id='newsSection'>
          {user && (
            <form
              onSubmit={handleCreateNews}
              className='bg-white rounded-xl shadow p-4 mb-6 space-y-3'
            >
              <div className='flex items-center justify-between'>
                <p className='font-semibold text-gray-900'>Přidat aktualitu</p>
                <button
                  type='submit'
                  disabled={creatingNews}
                  className='bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100'
                >
                  {creatingNews ? "Přidávám..." : "Přidat"}
                </button>
              </div>

              <textarea
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                rows={3}
                placeholder='Text aktuality...'
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />
            </form>
          )}
          {loadingNews ? (
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid'></div>
          ) : (
            news.map((n, index) => (
              <motion.div
                key={n._id}
                className='relative bg-white rounded-xl shadow p-6'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className='text-gray-700'>{n.information}</p>

                <div className='mt-3 flex items-center justify-between'>
                  <p className='text-sm text-gray-500'>
                    {new Date(n.createdAt).toLocaleDateString("cs-CZ")}
                  </p>

                  {user && (
                    <Trash2
                      className='cursor-pointer text-red-600 hover:bg-red-200 rounded-md'
                      onClick={() => handleDeleteNews(n._id)}
                    />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Section>
    </>
  );
};

export default DrZdivPage;
