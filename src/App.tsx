import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Upload, 
  Settings, 
  MapPin, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import WeatherCards from './components/WeatherCards';
import ForecastChart from './components/ForecastChart';
import MetricsTable from './components/MetricsTable';
import ForecastLog from './components/ForecastLog';
import { getLiveWeather, getHealth } from './frontend/src/api/client';

const INDIAN_CITIES = [
  { name: 'Ooty, Tamil Nadu', lat: 11.4102, lon: 76.6950 },
  { name: 'Jodhpur, Rajasthan', lat: 26.2389, lon: 73.0243 },
  { name: 'Ahmedabad, Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kurnool, Andhra Pradesh', lat: 15.8281, lon: 78.0373 },
  { name: 'Muppandal, Tamil Nadu', lat: 8.2483, lon: 77.5458 },
  { name: 'Kutch, Gujarat', lat: 23.7337, lon: 69.8597 },
];

const App = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [horizon, setHorizon] = useState('1h');
  const [isRetraining, setIsRetraining] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(INDIAN_CITIES[0]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const resp = await getLiveWeather(selectedLocation.lat, selectedLocation.lon);
        setWeatherData(resp.data);
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, [selectedLocation]);

  const chartData = Array.from({ length: 24 }).map((_, i) => {
    // Basic deterministic variability based on location
    const mod = (selectedLocation.lat + selectedLocation.lon) % 50;
    return {
      time: `2025-01-15 ${String(i).padStart(2, '0')}:00`,
      observed: 200 + mod + Math.random() * 80 + Math.sin(i/4) * 50,
      predicted: 200 + mod + Math.random() * 80 + Math.sin(i/4) * 50 + (Math.random() - 0.5) * 15,
      upper: 350 + mod + Math.sin(i/4) * 50,
      lower: 150 + mod + Math.sin(i/4) * 50,
    };
  });

  return (
    <div className="h-screen bg-bg text-text-main font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-[60px] bg-card-bg border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-accent-green" />
          <div className="leading-tight">
            <h1 className="text-base font-bold text-text-main">Renewable Energy Forecast System</h1>
            <div className="flex items-center gap-2">
              <select 
                value={selectedLocation.name}
                onChange={(e) => {
                  const city = INDIAN_CITIES.find(c => c.name === e.target.value);
                  if (city) setSelectedLocation(city);
                }}
                className="bg-transparent border-none text-xs text-text-dim hover:text-text-main focus:outline-none cursor-pointer p-0"
              >
                {INDIAN_CITIES.map(c => <option key={c.name} value={c.name} className="bg-card-bg">{c.name}</option>)}
              </select>
              <span className="text-[10px] text-text-dim/50">({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lon.toFixed(2)}°E)</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-bg border border-border px-3 py-1 rounded text-sm font-mono text-accent-blue">
            IST {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-accent-green/10 border border-accent-green/20 rounded text-[10px] font-bold text-accent-green uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            v1.2.0 Stable
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-rows-[120px_1fr_200px] gap-4 p-4 overflow-hidden">
        {/* Weather Cards */}
        <section className="weather-cards">
          <WeatherCards data={weatherData} />
        </section>

        {/* Middle Section: Chart and Metrics */}
        <section className="grid grid-cols-[1.8fr_1fr] gap-4 overflow-hidden">
          <div className="bg-card-bg border border-border rounded-lg p-5 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 text-sm font-semibold text-text-main">
              <h2>Energy Output Forecast (kWh)</h2>
              <div className="flex gap-1">
                {['1h', '3h', '24h'].map(h => (
                  <button 
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`px-3 py-1 text-xs rounded border transition-all ${
                      horizon === h 
                      ? 'bg-accent-blue border-accent-blue text-white' 
                      : 'bg-bg border-border text-text-dim hover:border-text-dim/50'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ForecastChart data={chartData} horizon={horizon} />
            </div>
          </div>

          <div className="bg-card-bg border border-border rounded-lg p-5 flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold text-text-main mb-4">Model Performance Matrix</h2>
            <div className="flex-1 overflow-auto">
              <MetricsTable />
            </div>
            <div className="mt-4 p-3 border border-dashed border-border rounded text-center">
              <p className="text-[11px] text-text-dim">Drag & Drop Batch CSV for Retraining</p>
            </div>
          </div>
        </section>

        {/* Bottom Section: Logs */}
        <section className="bg-card-bg border border-border rounded-lg flex flex-col overflow-hidden">
          <div className="bg-bg/40 px-4 py-2 border-b border-border flex justify-between items-center shrink-0">
            <h2 className="text-xs font-semibold text-text-main">Recent Prediction Audit Log</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-text-dim">Auto-refresh in 22s</span>
              <button 
                onClick={() => {
                  setIsRetraining(true);
                  setTimeout(() => setIsRetraining(false), 2000);
                }}
                className="text-text-dim hover:text-text-main transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRetraining ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <ForecastLog />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-[40px] bg-card-bg border-t border-border flex items-center justify-between px-6 shrink-0 text-[11px] text-text-dim">
        <div>
          Model: <span className="text-text-main">v1.2.0-stable</span> &nbsp;|&nbsp; 
          Asset ID: <span className="text-text-main">ooty_solar_wind_001</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            System Health: <span className="text-accent-green font-bold">OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-1">
            API Latency: <span className="text-text-main font-mono">42ms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
