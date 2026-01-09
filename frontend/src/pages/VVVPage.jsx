import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { motion } from "framer-motion";
import {
  CalendarSearchIcon,
  Megaphone,
  Edit2,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import Section from "../components/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import ExhibitionCarousel from "../components/ExhibitionCarousel.jsx";
import toast from "react-hot-toast";
import { toastAction } from "../utils/toastAction.jsx";
import { confirmToast } from "../utils/confirmToast.jsx";
import { apiFetch } from "../utils/api.js";

const EMPTY_EXHIBITION_DRAFT = { title: "", information: "", date: "" };

const VVVPage = () => {
  const { data: featuredExhibitionData, loading: loadingFeaturedExhibition } =
    useFetch("/api/exhibitions/featured");
  const [featuredExhibition, setFeaturedExhibition] = useState(null);

  useEffect(() => {
    if (featuredExhibitionData !== undefined) {
      setFeaturedExhibition(featuredExhibitionData);
    }
  }, [featuredExhibitionData]);

  const refreshFeaturedExhibition = async () => {
    try {
      setFeaturedExhibition(useFetch("/api/exhibitions/featured"));
    } catch (e) {
      if (String(e.message).includes("404")) setFeaturedExhibition(null);
      else console.error(e);
    }
  };

  const { data: exhibitionsData, loading: exhibitionsLoading } =
    useFetch("/api/exhibitions");

  const { user } = useAuth();

  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    if (exhibitionsData) setExhibitions(exhibitionsData);
  }, [exhibitionsData]);

  const [editingExhibitionId, setEditingExhibitionId] = useState(null);
  const [draftExhibition, setDraftExhibition] = useState(
    EMPTY_EXHIBITION_DRAFT
  );
  const [creatingExhibition, setCreatingExhibition] = useState(false);
  const [showCreateExhibition, setShowCreateExhibition] = useState(false);

  const isFormEdit = Boolean(editingExhibitionId);

  const resetDraftExhibition = () => setDraftExhibition(EMPTY_EXHIBITION_DRAFT);

  const scrollToPlan = () => {
    requestAnimationFrame(() => {
      document
        .getElementById("fullExhibitionPlan")
        ?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const openCreateExhibition = () => {
    setEditingExhibitionId(null);
    resetDraftExhibition();
    setShowCreateExhibition(true);
    scrollToPlan();
  };

  const openEditExhibition = (exh) => {
    setEditingExhibitionId(exh._id);
    setDraftExhibition({
      title: exh.title || "",
      information: exh.information || "",
      date: exh.date ? new Date(exh.date).toISOString().slice(0, 10) : "",
    });
    setShowCreateExhibition(true);
    scrollToPlan();
  };

  const closeForm = () => {
    setEditingExhibitionId(null);
    resetDraftExhibition();
    setShowCreateExhibition(false);
  };

  const handleDeleteExhibition = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto výstavu?",
      description: "Tuto akci nelze vrátit zpět.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(
      () => apiFetch(`/api/exhibitions/${id}`, { method: "DELETE" }),
      {
        loading: "Mažu výstavu...",
        success: "Výstava smazána.",
        error: "Nepodařilo se smazat výstavu.",
      }
    );

    setExhibitions((prev) => prev.filter((e) => e._id !== id));

    if (editingExhibitionId === id) closeForm();

    await refreshFeaturedExhibition();
  };

  const handleSaveExhibition = async (e) => {
    e?.preventDefault?.();

    const title = draftExhibition.title.trim();
    const information = draftExhibition.information.trim();
    const date = (draftExhibition.date || "").trim();

    if (!title) return toast.error("Zadej název výstavy.");
    if (!information) return toast.error("Zadej informace.");
    if (!date) return toast.error("Zadej datum zahájení.");

    setCreatingExhibition(true);
    try {
      const isEdit = Boolean(editingExhibitionId);

      const saved = await toastAction(
        () =>
          apiFetch(
            isEdit
              ? `/api/exhibitions/${editingExhibitionId}`
              : "/api/exhibitions",
            {
              method: isEdit ? "PUT" : "POST",
              body: { title, information, date },
            }
          ),
        {
          loading: isEdit ? "Ukládám změny..." : "Přidávám výstavu...",
          success: isEdit ? "Výstava aktualizována." : "Výstava přidána.",
          error: isEdit
            ? "Chyba při ukládání."
            : "Nepodařilo se přidat výstavu.",
        }
      );

      setExhibitions((prev) =>
        isEdit
          ? prev.map((x) => (x._id === saved._id ? saved : x))
          : [saved, ...prev]
      );

      closeForm();

      await refreshFeaturedExhibition();
    } finally {
      setCreatingExhibition(false);
    }
  };

  const nextExhibitions = useMemo(() => exhibitions.slice(0, 6), [exhibitions]);

  return (
    <>
      <Hero
        title='VVV – Výstavy ve výloze'
        subtitle='Aktuální výstava na dosah'
        description='Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán výstav a možnost zakoupení obrazů.'
      >
        <div className='w-full max-w-3xl mx-auto mt-6'>
          {loadingFeaturedExhibition ? (
            <div className='flex justify-center items-center h-64 md:h-96'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid' />
            </div>
          ) : (
            <img
              src={featuredExhibition?.imageUrl || Placeholder}
              alt={featuredExhibition?.title || "Aktuální výstava"}
              className='rounded-xl shadow-lg w-full object-cover h-64 md:h-96'
              loading='eager'
              decoding='async'
            />
          )}
        </div>
      </Hero>

      <Section border={true}>
        <div className='flex items-center mb-8'>
          <CalendarSearchIcon className='w-8 h-8 text-[#f5a623] mr-3' />
          <h2 className='text-3xl font-bold'>Následující výstavy</h2>
        </div>
        <ExhibitionCarousel
          items={nextExhibitions}
          loading={exhibitionsLoading}
        />
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

            <a
              href='/eshop'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block mt-8 bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300'
            >
              Přejít na e-shopu
            </a>
          </div>

          <div className='md:w-1/3 mt-6 md:mt-0'>
            <img
              src={Placeholder}
              alt='Ukázka produktů z e-shopu'
              className='rounded-lg shadow-lg object-cover w-full h-48 md:h-64'
              loading='lazy'
              decoding='async'
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
              toast("Zatím není napojeno na API 🙂", { icon: "ℹ️" });
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
            <button
              onClick={openCreateExhibition}
              className='flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition'
            >
              <Plus size={18} />
              Přidat výstavu
            </button>
          )}
        </div>

        {user && showCreateExhibition && (
          <form
            onSubmit={handleSaveExhibition}
            className='bg-white rounded-xl shadow p-4 mb-6 space-y-3'
          >
            <div className='flex items-center justify-between gap-3'>
              <p className='font-semibold text-gray-900'>
                {isFormEdit ? "Upravit výstavu" : "Přidat výstavu"}
              </p>

              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={closeForm}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition'
                >
                  <X size={18} />
                  Zrušit
                </button>

                <button
                  type='submit'
                  disabled={creatingExhibition}
                  className='bg-[#f5a623] text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100'
                >
                  {creatingExhibition ? "Ukládám..." : "Uložit"}
                </button>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-3'>
              <input
                value={draftExhibition.title}
                onChange={(e) =>
                  setDraftExhibition((d) => ({ ...d, title: e.target.value }))
                }
                placeholder='Název'
                className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />

              <input
                type='date'
                value={draftExhibition.date}
                onChange={(e) =>
                  setDraftExhibition((d) => ({
                    ...d,
                    date: e.target.value,
                  }))
                }
                className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
              />
            </div>

            <textarea
              value={draftExhibition.information}
              onChange={(e) =>
                setDraftExhibition((d) => ({
                  ...d,
                  information: e.target.value,
                }))
              }
              rows={3}
              placeholder='Informace...'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]'
            />
          </form>
        )}

        {exhibitionsLoading ? (
          <div className='flex justify-center items-center h-48'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid' />
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
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className='bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start'
              >
                <img
                  src={exh.imageUrl || Placeholder}
                  alt={exh.title}
                  className='rounded-md w-full md:w-48 h-48 object-cover flex-shrink-0'
                  loading='lazy'
                  decoding='async'
                />
                <div className='flex-1'>
                  <h3 className='text-xl font-bold mb-2'>{exh.title}</h3>
                  <p className='text-gray-700 mb-1'>{exh.information}</p>
                  {exh.date && (
                    <p className='text-gray-400 text-sm'>
                      Od: {new Date(exh.date).toLocaleDateString("cs-CZ")}
                    </p>
                  )}

                  {user && (
                    <div className='mt-6 flex space-x-2'>
                      <Edit2
                        className='cursor-pointer text-blue-600 hover:bg-blue-200 rounded-md'
                        onClick={() => openEditExhibition(exh)}
                      />
                      <Trash2
                        className='cursor-pointer text-red-600 hover:bg-red-200 rounded-md'
                        onClick={() => handleDeleteExhibition(exh._id)}
                      />
                    </div>
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
