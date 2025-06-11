const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // base delay in ms for exponential backoff

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Caching utility for Jikan API requests
const CACHE_EXPIRY = 3600000; // 1 hour in ms

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

// Generic fetch with caching for Jikan API
export async function fetchWithCache(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = url + (queryString ? `?${queryString}` : '');
  const cacheKey = `jikan_cache_${fullUrl}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching from Jikan API:', error);
    throw error;
  }
};


export async function fetchNewReleases(page = 1) {
  const url = `${JIKAN_API_BASE_URL}/top/anime?limit=24&status=airing&filter=bypopularity&type=movie&order_by=popularity`;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const data = await fetchWithCache(url, { page });
      return data.data;
    } catch (error) {
      if (error.message.includes('rate limit') && attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * Math.pow(2, attempt);
        console.warn(`Retrying due to rate limit error after ${delayTime} ms...`);
        await delay(delayTime);
        attempt++;
        continue;
      }
      console.error('Error fetching new releases from Jikan:', error);
      throw error;
    }
  }
}

export async function fetchUpdates() {
  const url = `${JIKAN_API_BASE_URL}/top/anime?filter=upcoming&limit=20`;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const data = await fetchWithCache(url);
      return data.data;
    } catch (error) {
      if (error.message.includes('rate limit') && attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * Math.pow(2, attempt);
        console.warn(`Retrying due to rate limit error after ${delayTime} ms...`);
        await delay(delayTime);
        attempt++;
        continue;
      }
      console.error('Error fetching updates from Jikan:', error);
      throw error;
    }
  }
}

export async function fetchOngoing() {
  const url = `${JIKAN_API_BASE_URL}/top/anime?filter=airing&limit=20`;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const data = await fetchWithCache(url);
      return data.data;
    } catch (error) {
      if (error.message.includes('rate limit') && attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * Math.pow(2, attempt);
        console.warn(`Retrying due to rate limit error after ${delayTime} ms...`);
        await delay(delayTime);
        attempt++;
        continue;
      }
      console.error('Error fetching ongoing from Jikan:', error);
      throw error;
    }
  }
}

export async function fetchRecent() {
  const url = `${JIKAN_API_BASE_URL}/seasons/now`;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const data = await fetchWithCache(url);
      return data.data;
    } catch (error) {
      if (error.message.includes('rate limit') && attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * Math.pow(2, attempt);
        console.warn(`Retrying due to rate limit error after ${delayTime} ms...`);
        await delay(delayTime);
        attempt++;
        continue;
      }
      console.error('Error fetching recent from Jikan:', error);
      throw error;
    }
  }
}

// New function to fetch anime with flexible filters
export async function fetchAnimeWithFilters(filters = {}, page = 1) {
  const url = `${JIKAN_API_BASE_URL}/anime`;
  let attempt = 0;

  // Map filters to Jikan API query parameters
  const params = {
    page,
    ...filters,
  };

  // Fix genre key to genres for Jikan API
  if (params.genre) {
    params.genres = params.genre;
    delete params.genre;
  }

  while (attempt <= MAX_RETRIES) {
    try {
      const data = await fetchWithCache(url, params);
      return data.data;
    } catch (error) {
      if (error.message.includes('rate limit') && attempt < MAX_RETRIES) {
        const delayTime = RETRY_DELAY_BASE * Math.pow(2, attempt);
        console.warn(`Retrying due to rate limit error after ${delayTime} ms...`);
        await delay(delayTime);
        attempt++;
        continue;
      }
      console.error('Error fetching anime with filters from Jikan:', error);
      throw error;
    }
  }
}
