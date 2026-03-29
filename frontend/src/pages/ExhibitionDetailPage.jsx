import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ArrowLeft, X } from "lucide-react";
import Section from "../components/layout/Section.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { useFetch } from "../hooks/useFetch.jsx";
import Gallery from "../components/layout/Gallery.jsx";
import Button from "../components/layout/Button.jsx";

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const { data: exh, loading } = useFetch(`/api/exhibitions/${id}`);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const formattedDate = exh?.date
    ? new Date(exh.date).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const galleryImages =
    Array.isArray(exh?.images) && exh.images.length > 0
      ? exh.images
      : [
          {
            url: Placeholder,
            alt: exh?.title
              ? `${exh.title} - placeholder galerie`
              : "Placeholder galerie",
          },
        ];

  useEffect(() => {
    if (!isCoverOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCoverOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isCoverOpen]);

  if (loading) {
    return (
      <Section border={false}>
        <div className="overflow-hidden rounded-[2rem] border border-white/45 bg-white/55 px-6 py-14 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex h-48 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
          </div>
        </div>
      </Section>
    );
  }

  if (!exh) {
    return (
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fbf6ef_0%,#f6efe6_42%,#ffffff_100%)]">
        <div className="pointer-events-none absolute -left-12 top-20 h-52 w-52 rounded-full bg-[#f5a623]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-white/50 blur-3xl" />

        <Section border={false}>
          <div className="overflow-hidden rounded-[2rem] border border-white/45 bg-white/60 px-6 py-14 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <p className="text-gray-500">Výstava nebyla nalezena.</p>
            <Button
              to="/vvv"
              variant="secondary"
              size="sm"
              className="mt-4 border-white/60 bg-white/70 backdrop-blur-md"
            >
              Zpět na výstavy
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fbf6ef_0%,#f7efe5_35%,#ffffff_100%)]">
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-[#f5a623]/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-80 w-80 rounded-full bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 left-1/3 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />

      <Section border={false}>
        <Button
          to="/vvv"
          variant="secondary"
          size="sm"
          className="border-white/60 bg-white/70 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <ArrowLeft size={18} />
          Zpět na výstavy
        </Button>

        <div className="mt-6 overflow-hidden rounded-[2.2rem] border border-white/45 bg-white/[0.38] shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="relative h-[300px] w-full overflow-hidden border-b border-white/20 bg-white/20 md:h-[425px] lg:h-[550px]">
            <img
              src={exh.coverImage?.url || Placeholder}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-45"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),rgba(15,23,42,0.16))]" />
            <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <img
              src={exh.coverImage?.url || Placeholder}
              alt={exh.coverImage?.alt || exh.title}
              className="relative h-full w-full object-contain p-2 md:p-4 lg:p-5"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-6 left-0 h-28 w-28 rounded-full bg-[#f5a623]/15 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-white/40 bg-white/35 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#8a5a11] backdrop-blur-md">
                  Výstava ve výloze
                </div>

                <button
                  type="button"
                  onClick={() => setIsCoverOpen(true)}
                  className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/55 px-4 py-2 text-sm font-medium text-gray-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/75"
                  aria-label="Zobrazit titulni obrazek pres celou obrazovku"
                >
                  Zvětšit obrázek
                </button>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                {exh.title}
              </h1>

              {formattedDate && (
                <div className="mt-5 inline-flex rounded-full border border-white/45 bg-white/45 px-4 py-2 text-sm font-medium text-gray-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
                  Datum: {formattedDate}
                </div>
              )}

              {exh.information && (
                <div className="mt-6 rounded-[1.6rem] border border-white/40 bg-white/30 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <p className="whitespace-pre-line text-[1.02rem] leading-8 text-gray-700">
                    {exh.information}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {(exh.author?.name ||
        exh.author?.bio ||
        exh.author?.photo ||
        exh.author?.website) && (
        <Section border={false}>
          <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/[0.34] p-6 shadow-[0_28px_70px_rgba(15,23,42,0.1)] backdrop-blur-2xl md:-mt-12 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#8a5a11]">
                  Medailon
                </p>
                <h2 className="text-2xl font-bold text-gray-900">Autor</h2>
              </div>
            </div>

            <div className="flex flex-col gap-6 rounded-[1.75rem] border border-white/35 bg-white/25 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:p-6">
              <div className="relative flex-shrink-0 self-start">
                <div className="absolute -inset-3 rounded-[1.6rem] bg-orange-200/35 blur-2xl" />
                <img
                  src={exh.author?.photo || Placeholder}
                  alt={exh.author?.name || "Autor"}
                  className="relative h-32 w-32 rounded-[1.4rem] border border-white/50 object-cover shadow-[0_18px_35px_rgba(15,23,42,0.12)]"
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                {exh.author?.name && (
                  <p className="text-xl font-semibold text-gray-900">
                    {exh.author.name}
                  </p>
                )}

                {exh.author?.bio && (
                  <p className="mt-3 whitespace-pre-line leading-8 text-gray-700">
                    {exh.author.bio}
                  </p>
                )}

                {exh.author?.website && (
                  <Button
                    href={exh.author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    className="mt-5 border-white/55 bg-white/60 backdrop-blur-md hover:bg-white/75"
                  >
                    Web autora
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      <section className="px-6 pb-20 pt-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Galerie
          </h2>
          <Gallery images={galleryImages} />
        </div>
      </section>

      {isCoverOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/84 p-4 backdrop-blur-xl md:p-8"
          onClick={() => setIsCoverOpen(false)}
        >
          <div
            className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-orange-200/20 blur-3xl" />
            <div className="pointer-events-none absolute right-6 top-4 h-32 w-32 rounded-full bg-white/14 blur-3xl" />

            <div className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#f5a623]">
                  {exh.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCoverOpen(false)}
                aria-label="Zavřít náhled obrázku"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:bg-white/18"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex justify-center px-4 py-5 sm:px-6 sm:py-6">
              <div className="relative w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <img
                  src={exh.coverImage?.url || Placeholder}
                  alt={exh.coverImage?.alt || exh.title}
                  className="max-h-[78vh] w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitionDetailPage;
