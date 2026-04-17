import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface MetricsTableProps {
  currentHorizon: string;
}

const MetricsTable: React.FC<MetricsTableProps> = ({ currentHorizon }) => {
  const metrics = [
    { id: '1h', horizon: '1h Forecast', rmse: 14.22, mae: 10.84, improvement: '-12.4%', status: 'better' },
    { id: '3h', horizon: '3h Forecast', rmse: 28.51, mae: 19.10, improvement: '-8.2%', status: 'better' },
    { id: '24h', horizon: '24h Forecast', rmse: 52.30, mae: 41.12, improvement: '-2.1%', status: 'stable' },
  ];

  return (
    <table className="w-full border-collapse">
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
  );
};

export default MetricsTable;
