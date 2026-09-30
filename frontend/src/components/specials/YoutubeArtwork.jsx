import { useState } from "react";
import { Mic2, Play, Tv } from "lucide-react";
import useCookieConsent from "../cookies/useCookieConsent.js";
import { displayVideoTitle } from "../../utils/videoTitle.js";

export default function YoutubeArtwork({ video, kind, className = "" }) {
  const { consent } = useCookieConsent();
  const [imageError, setImageError] = useState(false);
  const Icon = kind === "poetrycast" ? Mic2 : Tv;
  const showImage = Boolean(consent?.externalContent && video.thumbnailUrl && !imageError);

  return (
    <div
      className={`relative aspect-video overflow-hidden bg-[linear-gradient(135deg,#9a590b,#e7b364_55%,#fff0d2)] ${className}`}
    >
      {showImage && (
        <img
          src={video.thumbnailUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#3d2514]/45 via-transparent to-transparent" />
      {!showImage && (
        <div className="absolute inset-0 flex flex-col items-start justify-end p-5 text-white">
          <Icon size={30} aria-hidden="true" className="mb-auto opacity-80" />
          <span className="line-clamp-2 max-w-[85%] text-lg font-bold leading-snug drop-shadow-md">
            {displayVideoTitle(video.title, kind)}
          </span>
        </div>
      )}
      <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#7a4d16] shadow-lg">
        <Play size={17} fill="currentColor" aria-hidden="true" />
      </span>
    </div>
  );
}
