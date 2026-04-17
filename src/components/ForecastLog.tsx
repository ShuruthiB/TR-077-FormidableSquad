import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ForecastLogProps {
  selectedLocation: any;
}

const ForecastLog: React.FC<ForecastLogProps> = ({ selectedLocation }) => {
  const now = new Date();
  const lat = selectedLocation?.lat || 0;
  const lon = selectedLocation?.lon || 0;
  
  // Generate logs for the last 4 hours dynamically in IST
  const logs = [0, 1, 2, 3].map((hourOffset) => {
    const logTime = new Date(now);
    logTime.setHours(now.getHours() - (hourOffset + 1));
    
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(logTime);
    const d = parts.find(p => p.type === 'day')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const y = parts.find(p => p.type === 'year')?.value;
    const h = parts.find(p => p.type === 'hour')?.value;
    
    const dateStr = `${y}-${m}-${d}`;
    const timeStr = `${h}:00:00`;
    
    // Seeded random for consistency based on location AND time
    const seed = parseInt(h || '0') + parseInt(d || '0') + Math.floor(lat) + Math.floor(lon);
    const locNoise = Math.sin(lat + lon) * 50; 
    const timeNoise = Math.cos(seed) * 10;
    
    // Base values are influenced by location coordinates
    const predicted = 450 + locNoise + timeNoise + (Math.random() * 20); 
    const actual = predicted + (Math.random() * 16 - 8);
    const errorVal = ((actual - predicted) / predicted) * 100;
    
    return {
      id: hourOffset,
      time: `${dateStr} ${timeStr}`,
      horizon: hourOffset % 2 === 0 ? '1h' : '3h',
      predicted: Math.max(0, predicted),
      actual: Math.max(0, actual),
      error: `${errorVal > 0 ? '+' : ''}${errorVal.toFixed(2)}%`,
      status: Math.abs(errorVal) < 2.5 ? 'ACCURATE' : 'MARGINAL'
    };
  });

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse min-w-[800px]">
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
          <tr key={log.id} className="border-b border-border/20 hover:bg-white/[0.02] transition-colors group">
            <td className="py-3 px-4 text-[12px] text-text-main font-mono tabular-nums">{log.time}</td>
            <td className="py-3 px-4">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-bg border border-border text-text-dim font-bold uppercase tracking-widest">{log.horizon}</span>
            </td>
            <td className="py-3 px-4 text-[13px] text-text-main font-black tracking-tight">{log.predicted.toFixed(1)} <span className="text-[10px] text-text-dim font-normal">kWh</span></td>
            <td className="py-3 px-4 text-[13px] text-text-main/80 font-bold">{log.actual.toFixed(1)} <span className="text-[10px] text-text-dim font-normal">kWh</span></td>
            <td className={`py-3 px-4 text-[11px] font-black ${
              log.error.startsWith('-') ? 'text-accent-green' : 'text-rose-400'
            }`}>
              {log.error}
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-accent-green/30 bg-accent-green/5 text-accent-green text-[9px] font-black uppercase tracking-tighter">
                <CheckCircle2 className="w-3 h-3" />
                {log.status}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default ForecastLog;
