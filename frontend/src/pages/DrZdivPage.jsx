import React, { useEffect, useState } from "react";
import Hero from "../components/layout/Hero";
import Section from "../components/layout/Section";
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
import MeetingsList from "../components/meetings/MeetingsList";
import MeetingForm from "../components/meetings/MeetingForm";
import NewsForm from "../components/news/NewsForm";
import NewsList from "../components/news/NewsList";
import { useListControls } from "../hooks/useListControls";
import ListToolbar from "../components/layout/ListToolbar";
import Pagination from "../components/layout/Pagiantion";
import ScrollHint from "../components/layout/ScrollHint";

const EMPTY_MEETING_DRAFT = { title: "", information: "", day_in_week: "" };

const DrZdivPage = () => {
  const { data: nearestNewsData, loading: loadingNearestNews } =
    useFetch("/api/news/nearest");
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [nearestNews, setNearestNews] = useState(null);

  const openCreateNews = () => setShowNewsForm(true);
  const closeCreateNews = () => {
    setShowNewsForm(false);
    setNewsText("");
  };

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
  const newsControls = useListControls(news, {
    pageSize: 6,
    getSortValue: (n) => n.createdAt,
    searchFields: [(n) => n.information],
  });

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
        },
      );

      setNews((prev) => [created, ...prev]);
      setNewsText("");
      setNearestNews(created);
      setShowNewsForm(false);
      newsControls.setQuery("");
      newsControls.setPage(1);
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
    newsControls.setPage((p) =>
      Math.max(1, Math.min(p, newsControls.pageCount)),
    );

    if (nearestNews?._id === id) setNearestNews(null);
    await refreshNearestNews();
  };

  const { data: meetingsData, loading: loadingMeetings } =
    useFetch("/api/meetings");
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    if (Array.isArray(meetingsData)) setMeetings(meetingsData);
  }, [meetingsData]);

  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [creatingMeeting, setCreatingMeeting] = useState(false);
  const [draftMeeting, setDraftMeeting] = useState(EMPTY_MEETING_DRAFT);

  const isMeetingEdit = Boolean(editingMeetingId);

  const openCreateMeeting = () => {
    setEditingMeetingId(null);
    setDraftMeeting(EMPTY_MEETING_DRAFT);
    setShowMeetingForm(true);
  };

  const openEditMeeting = (m) => {
    setEditingMeetingId(m._id);
    setDraftMeeting({
      title: m.title || "",
      information: m.information || "",
      day_in_week: m.day_in_week || "",
    });
    setShowMeetingForm(true);
  };

  const closeMeetingForm = () => {
    setEditingMeetingId(null);
    setDraftMeeting(EMPTY_MEETING_DRAFT);
    setShowMeetingForm(false);
  };

  const validateMeetingDraft = (d) => {
    if (!d.title?.trim()) return "Zadej název schůzky.";
    if (!d.information?.trim()) return "Zadej informace.";
    if (!d.day_in_week?.trim()) return "Zadej den v týdnu.";
    return null;
  };

  const handleSaveMeeting = async (e) => {
    e?.preventDefault?.();

    const err = validateMeetingDraft(draftMeeting);
    if (err) return toast.error(err);

    const payload = {
      title: draftMeeting.title.trim(),
      information: draftMeeting.information.trim(),
      day_in_week: draftMeeting.day_in_week.trim(),
    };

    setCreatingMeeting(true);
    try {
      const saved = await toastAction(
        () =>
          apiFetch(
            isMeetingEdit
              ? `/api/meetings/${editingMeetingId}`
              : "/api/meetings",
            { method: isMeetingEdit ? "PUT" : "POST", body: payload },
          ),
        {
          loading: isMeetingEdit ? "Ukládám změny..." : "Přidávám schůzku...",
          success: isMeetingEdit
            ? "Schůzka aktualizována."
            : "Schůzka přidána.",
          error: isMeetingEdit
            ? "Chyba při ukládání."
            : "Nepodařilo se přidat schůzku.",
        },
      );

      setMeetings((prev) =>
        isMeetingEdit
          ? prev.map((m) => (m._id === saved._id ? saved : m))
          : [saved, ...prev],
      );

      closeMeetingForm();
    } finally {
      setCreatingMeeting(false);
    }
  };

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
      },
    );

    setMeetings((prev) => prev.filter((m) => m._id !== id));
    if (editingMeetingId === id) closeMeetingForm();
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
        title="Dr. ZDIV"
        subtitle="Dětské divadelní skupiny plné energie a hravosti."
        description="Přinášíme nové nápady a divadelní tvorbu pro všechny generace."
        buttonText="Rozpis skupin"
        onButtonClick={() => {
          const el = document.getElementById("groupsSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        children={
          loadingNearestNews ? (
            <div className="flex justify-center items-center bg-white rounded-xl shadow-lg p-6 max-w-sm w-full h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid"></div>
            </div>
          ) : nearestNews ? (
            <div
              className="bg-gradient-to-br from-white to-gray-50 
                rounded-2xl shadow-xl p-7 max-w-sm w-full 
                border border-gray-100 hover:shadow-2xl 
                flex flex-col justify-center items-start
                transition duration-300"
            >
              <div className="flex items-center mb-6">
                <div
                  className="flex items-center justify-center 
                    w-12 h-12 rounded-full 
                    bg-[#f5a623]/20 mr-4"
                >
                  <Megaphone className="w-7 h-7 text-[#f5a623]" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Aktualita
                </h2>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                {nearestNews.information}
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById("newsSection");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-auto bg-[#f5a623] text-white 
               px-6 py-3 rounded-xl font-semibold
               flex items-center justify-center gap-2 self-center
               hover:bg-[#e49415] transition-all duration-300"
              >
                Zobrazit všechny aktuality
              </button>
            </div>
          ) : (
            <p className="text-gray-400">Žádné aktuality k zobrazení</p>
          )
        }
      />
      <div className="relative">
        <ScrollHint variant="overlay" />
      </div>
      <Section border={true}>
        <div className="flex items-center mb-8">
          <Spotlight className="w-9 h-9 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">
            Objev v sobě herce s Dr. ZDIVem
          </h2>
        </div>
        {about.map((item, index) => (
          <motion.p
            key={index}
            className="text-gray-700 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {item.text}
          </motion.p>
        ))}
      </Section>
      <Section id="groupsSection" border={true}>
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-[#f5a623] mr-3" />
            <h2 className="text-3xl font-bold">Rozpis skupin</h2>
          </div>

          {user && (
            <button
              onClick={openCreateMeeting}
              className="flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition"
            >
              <Plus size={18} />
              Přidat schůzku
            </button>
          )}
        </div>

        {user && showMeetingForm && (
          <MeetingForm
            isEdit={isMeetingEdit}
            draft={draftMeeting}
            setDraft={setDraftMeeting}
            creating={creatingMeeting}
            onClose={closeMeetingForm}
            onSubmit={handleSaveMeeting}
          />
        )}

        {loadingMeetings ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
          </div>
        ) : (
          <MeetingsList
            meetings={meetings}
            user={user}
            onEdit={openEditMeeting}
            onDelete={handleDeleteMeeting}
          />
        )}
      </Section>

      <Section id="signin" border={true}>
        <div className="relative">
          <ScrollHint variant="overlay" target="signin" />
        </div>
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold">Přihlášení a informace o kurzu</h2>
        </div>
        <p>
          Skupiny Dr. ZDIV vede{" "}
          <a href="/" className="text-[#f5a623]">
            Mgr.Adéla Pellarová
          </a>{" "}
          (DAMU).
        </p>
        <h3 className="text-xl font-semibold py-3">Přihlášení do Dr. ZDIV:</h3>
        <p>
          U Adély Pellarové na tel.: 777 076 901 nebo emailem
          divadelier@divadelier.cz získáte odpovědi na všechny Vaše další
          případné dotazy a obdržíte zde i přihlášku nebo si ji můžete stáhnout
          zde.
        </p>
        <div className="flex flex-row gap-4 my-3">
          <a
            onClick={() => handleDownload()}
            className="flex flex-row gap-1 bg-orange-500 text-white px-3 py-2 rounded-full hover:bg-orange-600 transition cursor-pointer"
          >
            Stáhnout přihlášku
            <DownloadIcon size={20} />
          </a>
        </div>
        <p>Kurzovné činí 1700,-Kč za pololetí.</p>
      </Section>
      <Section id="newsSection">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Megaphone className="w-8 h-8 text-[#f5a623] mr-3" />
            <h2 className="text-3xl font-bold">Aktuality</h2>
          </div>

          {user && (
            <button
              onClick={openCreateNews}
              className="flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition"
            >
              <Plus size={18} />
              Přidat aktualitu
            </button>
          )}
        </div>

        {user && showNewsForm && (
          <NewsForm
            value={newsText}
            onChange={setNewsText}
            creating={creatingNews}
            onSubmit={handleCreateNews}
            onClose={closeCreateNews}
          />
        )}

        {loadingNews ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
        ) : (
          <>
            <ListToolbar
              query={newsControls.query}
              setQuery={newsControls.setQuery}
              totalCount={newsControls.totalCount}
              filteredCount={newsControls.filteredCount}
            />
            <NewsList
              news={[...newsControls.items].reverse()}
              user={user}
              onDelete={handleDeleteNews}
            />
            <Pagination
              page={newsControls.page}
              pageCount={newsControls.pageCount}
              onPageChange={newsControls.setPage}
            />
          </>
        )}
      </Section>
    </>
  );
};

export default DrZdivPage;
