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
        "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full " +
        "border border-white/42 bg-[linear-gradient(145deg,rgba(255,247,226,0.97),rgba(245,166,35,0.62))] " +
        "shadow-[0_24px_50px_rgba(60,28,0,0.32)] backdrop-blur-xl " +
        "transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[linear-gradient(145deg,rgba(255,247,230,1),rgba(245,166,35,0.72))] " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5a623]"
      }
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.52),transparent_55%)]" />
      <span className="pointer-events-none absolute -bottom-2 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-[#f5a623]/34 blur-xl" />
      <ArrowUp
        size={18}
        className="relative text-[#4a2c14]"
        strokeWidth={2.4}
      />
    </button>
  );
}
