import React, { useEffect, useState } from "react";
import Button from "../layout/Button";
import useCookieConsent from "./useCookieConsent";

export default function CookieConsentBanner() {
  const { consent, setConsent } = useCookieConsent();
  const [openSettings, setOpenSettings] = useState(false);
  const [externalContent, setExternalContent] = useState(false);

  useEffect(() => {
    if (consent) {
      setExternalContent(Boolean(consent.externalContent));
    }
  }, [consent]);

  if (consent && !openSettings) {
    return (
      <div className="fixed bottom-4 left-4 z-[80]">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpenSettings(true)}
          className="rounded-full px-4 py-2 text-sm shadow-[0_12px_28px_rgba(94,55,8,0.14)]"
        >
          Cookies
        </Button>
      </div>
    );
  }

  const handleAcceptAll = () => {
    setConsent({ externalContent: true });
    setOpenSettings(false);
  };

  const handleRejectAll = () => {
    setConsent({ externalContent: false });
    setOpenSettings(false);
  };

  const handleSaveSettings = () => {
    setConsent({ externalContent });
    setOpenSettings(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80]">
      <div className="border-t border-[#ead7bb] bg-[linear-gradient(145deg,rgba(255,250,244,0.99),rgba(248,239,226,0.98))] shadow-[0_-18px_60px_rgba(94,55,8,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d8891c]">
              Cookies a externí obsah
            </p>
            <h2 className="text-xl font-bold text-[#2f2417] sm:text-2xl">
              Nastavení soukromí na webu
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[#5e4b34] sm:text-base">
              Web používá jen technicky nezbytné údaje. Externí cookies načítáme
              až po vašem souhlasu s externím obsahem. Svou volbu můžete
              kdykoliv změnit.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[360px] lg:max-w-[420px]">
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={handleAcceptAll}>
                Povolit
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleRejectAll}
              >
                Nepovolit
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenSettings((value) => !value)}
              >
                Nastavení
              </Button>
            </div>

            {openSettings ? (
              <div className="rounded-[1.2rem] border border-[#eadfce] bg-white/70 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={externalContent}
                    onChange={(e) => setExternalContent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#d8922c] text-[#f5a623] focus:ring-[#f5a623]"
                  />
                  <span className="text-sm leading-6 text-[#5e4b34]">
                    Externí obsah z Google Maps a YouTube
                  </span>
                </label>

                <div className="mt-4 flex justify-end">
                  <Button type="button" onClick={handleSaveSettings}>
                    Uložit
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
