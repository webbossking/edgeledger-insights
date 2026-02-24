import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '@/services/api';
import PickCard from '@/components/PickCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { ArrowLeft, Swords, BarChart3, Newspaper } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (id) api.getMatchById(id).then(m => { setMatch(m); setLoading(false); });
  }, [id]);

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  if (!match) return <div className="card-elevated p-8 text-center">Match not found</div>;

  const s = match.signals;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/app/matches" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to Matches</Link>
      <div className="card-elevated p-6">
        <span className="text-xs text-muted-foreground">{match.league.name}</span>
        <h1 className="text-xl font-bold mt-1">{match.homeTeam.name} vs {match.awayTeam.name}</h1>
        <p className="text-sm text-muted-foreground">{new Date(match.kickoff).toLocaleString()}</p>
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[{ key: 'overview', label: 'Overview', icon: Swords }, { key: 'signals', label: 'Signals', icon: BarChart3 }, { key: 'news', label: 'Team News', icon: Newspaper }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 ${tab === t.key ? 'bg-card shadow-card' : 'text-muted-foreground'}`}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-3">
          <h3 className="font-semibold">Picks for this match</h3>
          {match.picks.length === 0 ? <p className="text-sm text-muted-foreground">No picks available for this match.</p> :
            match.picks.map((p: any) => <PickCard key={p.id} pick={p} onSave={id => api.saveUserPick(id)} />)}
        </div>
      )}

      {tab === 'signals' && (
        <div className="space-y-4">
          {[
            { label: 'Home Attack', value: s.attackStrength.home },
            { label: 'Away Attack', value: s.attackStrength.away },
            { label: 'Home Defense', value: s.defenseStrength.home },
            { label: 'Away Defense', value: s.defenseStrength.away },
            { label: 'BTTS Likelihood', value: s.bttsLikelihood },
            { label: 'Volatility', value: s.volatility },
          ].map(item => (
            <div key={item.label} className="card-elevated p-4">
              <div className="flex justify-between text-sm mb-2"><span>{item.label}</span><span className="font-bold">{Math.round(item.value)}%</span></div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-elevated p-4 text-center"><p className="text-xs text-muted-foreground">Goal Expectancy</p><p className="text-xl font-bold">{s.goalExpectancy}</p></div>
            <div className="card-elevated p-4 text-center"><p className="text-xs text-muted-foreground">Tempo</p><p className="text-xl font-bold">{s.tempo}</p></div>
          </div>
        </div>
      )}

      {tab === 'news' && (
        <div className="space-y-3">
          {match.news.length === 0 ? <p className="text-sm text-muted-foreground">No team news available.</p> :
            match.news.map((n: any) => (
              <div key={n.id} className="card-elevated p-4">
                <span className="text-xs text-muted-foreground capitalize">{n.type}</span>
                <p className="font-medium text-sm mt-1">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.content}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
