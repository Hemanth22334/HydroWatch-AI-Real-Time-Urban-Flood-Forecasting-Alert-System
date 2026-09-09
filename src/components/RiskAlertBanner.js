import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity } from 'lucide-react';

export default function RiskAlertBanner({ prediction, loading, error }) {
  if (loading) {
    return (
      <div className="w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-xl animate-pulse flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-palette-indigo/10 flex items-center justify-center">
            <Activity className="w-6 h-6 animate-spin text-palette-pink" />
          </div>
          <div>
            <div className="h-5 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-72"></div>
          </div>
        </div>
        <div className="h-10 bg-slate-200 rounded w-28"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 rounded-3xl bg-rose-50 border border-palette-pink text-rose-900 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AlertOctagon className="w-8 h-8 text-palette-pink flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-rose-950">API Connection Error</h3>
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const { flood_probability, risk_level, alert_color, status_heading, recommendation } = prediction;

  // Light Theme Banner styles using user colors
  const configMap = {
    GREEN: {
      bg: 'bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-300 text-emerald-950 shadow-lg shadow-emerald-500/10',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
    },
    YELLOW: {
      bg: 'bg-gradient-to-r from-amber-50 via-white to-yellow-50 border-amber-300 text-amber-950 shadow-lg shadow-amber-500/10',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      icon: <AlertTriangle className="w-10 h-10 text-amber-600" />,
    },
    RED: {
      bg: 'bg-gradient-to-r from-rose-50 via-white to-palette-pink/10 border-palette-pink text-rose-950 shadow-xl shadow-rose-500/15 animate-pulse',
      badge: 'bg-rose-100 text-rose-900 border-palette-pink/40',
      progressBar: 'bg-gradient-to-r from-palette-pink via-rose-500 to-amber-500',
      icon: <AlertOctagon className="w-10 h-10 text-palette-pink" />,
    }
  };

  const style = configMap[alert_color] || configMap.GREEN;

  return (
    <div className={`w-full p-6 md:p-8 rounded-3xl ${style.bg} border backdrop-blur-xl transition-all duration-300`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Side: Status Icon & Details */}
        <div className="flex items-start space-x-4">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex-shrink-0 shadow-md">
            {style.icon}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className={`px-3.5 py-1 text-xs uppercase tracking-wider font-black rounded-full border ${style.badge}`}>
                {risk_level} RISK ALERT
              </span>
              <span className="text-xs text-slate-500 font-semibold">Live Machine Learning Output</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">{status_heading}</h2>
            <p className="text-sm mt-1 text-slate-700 max-w-2xl leading-relaxed font-medium">
              {recommendation}
            </p>
          </div>
        </div>

        {/* Right Side: Visual Probability Meter */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center lg:items-end min-w-[240px] shadow-lg">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            Predicted Risk Index
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl md:text-5xl font-black tracking-tighter gradient-text-palette">
              {flood_probability}%
            </span>
          </div>

          {/* Probability Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden border border-slate-200">
            <div
              className={`h-full ${style.progressBar} transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, flood_probability))}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
