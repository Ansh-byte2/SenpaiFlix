import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Volume2 } from "lucide-react";

const CACHE_KEY = 'hero_anime_cache';
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
      return parsed.data;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function setCachedData(key, data) {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
}

const HeroCarousel = () => {
  const [animeList, setAnimeList] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const cachedData = getCachedData(CACHE_KEY);
    if (cachedData) {
      setAnimeList(cachedData);
      return;
    }
    fetch("https://api.jikan.moe/v4/seasons/now?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data.data);
        setCachedData(CACHE_KEY, data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animeList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [animeList]);

  if (animeList.length === 0) return null;
  const anime = animeList[current];

  return (
    <section className="relative h-[90vh] w-full overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="object-cover object-center w-full h-full brightness-[.9] transition duration-500"
          loading="lazy"
          style={{ imageRendering: "pixelated",}}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1b] via-[#0f0f1b]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full px-6 md:px-16 py-10 flex flex-col justify-end md:justify-center max-w-screen-xl mx-auto">
        <p className="text-pink-400 text-sm mb-2">#3 Spotlight</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">{anime.title_english}</h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm text-white mb-4 flex-wrap">
          <span className="flex items-center gap-1"><span className="text-xs">🔘</span> TV</span>
          <span className="flex items-center gap-1">⏱️ 24m</span>
          <span className="flex items-center gap-1">📅 Apr 4, 2025</span>
          <span className="bg-pink-500 text-xs px-2 py-0.5 rounded">HD</span>
          <span className="bg-green-500 text-xs px-2 py-0.5 rounded">cc 10</span>
          <span className="bg-blue-600 text-xs px-2 py-0.5 rounded"><Volume2 size={12} className="inline-block" /> 8</span>
        </div>

        {/* Description */}
        <p className="text-gray-300 max-w-2xl text-sm mb-6 line-clamp-3">
          {anime.synopsis}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <a
            href={`/anime/${anime.mal_id}`}
            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold text-sm px-6 py-2 rounded-full"
          >
            ▶️ Watch Now
          </a>
          <a
            href={`/anime/${anime.mal_id}`}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-6 py-2 rounded-full"
          >
            Detail ➤
          </a>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + animeList.length) % animeList.length)}
          className="bg-white/20 hover:bg-white/40 p-2 rounded-md transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % animeList.length)}
          className="bg-white/20 hover:bg-white/40 p-2 rounded-md transition"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
