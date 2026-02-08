import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function CourseInquiryModal({
  open,
  onClose,
  courseTitle,
  onSubmit,
}) {
  const panelRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
          'input, textarea, button, [tabindex]:not([tabindex="-1"])',
        );
        first?.focus?.();
      }
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Nezávazná poptávka kurzu"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Zavřít dialog"
        onClick={() => onClose?.()}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-100"
        >
          <div className="flex items-start justify-between gap-4 p-5 border-b">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900">
                Nezávazná poptávka
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {courseTitle ? (
                  <>
                    Vybraný kurz:{" "}
                    <span className="font-semibold">{courseTitle}</span>
                  </>
                ) : (
                  "Vyberte kurz a napište nám."
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClose?.()}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Zavřít"
              disabled={submitting}
            >
              <X size={18} />
            </button>
          </div>

          <form
            className="p-5 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();

              if (submitting) {
                return;
              }

              const fd = new FormData(e.currentTarget);

              const payload = {
                courseTitle: String(courseTitle || fd.get("courseTitle") || ""),
                name: String(fd.get("name") || "").trim(),
                email: String(fd.get("email") || "").trim(),
                phone: String(fd.get("phone") || "").trim(),
                message: String(fd.get("message") || "").trim(),
              };

              setSubmitting(true);
              try {
                await onSubmit?.(payload);
                onClose?.();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <input
              name="courseTitle"
              type="text"
              value={courseTitle || ""}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-50"
              placeholder="Vybraný kurz"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="name"
                type="text"
                required
                placeholder="Vaše jméno"
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefon (nepovinné)"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Váš e-mail"
              className="w-full border rounded-lg px-4 py-2"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="Zpráva (nepovinné)"
              className="w-full border rounded-lg px-4 py-2"
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="px-5 py-2 rounded-full border bg-white hover:bg-gray-50 disabled:opacity-50"
                disabled={submitting}
              >
                Zrušit
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-full bg-[#f5a623] text-white font-semibold shadow hover:shadow-md hover:scale-[1.01] transition disabled:opacity-50"
              >
                {submitting ? "Odesílám…" : "Odeslat"}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Odesláním souhlasíte se zpracováním údajů za účelem kontaktování
              ohledně kurzu.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
