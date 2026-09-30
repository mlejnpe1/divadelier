const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 15 * 60 * 1000;
const PLAYLIST_CACHE_TTL_MS = 5 * 60 * 1000;
const POETRYCAST_PLAYLIST_ID = "PLguhGFa3IXO_FMOcm71QJWcNXIL3Cww2W";
const NEWS_PLAYLIST_ID = "PLguhGFa3IXO_mA3IKVINHUHWTgTRRhljm";

const latestPlaylistVideoCaches = new Map();
const playlistVideosCaches = new Map();

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

function getYouTubeConfig({
  apiKeyEnv = "YOUTUBE_API_KEY",
  playlistIdEnv = "YOUTUBE_PLAYLIST_ID",
  playlistUrlEnv = "YOUTUBE_PLAYLIST_URL",
  playlistId: explicitPlaylistId = "",
} = {}) {
  const apiKey = String(process.env[apiKeyEnv] || "").trim();
  const playlistId = extractPlaylistId(
    explicitPlaylistId || process.env[playlistIdEnv] || process.env[playlistUrlEnv],
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

async function fetchAllPlaylistVideos({ apiKey, playlistId }) {
  const videos = [];
  const seenTokens = new Set();
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      key: apiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/playlistItems?${params.toString()}`,
    );
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        payload?.error?.message || `YouTube API returned HTTP ${response.status}.`,
      );
    }

    for (const item of payload?.items || []) {
      const videoId =
        item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId;
      const title = String(item?.snippet?.title || "").trim();
      if (!videoId || !title || ["Private video", "Deleted video"].includes(title)) {
        continue;
      }

      videos.push({
        videoId,
        playlistId,
        title,
        description: String(item?.snippet?.description || "").trim(),
        publishedAt:
          item?.contentDetails?.videoPublishedAt ||
          item?.snippet?.publishedAt ||
          "",
        position: Number(item?.snippet?.position ?? videos.length),
        channelTitle: String(
          item?.snippet?.videoOwnerChannelTitle || item?.snippet?.channelTitle || "",
        ).trim(),
        thumbnailUrl: pickBestThumbnail(item?.snippet?.thumbnails),
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`,
      });
    }

    pageToken = String(payload?.nextPageToken || "");
    if (pageToken && seenTokens.has(pageToken)) {
      throw new Error("YouTube API returned a repeated page token.");
    }
    if (pageToken) seenTokens.add(pageToken);
  } while (pageToken);

  return videos;
}

function createLatestPlaylistVideoHandler(configOptions) {
  return async function latestPlaylistVideoHandler(_, res) {
    const config = getYouTubeConfig(configOptions);

    if (!config.configured) {
      return res.status(200).json({
        configured: false,
        video: null,
        message: "YouTube playlist zatím není nakonfigurovaný.",
      });
    }

    const cacheKey = `${config.playlistId}:${config.apiKey}`;
    const now = Date.now();
    const cacheId = `${configOptions?.playlistIdEnv || "YOUTUBE_PLAYLIST_ID"}:${cacheKey}`;
    const cached = latestPlaylistVideoCaches.get(cacheId);

    if (cached && cached.expiresAt > now) {
      return res.status(200).json(cached.payload);
    }

    try {
      const payload = await fetchLatestPlaylistVideo(config);

      latestPlaylistVideoCaches.set(cacheId, {
        cacheKey,
        expiresAt: now + CACHE_TTL_MS,
        payload,
      });

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
  };
}

export const getLatestPlaylistVideo = createLatestPlaylistVideoHandler({
  apiKeyEnv: "YOUTUBE_API_KEY",
  playlistId: NEWS_PLAYLIST_ID,
});

export const getLatestSpecialPlaylistVideo = createLatestPlaylistVideoHandler({
  apiKeyEnv: "YOUTUBE_API_KEY",
  playlistIdEnv: "YOUTUBE_SPECIAL_PLAYLIST_ID",
  playlistUrlEnv: "YOUTUBE_SPECIAL_PLAYLIST_URL",
});

function createPlaylistVideosHandler(configOptions) {
  return async function playlistVideosHandler(_, res) {
    const config = getYouTubeConfig(configOptions);
    if (!config.configured) {
      return res.status(503).json({ message: "YouTube playlist není nakonfigurovaný." });
    }

    const cacheKey = `${config.playlistId}:${config.apiKey}`;
    const now = Date.now();
    const cached = playlistVideosCaches.get(cacheKey);
    if (cached?.expiresAt > now) {
      return res.status(200).json(cached.payload);
    }

    try {
      const items = await fetchAllPlaylistVideos(config);
      const payload = { items };
      playlistVideosCaches.set(cacheKey, {
        expiresAt: now + PLAYLIST_CACHE_TTL_MS,
        payload,
      });
      return res.status(200).json(payload);
    } catch (error) {
      console.error("Error in playlistVideosHandler controller.", error);
      return res.status(502).json({
        message: "Nepodařilo se načíst playlist z YouTube.",
      });
    }
  };
}

export const getPoetrycastPlaylist = createPlaylistVideosHandler({
  playlistId: POETRYCAST_PLAYLIST_ID,
});

export const getSpecialPlaylist = createPlaylistVideosHandler({
  playlistIdEnv: "YOUTUBE_SPECIAL_PLAYLIST_ID",
  playlistUrlEnv: "YOUTUBE_SPECIAL_PLAYLIST_URL",
});
