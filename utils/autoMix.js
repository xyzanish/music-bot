// src/utils/autoMix.js
import play from "play-dl";

export async function getRecommendation(title) {
  try {
    // Use play-dl's yt_search to find similar tracks
    const results = await play.search(`${title} similar`, { source: "yt_search", limit: 5 });
    if (!results || results.length === 0) return null;
    const chosen = results[Math.floor(Math.random() * results.length)];
    return {
      title: chosen.title,
      uri: chosen.url,
      author: chosen.channel.name,
      duration: chosen.durationInSec * 1000,
      thumbnail: chosen.thumbnail
    };
  } catch (e) {
    console.error("getRecommendation error", e);
    return null;
  }
}
