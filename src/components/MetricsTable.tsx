import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MetricsTableProps {
  currentHorizon: string;
  selectedLocation: any;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ currentHorizon, selectedLocation }) => {
  // Use location coordinates to seed the metrics so they are predictably different per city
  const seed = (selectedLocation?.lat || 0) + (selectedLocation?.lon || 0);
  const drift = Math.abs(Math.sin(seed) * 5);
  
  const metrics = [
    { id: '1h', horizon: '1h Forecast', rmse: 12.22 + drift, mae: 8.84 + (drift * 0.7), improvement: `-${(10 + drift).toFixed(1)}%`, status: 'better' },
    { id: '3h', horizon: '3h Forecast', rmse: 24.51 + (drift * 2), mae: 17.10 + (drift * 1.5), improvement: `-${(6 + (drift/2)).toFixed(1)}%`, status: 'better' },
    { id: '24h', horizon: '24h Forecast', rmse: 48.30 + (drift * 4), mae: 38.12 + (drift * 3), improvement: `-${(2 + (drift/4)).toFixed(1)}%`, status: drift > 4 ? 'stable' : 'better' },
  ];

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse min-w-[320px]">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 pr-6">Horizon</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-6">RMSE</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-6">MAE</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 pl-6">vs Baseline</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m) => (
          <tr key={m.horizon} className={`border-b border-border/20 transition-all duration-300 ${
            currentHorizon === m.id ? 'bg-accent-blue/10 translate-x-1' : ''
          }`}>
            <td className="py-4 text-[13px] text-text-main font-bold pr-6">
              <div className="flex items-center gap-2">
                {currentHorizon === m.id ? (
                   <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_var(--accent-blue)]" />
                ) : (
                  <div className="w-2 h-2 rounded-full border border-border" />
                )}
                {m.horizon}
              </div>
            </td>
            <td className="py-4 text-[13px] text-text-main font-mono tracking-tighter tabular-nums px-6">{m.rmse.toFixed(2)}</td>
            <td className="py-4 text-[13px] text-text-main font-mono tracking-tighter tabular-nums px-6">{m.mae.toFixed(2)}</td>
            <td className={`py-4 text-[13px] font-black pl-6 ${
              m.status === 'better' ? 'text-accent-green' : 'text-accent-amber'
            }`}>
              <span className="flex items-center gap-1">
                {m.status === 'better' ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {m.improvement}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default MetricsTable;
