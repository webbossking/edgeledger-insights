import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import type { Pick as PickType } from '@/data/mockData';
import PickCard from '@/components/PickCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Target } from 'lucide-react';

export default function Picks() {
  const [category, setCategory] = useState<string>('');
  const [picks, setPicks] = useState<PickType[]>([]);
  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState('');
  const [risk, setRisk] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getPicks({ category: category || undefined, league: league || undefined, risk: risk || undefined }).then(p => { setPicks(p); setLoading(false); });
  }, [category, league, risk]);

  const cats = [{ key: '', label: 'All' }, { key: 'safe', label: 'Safe' }, { key: 'value', label: 'Value' }, { key: 'avoid', label: 'Avoid' }];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Picks</h1><p className="text-sm text-muted-foreground">Browse today's analyzed picks</p></div>
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {cats.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${category === c.key ? 'bg-card shadow-card' : 'text-muted-foreground'}`}>{c.label}</button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {['', 'low', 'medium', 'high'].map(r => (
          <button key={r} onClick={() => setRisk(r)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${risk === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {r ? r.charAt(0).toUpperCase() + r.slice(1) + ' Risk' : 'Any Risk'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {loading ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />) :
          picks.length === 0 ? (
            <div className="card-elevated p-8 text-center"><Target className="h-8 w-8 text-muted-foreground mx-auto mb-3" /><p className="font-medium">No picks match your filters</p></div>
          ) : picks.map(p => <PickCard key={p.id} pick={p} onSave={id => api.saveUserPick(id)} />)}
      </div>
    </div>
  );
}
