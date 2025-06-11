import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchAnimeDetailsWithCache,
  get2AnimeEmbedUrl,
} from "../utils/streamingApis";
import "./watch.css";

const Watch = () => {
  const { animeId, episodeNumber } = useParams();
  const navigate = useNavigate();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(
    episodeNumber ? parseInt(episodeNumber) : 1
  );
  const [streamUrl, setStreamUrl] = useState("");
  const [autoNext, setAutoNext] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSkip, setAutoSkip] = useState(false);

  useEffect(() => {
    if (!animeId) return;

    const fetchData = async () => {
      try {
        const data = await fetchAnimeDetailsWithCache(animeId);
        setAnimeDetails(data.anime);
        setEpisodes(data.episodes);
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
      }
    };

    fetchData();
  }, [animeId]);

  useEffect(() => {
    if (!animeDetails || episodes.length === 0) return;

    if (animeDetails.title) {
      const url = get2AnimeEmbedUrl(animeDetails.title, currentEpisode);
      setStreamUrl(url);
    }
  }, [animeDetails, episodes, currentEpisode]);

  useEffect(() => {
    if (autoNext && currentEpisode < episodes.length) {
      const timer = setTimeout(() => {
        handleEpisodeChange(currentEpisode + 1);
      }, 5000); // 5 seconds delay before auto next
      return () => clearTimeout(timer);
    }
  }, [autoNext, currentEpisode, episodes.length]);

  const handleEpisodeChange = (epNum) => {
    setCurrentEpisode(epNum);
    navigate(`/watch/${animeId}/${epNum}`);
  };

  const toggleAutoNext = () => setAutoNext(!autoNext);
  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const toggleAutoSkip = () => setAutoSkip(!autoSkip);

  if (!animeDetails) {
    return <div className="watch-page loading">Loading anime details...</div>;
  }

  return (
    <div className="watch-page dark-theme">
      <nav className="top-nav">
        <div className="logo">AnimeKai</div>
        <div className="nav-icons">
          <button title="Search" className="icon-btn">🔍</button>
          <button title="User" className="icon-btn">👤</button>
          <button title="Language EN" className="lang-btn">en</button>
          <button title="Language JP" className="lang-btn">jp</button>
        </div>
      </nav>

      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/home">TV</Link> /{" "}
        <span>{animeDetails.title}</span>
      </div>

      <div className="video-player">
        {streamUrl ? (
          <iframe
            title={`Episode ${currentEpisode}`}
            src={streamUrl}
            width="100%"
            height="500px"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen"
          ></iframe>
        ) : (
          <p>Loading stream...</p>
        )}
      </div>

      <div className="controls">
        <button onClick={toggleAutoNext} className={autoNext ? "active" : ""}>
          ▶▶ AutoNext
        </button>
        <button onClick={toggleAutoPlay} className={autoPlay ? "active" : ""}>
          ▶ AutoPlay
        </button>
        <button onClick={toggleAutoSkip} className={autoSkip ? "active" : ""}>
          ⏭ AutoSkip
        </button>
        <button
          onClick={() =>
            currentEpisode > 1 && handleEpisodeChange(currentEpisode - 1)
          }
        >
          ⏮ Prev
        </button>
        <button
          onClick={() =>
            currentEpisode < episodes.length &&
            handleEpisodeChange(currentEpisode + 1)
          }
        >
          ⏭ Next
        </button>
        <button title="Bookmark">❤️ Bookmark</button>
        <button title="Watch2Gether">W2G</button>
        <button title="Report">⚠️ Report</button>
      </div>

      <div className="episode-list">
        <h2>Episodes</h2>
        <ul>
          {episodes.map((ep) => (
            <li
              key={ep.mal_id}
              className={ep.mal_id === currentEpisode ? "active" : ""}
              onClick={() => handleEpisodeChange(ep.mal_id)}
            >
              Episode {ep.mal_id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Watch;
