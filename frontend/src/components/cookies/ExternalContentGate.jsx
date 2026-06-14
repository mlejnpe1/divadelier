import React from "react";
import { ExternalLink } from "lucide-react";
import Button from "../layout/Button";
import useCookieConsent from "./useCookieConsent";

export default function ExternalContentGate({
  type,
  title,
  description,
  sourceLabel,
  sourceHref,
  loadLabel,
  iframeSrc,
  iframeTitle,
  iframeAllow,
  iframeReferrerPolicy,
  className = "",
  iframeClassName = "",
}) {
  const { consent, setConsent } = useCookieConsent();
  const allowed = Boolean(consent?.externalContent);

  const handleAllow = () => {
    setConsent({ externalContent: true });
  };

  return (
    <div className={className}>
      {allowed ? (
        <iframe
          src={iframeSrc}
          title={iframeTitle || title}
          className={iframeClassName}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          allow={iframeAllow}
          referrerPolicy={iframeReferrerPolicy || "no-referrer-when-downgrade"}
        />
      ) : (
        <div className="flex h-full min-h-[240px] flex-col justify-between rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_16px_38px_rgba(94,55,8,0.08)] backdrop-blur-xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c6801c]">
              {type}
            </p>
            <h3 className="text-xl font-semibold text-[#2f2417]">{title}</h3>
            <p className="text-sm leading-7 text-[#5e4b34]">{description}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" onClick={handleAllow}>
              {loadLabel || `Načíst ${type.toLowerCase()}`}
            </Button>
            <Button href={sourceHref} target="_blank" rel="noopener noreferrer" variant="secondary">
              Otevřít na {sourceLabel}
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
