import React from "react";
import { ExternalLink, PlayCircle, Youtube } from "lucide-react";
import { useFetch } from "../../hooks/useFetch.jsx";
import Button from "../layout/Button.jsx";

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

export default function LatestYoutubeVideoPanel({ user }) {
  const { data, loading } = useFetch("/api/youtube/latest-playlist-video");

  const video = data?.video || null;
  const publishedAt = formatPublishedAt(video?.publishedAt);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#ffd799]/20 bg-[linear-gradient(145deg,rgba(255,248,236,0.82),rgba(255,234,196,0.44))] p-6 shadow-[0_22px_60px_rgba(95,47,0,0.12)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute -left-8 top-4 h-24 w-24 rounded-full bg-[#f5a623]/18 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] text-[#9a590b]">
          <Youtube size={22} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a590b]">
            YouTube
          </p>
          <h3 className="text-3xl font-bold text-[#3d2514]">
            Poslední video novinky
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex h-72 items-center justify-center rounded-[1.8rem] border border-white/40 bg-white/40">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-[#f5a623] border-solid" />
        </div>
      ) : null}

      {!loading && video ? (
        <div className="relative mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-start">
          <div className="overflow-hidden rounded-[1.8rem] border border-white/45 bg-black shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={video.embedUrl}
                title={video.title || "YouTube video"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/45 bg-white/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              {publishedAt ? (
                <span className="rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a590b]">
                  {publishedAt}
                </span>
              ) : null}
              {video.channelTitle ? (
                <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a4d16]">
                  {video.channelTitle}
                </span>
              ) : null}
            </div>

            <h4 className="mt-4 text-2xl font-semibold leading-tight text-gray-900">
              {video.title || "Nejnovější video"}
            </h4>

            <p className="mt-4 line-clamp-6 text-sm leading-7 text-[#6b4b2b] md:text-base">
              {video.description ||
                "Video je připravené ke spuštění přímo na webu."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={video.watchUrl} target="_blank" rel="noreferrer">
                Přehrát na YouTube
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {!loading && !video ? (
        <div className="mt-8 rounded-[1.8rem] border border-white/45 bg-white/55 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ffd799]/30 bg-[rgba(245,166,35,0.14)] text-[#9a590b]">
            <PlayCircle size={22} />
          </div>

          <h4 className="mt-4 text-2xl font-semibold text-gray-900">
            Poslední video se připravuje
          </h4>
          {data?.details && user ? (
            <div className="mt-3 rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm text-red-700">
              {data.details}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
