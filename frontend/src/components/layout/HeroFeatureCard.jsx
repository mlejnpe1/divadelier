import React from "react";
import { ArrowDownRight } from "lucide-react";

export default function HeroFeatureCard({
  icon: Icon,
  title,
  text,
  onClick,
  as = "div",
  actionLabel,
  compact = false,
}) {
  const Component = as;
  const interactive = as === "button" || as === "a";

  return (
    <Component
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      className={`group rounded-[1.6rem] border border-white/24 bg-white/50 p-4 text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/66 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a623] ${interactive ? "cursor-pointer" : ""} ${compact ? "flex items-center gap-4" : ""}`}
    >
      {Icon ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[rgba(245,166,35,0.14)] text-[#c46f04] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <Icon size={20} aria-hidden="true" />
        </div>
      ) : null}

      <div className="min-w-0">
        <h3 className={`${compact ? "" : "mt-4"} text-lg font-semibold text-gray-900`}>{title}</h3>
        <p className={`${compact ? "mt-1 leading-5" : "mt-2 leading-7"} text-sm text-[#5f4a35]`}>{text}</p>
        {actionLabel && !compact ? (
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#9a590b]">
            {actionLabel} <ArrowDownRight size={16} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      {actionLabel && compact ? (
        <span className="ml-auto shrink-0 text-[#9a590b]">
          <span className="sr-only">{actionLabel}</span>
          <ArrowDownRight size={20} aria-hidden="true" />
        </span>
      ) : null}
    </Component>
  );
}
