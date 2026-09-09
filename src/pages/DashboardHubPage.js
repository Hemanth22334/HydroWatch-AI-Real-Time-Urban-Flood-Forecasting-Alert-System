import React from 'react';
import { AlertTriangle, BarChart3, Calendar, Newspaper, History, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function DashboardHubPage({ onNavigate, prediction }) {
  const tiles = [
    {
      id: 'alerts',
      title: 'Risk Alerts & Live Banner',
      category: 'PRIMARY MONITOR',
      desc: 'View real-time Green, Yellow, and Red flood risk alert banners with emergency safety guidance.',
      icon: <AlertTriangle className="w-7 h-7 text-palette-pink" />,
      badge: prediction ? `${prediction.flood_probability}% ${prediction.risk_level} RISK` : 'LIVE ALERT',
      badgeStyle: prediction?.alert_color === 'RED' ? 'bg-rose-100 text-rose-900 border-palette-pink' :
                 prediction?.alert_color === 'YELLOW' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                 'bg-emerald-100 text-emerald-900 border-emerald-300',
      gradient: 'from-rose-50 to-purple-50'
    },
    {
      id: 'weather',
      title: 'City Weather & Controls',
      category: 'TELEMETRY INPUTS',
      desc: 'Type any city name globally to import real-time weather telemetry or adjust rainfall, river stage & humidity sliders.',
      icon: <Zap className="w-7 h-7 text-amber-600" />,
      badge: 'LIVE CITY SEARCH',
      badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
      gradient: 'from-amber-50 to-orange-50'
    },
    {
      id: 'analytics',
      title: 'Predictive Analytics & Charts',
      category: 'DATA VISUALIZATION',
      desc: 'Interactive Recharts area & bar charts analyzing rainfall risk sensitivity curves vs danger thresholds.',
      icon: <BarChart3 className="w-7 h-7 text-palette-magenta" />,
      badge: 'INTERACTIVE CHARTS',
      badgeStyle: 'bg-purple-100 text-palette-magenta border-purple-200',
      gradient: 'from-purple-50 to-indigo-50'
    },
    {
      id: 'forecast',
      title: '24-Hour Future Forecast',
      category: 'PREDICTIVE TIMELINE',
      desc: '24-hour predictive timeline detailing hourly flood risk probabilities and peak danger windows.',
      icon: <Calendar className="w-7 h-7 text-palette-indigo" />,
      badge: 'HOURLY TIMELINE',
      badgeStyle: 'bg-indigo-100 text-palette-indigo border-indigo-200',
      gradient: 'from-indigo-50 to-blue-50'
    },
    {
      id: 'news',
      title: 'City Weather News & Advisories',
      category: 'EMERGENCY BULLETINS',
      desc: 'Localized meteorological news feeds, river gauge watches, and disaster bulletins with images.',
      icon: <Newspaper className="w-7 h-7 text-palette-pink" />,
      badge: 'LOCAL NEWS FEED',
      badgeStyle: 'bg-rose-100 text-palette-pink border-rose-200',
      gradient: 'from-rose-50 to-pink-50'
    },
    {
      id: 'history',
      title: 'Prediction Audit History Log',
      category: 'SIMULATION RECORDS',
      desc: 'Historical audit log table tracking past parameter simulations, model outputs, and time logs.',
      icon: <History className="w-7 h-7 text-slate-700" />,
      badge: 'AUDIT LOG',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-300',
      gradient: 'from-slate-100 to-slate-50'
    }
  ];

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-palette-pink bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            DASHBOARD CONTROL HUB
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            System Feature Modules
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-semibold mt-1">
            Click on any feature card below to navigate directly into that dedicated workspace module.
          </p>
        </div>

        {prediction && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3 self-start md:self-auto">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase text-slate-500">Current Model Status</div>
              <div className="text-sm font-black text-slate-900">{prediction.flood_probability}% ({prediction.risk_level} Risk)</div>
            </div>
          </div>
        )}
      </div>

      {/* FEATURE TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onNavigate(tile.id)}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer group hover:border-palette-magenta hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                  {tile.icon}
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border shadow-xs ${tile.badgeStyle}`}>
                  {tile.badge}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {tile.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-palette-pink transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                  {tile.desc}
                </p>
              </div>

            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black text-palette-indigo group-hover:text-palette-pink">
              <span>Open Module</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
