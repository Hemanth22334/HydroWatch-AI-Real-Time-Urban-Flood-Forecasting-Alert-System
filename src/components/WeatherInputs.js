import React, { useState } from 'react';
import { CloudRain, Waves, Droplet, RefreshCw, Zap, Search, MapPin, Globe } from 'lucide-react';

export default function WeatherInputs({ inputs, setInputs, onPredict, autoPredict, setAutoPredict, loading, onCitySelect }) {
  const [cityName, setCityName] = useState('');
  const [cityLoading, setCityLoading] = useState(false);
  const [cityMessage, setCityMessage] = useState(null);

  const handleChange = (field, val) => {
    const num = parseFloat(val) || 0;
    const newInputs = { ...inputs, [field]: num };
    setInputs(newInputs);
    if (autoPredict) {
      onPredict(newInputs);
    }
  };

  const applyPreset = (preset) => {
    let presetValues = {};
    if (preset === 'normal') {
      presetValues = { rainfall: 15, river_level: 2.1, humidity: 45 };
    } else if (preset === 'moderate') {
      presetValues = { rainfall: 85, river_level: 5.5, humidity: 75 };
    } else if (preset === 'severe') {
      presetValues = { rainfall: 175, river_level: 9.2, humidity: 95 };
    }
    setInputs(presetValues);
    setCityMessage(null);
    onPredict(presetValues);
  };

  // Fetch live city weather from backend API
  const handleFetchCityWeather = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;

    setCityLoading(true);
    setCityMessage(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/fetch-city-weather?city=${encodeURIComponent(cityName.trim())}`);
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const { city, country, rainfall_mm, humidity_pct, temperature_c } = result.data;
        const newInputs = {
          ...inputs,
          rainfall: rainfall_mm,
          humidity: humidity_pct
        };
        setInputs(newInputs);
        if (onCitySelect) {
          onCitySelect(city);
        }
        setCityMessage({
          type: 'success',
          text: `Fetched live weather for ${city}${country ? `, ${country}` : ''}: Temp ${temperature_c}°C, Rain ${rainfall_mm} mm/h, Humidity ${humidity_pct}%`
        });
        onPredict(newInputs);
      } else {
        setCityMessage({
          type: 'error',
          text: result.message || 'City not found'
        });
      }
    } catch (err) {
      setCityMessage({
        type: 'error',
        text: 'Unable to connect to live weather API service.'
      });
    } finally {
      setCityLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      
      {/* Top Bar: Live City Weather Search */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl gradient-bg-palette text-white shadow-md">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Fetch Live Real-Time Weather for Your Area</span>
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              Type your city name to import real-time precipitation & humidity telemetry.
            </p>
          </div>
        </div>

        <form onSubmit={handleFetchCityWeather} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MapPin className="w-4 h-4 text-palette-pink absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Mumbai, London, New York..."
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-palette-pink focus:ring-1 focus:ring-palette-pink"
            />
          </div>
          <button
            type="submit"
            disabled={cityLoading || !cityName.trim()}
            className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-palette-pink via-palette-magenta to-palette-indigo hover:opacity-90 text-white flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-50 flex-shrink-0"
          >
            {cityLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{cityLoading ? 'Fetching...' : 'Fetch Live Weather'}</span>
          </button>
        </form>
      </div>

      {/* City Status Toast Notification */}
      {cityMessage && (
        <div className={`p-3.5 text-xs rounded-xl border flex items-center justify-between font-medium ${
          cityMessage.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-palette-pink/40 text-rose-900'
        }`}>
          <span>{cityMessage.text}</span>
          <button onClick={() => setCityMessage(null)} className="text-slate-500 hover:text-slate-900 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Preset & Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Weather Parameter Controls
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Fine-tune inputs to evaluate machine learning flood predictions.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('normal')}
            className="px-3.5 py-2 text-xs font-extrabold rounded-xl bg-slate-100 hover:bg-emerald-100 text-emerald-800 border border-slate-200 hover:border-emerald-400 transition-all shadow-sm"
          >
            Dry / Normal
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="px-3.5 py-2 text-xs font-extrabold rounded-xl bg-slate-100 hover:bg-amber-100 text-amber-900 border border-slate-200 hover:border-amber-400 transition-all shadow-sm"
          >
            Heavy Monsoon
          </button>
          <button
            onClick={() => applyPreset('severe')}
            className="px-3.5 py-2 text-xs font-extrabold rounded-xl bg-slate-100 hover:bg-rose-100 text-palette-pink border border-slate-200 hover:border-palette-pink transition-all shadow-sm"
          >
            Severe Storm
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rainfall */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-rose-100 text-palette-pink border border-rose-200">
                <CloudRain className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-900">Rainfall</span>
            </div>
            <span className="text-xl font-black text-palette-pink">
              {inputs.rainfall} <span className="text-xs font-semibold text-slate-500">mm/h</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="1"
            value={inputs.rainfall}
            onChange={(e) => handleChange('rainfall', e.target.value)}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-palette-pink"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono font-bold">
            <span>0 mm</span>
            <span>100 mm</span>
            <span>200 mm</span>
          </div>
        </div>

        {/* River Level */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-900">River Level</span>
            </div>
            <span className="text-xl font-black text-amber-600">
              {inputs.river_level} <span className="text-xs font-semibold text-slate-500">m</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={inputs.river_level}
            onChange={(e) => handleChange('river_level', e.target.value)}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono font-bold">
            <span>0 m</span>
            <span>5 m</span>
            <span>10 m</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-xl bg-purple-100 text-palette-magenta border border-purple-200">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-900">Humidity</span>
            </div>
            <span className="text-xl font-black text-palette-magenta">
              {inputs.humidity} <span className="text-xs font-semibold text-slate-500">%</span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={inputs.humidity}
            onChange={(e) => handleChange('humidity', e.target.value)}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-palette-magenta"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono font-bold">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoPredict}
            onChange={(e) => setAutoPredict(e.target.checked)}
            className="w-4 h-4 rounded text-palette-indigo bg-slate-100 border-slate-300 focus:ring-palette-indigo"
          />
          <span className="text-xs text-slate-700 font-bold">
            Live auto-prediction on slider change
          </span>
        </label>

        <button
          onClick={() => onPredict(inputs)}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl gradient-bg-palette text-white font-black text-sm shadow-lg flex items-center justify-center space-x-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Evaluating Model...' : 'Calculate Flood Probability'}</span>
        </button>
      </div>
    </div>
  );
}
