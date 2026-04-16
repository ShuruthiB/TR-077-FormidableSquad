import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

const MetricsTable = () => {
  const metrics = [
    { horizon: '1h Forecast', rmse: 14.22, mae: 10.84, improvement: '-12.4%', status: 'better' },
    { horizon: '3h Forecast', rmse: 28.51, mae: 19.10, improvement: '-8.2%', status: 'better' },
    { horizon: '24h Forecast', rmse: 52.30, mae: 41.12, improvement: '-2.1%', status: 'stable' },
  ];

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2">Horizon</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2">RMSE</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2">MAE</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2">vs Baseline</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m) => (
          <tr key={m.horizon} className="border-b border-border/40">
            <td className="py-3 text-[13px] text-text-main font-semibold">{m.horizon}</td>
            <td className="py-3 text-[13px] text-text-main font-mono">{m.rmse.toFixed(2)}</td>
            <td className="py-3 text-[13px] text-text-main font-mono">{m.mae.toFixed(2)}</td>
            <td className={`py-3 text-[13px] font-bold ${
              m.status === 'better' ? 'text-accent-green' : 'text-accent-amber'
            }`}>
              {m.improvement}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MetricsTable;
