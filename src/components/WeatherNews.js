import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, BellRing, ExternalLink, MapPin, Search, RefreshCw } from 'lucide-react';
import { fetchDirectCityNews } from '../utils/mlEngine';

export default function WeatherNews({ currentCity = 'Mumbai' }) {
  const [city, setCity] = useState(currentCity);
  const [searchInput, setSearchInput] = useState(currentCity);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCity(currentCity);
    setSearchInput(currentCity);
  }, [currentCity]);

  const fetchCityNews = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      let newsData = null;
      try {
        const res = await fetch(`http://127.0.0.1:5000/fetch-city-news?city=${encodeURIComponent(targetCity)}`, {
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'success') {
            newsData = data.news;
            setCity(data.city);
          }
        }
      } catch (e) {
        // Flask server offline/unreachable on mobile -> Direct fallback
      }

      if (!newsData) {
        newsData = fetchDirectCityNews(targetCity);
        setCity(targetCity.charAt(0).toUpperCase() + targetCity.slice(1));
      }

      setNewsItems(newsData || []);

    } catch (err) {
      setError('Unable to fetch news bulletins for city');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCityNews(city);
  }, [fetchCityNews, city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchCityNews(searchInput.trim());
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      
      {/* Title & City News Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-palette-indigo shadow-sm">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>{city} Hydro-Met News & Emergency Bulletins</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Localized hydrological news updates, weather advisories, and disaster bulletins for {city}.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-palette-pink absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="News city search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-palette-pink"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs font-black bg-gradient-to-r from-palette-pink to-palette-magenta text-white rounded-xl flex items-center space-x-1 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>News</span>
            </button>
          </form>

          <span className="hidden sm:flex items-center space-x-1.5 px-3 py-1 text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 rounded-full shadow-sm flex-shrink-0">
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
            <span>Live Feed</span>
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-palette-pink text-rose-900 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {/* News Grid with Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-palette-magenta/50 transition-all shadow-md group hover:-translate-y-1"
          >
            {/* News Image Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-200">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-md border shadow-md ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono font-bold text-white/90">
                {item.time}
              </div>
            </div>

            {/* News Body Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-palette-pink transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">{item.source}</span>
                <span className="flex items-center space-x-1 text-palette-pink font-black group-hover:underline cursor-pointer">
                  <span>Read bulletin</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
