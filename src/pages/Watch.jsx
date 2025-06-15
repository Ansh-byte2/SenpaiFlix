import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchAnimeDetailsWithCache,
  get2AnimeEmbedUrl,
  get2AnimeEmbedUrl1,
  get2AnimeEmbedUrl2,
  get2AnimeEmbedUrl3,
  fetchNextEpisodeReleaseDateFromAnilist,
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
  const [streamUrl1, setStreamUrl1] = useState("");
  const [streamUrl2, setStreamUrl2] = useState("");
  const [streamUrl3, setStreamUrl3] = useState("");
  const [autoNext, setAutoNext] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoSkip, setAutoSkip] = useState(true);
  const [expand, setExpand] = useState(false);
  const [server, setServer] = useState("HD-1");
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // New state for next episode release date and countdown
  const [nextEpisodeReleaseDate, setNextEpisodeReleaseDate] = useState(null);
  const [countdownText, setCountdownText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!animeId) return;

    const fetchData = async () => {
      try {
        const data = await fetchAnimeDetailsWithCache(animeId);
        setAnimeDetails(data.anime);
        setEpisodes(data.episodes);

        // Fetch next episode release date from Anilist
        const nextRelease = await fetchNextEpisodeReleaseDateFromAnilist(animeId);
        if (nextRelease) {
          setNextEpisodeReleaseDate(new Date(nextRelease * 1000)); // Convert seconds to ms
        } else {
          setNextEpisodeReleaseDate(null);
        }
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
      }
    };

    fetchData();
  }, [animeId]);

  useEffect(() => {
    if (!animeDetails || episodes.length === 0) return;

    if (animeDetails.title_english) {
      const url = get2AnimeEmbedUrl(animeDetails.title, currentEpisode);
      const url1 = get2AnimeEmbedUrl(animeDetails.title_english, currentEpisode);
      const url2 = get2AnimeEmbedUrl2(animeDetails.title_english, currentEpisode);
      const url3 = get2AnimeEmbedUrl3(animeDetails.title, currentEpisode);
      setStreamUrl(url);
      setStreamUrl1(url1);
      setStreamUrl2(url2);
      setStreamUrl3(url3);

    }
  }, [animeDetails, episodes, currentEpisode]);

  useEffect(() => {
    if (autoNext && currentEpisode < episodes.length) {
      const timer = setTimeout(() => {
        handleEpisodeChange(currentEpisode + 1);
      }, 1440*1000); // 5 seconds delay before auto next
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
  const toggleExpand = () => setExpand(!expand);
  const handleServerChange = (srv) => setServer(srv);

  const filteredEpisodes = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
    ep.mal_id.toString().includes(episodeSearch)
  );

  if (!animeDetails) {
    return <div className="watch-page loading">Loading anime details...</div>;
  }

  // Helper to get genre string
  const genreString = animeDetails.genres
    ? animeDetails.genres.map((g) => g.name).join(", ")
    : animeDetails.genre || "";

  return (
    <div className="watch-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/home">TV</Link> /{" "}
        <span>Watching {animeDetails.title_english}</span>
      </div>

      <div className="main-content">
        {/* Left Sidebar - Episode List */}
          <div className="left-column">
            <div className="episode-list-header">
              <strong>List of episodes:</strong>
              <input
                type="text"
                placeholder="Number of Ep"
                className="episode-search"
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
              />
            </div>
            <div className="episode-list">
              <ul>
                {filteredEpisodes.map((ep) => (
            <li
              key={ep.mal_id}
              className={ep.mal_id === currentEpisode ? "active" : ""}
              onClick={() => handleEpisodeChange(ep.mal_id)}
            >
              <span className="episode-number">{ep.mal_id}</span>{" "}
              {ep.title.length > 30
                ? ep.title.slice(0, 30) + "..."
                : ep.title}
            </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center - Video Player and Controls */}
              <div className={`center-column ${expand ? "expanded" : ""}`}>
              <div className="video-player" style={{ position: "relative", width: "100%", height: "500px", background: !isPlaying ? `url(${animeDetails.images?.jpg?.large_image_url}) center center / cover no-repeat` : "black" }}>
              {!isPlaying ? (
                <div
                  className="video-initial"
                  onClick={() => setIsPlaying(true)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "rgba(0,0,0,0.25)",
                  }}
                >
                  <div className="play-button-circle" style={{ zIndex: 2 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="40" cy="40" r="40" fill="#F97316"/>
                      <path d="M32 26L56 40L32 54V26Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              ) : streamUrl ? (
                <>
              <iframe
                title={`Episode ${currentEpisode}`}
                src={
                server === "HD-1"
                  ? streamUrl
                  : server === "HD-2"
                  ? streamUrl1
                  : server === "HD-3"
                  ? streamUrl2
                  : server === "HD-4"
                  ? streamUrl3
                  : streamUrl
                }
                width="100%"
                height="500px"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
              ></iframe>
                </>
                ) : (
                <p>Loading stream...</p>
                )}
              </div>

              <div className="video-controls">
                <button onClick={toggleExpand} className={expand ? "active" : ""}>
                Expand
                </button>
                <button onClick={() => setFocusMode(true)} className={focusMode ? "active" : ""}>
                Focus
                </button>
                <button onClick={toggleAutoPlay} className={autoPlay ? "active" : ""}>
                Auto Play {autoPlay ? "On" : "Off"}
                </button>
                <button onClick={toggleAutoNext} className={autoNext ? "active" : ""}>
                Auto Next {autoNext ? "On" : "Off"}
                </button>
                <button onClick={toggleAutoSkip} className={autoSkip ? "active" : ""}>
                Auto Skip Intro {autoSkip ? "On" : "Off"}
                </button>
              </div>

              <div className="watching-server-container">
                <div className="watching-message-container">
                <div className="watching-message">
                  You are watching <br />
                  Episode {currentEpisode}
                  <br />
                  If current server doesn't work <br />
                  please try other servers beside.
                </div>
                </div>
                <div className="server-controls-container">
                <div className="cc-label">cc</div>
                <div className="sub-label">SUB:</div>
                <div className="server-buttons">
                  <button
                  className={server === "HD-1" ? "active" : ""}
                  onClick={() => {
                    setServer("HD-1");
                    if (animeDetails && animeDetails.title_english) {
                    setStreamUrl(get2AnimeEmbedUrl1(animeDetails.title, currentEpisode));
                    }
                  }}
                  >
                  HD-1
                  </button>

                  <button
                  className={server === "HD-2" ? "active" : ""}
                  onClick={() => {
                    setServer("HD-2");
                    if (animeDetails && animeDetails.title_english) {
                    setStreamUrl1(get2AnimeEmbedUrl(animeDetails.title_english, currentEpisode));
                    }
                  }}
                  >
                  HD-2
                  </button>
                </div>
                <div className="sub-label">DUB:</div>
                <div className="server-buttons">
                  <button
                  className={server === "HD-3" ? "active" : ""}
                  onClick={() => {
                    setServer("HD-3");
                    if (animeDetails && animeDetails.title_english) {
                    setStreamUrl2(get2AnimeEmbedUrl2(animeDetails.title_english, currentEpisode));
                    }
                  }}
                  >
                  HD-3
                  </button>
                  <button
                  className={server === "HD-4" ? "active" : ""}
                  onClick={() => {
                    setServer("HD-4");
                    if (animeDetails && animeDetails.title_english) {
                    setStreamUrl3(get2AnimeEmbedUrl3(animeDetails.title, currentEpisode));
                    }
                  }}
                  >
                  HD-4
                  </button>
                </div>
                </div>
              </div>
              </div>

              {/* Right Sidebar - Anime Info */}
        <div className="right-column">
          <div className="poster">
            <img src={animeDetails.images?.jpg?.large_image_url} alt={animeDetails.title_english || animeDetails.title} />
          </div>
          <div className="info-text">
            <h2>{animeDetails.title_english}</h2>
            <div className="meta">
              <div>
                <strong>{animeDetails.type}</strong>
              </div>
              <div>
                <strong>HD</strong>
              </div>
              <div>
                <strong>{animeDetails.episodes}</strong>
              </div>
              <div>{animeDetails.duration}</div>
              <div>{genreString}</div>
            </div>
            <p>{animeDetails.synopsis}</p>
            <p>
              Senpai is the best site to watch <strong>{animeDetails.title_english}</strong> SUB online, or you can even watch <strong>{animeDetails.title_english}</strong> DUB in HD quality. You can also find Yokohama Animation Lab anime on Senpai Flix website.
            </p>
            <button className="view-detail-btn">View detail</button>
            <div className="rating">
              <h3>{animeDetails.score}</h3>
              <div>Vote now</div>
            </div>
          </div>
        </div>
      </div>

      {focusMode && (
        <div className="modal-overlay" onClick={() => setFocusMode(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {streamUrl ? (
              <iframe
                title={`Episode ${currentEpisode} - Focus Mode`}
                src={
                  server === "HD-1"
                    ? streamUrl
                    : server === "HD-2"
                    ? streamUrl1
                    : server === "HD-3"
                    ? streamUrl2
                    : server === "HD-4"
                    ? streamUrl3
                    : streamUrl
                }
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
              ></iframe>
            ) : (
              <p>Loading stream...</p>
            )}
            <button className="modal-close-btn" onClick={() => setFocusMode(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
