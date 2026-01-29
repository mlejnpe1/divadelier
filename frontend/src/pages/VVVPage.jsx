import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/layout/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { CalendarSearchIcon, Megaphone, Plus } from "lucide-react";
import Section from "../components/layout/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import ExhibitionCarousel from "../components/exhibitions/ExhibitionCarousel.jsx";
import toast from "react-hot-toast";
import { toastAction } from "../utils/toastAction.jsx";
import { confirmToast } from "../utils/confirmToast.jsx";
import { apiFetch } from "../utils/api.js";
import ExhibitionForm from "../components/exhibitions/ExhibitionForm.jsx";
import ExhibitionList from "../components/exhibitions/ExhibitionList.jsx";
import ListToolbar from "../components/layout/ListToolbar.jsx";
import Pagination from "../components/layout/Pagiantion.jsx";
import { useListControls } from "../hooks/useListControls.jsx";

const EMPTY_EXHIBITION_DRAFT = {
  title: "",
  information: "",
  date: "",
  coverImage: { url: "", alt: "" },
  images: [],
  author: { name: "", bio: "", photo: "", website: "" },
};

const VVVPage = () => {
  const [featuredExhibition, setFeaturedExhibition] = useState(null);
  const [loadingFeaturedExhibition, setLoadingFeaturedExhibition] =
    useState(true);

  const refreshFeaturedExhibition = async () => {
    setLoadingFeaturedExhibition(true);
    try {
      const featured = await apiFetch("/api/exhibitions/featured");
      setFeaturedExhibition(featured);
    } catch (e) {
      if (String(e.message).includes("404")) setFeaturedExhibition(null);
      else console.error(e);
    } finally {
      setLoadingFeaturedExhibition(false);
    }
  };

  const { data: exhibitionsData, loading: exhibitionsLoading } =
    useFetch("/api/exhibitions");

  const { user } = useAuth();
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    refreshFeaturedExhibition();

    if (exhibitionsData) setExhibitions(exhibitionsData);
  }, [exhibitionsData]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const carouselExhibitions = useMemo(() => {
    const arr = Array.isArray(exhibitions) ? [...exhibitions] : [];

    const upcoming = arr
      .filter((e) => e?.date && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcoming.length === 0) {
      return arr
        .filter((e) => e?.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
    }

    return upcoming.slice(0, 6);
  }, [exhibitions]);

  const exhibitionControls = useListControls(exhibitions, {
    pageSize: 5,
    getSortValue: (e) => new Date(e.date || 0),
    searchFields: [(e) => e.title, (e) => e.information, (e) => e.author?.name],
  });

  const [editingExhibitionId, setEditingExhibitionId] = useState(null);
  const [draftExhibition, setDraftExhibition] = useState(
    EMPTY_EXHIBITION_DRAFT,
  );
  const [creatingExhibition, setCreatingExhibition] = useState(false);
  const [showCreateExhibition, setShowCreateExhibition] = useState(false);

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
      coverImage: {
        url: exh.coverImage?.url || "",
        alt: exh.coverImage?.alt || "",
      },
      images: Array.isArray(exh.images) ? exh.images : [],
      author: {
        name: exh.author?.name || "",
        bio: exh.author?.bio || "",
        photo: exh.author?.photo || "",
        website: exh.author?.website || "",
      },
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
      },
    );

    setExhibitions((prev) => prev.filter((e) => e._id !== id));

    if (editingExhibitionId === id) closeForm();

    await refreshFeaturedExhibition();
    exhibitionControls.resetControls();
  };

  function validateExhibitionDraft(draft) {
    if (!draft.title?.trim()) return "Zadej název výstavy.";
    if (!draft.information?.trim()) return "Zadej popis výstavy.";
    if (!draft.date) return "Zadej datum výstavy.";

    if (!draft.coverImage?.url?.trim()) {
      return "Úvodní (titulní) fotka je povinná.";
    }

    const invalidImage = draft.images.find((img) => !img?.url?.trim());
    if (invalidImage) {
      return "Každá fotografie musí mít vyplněnou URL.";
    }

    return null;
  }

  const handleSaveExhibition = async (e) => {
    e?.preventDefault?.();

    const error = validateExhibitionDraft(draftExhibition);
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      title: draftExhibition.title.trim(),
      information: draftExhibition.information.trim(),
      date: draftExhibition.date,

      coverImage: {
        url: draftExhibition.coverImage.url.trim(),
        alt: draftExhibition.coverImage.alt?.trim() || "",
      },

      images: draftExhibition.images.map((img) => ({
        url: img.url.trim(),
        alt: img.alt?.trim() || "",
      })),

      author: draftExhibition.author || {},
    };

    console.log(payload);

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
              body: payload,
            },
          ),
        {
          loading: isEdit ? "Ukládám změny..." : "Přidávám výstavu...",
          success: isEdit ? "Výstava aktualizována." : "Výstava přidána.",
          error: isEdit
            ? "Chyba při ukládání."
            : "Nepodařilo se přidat výstavu.",
        },
      );

      setExhibitions((prev) =>
        isEdit
          ? prev.map((x) => (x._id === saved._id ? saved : x))
          : [saved, ...prev],
      );

      closeForm();

      await refreshFeaturedExhibition();
    } finally {
      setCreatingExhibition(false);
    }

    exhibitionControls.resetControls();
  };

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const handleImages = () => {
    const url = newImageUrl.trim();
    const alt = newImageAlt.trim();

    if (!url) return toast.error("Zadej URL obrázku.");

    setDraftExhibition((d) => ({
      ...d,
      images: [...(d.images || []), { url, alt }],
    }));

    setNewImageUrl("");
    setNewImageAlt("");
  };

  useEffect(() => {
    if (window.location.hash === "#fullExhibitionPlan") {
      requestAnimationFrame(() => {
        document
          .getElementById("fullExhibitionPlan")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, []);

  return (
    <>
      <Hero
        title="VVV – Výstavy ve výloze"
        subtitle="Aktuální výstava na dosah"
        description="Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán výstav a možnost zakoupení obrazů."
      >
        <div className="w-full max-w-3xl mx-auto mt-6">
          {loadingFeaturedExhibition ? (
            <div className="flex justify-center items-center h-64 md:h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
            </div>
          ) : (
            <img
              src={featuredExhibition?.coverImage?.url || Placeholder}
              alt={featuredExhibition?.title || "Aktuální výstava"}
              className="rounded-xl shadow-lg w-full object-cover h-64 md:h-96"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
      </Hero>

      <Section border={true}>
        <div className="flex items-center mb-8">
          <CalendarSearchIcon className="w-8 h-8 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">Následující výstavy</h2>
        </div>
        <ExhibitionCarousel
          items={carouselExhibitions}
          loading={exhibitionsLoading}
        />
      </Section>

      <Section border={true}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold mb-4">
              Máte zájem o nějaké dílo?
            </h2>
            <p className="text-gray-700 mb-6">
              Pokud vás zaujala některá z vystavených prací, můžete si ji
              zakoupit přímo z našeho e-shopu.
            </p>

            <a
              href="/eshop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300"
            >
              Přejít na e-shopu
            </a>
          </div>

          <div className="md:w-1/3 mt-6 md:mt-0">
            <img
              src={Placeholder}
              alt="Ukázka produktů z e-shopu"
              className="rounded-lg shadow-lg object-cover w-full h-48 md:h-64"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Section>

      <Section border={true}>
        <div className="flex items-center mb-8">
          <Megaphone className="w-8 h-8 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">Kontaktujte nás</h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast("Zatím není napojeno na API 🙂", { icon: "ℹ️" });
            }}
          >
            <input
              type="text"
              placeholder="Vaše jméno"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
            <input
              type="email"
              placeholder="Váš email"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
            <textarea
              placeholder="Vaše zpráva"
              rows={4}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            />
            <button
              type="submit"
              className="mt-8 mx-auto bg-[#f5a623] text-white px-6 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transform transition duration-300"
            >
              Odeslat zprávu
            </button>
          </form>
        </div>
      </Section>

      <Section border={true}>
        <div className="flex justify-between items-center mb-6">
          <h2 id="fullExhibitionPlan" className="text-3xl font-bold">
            Kompletní výstavní plán
          </h2>
          {user && (
            <button
              onClick={openCreateExhibition}
              className="flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-105 transition"
            >
              <Plus size={18} />
              Přidat výstavu
            </button>
          )}
        </div>

        {user && showCreateExhibition && (
          <ExhibitionForm
            isEdit={Boolean(editingExhibitionId)}
            draft={draftExhibition}
            setDraft={setDraftExhibition}
            creating={creatingExhibition}
            onClose={closeForm}
            onSubmit={handleSaveExhibition}
            newImageUrl={newImageUrl}
            setNewImageUrl={setNewImageUrl}
            newImageAlt={newImageAlt}
            setNewImageAlt={setNewImageAlt}
            onAddImage={handleImages}
          />
        )}

        {exhibitionsLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
          </div>
        ) : exhibitions.length === 0 ? (
          <p className="text-gray-400">Žádné výstavy k zobrazení</p>
        ) : (
          <div className="space-y-6">
            <ListToolbar
              query={exhibitionControls.query}
              setQuery={exhibitionControls.setQuery}
              totalCount={exhibitionControls.totalCount}
              filteredCount={exhibitionControls.filteredCount}
            />

            <ExhibitionList
              exhibitions={exhibitionControls.items}
              loading={exhibitionsLoading}
              user={user}
              onEdit={openEditExhibition}
              onDelete={handleDeleteExhibition}
            />

            <Pagination
              page={exhibitionControls.page}
              pageCount={exhibitionControls.pageCount}
              onPageChange={exhibitionControls.setPage}
            />
          </div>
        )}
      </Section>
    </>
  );
};

export default VVVPage;
