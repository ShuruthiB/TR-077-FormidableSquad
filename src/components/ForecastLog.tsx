import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ForecastLog = () => {
  const logs = [
    { id: 1, time: '2025-05-12 14:00:00', horizon: '1h', predicted: 312.8, actual: 315.2, error: '-0.76%', status: 'ACCURATE' },
    { id: 2, time: '2025-05-12 13:00:00', horizon: '1h', predicted: 288.4, actual: 291.0, error: '-0.89%', status: 'ACCURATE' },
    { id: 3, time: '2025-05-12 11:00:00', horizon: '3h', predicted: 245.1, actual: 238.9, error: '+2.59%', status: 'ACCURATE' },
    { id: 4, time: '2025-05-12 10:00:00', horizon: '1h', predicted: 210.2, actual: 215.1, error: '-2.27%', status: 'ACCURATE' },
  ];

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-bg/20">
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Timestamp (IST)</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Horizon</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Predicted</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Actual</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Error %</th>
          <th className="text-left text-[11px] text-text-dim uppercase tracking-wider font-semibold py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
            <td className="py-2 px-4 text-[13px] text-text-main font-mono">{log.time}</td>
            <td className="py-2 px-4 text-[13px] text-text-main font-semibold">{log.horizon}</td>
            <td className="py-2 px-4 text-[13px] text-text-main font-mono">{log.predicted.toFixed(1)} kWh</td>
            <td className="py-2 px-4 text-[13px] text-text-main font-mono">{log.actual.toFixed(1)} kWh</td>
            <td className="py-2 px-4 text-[13px] text-text-main font-mono">{log.error}</td>
            <td className="py-2 px-4">
              <span className="px-2 py-0.5 rounded-full border border-accent-green bg-accent-green/10 text-accent-green text-[11px] font-bold">
                {log.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ForecastLog;
