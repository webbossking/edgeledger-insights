import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '@/services/api';
import type { Fixture } from '@/data/mockData';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Badge } from '@/components/ui/badge';

export default function Matches() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState('today');

  useEffect(() => {
    setLoading(true);
    api.getFixtures({ dateRange: day }).then(f => { setFixtures(f); setLoading(false); });
  }, [day]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Matches</h1><p className="text-sm text-muted-foreground">Browse fixtures by date</p></div>
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {['today', 'tomorrow', 'weekend'].map(d => (
          <button key={d} onClick={() => setDay(d)} className={`px-4 py-2 rounded-md text-sm font-medium ${day === d ? 'bg-card shadow-card' : 'text-muted-foreground'}`}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />) :
          fixtures.map(f => (
            <Link key={f.id} to={`/app/matches/${f.id}`} className="card-elevated-hover p-4 flex items-center justify-between block">
              <div>
                <span className="text-xs text-muted-foreground">{f.league.code} • {new Date(f.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <p className="font-semibold text-sm mt-1">{f.homeTeam.name} vs {f.awayTeam.name}</p>
                {f.score && <p className="text-sm text-primary font-bold mt-1">{f.score.home} - {f.score.away}</p>}
              </div>
              <Badge variant={f.status === 'finished' ? 'secondary' : f.status === 'live' ? 'default' : 'outline'} className="text-xs">
                {f.status}
              </Badge>
            </Link>
          ))}
      </div>
    </div>
  );
}
