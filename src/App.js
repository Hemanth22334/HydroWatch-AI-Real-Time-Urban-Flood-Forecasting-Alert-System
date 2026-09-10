import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardHubPage from './pages/DashboardHubPage';
import {
  RiskAlertPage,
  WeatherInputPage,
  AnalyticsPage,
  FutureForecastPage,
  NewsPage,
  HistoryPage
} from './pages/FeaturePages';
import { calculateClientFloodRisk } from './utils/mlEngine';

const API_BASE_URL = 'http://127.0.0.1:5000';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
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
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'standalone' | 'checking'
  const [history, setHistory] = useState([]);

  // Check health endpoint of Flask REST API
  const checkServerHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('standalone');
      }
    } catch (err) {
      setServerStatus('standalone');
    }
  };

  // Fetch prediction from /predict-flood API or fallback to Client ML Engine
  const fetchPrediction = useCallback(async (currentInputs) => {
    setLoading(true);
    setError(null);
    try {
      let data = null;
      try {
        const response = await fetch(`${API_BASE_URL}/predict-flood`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rainfall: currentInputs.rainfall,
            river_level: currentInputs.river_level,
            humidity: currentInputs.humidity
          }),
          signal: AbortSignal.timeout(2000)
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            data = result.data;
            setServerStatus('online');
          }
        }
      } catch (e) {
        // Flask server offline/unreachable (e.g. on Mobile Phone) -> Fallback to client ML
        setServerStatus('standalone');
      }

      // If Flask backend didn't respond, calculate via Client ML Engine
      if (!data) {
        data = calculateClientFloodRisk(currentInputs.rainfall, currentInputs.river_level, currentInputs.humidity);
      }

      setPrediction(data);
      setHistory(prev => [data, ...prev.slice(0, 9)]);

    } catch (err) {
      console.error('Prediction Error:', err);
      // Fallback calculation guarantee
      const clientData = calculateClientFloodRisk(currentInputs.rainfall, currentInputs.river_level, currentInputs.humidity);
      setPrediction(clientData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    checkServerHealth();
    fetchPrediction(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-palette-pink selection:text-white flex flex-col justify-between">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          serverStatus={serverStatus}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activePage === 'landing' && (
            <LandingPage onGetStarted={() => setActivePage('hub')} />
          )}

          {activePage === 'hub' && (
            <DashboardHubPage
              onNavigate={(pageId) => setActivePage(pageId)}
              prediction={prediction}
            />
          )}

          {activePage === 'alerts' && (
            <RiskAlertPage
              prediction={prediction}
              loading={loading}
              error={error}
              onBack={() => setActivePage('hub')}
            />
          )}

          {activePage === 'weather' && (
            <WeatherInputPage
              inputs={inputs}
              setInputs={setInputs}
              onPredict={fetchPrediction}
              autoPredict={autoPredict}
              setAutoPredict={setAutoPredict}
              loading={loading}
              onCitySelect={(city) => setActiveCity(city)}
              onBack={() => setActivePage('hub')}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsPage
              prediction={prediction}
              onBack={() => setActivePage('hub')}
            />
          )}

          {activePage === 'forecast' && (
            <FutureForecastPage
              onBack={() => setActivePage('hub')}
            />
          )}

          {activePage === 'news' && (
            <NewsPage
              currentCity={activeCity}
              onBack={() => setActivePage('hub')}
            />
          )}

          {activePage === 'history' && (
            <HistoryPage
              history={history}
              onBack={() => setActivePage('hub')}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>HydroWatch AI OS v1.0 — Real-Time Urban Flood Forecasting & Alert System</div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActivePage('landing')} className="hover:text-slate-900">Home</button>
            <button onClick={() => setActivePage('hub')} className="hover:text-slate-900">Dashboard Hub</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
