import React from "react";
import { useParams, Link } from "react-router";
import Section from "../components/layout/Section.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { useFetch } from "../hooks/useFetch.jsx";
import { ArrowLeft } from "lucide-react";
import Gallery from "../components/layout/Gallery.jsx";

const ExhibitionDetailPage = () => {
  const { id } = useParams();
  const { data: exh, loading } = useFetch(`/api/exhibitions/${id}`);

  if (loading) {
    return (
      <Section border={true}>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
        </div>
      </Section>
    );
  }

  if (!exh) {
    return (
      <Section border={true}>
        <p className="text-gray-500">Výstava nebyla nalezena.</p>
        <Link to="/vvv" className="text-[#f5a623] underline">
          Zpět na výstavy
        </Link>
      </Section>
    );
  }

  return (
    <>
      <Section border={false}>
        <Link
          to="/vvv"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Zpět na výstavy
        </Link>

        <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={exh.coverImage?.url || Placeholder}
            alt={exh.coverImage?.alt || exh.title}
            className="w-full h-64 md:h-96 object-cover"
            loading="eager"
            decoding="async"
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold">{exh.title}</h1>
            {exh.date && (
              <p className="text-gray-500 mt-1">
                Datum: {new Date(exh.date).toLocaleDateString("cs-CZ")}
              </p>
            )}

            {exh.information && (
              <p className="text-gray-700 mt-4 whitespace-pre-line">
                {exh.information}
              </p>
            )}
          </div>
        </div>
      </Section>

      {(exh.author?.name ||
        exh.author?.bio ||
        exh.author?.photo ||
        exh.author?.website) && (
        <Section border={true}>
          <h2 className="text-2xl font-bold mb-4">Autor</h2>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
            <img
              src={exh.author?.photo || Placeholder}
              alt={exh.author?.name || "Autor"}
              className="w-32 h-32 rounded-xl object-cover flex-shrink-0 border"
              loading="lazy"
            />

            <div className="flex-1">
              {exh.author?.name && (
                <p className="text-xl font-semibold">{exh.author.name}</p>
              )}

              {exh.author?.bio && (
                <p className="text-gray-700 mt-2 whitespace-pre-line">
                  {exh.author.bio}
                </p>
              )}

              {exh.author?.website && (
                <a
                  href={exh.author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-[#f5a623] font-semibold hover:underline"
                >
                  Web autora
                </a>
              )}
            </div>
          </div>
        </Section>
      )}

      <Section border={true}>
        <h2 className="text-2xl font-bold mb-4">Galerie</h2>

        {Array.isArray(exh.images) && exh.images.length > 0 ? (
          <Gallery images={exh.images} />
        ) : (
          <p className="text-gray-500">Žádné fotky k zobrazení.</p>
        )}
      </Section>
    </>
  );
};

export default ExhibitionDetailPage;
