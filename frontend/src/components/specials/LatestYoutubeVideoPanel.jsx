import { useState } from "react";
import { ExternalLink, PlayCircle, Youtube } from "lucide-react";
import Button from "../layout/Button.jsx";
import ExternalContentGate from "../cookies/ExternalContentGate.jsx";
import { displayVideoTitle } from "../../utils/videoTitle.js";
import YoutubeArtwork from "./YoutubeArtwork.jsx";

function formatPublishedAt(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function LatestYoutubeVideoPanel({
  video,
  loading,
  details,
  user,
  badge = "TV VV",
  heading = "Nejnovější video",
  kind = "special",
}) {
  const [showPlayer, setShowPlayer] = useState(false);
  const publishedAt = formatPublishedAt(video?.publishedAt);
  const title = displayVideoTitle(video?.title, kind);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-5 shadow-[0_22px_60px_rgba(95,47,0,0.12)] md:p-7">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] text-[#9a590b]">
          <Youtube size={21} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a590b]">{badge}</p>
          <h3 className="text-xl font-bold text-[#3d2514] md:text-2xl">{heading}</h3>
        </div>
      </div>

      {loading && (
        <div className="mt-6 flex h-52 items-center justify-center rounded-[1.6rem] bg-white/40">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
        </div>
      )}

      {!loading && video && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:items-stretch">
          {showPlayer ? (
            <ExternalContentGate
              type="YouTube"
              title={video.title}
              description="Video načteme po vašem souhlasu s externím obsahem."
              sourceLabel="YouTube"
              sourceHref={video.watchUrl}
              loadLabel="Načíst video"
              iframeSrc={video.embedUrl || `https://www.youtube.com/embed/${video.videoId}`}
              iframeTitle={video.title}
              iframeAllow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="overflow-hidden rounded-[1.6rem] border border-white/45 bg-black"
              iframeClassName="aspect-video h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowPlayer(true)}
              aria-label={`Přehrát na stránce: ${title}`}
              className="group relative overflow-hidden rounded-[1.6rem] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5a623]"
            >
              <YoutubeArtwork video={video} kind={kind} />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#4a2c14] shadow-lg transition group-hover:bg-[#f5a623] group-hover:text-white">
                Přehrát na stránce
              </span>
            </button>
          )}

          <div className="flex flex-col rounded-[1.6rem] border border-white/45 bg-white/55 p-5">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a590b]">
              {publishedAt && <span>{publishedAt}</span>}
              {video.channelTitle && <span>· {video.channelTitle}</span>}
            </div>
            <h4 title={video.title} className="mt-4 text-2xl font-semibold leading-tight text-[#3d2514]">
              {title}
            </h4>
            {video.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#6b4b2b]">
                {video.description}
              </p>
            )}
            <div className="mt-auto pt-5">
              <Button href={video.watchUrl} target="_blank" rel="noopener noreferrer">
                Přehrát na YouTube
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!loading && !video && (
        <div className="mt-6 rounded-[1.6rem] border border-white/45 bg-white/55 p-6">
          <PlayCircle size={26} className="text-[#9a590b]" />
          <p className="mt-3 text-[#6b4b2b]">Nejnovější video se zatím nepodařilo načíst.</p>
          {details && user && <p className="mt-2 text-sm text-red-700">{details}</p>}
        </div>
      )}
    </div>
  );
}
