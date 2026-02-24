import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import { SkeletonKPI, SkeletonCard } from '@/components/SkeletonCard';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Analytics() {
  const [summary, setSummary] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalyticsSummary(), api.getAnalyticsSeries()]).then(([s, sr]) => { setSummary(s); setSeries(sr); setLoading(false); });
  }, []);

  if (loading) return <div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, i) => <SkeletonKPI key={i} />)}</div><SkeletonCard /><SkeletonCard /></div>;

  const kpis = [
    { label: 'Total P/L', value: `${summary.totalPL > 0 ? '+' : ''}${summary.totalPL}u`, icon: summary.totalPL >= 0 ? TrendingUp : TrendingDown, color: summary.totalPL >= 0 ? 'text-success' : 'text-destructive' },
    { label: 'ROI', value: `${summary.roi}%`, icon: BarChart3, color: summary.roi >= 0 ? 'text-success' : 'text-destructive' },
    { label: 'Win Rate', value: `${summary.winRate}%`, icon: Target, color: 'text-primary' },
    { label: 'Avg Odds', value: summary.avgOdds, icon: TrendingUp, color: 'text-foreground' },
    { label: 'Max Drawdown', value: `${summary.maxDrawdown}%`, icon: AlertTriangle, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-sm text-muted-foreground">Your betting performance breakdown</p></div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card-elevated p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><k.icon className={`h-3.5 w-3.5 ${k.color}`} />{k.label}</div>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="card-elevated p-4 md:p-6">
        <h3 className="font-semibold mb-4">Cumulative P/L</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" /><YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" /><Tooltip /><Area type="monotone" dataKey="cumPL" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} /></AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-4 md:p-6">
          <h3 className="font-semibold mb-4">Win Rate Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" /><YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" /><Tooltip /><Bar dataKey="winRate" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card-elevated p-4 md:p-6">
          <h3 className="font-semibold mb-4">ROI Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" /><YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" /><Tooltip /><Line type="monotone" dataKey="roi" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-elevated p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3"><Lightbulb className="h-5 w-5 text-warning" /><h3 className="font-semibold">Insights</h3></div>
        <div className="space-y-2 text-sm">
          <p>📊 Your best market is <strong className="text-primary">{summary.bestMarket}</strong></p>
          <p>⚠️ {summary.weeklyInsight}</p>
          <p>✅ Total bets analyzed: <strong>{summary.totalBets}</strong></p>
        </div>
      </div>
    </div>
  );
}
