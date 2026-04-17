import React from 'react';
import { Thermometer, Wind, Sun, Droplets, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  lastUpdated: string;
  colorClass?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, value, unit, trend, icon: Icon, lastUpdated, colorClass }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card-bg/60 backdrop-blur-md border border-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-white/5"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${colorClass?.split(' ')[0].replace('text-', 'bg-') || 'bg-accent-blue'}`} />
      
      <div className="flex justify-between items-start relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim/80 font-bold">{title}</span>
        <div className={`p-2 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300 ${colorClass || 'text-text-dim'}`}>
          <Icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
        </div>
      </div>
      
      <div className="my-3 relative z-10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-text-main tracking-tighter drop-shadow-sm">{value}</span>
          <span className="text-xs text-text-dim/60 font-bold uppercase tracking-widest">{unit}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1 relative z-10">
        <div className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider ${
          trend === 'up' ? 'bg-accent-green/20 text-accent-green' : trend === 'down' ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-text-dim'
        }`}>
          {trend === 'up' && <ArrowUp className="w-3 h-3 stroke-[3px]" />}
          {trend === 'down' && <ArrowDown className="w-3 h-3 stroke-[3px]" />}
          {trend === 'stable' && <Minus className="w-3 h-3 stroke-[3px]" />}
          <span>
            {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
          </span>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <span className="text-[8px] text-text-dim/30 uppercase font-black">Refreshed</span>
          <span className="text-[10px] text-text-dim/50 font-mono tabular-nums leading-none mt-0.5">{lastUpdated}</span>
        </div>
      </div>
    </motion.div>
  );
};

interface WeatherCardsProps {
  data: any;
}

const WeatherCards: React.FC<WeatherCardsProps> = ({ data }) => {
  if (!data) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {[1,2,3,4].map(i => <div key={i} className="bg-card-bg rounded-lg border border-border animate-pulse" />)}
    </div>
  );

  const current = data.current;
  if (!current) return <div className="text-rose-500 p-4">No current weather data available</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      <WeatherCard 
        title="Temperature"
        value={current.temperature_2m}
        unit="°C"
        trend="stable"
        icon={Thermometer}
        colorClass="text-accent-amber"
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Wind Speed"
        value={current.wind_speed_10m}
        unit="km/h"
        trend="up"
        icon={Wind}
        colorClass="text-accent-blue"
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Solar Irradiance"
        value={current.shortwave_radiation}
        unit="W/m²"
        trend="down"
        icon={Sun}
        colorClass="text-yellow-400"
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Humidity"
        value={current.relative_humidity_2m}
        unit="%"
        trend="stable"
        icon={Droplets}
        colorClass="text-cyan-400"
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
    </div>
  );
};

export default WeatherCards;
