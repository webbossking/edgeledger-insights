import type { Pick } from '@/data/mockData';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const riskColors: Record<string, string> = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

const actionLabels: Record<string, { label: string; className: string }> = {
  bet_now: { label: 'Bet Now', className: 'bg-success/10 text-success' },
  wait: { label: 'Wait', className: 'bg-warning/10 text-warning' },
  no_bet: { label: 'No Bet', className: 'bg-destructive/10 text-destructive' },
};

export default function PickCard({ pick, onSave }: { pick: Pick; onSave?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const kickoff = new Date(pick.fixture.kickoff);
  const action = actionLabels[pick.action];

  return (
    <div className="card-elevated-hover p-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">{pick.fixture.league.code}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{kickoff.toLocaleDateString()} {kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="font-semibold text-sm">
            {pick.fixture.homeTeam.name} vs {pick.fixture.awayTeam.name}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{pick.market}</Badge>
            <span className="text-sm font-medium text-primary">{pick.pick}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${action.className}`}>{action.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${riskColors[pick.risk]}`}>
            {pick.risk === 'low' ? <Shield className="inline h-3 w-3 mr-0.5" /> : pick.risk === 'high' ? <AlertTriangle className="inline h-3 w-3 mr-0.5" /> : <TrendingUp className="inline h-3 w-3 mr-0.5" />}
            {pick.risk.charAt(0).toUpperCase() + pick.risk.slice(1)}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>Confidence: <strong className="text-foreground">{pick.confidence}%</strong></span>
        <span>Min Odds: <strong className="text-foreground">{pick.minOdds}</strong></span>
        <span>Stake: <strong className="text-foreground">{pick.stakeUnits}u</strong></span>
      </div>

      {/* Expand toggle */}
      <button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline">
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {expanded ? 'Hide details' : 'Why this pick'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Analysis</p>
            <p className="text-sm">{pick.whyThisPick}</p>
          </div>
          {pick.saferAlternative && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Safer Alternative</p>
              <p className="text-sm text-primary">{pick.saferAlternative}</p>
            </div>
          )}
          {pick.noBetConditions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">No Bet If…</p>
              <ul className="text-sm space-y-1">
                {pick.noBetConditions.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {onSave && (
            <button onClick={() => onSave(pick.id)} className="text-xs text-primary hover:underline font-medium">
              + Save to My Picks
            </button>
          )}
        </div>
      )}
    </div>
  );
}
