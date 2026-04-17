import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface EnergyDistributionChartProps {
  data: any[];
}

const EnergyDistributionChart: React.FC<EnergyDistributionChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorSolarDist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWindDist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHydroDist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTidalDist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#94A3B8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(val) => `${Math.round(val)}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', fontSize: '11px', backdropFilter: 'blur(8px)' }}
            itemStyle={{ color: '#F8FAFC' }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
          
          <Area 
            type="monotone" 
            dataKey="hydro" 
            stackId="1"
            stroke="#06B6D4" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorHydroDist)" 
            name="Hydropower"
          />
          <Area 
            type="monotone" 
            dataKey="tidal" 
            stackId="1"
            stroke="#818CF8" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTidalDist)" 
            name="Tidal"
          />
          <Area 
            type="monotone" 
            dataKey="wind" 
            stackId="1"
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorWindDist)" 
            name="Wind"
          />
          <Area 
            type="monotone" 
            dataKey="solar" 
            stackId="1"
            stroke="#FBBF24" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSolarDist)" 
            name="Solar"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyDistributionChart;
