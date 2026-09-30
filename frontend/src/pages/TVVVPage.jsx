import { useEffect, useState } from "react";
import { Mic2, Theater, Tv } from "lucide-react";
import Hero from "../components/layout/Hero.jsx";
import HeroFeatureCard from "../components/layout/HeroFeatureCard.jsx";
import HeroFeaturePanel from "../components/layout/HeroFeaturePanel.jsx";
import Section from "../components/layout/Section.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { useAuth } from "../hooks/useAuth.js";
import LatestYoutubeVideoPanel from "../components/specials/LatestYoutubeVideoPanel.jsx";
import PlaylistArchive from "../components/specials/PlaylistArchive.jsx";
import PlaylistPreview from "../components/specials/PlaylistPreview.jsx";

const POETRYCAST_PLAYLIST_ID = "PLguhGFa3IXO_FMOcm71QJWcNXIL3Cww2W";
const EMPTY_PLAYLIST = [];
const TV_SECTIONS = [
  {
    id: "newsSection",
    icon: Theater,
    title: "Novinky z výlohy",
    shortTitle: "Novinky",
    text: "Co se právě děje v Divadeliéru.",
  },
  {
    id: "specialsSection",
    icon: Tv,
    title: "Speciály z Divadeliéru",
    shortTitle: "Rozhovory",
    text: "Rozhovory s hosty a záznamy.",
  },
  {
    id: "poetrycastsSection",
    icon: Mic2,
    title: "PoetryCasty",
    shortTitle: "PoetryCasty",
    text: "Všechny díly PoetryCastů.",
  },
];

function scrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = window.scrollY + target.getBoundingClientRect().top - 144;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
}

export default function TVVVPage() {
  const [activeSection, setActiveSection] = useState(TV_SECTIONS[0].id);

  useEffect(() => {
    const updateActiveSection = () => {
      const current = [...TV_SECTIONS]
        .reverse()
        .find(({ id }) => document.getElementById(id)?.getBoundingClientRect().top <= 170);
      setActiveSection(current?.id || TV_SECTIONS[0].id);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  const { data: newsData, loading: newsLoading } = useFetch(
    "/api/youtube/latest-playlist-video",
  );
  const {
    data: specialData,
    loading: specialLoading,
    error: specialError,
  } = useFetch("/api/youtube/special-playlist");
  const {
    data: poetrycastData,
    loading: poetrycastLoading,
    error: poetrycastError,
  } = useFetch("/api/youtube/poetrycast-playlist");
  const { user } = useAuth();

  const specials = specialData?.items || EMPTY_PLAYLIST;
  const poetrycasts = poetrycastData?.items || EMPTY_PLAYLIST;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Hero
        title="TV VV"
        subtitle="Televize ve výloze"
        description="Vyberte si pořad a pusťte si videa z Divadeliéru."
        children={
          <nav aria-label="Vybrat pořad TV VV">
            <HeroFeaturePanel
              eyebrow="Pořady TV VV"
              title="Vyberte pořad"
              items={TV_SECTIONS}
              columnsClassName="grid-cols-1"
              renderItem={(section) => (
                <HeroFeatureCard
                  as="button"
                  onClick={() => scrollTo(section.id)}
                  icon={section.icon}
                  title={section.title}
                  text={section.text}
                  actionLabel="Přejít na videa"
                  compact
                />
              )}
            />
          </nav>
        }
      />

      <nav
        aria-label="Sekce TV VV"
        className="sticky top-16 z-40 border-b border-[#ffd799]/30 bg-white/95 px-3 shadow-sm backdrop-blur-xl md:px-12"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-1">
          {TV_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              aria-current={activeSection === section.id ? "location" : undefined}
              className={`border-b-2 px-2 py-4 text-center text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#f5a623] sm:text-sm ${
                activeSection === section.id
                  ? "border-[#f5a623] text-[#9a590b]"
                  : "border-transparent text-[#5f4126] hover:bg-[#fff1d9]"
              }`}
            >
              <span className="sm:hidden">{section.shortTitle}</span>
              <span className="hidden sm:inline">{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      <Section id="newsSection" border compact>
        <div className="mb-6 flex items-center gap-3">
          <Theater className="h-8 w-8 text-[#f5a623]" aria-hidden="true" />
          <div>
            <h2 className="text-3xl font-bold text-[#3d2514]">Novinky z výlohy</h2>
            <p className="mt-1 text-sm text-[#6b4b2b] md:text-base">
              Nejnovější video z Divadeliéru.
            </p>
          </div>
        </div>
        <LatestYoutubeVideoPanel
          key={newsData?.video?.videoId || "empty"}
          video={newsData?.video || null}
          loading={newsLoading}
          details={newsData?.details}
          user={user}
          badge="Novinky z výlohy"
          heading="Poslední video"
          kind="news"
        />
      </Section>

      <Section id="specialsSection" border compact>
        <div className="mb-7 flex items-center gap-3">
          <Tv className="h-8 w-8 text-[#f5a623]" aria-hidden="true" />
          <div>
            <h2 className="text-3xl font-bold text-[#3d2514]">
              Speciály z Divadeliéru
            </h2>
            <p className="mt-1 text-sm text-[#6b4b2b] md:text-base">
              Rozhovory a záznamy se automaticky načítají z playlistu TV VV.
            </p>
          </div>
        </div>
        <PlaylistArchive
          items={specials}
          loading={specialLoading}
          error={specialError}
          kind="special"
          emptyMessage="V playlistu zatím nejsou žádné veřejné speciály."
        />
      </Section>

      <Section id="poetrycastsSection" compact>
        <div className="mb-7 flex items-center gap-3">
          <Mic2 className="h-8 w-8 text-[#f5a623]" aria-hidden="true" />
          <div>
            <h2 className="text-3xl font-bold text-[#3d2514]">PoetryCasty</h2>
            <p className="mt-1 text-sm text-[#6b4b2b] md:text-base">
              Všechny díly se automaticky načítají z playlistu Divadeliéru.
            </p>
          </div>
        </div>
        <PlaylistPreview
          video={poetrycasts[0]}
          playlistId={POETRYCAST_PLAYLIST_ID}
          title="PoetryCasty"
          heading="Celý playlist PoetryCastů"
        />
        <PlaylistArchive
          items={poetrycasts}
          loading={poetrycastLoading}
          error={poetrycastError}
          kind="poetrycast"
          emptyMessage="V playlistu zatím nejsou žádné veřejné díly."
        />
      </Section>
    </div>
  );
}
