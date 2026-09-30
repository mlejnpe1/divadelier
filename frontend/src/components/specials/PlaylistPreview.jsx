import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Button from "../layout/Button.jsx";
import ExternalContentGate from "../cookies/ExternalContentGate.jsx";
import YoutubeArtwork from "./YoutubeArtwork.jsx";

export default function PlaylistPreview({
  video,
  playlistId,
  title,
  heading = title,
  description = "Pusťte si všechny díly postupně.",
}) {
  const [expanded, setExpanded] = useState(false);
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  return (
    <div className="mb-8 overflow-hidden rounded-[1.8rem] border border-[#ffd799]/25 bg-[#fff8ec]/75 shadow-[0_16px_40px_rgba(95,47,0,0.08)]">
      {expanded ? (
        <ExternalContentGate
          type="YouTube"
          title={title}
          description="Playlist načteme po vašem souhlasu s externím obsahem."
          sourceLabel="YouTube"
          sourceHref={playlistUrl}
          loadLabel="Načíst playlist"
          iframeSrc={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`}
          iframeTitle={`${title} – playlist Divadeliéru`}
          iframeAllow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="mx-auto w-full max-w-3xl p-4"
          iframeClassName="aspect-video w-full rounded-[1.4rem]"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`Přehrát playlist ${title} na stránce`}
            className="w-full shrink-0 overflow-hidden focus-visible:outline-2 focus-visible:outline-[#f5a623] sm:w-52"
          >
            <YoutubeArtwork
              video={video || { title, thumbnailUrl: "" }}
              kind="poetrycast"
            />
          </button>
          <div className="flex flex-1 flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div>
              <h3 className="text-lg font-bold text-[#3d2514]">{heading}</h3>
              <p className="mt-1 text-sm text-[#6b4b2b]">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => setExpanded(true)} size="sm">
                Přehrát zde
              </Button>
              <Button href={playlistUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm">
                YouTube <ExternalLink size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
