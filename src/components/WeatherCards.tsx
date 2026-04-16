import React from 'react';
import { Cloud, Wind, Sun, Droplets, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  lastUpdated: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, value, unit, trend, icon: Icon, lastUpdated }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card-bg border border-border p-4 rounded-lg flex flex-col justify-between shadow-sm"
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] uppercase tracking-wider text-text-dim font-semibold">{title}</span>
        <Icon className="w-3.5 h-3.5 text-text-dim/50" />
      </div>
      
      <div className="my-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-text-main">{value}</span>
          <span className="text-xs text-text-dim">{unit}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <div className={`flex items-center gap-1 text-[12px] ${
          trend === 'up' ? 'text-accent-green' : trend === 'down' ? 'text-rose-500' : 'text-text-dim'
        }`}>
          {trend === 'up' && <ArrowUp className="w-3 h-3" />}
          {trend === 'down' && <ArrowDown className="w-3 h-3" />}
          {trend === 'stable' && <Minus className="w-3 h-3" />}
          <span className="font-medium">
            {trend === 'up' ? '↑ Increasing' : trend === 'down' ? '↓ Decreasing' : '→ Stable'}
          </span>
        </div>
        <span className="text-[10px] text-text-dim/60 ml-auto font-mono">{lastUpdated.split(' ')[0]}</span>
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
        icon={Cloud}
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Wind Speed"
        value={current.wind_speed_10m}
        unit="km/h"
        trend="up"
        icon={Wind}
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Solar Irradiance"
        value={current.shortwave_radiation}
        unit="W/m²"
        trend="down"
        icon={Sun}
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
      <WeatherCard 
        title="Humidity"
        value={current.relative_humidity_2m}
        unit="%"
        trend="stable"
        icon={Droplets}
        lastUpdated={new Date().toLocaleTimeString('en-IN', { hour12: false })}
      />
    </div>
  );
};

export default WeatherCards;
