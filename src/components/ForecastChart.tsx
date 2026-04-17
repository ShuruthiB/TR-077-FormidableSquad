import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';

interface ForecastChartProps {
  data: any[];
  horizon: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, horizon }) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <defs>
            <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} strokeOpacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#94A3B8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dy={10}
            label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -20, fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            dx={-10}
            label={{ value: 'Total Energy (kWh)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
            tickFormatter={(val) => `${Math.round(val)}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(8px)' }}
            itemStyle={{ color: '#F8FAFC' }}
            cursor={{ stroke: '#334155', strokeWidth: 1 }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} />
          
          <Area 
            type="monotone" 
            dataKey="totalObserved" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorObs)" 
            name="Total Observed Generation"
          />
          <Area 
            type="monotone" 
            dataKey="totalPredicted" 
            stroke="#22C55E" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1} 
            fill="url(#colorPred)" 
            name="Total Predicted Generation"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
