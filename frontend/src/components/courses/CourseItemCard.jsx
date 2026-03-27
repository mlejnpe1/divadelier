import React from "react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Button from "../layout/Button";

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
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {meta ? <p className="mt-1 text-sm text-gray-500">{meta}</p> : null}
        </div>

        {price ? (
          <div className="shrink-0 text-right">
            <div className="text-sm text-gray-500">Cena</div>
            <div className="text-lg font-semibold text-gray-900">{price}</div>
          </div>
        ) : null}
      </div>

      <p className="leading-relaxed text-gray-700">{description}</p>

      {badges.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-sm text-gray-700"
            >
              <BadgeCheck size={16} />
              {b}
            </span>
          ))}
        </div>
      ) : null}

      {onCtaClick ? (
        <div className="pt-2">
          <Button type="button" onClick={onCtaClick}>
            {ctaText}
            <ArrowUpRight size={18} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
