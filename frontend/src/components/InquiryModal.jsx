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
          className="relative w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-xl"
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
            {effectiveContext ? (
              <input
                name="context"
                type="text"
                value={effectiveContext}
                readOnly
                className="w-full rounded-lg border bg-gray-50 px-4 py-2"
                placeholder={contextLabel}
              />
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                name="name"
                type="text"
                required
                placeholder="Vaše jméno"
                className="w-full rounded-lg border px-4 py-2"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Telefon (nepovinné)"
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <input
              name="email"
              type="email"
              required
              placeholder="Váš e-mail"
              className="w-full rounded-lg border px-4 py-2"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="Zpráva (nepovinné)"
              className="w-full rounded-lg border px-4 py-2"
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
