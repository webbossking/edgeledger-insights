import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import type { BetLog } from '@/data/mockData';
import { SkeletonTable, SkeletonKPI } from '@/components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Download, Wallet, CheckCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function Tracker() {
  const [logs, setLogs] = useState<BetLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankroll, setBankroll] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ match: '', market: '1X2', odds: '', stakeUnits: '', notes: '' });
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([api.listBetLogs(), api.getBankrollPlan()]).then(([l, b]) => { setLogs(l); setBankroll(b); setLoading(false); });
  }, []);

  const handleLog = async () => {
    if (!form.match || !form.odds || !form.stakeUnits) return;
    await api.createBetLog({ date: new Date().toISOString().slice(0, 10), match: form.match, market: form.market, odds: +form.odds, stakeUnits: +form.stakeUnits, result: 'pending', payout: 0, notes: form.notes });
    const updated = await api.listBetLogs();
    setLogs(updated);
    setShowModal(false);
    setForm({ match: '', market: '1X2', odds: '', stakeUnits: '', notes: '' });
    toast({ title: 'Bet logged successfully' });
  };

  const settle = async (id: string, result: 'won' | 'lost' | 'void') => {
    const log = logs.find(l => l.id === id);
    if (!log) return;
    const payout = result === 'won' ? log.odds * log.stakeUnits : result === 'void' ? log.stakeUnits : 0;
    await api.updateBetLog(id, { result, payout });
    const updated = await api.listBetLogs();
    setLogs(updated);
    toast({ title: `Bet settled as ${result}` });
  };

  const exportCSV = async () => {
    const csv = await api.exportBetLogsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edgeledger-bets.csv'; a.click();
    toast({ title: 'CSV exported' });
  };

  const resultColor: Record<string, string> = { won: 'bg-success/10 text-success', lost: 'bg-destructive/10 text-destructive', pending: 'bg-warning/10 text-warning', void: 'bg-muted text-muted-foreground' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Tracker</h1><p className="text-sm text-muted-foreground">Log and manage your bets</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />CSV</Button>
          <Button size="sm" onClick={() => setShowModal(true)} className="gradient-primary text-primary-foreground border-0"><Plus className="h-4 w-4 mr-1" />Log Bet</Button>
        </div>
      </div>

      {/* Bankroll banner */}
      {loading ? <SkeletonKPI /> : bankroll && (
        <div className="card-elevated p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-xs text-muted-foreground">Starting</p><p className="font-bold">₦{bankroll.startingBankroll?.toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Current</p><p className="font-bold text-primary">₦{bankroll.currentBankroll?.toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Unit Size</p><p className="font-bold">{bankroll.unitSize}%</p></div>
          <div><p className="text-xs text-muted-foreground">Max Daily</p><p className="font-bold">{bankroll.maxDailyExposure}%</p></div>
        </div>
      )}

      {/* Bet logs */}
      {loading ? <SkeletonTable /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left">
              <th className="py-3 px-3 font-medium text-muted-foreground">Date</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Match</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Market</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Odds</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Stake</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Result</th>
              <th className="py-3 px-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b border-border">
                  <td className="py-3 px-3">{l.date}</td>
                  <td className="py-3 px-3 font-medium">{l.match}</td>
                  <td className="py-3 px-3">{l.market}</td>
                  <td className="py-3 px-3">{l.odds}</td>
                  <td className="py-3 px-3">{l.stakeUnits}u</td>
                  <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resultColor[l.result]}`}>{l.result}</span></td>
                  <td className="py-3 px-3">
                    {l.result === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => settle(l.id, 'won')} className="text-xs text-success hover:underline">Win</button>
                        <button onClick={() => settle(l.id, 'lost')} className="text-xs text-destructive hover:underline">Loss</button>
                        <button onClick={() => settle(l.id, 'void')} className="text-xs text-muted-foreground hover:underline">Void</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log bet modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setShowModal(false)} />
          <div className="relative card-elevated p-6 w-full max-w-md space-y-4 animate-fade-in">
            <div className="flex justify-between items-center"><h3 className="font-semibold text-lg">Log Bet</h3><button onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button></div>
            <Input placeholder="Match (e.g. Arsenal vs Man City)" value={form.match} onChange={e => setForm({ ...form, match: e.target.value })} />
            <select className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background" value={form.market} onChange={e => setForm({ ...form, market: e.target.value })}>
              {['1X2', 'DNB', 'Double Chance', 'BTTS', 'Over/Under 2.5'].map(m => <option key={m}>{m}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="Odds" value={form.odds} onChange={e => setForm({ ...form, odds: e.target.value })} />
              <Input type="number" placeholder="Stake (units)" value={form.stakeUnits} onChange={e => setForm({ ...form, stakeUnits: e.target.value })} />
            </div>
            <Input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <Button onClick={handleLog} className="w-full gradient-primary text-primary-foreground border-0">Save Bet</Button>
          </div>
        </div>
      )}
    </div>
  );
}
