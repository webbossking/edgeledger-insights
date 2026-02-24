import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '@/services/api';
import type { Pick as PickType } from '@/data/mockData';
import PickCard from '@/components/PickCard';
import { SkeletonCard, SkeletonKPI } from '@/components/SkeletonCard';
import { Target, TrendingUp, AlertTriangle, Wallet, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const [tab, setTab] = useState<'today' | 'tomorrow' | 'weekend'>('today');
  const [picks, setPicks] = useState<PickType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [league, setLeague] = useState('');
  const [bankroll, setBankroll] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getPicks({ day: tab }), api.getBankrollPlan()]).then(([p, b]) => {
      setPicks(p); setBankroll(b); setLoading(false);
    });
  }, [tab]);

  const filtered = picks.filter(p => {
    if (search && !p.fixture.homeTeam.name.toLowerCase().includes(search.toLowerCase()) && !p.fixture.awayTeam.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (league && p.fixture.league.id !== league) return false;
    return true;
  });

  const safe = filtered.filter(p => p.category === 'safe').length;
  const value = filtered.filter(p => p.category === 'value').length;
  const avoid = filtered.filter(p => p.category === 'avoid').length;

  const tabs = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'weekend', label: 'Weekend' },
  ] as const;

  const leagues = ['epl', 'ucl', 'laliga', 'seriea', 'npfl', 'caf', 'intl'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your daily betting intelligence overview</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-card shadow-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />) : (
          <>
            <div className="card-elevated p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Target className="h-3.5 w-3.5 text-success" />Safe Picks</div>
              <p className="text-2xl font-bold">{safe}</p>
            </div>
            <div className="card-elevated p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><TrendingUp className="h-3.5 w-3.5 text-warning" />Value Picks</div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="card-elevated p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><AlertTriangle className="h-3.5 w-3.5 text-destructive" />Avoid List</div>
              <p className="text-2xl font-bold">{avoid}</p>
            </div>
            <div className="card-elevated p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Wallet className="h-3.5 w-3.5 text-primary" />Bankroll</div>
              <p className="text-2xl font-bold">₦{bankroll?.currentBankroll?.toLocaleString()}</p>
            </div>
          </>
        )}
      </div>

      {/* Daily Drop Banner */}
      <div className="card-elevated p-4 flex items-center gap-3 bg-primary/5 border-primary/20">
        <Clock className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-medium">Daily Drop at 10:30 AM</p>
          <p className="text-xs text-muted-foreground">Fresh picks are published every morning</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link to="/app/tracker" className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">Log Bet</Link>
        <Link to="/app/tracker" className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">View Tracker</Link>
        <Link to="/app/analytics" className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">Open Analytics</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by team..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setLeague('')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!league ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>All</button>
          {leagues.map(l => (
            <button key={l} onClick={() => setLeague(l === league ? '' : l)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${league === l ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Picks list */}
      <div className="space-y-3">
        {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) :
          filtered.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <Target className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">No picks found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
            </div>
          ) : filtered.slice(0, 10).map(p => <PickCard key={p.id} pick={p} onSave={(id) => api.saveUserPick(id)} />)
        }
      </div>
    </div>
  );
}
