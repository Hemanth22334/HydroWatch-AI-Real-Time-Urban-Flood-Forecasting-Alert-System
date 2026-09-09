import React, { useState, useEffect, useCallback } from 'react';
import RiskAlertBanner from './RiskAlertBanner';
import WeatherInputs from './WeatherInputs';
import MetricCards from './MetricCards';
import CityVisualization from './CityVisualization';
import FutureForecastTimeline from './FutureForecastTimeline';
import WeatherNews from './WeatherNews';
import { Activity, Server, History, ShieldAlert, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000';

export default function FloodDashboard() {
  const [inputs, setInputs] = useState({
    rainfall: 65,
    river_level: 4.8,
    humidity: 78
  });

  const [activeCity, setActiveCity] = useState('Mumbai');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoPredict, setAutoPredict] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [history, setHistory] = useState([]);

  // Check health endpoint of Flask REST API
  const checkServerHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (err) {
      setServerStatus('offline');
    }
  };

  // Fetch prediction from /predict-flood API
  const fetchPrediction = useCallback(async (currentInputs) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/predict-flood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rainfall: currentInputs.rainfall,
          river_level: currentInputs.river_level,
          humidity: currentInputs.humidity
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setPrediction(result.data);
        setServerStatus('online');
        // Add to recent history log (max 5 entries)
        setHistory(prev => [result.data, ...prev.slice(0, 4)]);
      } else {
        throw new Error(result.message || 'Failed to predict flood risk');
      }
    } catch (err) {
      console.error('Fetch Prediction Error:', err);
      setError('Unable to connect to Flask API (http://127.0.0.1:5000/predict-flood). Ensure the Python backend is running.');
      setServerStatus('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: ping server & fetch initial prediction
  useEffect(() => {
    checkServerHealth();
    fetchPrediction(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans selection:bg-palette-pink selection:text-white relative overflow-hidden">
      
      {/* Light Theme Background Soft Ambient Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-palette-indigo/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-palette-magenta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-palette-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* SECTION 1: System Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 gradient-bg-palette rounded-2xl shadow-lg text-white">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span>HydroWatch</span>
                  <span className="gradient-text-palette">AI</span>
                </h1>
                <span className="px-3 py-0.5 text-[10px] font-black uppercase bg-purple-100 text-palette-magenta border border-purple-200 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-palette-pink" /> v1.0 Structured
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Real-Time Urban Flood Forecasting & Automated Alert Warning System
              </p>
            </div>
          </div>

          {/* Backend Connection Status Badge */}
          <div className="flex items-center space-x-3 self-start md:self-auto bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <Server className="w-4 h-4 text-palette-pink" />
            <span className="text-xs text-slate-600 font-bold">Flask API:</span>
            {serverStatus === 'online' ? (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Connected (127.0.0.1:5000)</span>
              </span>
            ) : serverStatus === 'offline' ? (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Disconnected</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 shadow-sm">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>Checking...</span>
              </span>
            )}
          </div>
        </header>

        {/* SECTION 2: Primary Visual Risk Alert Banner */}
        <section className="space-y-4">
          <RiskAlertBanner
            prediction={prediction}
            loading={loading}
            error={error}
          />
          {/* Key Telemetry Metric Cards */}
          <MetricCards prediction={prediction} />
        </section>

        {/* SECTION 3: Live City Weather Search & Input Controls */}
        <section>
          <WeatherInputs
            inputs={inputs}
            setInputs={setInputs}
            onPredict={fetchPrediction}
            autoPredict={autoPredict}
            setAutoPredict={setAutoPredict}
            loading={loading}
            onCitySelect={(cityName) => setActiveCity(cityName)}
          />
        </section>

        {/* SECTION 4: Predictive Telemetry Analytics & Interactive Charts */}
        <section>
          <CityVisualization prediction={prediction} />
        </section>

        {/* SECTION 5: 24-Hour Future Flood Forecast Timeline */}
        <section>
          <FutureForecastTimeline />
        </section>

        {/* SECTION 6: City-Specific Live Weather News & Emergency Advisories */}
        <section>
          <WeatherNews currentCity={activeCity} />
        </section>

        {/* SECTION 7: Prediction Audit Log */}
        {history.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-palette-pink" />
                Recent Prediction Audit Log
              </h4>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {history.length} simulations stored
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
          </section>
        )}

      </div>
    </div>
  );
}
