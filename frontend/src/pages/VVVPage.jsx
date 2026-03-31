import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/layout/Hero.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { CalendarSearchIcon, Plus } from "lucide-react";
import Section from "../components/layout/Section.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import ExhibitionCarousel from "../components/exhibitions/ExhibitionCarousel.jsx";
import toast from "react-hot-toast";
import { toastAction } from "../utils/toastAction.jsx";
import { confirmToast } from "../utils/confirmToast.jsx";
import { apiFetch } from "../utils/api.js";
import ExhibitionFormModal from "../components/exhibitions/ExhibitionFormModal.jsx";
import ExhibitionList from "../components/exhibitions/ExhibitionList.jsx";
import ListToolbar from "../components/layout/ListToolbar.jsx";
import Pagination from "../components/layout/Pagiantion.jsx";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ContactSection from "../components/ContactSection.jsx";
import ScrollHint from "../components/layout/ScrollHint.jsx";
import Button from "../components/layout/Button.jsx";

const EMPTY_EXHIBITION_DRAFT = {
  title: "",
  information: "",
  date: "",
  coverImage: { url: "", alt: "", key: "" },
  images: [],
  author: {
    name: "",
    bio: "",
    photo: "",
    photoKey: "",
    websites: [{ url: "", description: "" }],
  },
};

function getExhibitionDisplayTitle(exhibition) {
  const title = String(exhibition?.title || "").trim();
  if (title) return title;

  const authorName = String(exhibition?.author?.name || "").trim();
  if (authorName) return `Vystava autora ${authorName}`;

  return "Vystava bez nazvu";
}

const VVVPage = () => {
  const currentYear = new Date(Date.now()).getFullYear();
  const { user } = useAuth();
  const [featuredExhibition, setFeaturedExhibition] = useState(null);
  const [loadingFeaturedExhibition, setLoadingFeaturedExhibition] =
    useState(true);
  const [selectedPlanYear, setSelectedPlanYear] = useState(currentYear);
  const [planQuery, setPlanQuery] = useState("");
  const [planRefresh, setPlanRefresh] = useState(0);
  const [editingExhibitionId, setEditingExhibitionId] = useState(null);
  const [draftExhibition, setDraftExhibition] = useState(
    EMPTY_EXHIBITION_DRAFT,
  );
  const [creatingExhibition, setCreatingExhibition] = useState(false);
  const [showCreateExhibition, setShowCreateExhibition] = useState(false);
  const [carouselRefresh, setCarouselRefresh] = useState(0);

  const debouncedPlanQuery = useDebouncedValue(planQuery, 300);

  const planUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("r", String(planRefresh));
    if (selectedPlanYear) {
      params.set("year", String(selectedPlanYear));
    }
    if (debouncedPlanQuery.trim()) {
      params.set("q", debouncedPlanQuery.trim());
    }
    return `/api/exhibitions?${params.toString()}`;
  }, [selectedPlanYear, debouncedPlanQuery, planRefresh]);

  const { data: planData, loading: planLoading } = useFetch(planUrl);
  const { data: carouselData, loading: carouselLoading } = useFetch(
    `/api/exhibitions/carousel?limit=6&r=${carouselRefresh}`,
  );

  useEffect(() => {
    if (
      !planLoading &&
      selectedPlanYear !== null &&
      Array.isArray(planData?.years) &&
      !planData.years.includes(selectedPlanYear)
    ) {
      setSelectedPlanYear(planData?.year ?? null);
    }
  }, [planData?.year, planData?.years, planLoading, selectedPlanYear]);

  const planYearItems = useMemo(() => {
    if (!Array.isArray(planData?.years)) return [];
    return planData.years.map((year) => ({
      value: year,
      label: String(year),
    }));
  }, [planData?.years]);

  const activePlanYear = selectedPlanYear ?? planData?.year ?? null;

  const refreshFeaturedExhibition = async () => {
    setLoadingFeaturedExhibition(true);
    try {
      const featured = await apiFetch("/api/exhibitions/featured");
      setFeaturedExhibition(featured);
    } catch (e) {
      if (String(e.message).includes("404")) {
        setFeaturedExhibition(null);
      } else {
        console.error(e);
      }
    } finally {
      setLoadingFeaturedExhibition(false);
    }
  };

  useEffect(() => {
    refreshFeaturedExhibition();
  }, []);

  const resetDraftExhibition = () => setDraftExhibition(EMPTY_EXHIBITION_DRAFT);

  const openCreateExhibition = () => {
    setEditingExhibitionId(null);
    resetDraftExhibition();
    setShowCreateExhibition(true);
  };

  const openEditExhibition = (exh) => {
    const authorWebsites = Array.isArray(exh.author?.websites)
      ? exh.author.websites
          .map((website) => {
            if (typeof website === "string") {
              return { url: String(website).trim(), description: "" };
            }

            return {
              url: String(website?.url || "").trim(),
              description: String(website?.description || "").trim(),
            };
          })
          .filter((website) => website.url)
      : [];
    const normalizedAuthorWebsites = authorWebsites.length
      ? authorWebsites
      : exh.author?.website
        ? [{ url: String(exh.author.website).trim(), description: "" }]
        : [{ url: "", description: "" }];

    setEditingExhibitionId(exh._id);
    setDraftExhibition({
      title: exh.title || "",
      information: exh.information || "",
      date: exh.date ? new Date(exh.date).toISOString().slice(0, 10) : "",
      coverImage: {
        url: exh.coverImage?.url || "",
        alt: exh.coverImage?.alt || "",
        key: exh.coverImage?.key || "",
      },
      images: Array.isArray(exh.images)
        ? exh.images.map((img) => ({
            url: img?.url || "",
            alt: img?.alt || "",
            key: img?.key || "",
          }))
        : [],
      author: {
        name: exh.author?.name || "",
        bio: exh.author?.bio || "",
        photo: exh.author?.photo || "",
        photoKey: exh.author?.photoKey || "",
        websites: normalizedAuthorWebsites,
      },
    });
    setShowCreateExhibition(true);
  };

  const closeForm = () => {
    setEditingExhibitionId(null);
    resetDraftExhibition();
    setShowCreateExhibition(false);
  };

  const handleDeleteExhibition = async (id) => {
    const ok = await confirmToast({
      message: "Opravdu chcete smazat tuto vystavu?",
      description: "Tuto akci nelze vratit zpet.",
      confirmText: "Smazat",
      danger: true,
    });
    if (!ok) return;

    await toastAction(
      () => apiFetch(`/api/exhibitions/${id}`, { method: "DELETE" }),
      {
        loading: "Mazu vystavu...",
        success: "Vystava smazana.",
        error: "Nepodarilo se smazat vystavu.",
      },
    );

    closeForm();
    await refreshFeaturedExhibition();
    setPlanQuery("");
    setSelectedPlanYear(currentYear);
    setPlanRefresh((x) => x + 1);
    setCarouselRefresh((x) => x + 1);
  };

  function validateExhibitionDraft(draft) {
    if (!draft.date) return "Zadej datum vystavy.";
    if (!draft.author?.name?.trim()) return "Zadej jmeno autora.";

    const invalidImage = draft.images.find((img) => !img?.url?.trim());
    if (invalidImage) {
      return "Nektera galerie fotka neni nahrana spravne.";
    }

    return null;
  }

  const handleSaveExhibition = async (e) => {
    e?.preventDefault?.();

    const error = validateExhibitionDraft(draftExhibition);
    if (error) {
      toast.error(error);
      return false;
    }

    const payload = {
      title: draftExhibition.title.trim(),
      information: draftExhibition.information.trim(),
      date: draftExhibition.date,
      coverImage: {
        url: draftExhibition.coverImage.url.trim(),
        alt: draftExhibition.coverImage.url.trim()
          ? draftExhibition.coverImage.alt?.trim() ||
            `${draftExhibition.title.trim()} - titulni fotka`
          : "",
        key: draftExhibition.coverImage.key?.trim() || "",
      },
      images: draftExhibition.images.map((img, index) => ({
        url: img.url.trim(),
        alt: img.alt?.trim() || `Fotka ${index + 1}`,
        key: img.key?.trim() || "",
      })),
      author: {
        ...(draftExhibition.author || {}),
        websites: (Array.isArray(draftExhibition.author?.websites)
          ? draftExhibition.author.websites
          : []
        )
          .map((website) => ({
            url: String(website?.url || "").trim(),
            description: String(website?.description || "").trim(),
          }))
          .filter((website) => website.url),
      },
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
          loading: isEdit ? "Ukladam zmeny..." : "Pridavam vystavu...",
          success: isEdit ? "Vystava aktualizovana." : "Vystava pridana.",
          error: isEdit
            ? "Chyba pri ukladani."
            : "Nepodarilo se pridat vystavu.",
        },
      );

      await refreshFeaturedExhibition();
      setPlanQuery("");
      setSelectedPlanYear(currentYear);
      setPlanRefresh((x) => x + 1);
      setCarouselRefresh((x) => x + 1);
      return true;
    } finally {
      setCreatingExhibition(false);
    }
  };

  return (
    <>
      <Hero
        title="VVV - Výstavy ve výloze"
        subtitle="Aktuální výstava na dosah"
        description="Prohlédněte si umělecká díla přímo z výlohy. Objevte novinky, plán vystav a možnost zakoupení obrazu."
        buttonText="Prohlédnout výstavní plán"
        onButtonClick={() => {
          const el = document.getElementById("exhibitionsSection");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        children={
          <div className="mx-auto mt-6 w-full max-w-3xl">
            <div className="mb-4 flex flex-row items-center gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-700">
                Aktuální výstava:
              </h2>
              {!loadingFeaturedExhibition && featuredExhibition ? (
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-700">
                  {getExhibitionDisplayTitle(featuredExhibition)}
                </h2>
              ) : null}
              {featuredExhibition?.date ? (
                <div className="rounded-full border border-white/60 bg-white/72 p-2 text-sm font-medium text-gray-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                  Od:{" "}
                  {new Date(featuredExhibition.date).toLocaleDateString(
                    "cs-CZ",
                  )}
                </div>
              ) : null}
            </div>

            {loadingFeaturedExhibition ? (
              <div className="flex h-64 items-center justify-center md:h-96">
                <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
              </div>
            ) : (
              <div className="relative h-64 overflow-hidden rounded-[1.8rem] border border-white/40 bg-white/35 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-md md:h-96">
                <img
                  src={featuredExhibition?.coverImage?.url || Placeholder}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),rgba(15,23,42,0.18))]" />
                <img
                  src={featuredExhibition?.coverImage?.url || Placeholder}
                  alt={
                    featuredExhibition?.coverImage?.alt ||
                    getExhibitionDisplayTitle(featuredExhibition)
                  }
                  className="relative h-full w-full object-contain p-4 md:p-6"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
          </div>
        }
      />

      <div className="relative">
        <ScrollHint variant="overlay" color="light" />
      </div>

      <Section border={true}>
        <div className="mb-8 flex items-center">
          <CalendarSearchIcon className="mr-3 h-8 w-8 text-[#f5a623]" />
          <h2 className="text-3xl font-bold">Následující výstavy</h2>
        </div>
        <ExhibitionCarousel
          items={carouselData?.items || []}
          loading={carouselLoading}
        />
      </Section>

      <Section border={true}>
        <div className="relative overflow-hidden rounded-[1.9rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-6 shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl md:p-8">
          <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-3xl" />
          <div className="relative flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between">
            <div className="rounded-[1.6rem] border border-[#ffd799]/24 bg-white/55 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm md:w-2/3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
                E-shop
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-gray-900">
                Máte zájem o nějaké dílo?
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-[#4a2c14]">
                Pokud Vás zaujala některá z vystavených prací, můžete si ji
                zakoupit přímo z našeho e-shopu.
              </p>

              <Button href="/eshop" className="mt-8">
                Přejit na e-shop
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#ffd799]/24 bg-[radial-gradient(circle_at_top,rgba(255,248,236,0.68),rgba(255,234,196,0.18))] md:w-1/3">
              <img
                src={Placeholder}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,236,0.18),rgba(95,47,0,0.12))]" />
              <img
                src={Placeholder}
                alt="Ukázka produktu z e-shopu"
                className="relative h-56 w-full object-contain p-4 md:h-64"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section border={true}>
        <ContactSection page="Výstavy ve výloze" />
      </Section>

      <Section border={true}>
        <div
          className="mb-6 flex items-center justify-between"
          id="exhibitionsSection"
        >
          <h2 id="fullExhibitionPlan" className="text-3xl font-bold">
            Kompletní výstavní plán
          </h2>
          {user && (
            <Button onClick={openCreateExhibition}>
              <Plus size={18} />
              Přidat výstavu
            </Button>
          )}
        </div>

        <ListToolbar
          query={planQuery}
          setQuery={(value) => {
            setSelectedPlanYear(currentYear);
            setPlanQuery(value);
          }}
        />

        <div className="relative">
          {planLoading && (
            <div className="absolute inset-0 z-10 flex items-start justify-end bg-white/60 p-2 backdrop-blur-[1px]">
              <span className="text-sm text-gray-500">Načítám...</span>
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
            page={activePlanYear}
            pageCount={planYearItems.length}
            items={planYearItems}
            itemTypeLabel="rok"
            onPageChange={(year) => setSelectedPlanYear(year)}
          />
        </div>
      </Section>

      {user && showCreateExhibition && (
        <ExhibitionFormModal
          isOpen={showCreateExhibition}
          modalKey={editingExhibitionId || "new-exhibition"}
          isEdit={Boolean(editingExhibitionId)}
          draft={draftExhibition}
          setDraft={setDraftExhibition}
          creating={creatingExhibition}
          onClose={closeForm}
          onSubmit={handleSaveExhibition}
        />
      )}
    </>
  );
};

export default VVVPage;
