const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 15 * 60 * 1000;

let latestPlaylistVideoCache = {
  cacheKey: "",
  expiresAt: 0,
  payload: null,
};

function extractPlaylistId(input) {
  const value = String(input || "").trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const playlistId = url.searchParams.get("list");
    if (playlistId) return playlistId;
  } catch {
    // Treat non-URL values as a direct playlist id.
  }

  return value;
}

function getYouTubeConfig() {
  const apiKey = String(process.env.YOUTUBE_API_KEY || "").trim();
  const playlistId = extractPlaylistId(
    process.env.YOUTUBE_PLAYLIST_ID || process.env.YOUTUBE_PLAYLIST_URL,
  );

  return {
    apiKey,
    playlistId,
    configured: Boolean(apiKey && playlistId),
  };
}

function pickBestThumbnail(thumbnails) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

async function fetchLatestPlaylistVideo({ apiKey, playlistId }) {
  const params = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId,
    maxResults: "1",
    key: apiKey,
  });

  const response = await fetch(
    `${YOUTUBE_API_BASE_URL}/playlistItems?${params.toString()}`,
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason =
      payload?.error?.message ||
      `YouTube API returned HTTP ${response.status}.`;
    throw new Error(reason);
  }

  const item = Array.isArray(payload?.items) ? payload.items[0] : null;
  if (!item) {
    return {
      configured: true,
      video: null,
      message: "Playlist zatím neobsahuje žádné veřejné video.",
    };
  }

  const videoId =
    item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId || "";

  return {
    configured: true,
    video: videoId
      ? {
          videoId,
          playlistId,
          title: String(item?.snippet?.title || "").trim(),
          description: String(item?.snippet?.description || "").trim(),
          publishedAt:
            item?.contentDetails?.videoPublishedAt ||
            item?.snippet?.publishedAt ||
            "",
          channelTitle: String(
            item?.snippet?.videoOwnerChannelTitle ||
              item?.snippet?.channelTitle ||
              "",
          ).trim(),
          thumbnailUrl: pickBestThumbnail(item?.snippet?.thumbnails),
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        }
      : null,
    message: videoId ? "" : "Nepodařilo se určit ID videa z playlistu.",
  };
}

export async function getLatestPlaylistVideo(_, res) {
  const config = getYouTubeConfig();

  if (!config.configured) {
    return res.status(200).json({
      configured: false,
      video: null,
      message: "YouTube playlist zatím není nakonfigurovaný.",
    });
  }

  const cacheKey = `${config.playlistId}:${config.apiKey}`;
  const now = Date.now();

  if (
    latestPlaylistVideoCache.payload &&
    latestPlaylistVideoCache.cacheKey === cacheKey &&
    latestPlaylistVideoCache.expiresAt > now
  ) {
    return res.status(200).json(latestPlaylistVideoCache.payload);
  }

  try {
    const payload = await fetchLatestPlaylistVideo(config);

    latestPlaylistVideoCache = {
      cacheKey,
      expiresAt: now + CACHE_TTL_MS,
      payload,
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error("Error in getLatestPlaylistVideo controller.", error);
    return res.status(200).json({
      configured: true,
      video: null,
      message: "Nepodařilo se načíst poslední video z YouTube playlistu.",
      details: error?.message || "Neznámá chyba YouTube API.",
    });
  }
}
