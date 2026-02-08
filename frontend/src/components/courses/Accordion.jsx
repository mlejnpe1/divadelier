import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <div className="font-semibold text-gray-900">{title}</div>
        <ChevronDown
          size={20}
          className={"transition " + (open ? "rotate-180" : "")}
        />
      </button>

      {open ? <div className="px-5 pb-5 text-gray-700">{children}</div> : null}
    </div>
  );
}
