import { ExternalLink, Mic2, Tv } from "lucide-react";
import Button from "../layout/Button.jsx";
import { displayVideoTitle } from "../../utils/videoTitle.js";
import YoutubeArtwork from "./YoutubeArtwork.jsx";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

export default function PlaylistVideoCard({ video, kind }) {
  const isPoetrycast = kind === "poetrycast";
  const Icon = isPoetrycast ? Mic2 : Tv;
  const publishedAt = formatDate(video.publishedAt);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#ffd799]/28 bg-[linear-gradient(155deg,rgba(255,249,239,0.82),rgba(255,238,211,0.46))] shadow-[0_24px_60px_rgba(95,47,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_75px_rgba(95,47,0,0.16)]">
      <a
        href={video.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Přehrát na YouTube: ${video.title}`}
        className="block overflow-hidden focus-visible:outline-2 focus-visible:outline-[#f5a623]"
      >
        <YoutubeArtwork video={video} kind={kind} className="transition duration-300 group-hover:scale-[1.03]" />
      </a>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center gap-2 text-[#9a6a36]">
          <Icon size={16} aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            {isPoetrycast ? "PoetryCast" : "TV VV speciál"}
          </span>
          {publishedAt && <span className="ml-auto text-xs">{publishedAt}</span>}
        </div>
        <h3
          title={video.title}
          className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-[#3d2514]"
        >
          {displayVideoTitle(video.title, kind)}
        </h3>
        {video.description && (
          <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-[#6b4b2b]">
            {video.description}
          </p>
        )}
        <div className="mt-auto pt-5">
          <Button
            href={video.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="sm"
            className="border-white/60 bg-white/70 text-[#4a2c14]"
          >
            Přehrát na YouTube
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </article>
  );
}
