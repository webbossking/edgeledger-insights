import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import type { LeaderboardEntry } from '@/data/mockData';
import { SkeletonTable } from '@/components/SkeletonCard';
import { Trophy, Shield, Flame, AlertCircle } from 'lucide-react';

const tierColors: Record<string, string> = { Bronze: 'text-orange-600', Silver: 'text-muted-foreground', Gold: 'text-yellow-500', Elite: 'text-primary' };

export default function Leaderboards() {
  const [tab, setTab] = useState<'roi' | 'discipline' | 'streaks'>('roi');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getLeaderboard(tab).then(d => { setData(d); setLoading(false); });
  }, [tab]);

  const tabs = [
    { key: 'roi' as const, label: 'ROI', icon: Trophy },
    { key: 'discipline' as const, label: 'Discipline', icon: Shield },
    { key: 'streaks' as const, label: 'Streaks', icon: Flame },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Leaderboards</h1><p className="text-sm text-muted-foreground">Compete on results and discipline</p></div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${tab === t.key ? 'bg-card shadow-card' : 'text-muted-foreground'}`}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
          </button>
        ))}
      </div>

      <div className="card-elevated p-4 flex items-start gap-3 bg-info/5 border-info/20">
        <AlertCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <div><p className="text-sm font-medium">Minimum 30 settled bets required</p><p className="text-xs text-muted-foreground">To appear on the ROI leaderboard, you need at least 30 settled bets. This ensures fair rankings.</p></div>
      </div>

      {loading ? <SkeletonTable rows={10} /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left">
              <th className="py-3 px-3 font-medium text-muted-foreground w-12">#</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">User</th>
              {tab === 'roi' && <><th className="py-3 px-3 font-medium text-muted-foreground">ROI</th><th className="py-3 px-3 font-medium text-muted-foreground">Bets</th><th className="py-3 px-3 font-medium text-muted-foreground">Win Rate</th></>}
              {tab === 'discipline' && <><th className="py-3 px-3 font-medium text-muted-foreground">Score</th><th className="py-3 px-3 font-medium text-muted-foreground">Unit Var</th><th className="py-3 px-3 font-medium text-muted-foreground">Exposure</th></>}
              {tab === 'streaks' && <><th className="py-3 px-3 font-medium text-muted-foreground">Profit Streak</th><th className="py-3 px-3 font-medium text-muted-foreground">Discipline Streak</th></>}
              <th className="py-3 px-3 font-medium text-muted-foreground">Tier</th>
            </tr></thead>
            <tbody>
              {data.map(u => (
                <tr key={u.rank} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-3 font-bold">{u.rank}</td>
                  <td className="py-3 px-3 font-medium">{u.username}</td>
                  {tab === 'roi' && <><td className={`py-3 px-3 font-bold ${u.roi >= 0 ? 'text-success' : 'text-destructive'}`}>{u.roi > 0 ? '+' : ''}{u.roi}%</td><td className="py-3 px-3">{u.betCount}</td><td className="py-3 px-3">{u.winRate}%</td></>}
                  {tab === 'discipline' && <><td className="py-3 px-3 font-bold">{u.disciplineScore}</td><td className="py-3 px-3">{u.avgUnitVariance}</td><td className="py-3 px-3">{u.exposureControlScore}</td></>}
                  {tab === 'streaks' && <><td className="py-3 px-3 font-bold">{u.profitStreakDays}d</td><td className="py-3 px-3">{u.disciplineStreakDays}d</td></>}
                  <td className={`py-3 px-3 font-medium ${tierColors[u.tier]}`}>{u.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
