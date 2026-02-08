import React from "react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";

export default function CourseItemCard({
  title,
  description,
  price,
  meta = "",
  badges = [],
  ctaText = "Mám zájem",
  onCtaClick,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {meta ? <p className="text-sm text-gray-500 mt-1">{meta}</p> : null}
        </div>

        {price ? (
          <div className="shrink-0 text-right">
            <div className="text-sm text-gray-500">Cena</div>
            <div className="text-lg font-semibold text-gray-900">{price}</div>
          </div>
        ) : null}
      </div>

      <p className="text-gray-700 leading-relaxed">{description}</p>

      {badges.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-100"
            >
              <BadgeCheck size={16} />
              {b}
            </span>
          ))}
        </div>
      ) : null}

      {onCtaClick ? (
        <div className="pt-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 bg-[#f5a623] text-white px-4 py-2 rounded-full font-semibold shadow hover:shadow-md hover:scale-[1.02] transition"
          >
            {ctaText}
          </button>
        </div>
      ) : null}
    </div>
  );
}
