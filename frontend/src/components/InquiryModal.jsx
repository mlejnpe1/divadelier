import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Button from "./layout/Button";

export default function InquiryModal({
  open,
  onClose,
  onSubmit,

  title = "Nezávazná poptávka",
  subtitle = "",

  contextLabel = "Téma",
  contextValue = "",
  contextType,
  initialMessage = "",
  summary = null,

  courseTitle = "",
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

  const effectiveContext = String(contextValue || courseTitle || "").trim();

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Zavřít dialog"
        onClick={() => {
          onClose?.();
        }}
        disabled={submitting}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          className="relative w-full max-w-xl rounded-[2rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(251,246,238,0.92))] shadow-[0_35px_100px_rgba(15,23,42,0.18)]"
        >
          <div className="flex items-start justify-between gap-4 border-b p-5">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>

              {subtitle ? (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              ) : null}

              {effectiveContext ? (
                <p className="mt-1 text-sm text-gray-600">
                  {contextLabel}:{" "}
                  <span className="font-semibold">{effectiveContext}</span>
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose?.();
              }}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
              aria-label="Zavřít"
              disabled={submitting}
            >
              <X size={18} />
            </button>
          </div>

          <form
            className="space-y-4 p-5"
            onSubmit={async (e) => {
              e.preventDefault();

              if (submitting) {
                return;
              }

              const fd = new FormData(e.currentTarget);

              const payload = {
                type: String(contextType || "general"),
                context: effectiveContext,
                name: String(fd.get("name") || "").trim(),
                email: String(fd.get("email") || "").trim(),
                phone: String(fd.get("phone") || "").trim(),
                message: String(fd.get("message") || "").trim(),
              };

              setSubmitting(true);
              try {
                await onSubmit?.(payload);
                onClose?.();
              } catch (err) {
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {summary ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-[#f2d5a9]/80 bg-[linear-gradient(145deg,rgba(255,250,241,0.96),rgba(255,241,214,0.76))] shadow-[0_16px_34px_rgba(138,79,8,0.08)]">
                <div className="grid gap-4 p-4 sm:grid-cols-[110px_minmax(0,1fr)] sm:p-5">
                  {summary.imageUrl ? (
                    <div className="overflow-hidden rounded-[1.2rem] border border-white/55 bg-white/70 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                      <img
                        src={summary.imageUrl}
                        alt={summary.imageAlt || summary.title || "Vybraný produkt"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[#9a590b]">
                      Vybraný produkt
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-gray-900">
                      {summary.title}
                    </h4>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {summary.price ? (
                        <span className="inline-flex rounded-full border border-white/60 bg-white/82 px-3 py-1.5 text-sm font-semibold text-[#5f4126] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                          {summary.price}
                        </span>
                      ) : null}
                      {summary.label ? (
                        <span className="inline-flex rounded-full border border-[#f0d6aa] bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a11]">
                          {summary.label}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {effectiveContext ? (
              <input
                name="context"
                type="text"
                value={effectiveContext}
                readOnly
                className="w-full rounded-xl border border-[#eadfce] bg-[#f8f4ee] px-4 py-3 text-[#5f4126]"
                placeholder={contextLabel}
              />
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                required
                placeholder="Vaše jméno"
                className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-[#4a2c14] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefon (nepovinné)"
                className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-[#4a2c14] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
              />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Váš e-mail"
              className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-[#4a2c14] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="Zpráva (nepovinné)"
              className="w-full rounded-xl border border-[#eadfce] bg-white px-4 py-3 text-[#4a2c14] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/20"
              defaultValue={initialMessage}
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                onClick={() => {
                  onClose?.();
                }}
                variant="secondary"
                disabled={submitting}
              >
                Zrušit
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="disabled:hover:translate-y-0 disabled:hover:scale-100"
              >
                {submitting ? "Odesílám..." : "Odeslat"}
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Odesláním souhlasíte se zpracováním údajů za účelem kontaktování.
            </p>
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
