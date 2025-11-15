// src/utils/linkResolver.js
import play from "play-dl";

export default async function resolveTrack(query) {
  const isUrl = /^https?:\/\//i.test(query);
  if (!isUrl) return { type: "search", query };

  const url = query.toLowerCase();

  // YouTube
  const ytValidated = play.yt_validate(query);
  if (ytValidated === "video" || ytValidated === "playlist") return { type: "youtube", query };

  // SoundCloud
  if (url.includes("soundcloud.com")) return { type: "soundcloud", query };

  // Twitch
  if (url.includes("twitch.tv")) return { type: "twitch", query };

  // Direct audio
  if (url.match(/\.(mp3|wav|flac|aac|m4a)(\?.*)?$/)) return { type: "direct", query };

  // Spotify
  if (url.includes("spotify.com")) {
    try {
      const info = await play.spotify(query);
      if (info.type === "track") {
        const title = info.name;
        const artist = info.artists?.[0]?.name ?? "";
        return { type: "spotify", title, artist, query };
      } else if (info.type === "playlist" || info.type === "album") {
        return { type: "spotify_playlist", query, info };
      }
    } catch (e) {
      return { type: "search", query };
    }
  }

  // Apple Music fallback
  if (url.includes("music.apple.com")) return { type: "apple", query };

  // TikTok
  if (url.includes("tiktok.com")) return { type: "tiktok", query };

  // fallback
  return { type: "search", query };
}
