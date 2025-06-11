import axios from "axios";

const jikanCache = new Map();

/**
 * Fetch anime details and episodes from Jikan API with caching.
 * @param {string} animeId - The MyAnimeList anime ID.
 * @returns {Promise<Object>} - Anime details including episodes.
 */
export async function fetchAnimeDetailsWithCache(animeId) {
  if (jikanCache.has(animeId)) {
    return jikanCache.get(animeId);
  }
  try {
    // Fetch anime details
    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
    const animeData = animeResponse.data.data;

    // Fetch episodes list
    const episodesResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
    const episodesData = episodesResponse.data.data;

    const result = {
      anime: animeData,
      episodes: episodesData,
    };

    jikanCache.set(animeId, result);
    return result;
  } catch (error) {
    console.error("Error fetching anime details from Jikan API:", error);
    throw error;
  }
}

/**
 * Get stream URL from megaplay.buzz endpoint.
 * @param {string} hianimeEpId - The hianime episode ID.
 * @param {string} language - Language code (e.g., "sub", "dub").
 * @returns {string} - Stream URL.
 */
export function getMegaplayStreamUrl(hianimeEpId, language) {
  return `https://megaplay.buzz/stream/s-2/${hianimeEpId}/${language}`;
}

/**
 * Get stream URL from 2anime.xyz embed endpoint.
 * @param {string} animeName - Anime name in English (URL friendly).
 * @param {number} episodeNumber - Episode number.
 * @returns {string} - Embed URL.
 */
export function get2AnimeEmbedUrl(animeName, episodeNumber) {
  // Convert animeName to URL friendly format (lowercase, hyphens)
  const formattedName = animeName.toLowerCase().replace(/\s+/g, "-");
  return `https://2anime.xyz/embed/${formattedName}-episode-${episodeNumber}`;
}
