import React from "react";
import { ChevronDown } from "lucide-react";

function resolveTarget(target) {
  if (!target) {
    return null;
  }

  // ref: { current: HTMLElement }
  if (typeof target === "object" && target.current) {
    return target.current;
  }

  // element directly
  if (typeof target === "object" && target.nodeType === 1) {
    return target;
  }

  // string: "#id" or ".class" or "section"
  if (typeof target === "string") {
    return document.querySelector(target);
  }

  return null;
}

export default function ScrollHint({
  target, // ref | HTMLElement | selector string ("#sectionId")
  offset = 0,
  scrollBy = 0,

  label = "Pokračovat níže",
  double = true,
  variant = "overlay", // "overlay" | "inline"
  className = "",
  iconClassName = "",
}) {
  const handleClick = () => {
    const el = resolveTarget(target);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      if (offset) {
        window.setTimeout(() => {
          window.scrollBy({ top: offset, behavior: "smooth" });
        }, 250);
      }
      return;
    }

    const by = Number(scrollBy || 0);
    if (by) {
      window.scrollBy({ top: by, behavior: "smooth" });
      return;
    }

    window.scrollBy({
      top: Math.round(window.innerHeight * 0.8),
      behavior: "smooth",
    });
  };

  const base =
    "select-none text-gray-700/80 hover:text-gray-900 transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623] rounded-xl";

  const overlayPos = "absolute left-1/2 -translate-x-1/2 bottom-6";

  const inlinePos = "inline-flex";

  const wrapper =
    variant === "overlay"
      ? `${base} ${overlayPos} flex flex-col items-center gap-1`
      : `${base} ${inlinePos} flex flex-col items-center gap-1`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`${wrapper} ${className}`}
    >
      {label ? (
        <span className="text-xs tracking-wide uppercase opacity-80">
          {label}
        </span>
      ) : null}

      <span className="relative h-8 w-8">
        <ChevronDown
          className={`absolute inset-0 motion-safe:animate-bounce motion-reduce:animate-none ${iconClassName}`}
        />
        {double ? (
          <ChevronDown
            className={`absolute inset-0 translate-y-3 opacity-60 motion-safe:animate-bounce motion-reduce:animate-none ${iconClassName}`}
          />
        ) : null}
      </span>
    </button>
  );
}
