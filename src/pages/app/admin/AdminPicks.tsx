import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import { fixtures, type Pick as PickType } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export default function AdminPicks() {
  const [adminPicks, setAdminPicks] = useState<PickType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ fixtureId: fixtures[3]?.id || '', market: '1X2', pick: '', confidence: '70', risk: 'low' as const, minOdds: '1.50', stakeUnits: '1.5', action: 'bet_now' as const, whyThisPick: '', saferAlternative: '', noBetConditions: '' });

  useEffect(() => { api.adminListPicks().then(setAdminPicks); }, []);

  const handleCreate = async () => {
    const fixture = fixtures.find(f => f.id === form.fixtureId) || fixtures[0];
    const pick: PickType = {
      id: `admin-${Date.now()}`, fixtureId: fixture.id, fixture,
      market: form.market, pick: form.pick, confidence: +form.confidence,
      risk: form.risk, minOdds: +form.minOdds, stakeUnits: +form.stakeUnits,
      action: form.action, category: form.risk === 'low' ? 'safe' : form.risk === 'medium' ? 'value' : 'avoid',
      whyThisPick: form.whyThisPick, saferAlternative: form.saferAlternative || undefined,
      noBetConditions: form.noBetConditions.split('\n').filter(Boolean), createdAt: new Date().toISOString(),
    };
    await api.adminCreatePick(pick);
    const updated = await api.adminListPicks();
    setAdminPicks(updated);
    setShowForm(false);
    toast({ title: 'Pick published!' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Admin Picks</h1><p className="text-sm text-muted-foreground">Create and manage picks</p></div>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1" />Create Pick</Button>
      </div>

      {showForm && (
        <div className="card-elevated p-6 space-y-4 animate-fade-in">
          <h3 className="font-semibold">New Pick</h3>
          <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" value={form.fixtureId} onChange={e => setForm({ ...form, fixtureId: e.target.value })}>
            {fixtures.slice(0, 20).map(f => <option key={f.id} value={f.id}>{f.homeTeam.name} vs {f.awayTeam.name}</option>)}
          </select>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background" value={form.market} onChange={e => setForm({ ...form, market: e.target.value })}>
              {['1X2', 'DNB', 'Double Chance', 'BTTS', 'Over/Under 2.5'].map(m => <option key={m}>{m}</option>)}
            </select>
            <Input placeholder="Pick (e.g. Home Win)" value={form.pick} onChange={e => setForm({ ...form, pick: e.target.value })} />
            <Input type="number" placeholder="Confidence %" value={form.confidence} onChange={e => setForm({ ...form, confidence: e.target.value })} />
            <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background" value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value as any })}>
              <option value="low">Low Risk</option><option value="medium">Medium Risk</option><option value="high">High Risk</option>
            </select>
            <Input type="number" placeholder="Min Odds" value={form.minOdds} onChange={e => setForm({ ...form, minOdds: e.target.value })} />
            <Input type="number" placeholder="Stake Units" value={form.stakeUnits} onChange={e => setForm({ ...form, stakeUnits: e.target.value })} />
          </div>
          <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" value={form.action} onChange={e => setForm({ ...form, action: e.target.value as any })}>
            <option value="bet_now">Bet Now</option><option value="wait">Wait</option><option value="no_bet">No Bet</option>
          </select>
          <Textarea placeholder="Why this pick..." value={form.whyThisPick} onChange={e => setForm({ ...form, whyThisPick: e.target.value })} />
          <Input placeholder="Safer alternative (optional)" value={form.saferAlternative} onChange={e => setForm({ ...form, saferAlternative: e.target.value })} />
          <Textarea placeholder="No-bet conditions (one per line)" value={form.noBetConditions} onChange={e => setForm({ ...form, noBetConditions: e.target.value })} rows={3} />
          <Button onClick={handleCreate} className="gradient-primary text-primary-foreground border-0">Publish Pick</Button>
        </div>
      )}

      {adminPicks.length === 0 ? (
        <div className="card-elevated p-8 text-center"><p className="text-muted-foreground">No admin picks yet. Create your first pick above.</p></div>
      ) : (
        <div className="space-y-3">
          {adminPicks.map((p: any) => (
            <div key={p.id} className="card-elevated p-4">
              <p className="font-medium text-sm">{p.fixture?.homeTeam?.name} vs {p.fixture?.awayTeam?.name}</p>
              <p className="text-sm text-muted-foreground">{p.market} — {p.pick} ({p.confidence}%)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
