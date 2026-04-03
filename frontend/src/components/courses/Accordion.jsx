import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[1.65rem] border border-[#ffd799]/25 bg-[linear-gradient(145deg,rgba(255,248,236,0.8),rgba(255,234,196,0.44))] shadow-[0_18px_44px_rgba(95,47,0,0.08)] backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/18"
      >
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#9a590b]">
            Profil
          </p>
          <div className="mt-2 text-lg font-semibold text-gray-900">{title}</div>
        </div>
        <ChevronDown
          size={20}
          className={
            "flex-shrink-0 text-[#8a5a11] transition " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open ? (
        <div className="border-t border-white/25 px-5 pb-5 pt-4 text-[#5f4a35]">
          {children}
        </div>
      ) : null}
    </div>
  );
}
