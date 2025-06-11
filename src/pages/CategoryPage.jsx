import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewReleases, fetchUpdates, fetchOngoing, fetchRecent } from '../utils/api';

const categoryFetchMap = {
  'new-releases': fetchNewReleases,
  updates: fetchUpdates,
  ongoing: fetchOngoing,
  recent: fetchRecent,
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchFunction = categoryFetchMap[category];
        if (!fetchFunction) {
          setError('Invalid category');
          setAnimeData([]);
          setLoading(false);
          return;
        }
        const data = await fetchFunction();
        setAnimeData(data || []);
      } catch (err) {
        setError('Failed to fetch data');
        setAnimeData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  if (loading) return <div>Loading {category}...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 text-white bg-[#19192c] min-h-screen">
      <h1 className="text-3xl font-bold mb-4 capitalize">{category.replace('-', ' ')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {animeData.length === 0 && <p>No data available.</p>}
        {animeData.map((anime) => (
          <div
            key={anime.mal_id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate(`/anime/${anime.mal_id}`)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/anime/${anime.mal_id}`);
              }
            }}
          >
            <img
              src={anime.images?.jpg?.image_url || anime.image_url || ''}
              alt={anime.title || anime.name}
              className="w-36 h-52 object-cover rounded-md shadow-lg"
            />
            <p className="text-sm mt-2 text-center truncate w-full" title={anime.title_english || anime.name}>
              {anime.title_english || anime.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}