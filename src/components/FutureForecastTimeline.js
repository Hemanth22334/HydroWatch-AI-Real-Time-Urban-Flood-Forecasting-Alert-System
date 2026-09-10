import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, TrendingUp, Search, RefreshCw } from 'lucide-react';
import { fetchDirectFutureForecast } from '../utils/mlEngine';

export default function FutureForecastTimeline() {
  const [city, setCity] = useState('Mumbai');
  const [searchInput, setSearchInput] = useState('Mumbai');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      try {
        const res = await fetch(`http://127.0.0.1:5000/fetch-future-forecast?city=${encodeURIComponent(targetCity)}&hours=24`, {
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          const result = await res.json();
          if (result.status === 'success') {
            data = result;
          }
        }
      } catch (e) {
        // Flask server unreachable on mobile -> Direct Open-Meteo call
      }

      if (!data) {
        data = await fetchDirectFutureForecast(targetCity, 3.5, 24);
      }

      setForecast(data.forecast || []);
      setCity(data.city);

    } catch (err) {
      setError(err.message || 'Unable to fetch future forecast');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForecast(city);
  }, [fetchForecast, city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchForecast(searchInput.trim());
    }
  };

  // Find peak risk hour
  const peakHour = forecast.length > 0 ? [...forecast].sort((a, b) => b.flood_probability - a.flood_probability)[0] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      
      {/* Header & City Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-palette-magenta border border-purple-200">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              24-Hour Future Flood Risk Timeline ({city})
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Machine Learning predictive timeline calculating hourly hydrological risk for upcoming hours.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Check future city forecast..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-palette-magenta"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-black bg-gradient-to-r from-palette-magenta to-palette-indigo hover:opacity-90 text-white rounded-xl flex items-center space-x-1 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Forecast</span>
          </button>
        </form>
      </div>

      {/* Peak Risk Summary Card */}
      {peakHour && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          peakHour.alert_color === 'RED' ? 'bg-rose-50 border-palette-pink text-rose-950 shadow-md' :
          peakHour.alert_color === 'YELLOW' ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-md' :
          'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md'
        }`}>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                24-Hour Peak Risk Warning Window
              </span>
              <h4 className="text-sm font-black">
                Peak Probability of {peakHour.flood_probability}% expected at {peakHour.hour_label}
              </h4>
            </div>
          </div>
          <div className="text-xs font-mono font-black px-3.5 py-1.5 bg-white rounded-xl border border-slate-300 self-start sm:self-auto text-slate-900">
            {peakHour.rainfall_mm} mm/h Rain | {peakHour.river_level_m.toFixed(1)}m River
          </div>
        </div>
      )}

      {/* Error / Loading State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-palette-pink text-rose-900 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {/* 24-Hour Hourly Cards Carousel / Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-3.5 min-w-max">
          {forecast.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between w-36 transition-all hover:scale-105 ${
                item.alert_color === 'RED' ? 'bg-rose-50 border-palette-pink text-rose-950 shadow-sm' :
                item.alert_color === 'YELLOW' ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm' :
                'bg-slate-50 border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold flex items-center gap-1 font-mono text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.hour_label}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  item.alert_color === 'RED' ? 'bg-palette-pink animate-ping' :
                  item.alert_color === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              </div>

              <div className="my-2">
                <div className="text-2xl font-black">{item.flood_probability}%</div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider mt-0.5 opacity-80">
                  {item.risk_level} RISK
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-600 font-mono font-semibold space-y-0.5">
                <div>🌧️ {item.rainfall_mm} mm/h</div>
                <div>💧 {item.humidity_pct}% hum</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
