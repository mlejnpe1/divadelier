import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const renderParagraph = (paragraph, idx) => {
  if (typeof paragraph === "string") {
    return <p key={idx}>{paragraph}</p>;
  }

  if (paragraph?.type === "linkLine") {
    return (
      <p key={idx}>
        {paragraph.before}
        <a
          href={paragraph.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c98512] underline underline-offset-2 hover:text-[#a96a08]"
        >
          {paragraph.label}
        </a>
        {paragraph.after}
      </p>
    );
  }

  return null;
};

const LegalModal = ({ open, onClose, legalDocument }) => {
  const panelRef = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const prevOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(() => {
      const el = panelRef.current;
      if (el) {
        const first = el.querySelector(
          'button, a, input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        first?.focus?.();
      }
    });

    return () => {
      window.document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !legalDocument) {
    return null;
  }

  const handleClose = () => {
    if (closing) {
      return;
    }

    setClosing(true);
    onClose?.();
    setTimeout(() => {
      setClosing(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="Zavřít dialog"
        onClick={handleClose}
        disabled={closing}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#ead7bb] bg-[linear-gradient(145deg,#fffaf4_0%,#f8efe2_52%,#fffdf9_100%)] shadow-[0_35px_100px_rgba(15,23,42,0.18)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#eadfce] px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8891c]">
                Informace
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#2f2417] sm:text-2xl">
                {legalDocument.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-full p-2 text-[#6a4a20] transition hover:bg-white/70 hover:text-[#2f2417]"
              aria-label="Zavřít"
              disabled={closing}
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            <div className="space-y-4">
              <p className="max-w-3xl text-sm leading-7 text-[#5e4b34] sm:text-base">
                {legalDocument.intro}
              </p>

              <div className="grid gap-4">
                {legalDocument.sections.map((section) => (
                  <article
                    key={section.title}
                    className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-[#2f2417]">
                      {section.title}
                    </h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-[#5e4b34] sm:text-base">
                      {section.paragraphs.map(renderParagraph)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LegalModal;
