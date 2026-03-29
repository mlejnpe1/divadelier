import React, { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import ExhibitionForm from "./ExhibitionForm.jsx";

export default function ExhibitionFormModal({
  isOpen,
  isEdit,
  draft,
  setDraft,
  creating,
  onClose,
  onSubmit,
  modalKey,
}) {
  const requestCloseRef = useRef(null);

  const handleRequestClose = useCallback(() => {
    if (requestCloseRef.current) {
      void requestCloseRef.current();
    } else {
      onClose();
    }
  }, [onClose]);

  const registerRequestClose = useCallback((fn) => {
    requestCloseRef.current = fn;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleRequestClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleRequestClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6">
      <button
        type="button"
        aria-label="Zavrit modal"
        onClick={handleRequestClose}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,244,222,0.34),rgba(15,23,42,0.62))] backdrop-blur-md"
      />

      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.24),rgba(255,247,237,0.14))] shadow-[0_35px_120px_rgba(15,23,42,0.38)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-[#f5a623]/18 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-white/18 blur-3xl" />

        <div className="relative flex max-h-[min(92vh,980px)] flex-col">
          <div className="flex items-center justify-between border-b border-white/20 px-5 py-4 md:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f0b24d]">
                {isEdit ? "Upravit vystavu" : "Pridat vystavu"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition hover:bg-white/16"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto p-3 md:p-5">
            <ExhibitionForm
              key={modalKey}
              isEdit={isEdit}
              draft={draft}
              setDraft={setDraft}
              creating={creating}
              onClose={onClose}
              onSubmit={onSubmit}
              onRegisterRequestClose={registerRequestClose}
              className="mb-0 border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,247,237,0.7))]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
