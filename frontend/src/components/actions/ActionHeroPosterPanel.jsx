import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Expand, Upload, X } from "lucide-react";
import Button from "../layout/Button";
import { useFetch } from "../../hooks/useFetch";
import { API_URL } from "../../utils/api";
import { toastAction } from "../../utils/toastAction";
import HeroGlassPanel from "../layout/HeroGlassPanel.jsx";

const HERO_POSTER_ALT = "Přehled měsíčních akcí Divadeliéru";

async function uploadActionHeroPoster(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/actions/hero-poster`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (res.status === 204) {
    return null;
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || `HTTP chyba ${res.status}`);
  }

  return payload;
}

export default function ActionHeroPosterPanel({
  user,
  refreshToken = 0,
  onUploaded,
}) {
  const fileInputRef = useRef(null);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const { data, loading } = useFetch(
    `/api/actions/hero-poster?r=${refreshToken}`,
  );

  const posterUrl = useMemo(() => {
    if (!data?.hasPoster) {
      return "";
    }

    const version = data?.updatedAt
      ? new Date(data.updatedAt).getTime()
      : refreshToken;

    return `${API_URL}/api/actions/hero-poster/file?v=${version}`;
  }, [data?.hasPoster, data?.updatedAt, refreshToken]);

  useEffect(() => {
    if (!isPosterOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPosterOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPosterOpen]);

  const openUploadDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await toastAction(() => uploadActionHeroPoster(file), {
      loading: "Nahrávám plakát...",
      success: "Plakát aktualizován.",
      error: "Nepodařilo se nahrát plakát.",
    });

    onUploaded?.();
  };

  if (loading && !data) {
    return (
      <div className="flex h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/28 bg-white/28 shadow-[0_26px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      <HeroGlassPanel
        title="Na co se těšit tento měsíc?"
        headerSlot={
          user?.admin ? (
            <Button
              variant="secondary"
              size="sm"
              className="border-[#ffd799]/40 bg-white/88 text-[#5b3b12] shadow-[0_16px_34px_rgba(15,23,42,0.12)] backdrop-blur-xl hover:bg-white"
              onClick={openUploadDialog}
            >
              <Upload size={16} />
              {data?.hasPoster ? "Nahradit plakát" : "Nahrát plakát"}
            </Button>
          ) : null
        }
      >

        {data?.hasPoster ? (
          <div className="relative p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setIsPosterOpen(true)}
              className="group relative block w-full overflow-hidden rounded-[1.7rem] text-left"
              aria-label="Zobrazit plakát přes celou obrazovku"
            >
              <img
                src={posterUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-35"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(15,23,42,0.2))]" />
              <img
                src={posterUrl}
                alt={HERO_POSTER_ALT}
                className="relative h-[360px] w-full object-contain sm:h-[460px]"
                loading="eager"
                decoding="async"
              />
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/44 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/88 backdrop-blur-xl transition group-hover:bg-slate-950/58">
                <Expand size={14} />
                Zvětšit
              </div>
            </button>
          </div>
        ) : (
          <div className="px-5 py-8 sm:px-6 sm:py-10">
            <div className="flex h-[280px] items-center justify-center rounded-[1.7rem] border border-dashed border-white/24 bg-white/[0.06] px-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div>
                <p className="text-lg font-semibold text-white">
                  Plakát měsíčních akcí zatím není nahraný
                </p>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  {user?.admin
                    ? "Nahraj nový plakát a zobrazí se přímo v hero sekci."
                    : "Jakmile bude nahraný, objeví se tady jako rychlý přehled akcí."}
                </p>
              </div>
            </div>
          </div>
        )}
      </HeroGlassPanel>

      {isPosterOpen && data?.hasPoster
        ? createPortal(
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/84 p-4 backdrop-blur-xl md:p-8"
              onClick={() => setIsPosterOpen(false)}
            >
              <div
                className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-orange-200/20 blur-3xl" />
                <div className="pointer-events-none absolute right-6 top-4 h-32 w-32 rounded-full bg-white/14 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl sm:px-6">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#f5a623]">
                      {HERO_POSTER_ALT}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPosterOpen(false)}
                    aria-label="Zavřít náhled plakátu"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:bg-white/18"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative flex justify-center px-4 py-5 sm:px-6 sm:py-6">
                  <div className="relative w-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <img
                      src={posterUrl}
                      alt={HERO_POSTER_ALT}
                      className="max-h-[78vh] w-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
