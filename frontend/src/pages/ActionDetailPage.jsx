import React from "react";
import { useParams, Link } from "react-router";
import Section from "../components/layout/Section.jsx";
import Placeholder from "../assets/images/placeholder.png";
import { useFetch } from "../hooks/useFetch.jsx";
import { ArrowLeft } from "lucide-react";

const ActionDetailPage = () => {
  const { id } = useParams();
  const { data: action, loading } = useFetch(`/api/actions/${id}`);

  if (loading) {
    return (
      <Section border={true}>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#f5a623] border-solid" />
        </div>
      </Section>
    );
  }

  if (!action) {
    return (
      <Section border={true}>
        <p className="text-gray-500">Akce nebyla nalezena.</p>
        <Link to="/akce" className="text-[#f5a623] underline">
          Zpět na akce
        </Link>
      </Section>
    );
  }

  return (
    <Section border={false}>
      <Link
        to="/akce"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Zpět na akce
      </Link>

      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={action.coverImage?.url || Placeholder}
          alt={action.coverImage?.alt || action.title}
          className="w-full h-64 md:h-96 object-cover"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = Placeholder;
          }}
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold">{action.title}</h1>

          {action.date && (
            <p className="text-gray-500 mt-1">
              Datum: {new Date(action.date).toLocaleDateString("cs-CZ")}
            </p>
          )}

          {action.description && (
            <p className="text-gray-700 mt-4 whitespace-pre-line">
              {action.description}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
};

export default ActionDetailPage;
