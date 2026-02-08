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
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ContactSection from "../components/ContactSection.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";

const EMPTY_EXHIBITION_DRAFT = {
  title: "",
  information: "",
  date: "",
  coverImage: { url: "", alt: "" },
  images: [],
  author: { name: "", bio: "", photo: "", website: "" },
};

const VVVPage = () => {
  const { user } = useAuth();
  const [featuredExhibition, setFeaturedExhibition] = useState(null);
  const [loadingFeaturedExhibition, setLoadingFeaturedExhibition] =
    useState(true);
  const [planPage, setPlanPage] = useState(1);
  const [planQuery, setPlanQuery] = useState("");
  const planLimit = 5;
  const debouncedPlanQuery = useDebouncedValue(planQuery, 300);

  const planUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(planPage));
    params.set("limit", String(planLimit));
    if (debouncedPlanQuery.trim()) {
      params.set("q", debouncedPlanQuery.trim());
    }
    return `/api/exhibitions?${params.toString()}`;
  }, [planPage, planLimit, debouncedPlanQuery]);

  const { data: planData, loading: planLoading } = useFetch(planUrl);
  const [carouselRefresh, setCarouselRefresh] = useState(0);
  const { data: carouselData, loading: carouselLoading } = useFetch(
    `/api/exhibitions/carousel?limit=6&r=${carouselRefresh}`,
  );

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

  useEffect(() => {
    refreshFeaturedExhibition();
  }, []);

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

    closeForm();
    await refreshFeaturedExhibition();
    setPlanQuery("");
    setPlanPage(1);
    setCarouselRefresh((x) => x + 1);
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

    setCreatingExhibition(true);
    try {
      const isEdit = Boolean(editingExhibitionId);

      await toastAction(
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

      closeForm();

      await refreshFeaturedExhibition();
      setPlanQuery("");
      setPlanPage(1);
      setCarouselRefresh((x) => x + 1);
    } finally {
      setCreatingExhibition(false);
    }
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
        children={
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
        }
      />
      <div className="relative">
        <ScrollHint variant="overlay" />
      </div>
      <Section border={true}>
        <div className="flex items-center mb-8">
          <CalendarSearchIcon className="w-8 h-8 text-[#f5a623] mr-3" />
          <h2 className="text-3xl font-bold">Následující výstavy</h2>
        </div>
        <ExhibitionCarousel
          items={carouselData?.items || []}
          loading={carouselLoading}
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
        <ContactSection page="Výstavy ve výloze" />
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

        <ListToolbar
          query={planQuery}
          setQuery={(v) => {
            setPlanPage(1);
            setPlanQuery(v);
          }}
        />

        <div className="relative">
          {planLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-start justify-end p-2 z-10">
              <span className="text-sm text-gray-500">Načítám…</span>
            </div>
          )}

          <ExhibitionList
            exhibitions={planData?.items || []}
            loading={planLoading}
            user={user}
            onEdit={openEditExhibition}
            onDelete={handleDeleteExhibition}
          />

          <Pagination
            page={planData?.page ?? planPage}
            pageCount={planData?.pageCount || 1}
            onPageChange={(p) => setPlanPage(p)}
          />
        </div>
      </Section>
    </>
  );
};

export default VVVPage;
