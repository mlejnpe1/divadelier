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
  accent = "warm",
}) {
  const accentClassName =
    accent === "ivory"
      ? "border-[#e6d8c4]/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(249,244,236,0.76))]"
      : "border-[#ffd799]/28 bg-[linear-gradient(145deg,rgba(255,248,236,0.9),rgba(255,234,196,0.58))]";

  const badgeClassName =
    accent === "ivory"
      ? "border-[#e6d8c4]/70 bg-white/70 text-[#6d573d]"
      : "border-[#ffd799]/40 bg-[rgba(245,166,35,0.12)] text-[#8a4e08]";

  return (
    <article
      className={`group relative flex h-full flex-col gap-5 overflow-hidden rounded-[1.85rem] border p-6 shadow-[0_20px_52px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(15,23,42,0.12)] ${accentClassName}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#f5a623]/12 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          {meta ? (
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8a7158]">
              {meta}
            </p>
          ) : null}
          <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900">
            {title}
          </h3>
        </div>

        {price ? (
          <div className="shrink-0 rounded-full border border-white/55 bg-white/72 px-4 py-2 text-right shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a7158]">
              Cena
            </div>
            <div className="mt-1 text-base font-semibold text-gray-900">
              {price}
            </div>
          </div>
        ) : null}
      </div>

      <p className="relative leading-8 text-[#5f4a35]">{description}</p>

      {badges.length > 0 ? (
        <div className="relative flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md ${badgeClassName}`}
            >
              <BadgeCheck size={15} />
              {b}
            </span>
          ))}
        </div>
      ) : null}

      {onCtaClick ? (
        <div className="relative mt-auto pt-3">
          <Button type="button" onClick={onCtaClick}>
            {ctaText}
            <ArrowUpRight size={18} />
          </Button>
        </div>
      ) : null}
    </article>
  );
}
