import React from 'react';
import RiskAlertBanner from '../components/RiskAlertBanner';
import MetricCards from '../components/MetricCards';
import WeatherInputs from '../components/WeatherInputs';
import CityVisualization from '../components/CityVisualization';
import FutureForecastTimeline from '../components/FutureForecastTimeline';
import WeatherNews from '../components/WeatherNews';
import { History, ArrowLeft } from 'lucide-react';

export function RiskAlertPage({ prediction, loading, error, onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>
      <RiskAlertBanner prediction={prediction} loading={loading} error={error} />
      <MetricCards prediction={prediction} />
    </div>
  );
}

export function WeatherInputPage({ inputs, setInputs, onPredict, autoPredict, setAutoPredict, loading, onCitySelect, onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>
      <WeatherInputs
        inputs={inputs}
        setInputs={setInputs}
        onPredict={onPredict}
        autoPredict={autoPredict}
        setAutoPredict={setAutoPredict}
        loading={loading}
        onCitySelect={onCitySelect}
      />
    </div>
  );
}

export function AnalyticsPage({ prediction, onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>
      <CityVisualization prediction={prediction} />
    </div>
  );
}

export function FutureForecastPage({ onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>
      <FutureForecastTimeline />
    </div>
  );
}

export function NewsPage({ currentCity, onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>
      <WeatherNews currentCity={currentCity} />
    </div>
  );
}

export function HistoryPage({ history, onBack }) {
  return (
    <div className="space-y-6 py-4">
      <button onClick={onBack} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl flex items-center space-x-1.5 text-slate-700 hover:bg-slate-50 transition-all shadow-xs">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hub</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
          <h4 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-palette-pink" />
            Prediction Audit Log History
          </h4>
          <span className="text-xs text-slate-500 font-mono font-bold">
            {history.length} simulations logged
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-200">
              <tr>
                <th className="p-3.5">Rainfall (mm/h)</th>
                <th className="p-3.5">River Level (m)</th>
                <th className="p-3.5">Humidity (%)</th>
                <th className="p-3.5">Flood Prob.</th>
                <th className="p-3.5">Risk Tier</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono font-bold">
              {history.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-palette-pink font-black">{item.rainfall_mm}</td>
                  <td className="p-3.5 text-amber-700 font-black">{item.river_level_m}</td>
                  <td className="p-3.5 text-palette-magenta font-black">{item.humidity_pct}</td>
                  <td className="p-3.5 text-slate-900 font-black text-sm">{item.flood_probability}%</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                      item.alert_color === 'RED' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                      item.alert_color === 'YELLOW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 text-[10px]">
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just now'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
