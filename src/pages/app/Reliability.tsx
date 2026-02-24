import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Activity, CheckCircle, AlertTriangle, Clock, HelpCircle } from 'lucide-react';

const statusIcon: Record<string, any> = { live: CheckCircle, cached: Clock, degraded: AlertTriangle };
const statusColor: Record<string, string> = { live: 'text-success', cached: 'text-warning', degraded: 'text-destructive' };

export default function Reliability() {
  const [sources, setSources] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => { api.getSourceStatus().then(s => { setSources(s); setLoading(false); }); }, []);

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;

  const sourceList = [
    { key: 'fixtures', label: 'Fixtures Source', desc: 'Match schedules and results' },
    { key: 'odds', label: 'Odds Source', desc: 'Bookmaker odds data' },
    { key: 'news', label: 'News Source', desc: 'Team news and injuries' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Reliability</h1><p className="text-sm text-muted-foreground">Data source health status</p></div>
        <button onClick={() => setShowHelp(!showHelp)} className="p-2 hover:bg-muted rounded-lg"><HelpCircle className="h-5 w-5 text-muted-foreground" /></button>
      </div>

      {showHelp && (
        <div className="card-elevated p-4 bg-info/5 border-info/20 animate-fade-in">
          <h3 className="font-semibold text-sm mb-2">What this means</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong className="text-success">Live</strong> — Data is fresh and updated in real-time</li>
            <li><strong className="text-warning">Cached</strong> — Using recent cached data; source temporarily unavailable</li>
            <li><strong className="text-destructive">Degraded</strong> — Source is down; picks may be less reliable</li>
          </ul>
        </div>
      )}

      <div className="space-y-4">
        {sourceList.map(s => {
          const data = sources?.[s.key];
          const status = data?.status || 'live';
          const Icon = statusIcon[status];
          return (
            <div key={s.key} className="card-elevated p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${status === 'live' ? 'bg-success/10' : status === 'cached' ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                  <Activity className={`h-5 w-5 ${statusColor[status]}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1.5 text-sm font-medium ${statusColor[status]}`}>
                  <Icon className="h-4 w-4" />{status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
