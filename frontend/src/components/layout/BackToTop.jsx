import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop({ showAfter = 400 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > showAfter);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Zpět nahoru"
      className={
        "fixed bottom-6 right-6 z-50 " +
        "h-12 w-12 rounded-full " +
        "bg-white/90 backdrop-blur border shadow-lg " +
        "flex items-center justify-center " +
        "hover:scale-[1.03] transition " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623]"
      }
    >
      <ArrowUp size={18} className="text-gray-900" />
    </button>
  );
}
