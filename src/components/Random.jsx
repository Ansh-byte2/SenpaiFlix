import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Random = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        const response = await axios.get('https://api.jikan.moe/v4/anime',);
        const animeList = response.data.data;
        if (animeList.length === 0) {
          // If no anime found, navigate to home or show error
          navigate('/anime/34572'); // Default anime ID
          return;
        }
        const randomIndex = Math.floor(Math.random() * animeList.length);
        const randomAnime = animeList[randomIndex];
        navigate(`/anime/${randomAnime.mal_id}`);
      } catch (error) {
        console.error('Error fetching random anime:', error);
        navigate('/anime/34572');
      }
    };

    fetchRandomAnime();
  }, [navigate]);

  return null; // No UI needed, just redirect
};

export default Random;
