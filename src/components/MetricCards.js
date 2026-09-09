import React from 'react';
import { CloudRain, Waves, Droplets, Gauge } from 'lucide-react';

export default function MetricCards({ prediction }) {
  if (!prediction) return null;

  const { rainfall_mm, river_level_m, humidity_pct, flood_probability } = prediction;

  const metrics = [
    {
      title: "Precipitation Rate",
      value: `${rainfall_mm} mm/h`,
      subtext: rainfall_mm > 100 ? "Torrential rainfall" : rainfall_mm > 40 ? "Heavy rain" : "Light rain",
      icon: <CloudRain className="w-6 h-6 text-palette-pink" />,
      borderColor: "border-slate-200 hover:border-palette-pink/60 shadow-lg shadow-palette-pink/5",
      badgeColor: "bg-rose-50 text-palette-pink border-palette-pink/30"
    },
    {
      title: "River Water Level",
      value: `${river_level_m} m`,
      subtext: river_level_m > 7.0 ? "Overflow danger zone" : river_level_m > 4.0 ? "Moderate stage" : "Normal stage",
      icon: <Waves className="w-6 h-6 text-amber-600" />,
      borderColor: "border-slate-200 hover:border-amber-400/60 shadow-lg shadow-amber-500/5",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-300"
    },
    {
      title: "Relative Humidity",
      value: `${humidity_pct} %`,
      subtext: humidity_pct > 80 ? "Atmospheric saturation" : "Standard humidity",
      icon: <Droplets className="w-6 h-6 text-palette-magenta" />,
      borderColor: "border-slate-200 hover:border-palette-magenta/60 shadow-lg shadow-palette-magenta/5",
      badgeColor: "bg-purple-50 text-palette-magenta border-palette-magenta/30"
    },
    {
      title: "ML Flood Index",
      value: `${flood_probability} %`,
      subtext: "Random Forest confidence score",
      icon: <Gauge className="w-6 h-6 text-palette-indigo" />,
      borderColor: "border-slate-200 hover:border-palette-indigo/60 shadow-lg shadow-palette-indigo/5",
      badgeColor: "bg-indigo-50 text-palette-indigo border-palette-indigo/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-3xl bg-white border ${m.borderColor} shadow-md flex items-center justify-between transition-all duration-300 hover:-translate-y-1`}
        >
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {m.title}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
              {m.value}
            </div>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">{m.subtext}</p>
          </div>
          <div className={`p-3.5 rounded-2xl ${m.badgeColor} border shadow-sm flex-shrink-0`}>
            {m.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
