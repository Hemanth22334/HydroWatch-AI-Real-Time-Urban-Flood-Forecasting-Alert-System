import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, TrendingUp } from 'lucide-react';

export default function CityVisualization({ prediction }) {
  if (!prediction) return null;

  const { rainfall_mm, river_level_m, humidity_pct, flood_probability } = prediction;

  // Risk Sensitivity Curve Data (simulating risk across rainfall scale 0-200mm for current river/humidity)
  const sensitivityCurve = [0, 25, 50, 75, 100, 125, 150, 175, 200].map(rain => {
    const calculatedRisk = (0.55 * (rain / 200.0) + 0.35 * (river_level_m / 10.0) + 0.10 * (humidity_pct / 100.0)) * 100;
    return {
      rain: `${rain} mm`,
      risk: Math.min(100, Math.round(calculatedRisk * 10) / 10),
    };
  });

  // 3. Telemetry Parameter Benchmark vs Danger Thresholds
  const parameterComparison = [
    { metric: 'Rainfall (mm/h)', value: rainfall_mm, dangerThreshold: 100, unit: 'mm/h' },
    { metric: 'River Level (m)', value: river_level_m * 10, dangerThreshold: 70, unit: 'm (x10)' },
    { metric: 'Humidity (%)', value: humidity_pct, dangerThreshold: 85, unit: '%' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-100 border border-purple-200 rounded-2xl text-palette-magenta shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Predictive Telemetry Visualizations & Analytics
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Machine Learning feature contribution breakdown & rainfall risk sensitivity curve.
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1 text-xs font-black text-palette-pink bg-rose-50 border border-palette-pink/30 rounded-full flex items-center gap-1.5 shadow-sm">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Interactive Charts</span>
        </span>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Rainfall vs Risk Sensitivity Area Chart */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-palette-pink" />
                Rainfall Sensitivity & Risk Curve
              </h4>
              <p className="text-[11px] text-slate-500">
                Simulated flood probability response as precipitation increases (0 - 200 mm/h).
              </p>
            </div>
            <span className="text-xs font-black text-slate-700 bg-white px-2.5 py-1 border border-slate-200 rounded-lg">
              Cur. Prob: {flood_probability}%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensitivityCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B77" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F00BC" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rain" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`${value}% Probability`, 'Flood Risk']}
                />
                <Area type="monotone" dataKey="risk" stroke="#FF3B77" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Feature Weight Contribution Breakdown (Bar / Pie) */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-palette-magenta" />
                Feature Weight Contribution Breakdown
              </h4>
              <p className="text-[11px] text-slate-500">
                Random Forest feature weight distribution driving current flood calculation.
              </p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parameterComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 200]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="value" name="Current Measured Telemetry" fill="#4F00BC" radius={[6, 6, 0, 0]} />
                <Bar dataKey="dangerThreshold" name="Critical Risk Threshold" fill="#FF3B77" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
