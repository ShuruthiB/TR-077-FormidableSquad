import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Upload, 
  Settings, 
  MapPin, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Search,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import WeatherCards from './components/WeatherCards';
import ForecastChart from './components/ForecastChart';
import EnergyDistributionChart from './components/EnergyDistributionChart';
import MetricsTable from './components/MetricsTable';
import ForecastLog from './components/ForecastLog';
import { getLiveWeather, getHealth, searchLocation } from './frontend/src/api/client';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(30);

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
    const countdown = setInterval(() => {
      setRefreshTimer((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
      clearInterval(countdown);
    };
  }, [selectedLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const resp = await searchLocation(searchQuery);
      setSearchResults(resp.data.results || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const chartData = Array.from({ length: 24 }).map((_, i) => {
    const mod = (selectedLocation.lat + selectedLocation.lon) % 50;
    const horizonMultiplier = horizon === '1h' ? 1.0 : horizon === '3h' ? 1.2 : 0.8;
    
    // Synchronize timestamps with the logic from Audit Log (last 24 hours ending now)
    const logTime = new Date(currentTime);
    logTime.setHours(currentTime.getHours() - (24 - i));
    logTime.setMinutes(0);
    const labelTime = logTime.toTimeString().split(':')[0] + ':00';

    // Solar: Peaks during the day
    const solarBase = Math.max(0, Math.sin((logTime.getHours() - 6) * Math.PI / 12) * 150);
    // Wind: Variable but present
    const windBase = 60 + Math.random() * 30 + Math.cos(logTime.getHours() / 3) * 20;
    // Hydro: Very stable, slight variation based on city (elevation)
    const hydroBase = 100 + (mod * 2);
    // Tidal: Cyclical based on 12-hour tide cycles
    const tidalBase = 40 + Math.sin(logTime.getHours() * Math.PI / 6) * 30;
    
    const sActual = (solarBase + Math.random() * 15) * horizonMultiplier;
    const wActual = (windBase + Math.random() * 15) * horizonMultiplier;
    const hActual = (hydroBase + Math.random() * 5) * horizonMultiplier;
    const tActual = (tidalBase + Math.random() * 10) * horizonMultiplier;
    
    return {
      time: labelTime,
      solar: sActual,
      wind: wActual,
      hydro: hActual,
      tidal: tActual,
      totalObserved: sActual + wActual + hActual + tActual,
      totalPredicted: (sActual + wActual + hActual + tActual) + (Math.random() - 0.5) * 20,
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
            <div className="flex items-center gap-2 relative">
              <form onSubmit={handleSearch} className="flex items-center bg-bg/50 border border-border px-2 rounded-md h-6">
                <Search className="w-3 h-3 text-text-dim mr-1" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Any Indian City..."
                  className="bg-transparent border-none text-[10px] text-text-main focus:outline-none w-32 placeholder:text-text-dim/50"
                />
              </form>
              
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-card-bg border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
                  >
                    {searchResults.map((res: any) => (
                      <button
                        key={res.id}
                        onClick={() => {
                          setSelectedLocation({
                            name: `${res.name}, ${res.admin1 || res.country}`,
                            lat: res.latitude,
                            lon: res.longitude
                          });
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                        className="w-full px-3 py-2 text-left text-[11px] hover:bg-bg border-b border-border/50 last:border-none transition-colors"
                      >
                        <div className="font-semibold">{res.name}</div>
                        <div className="text-[9px] text-text-dim">{res.admin1}, {res.country}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-1 ml-1">
                <span className="text-[10px] text-accent-blue font-semibold">{selectedLocation.name}</span>
                <span className="text-[10px] text-text-dim/50 italic">({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lon.toFixed(2)}°E)</span>
              </div>
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
      <main className="flex-1 grid grid-rows-[115px_1fr_180px] gap-4 p-4 overflow-hidden">
        {/* Weather Cards */}
        <section className="weather-cards">
          <WeatherCards data={weatherData} />
        </section>

        {/* Middle Section: Parallel Charts and Metrics */}
        <section className="grid grid-cols-[1fr_1fr_300px] gap-4 min-h-0">
          {/* Chart 1: Total Generation */}
          <div className="bg-card-bg/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col overflow-hidden shadow-2xl group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-4 text-[10px] uppercase font-black tracking-[0.2em] text-text-dim/80">
              <h2 className="flex items-center gap-2">
                <RefreshCw className={`w-3 h-3 ${weatherData ? '' : 'animate-spin'}`} />
                Total Efficiency Forecast
              </h2>
              <div className="flex gap-1">
                {['1h', '3h', '24h'].map(h => (
                  <button 
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border transition-all ${
                      horizon === h 
                      ? 'bg-accent-blue border-accent-blue text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                      : 'bg-bg/50 border-border text-text-dim hover:border-text-dim/50'
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

          {/* Chart 2: Division */}
          <div className="bg-card-bg/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col overflow-hidden shadow-2xl group hover:border-white/10 transition-colors">
             <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-text-dim/80 mb-4">Energy Type Division (Solar / Wind)</h2>
            <div className="flex-1 min-h-0">
              <EnergyDistributionChart data={chartData} />
            </div>
          </div>

          {/* Metrics Column */}
          <div className="bg-card-bg/60 backdrop-blur-md border border-white/5 p-4 rounded-xl flex flex-col overflow-hidden shadow-2xl group hover:border-white/10 transition-colors">
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em] text-text-dim/80 mb-4">Model Performance Matrix</h2>
            <div className="flex-1 overflow-auto">
              <MetricsTable currentHorizon={horizon} />
            </div>
          </div>
        </section>

        {/* Bottom Section: Logs */}
        <section className="bg-card-bg border border-border rounded-lg flex flex-col overflow-hidden">
          <div className="bg-bg/40 px-4 py-2 border-b border-border flex justify-between items-center shrink-0">
            <h2 className="text-xs font-semibold text-text-main">Recent Prediction Audit Log</h2>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-text-dim">Auto-refresh in {refreshTimer}s</span>
              <button 
                onClick={() => {
                  setRefreshTimer(30);
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
