import React from "react";

export default function HeroGlassPanel({
  title,
  children,
  headerSlot = null,
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/28 shadow-[0_30px_84px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/24 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#f5a623]/16 blur-3xl" />

      <div className="relative border-b border-white/15 px-5 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {title}
            </h2>
          </div>

          {headerSlot}
        </div>
      </div>

      {children}
    </div>
  );
}
