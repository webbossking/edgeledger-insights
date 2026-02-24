import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'What is EdgeLedger?', a: 'EdgeLedger is a football prediction and betting intelligence web app. We analyze daily fixtures, generate picks with confidence and risk tags, and help you track your betting performance with bankroll awareness.' },
  { q: 'How accurate are the picks?', a: 'EdgeLedger provides data-backed suggestions, not guarantees. Our picks include confidence percentages and risk tags so you can make informed decisions. Historical average win rate for safe picks is ~68%.' },
  { q: 'Is EdgeLedger free?', a: 'Yes! The free plan gives you access to 3 daily picks, basic analytics, and the bet tracker. Paid plans unlock unlimited picks, advanced analytics, and more features.' },
  { q: 'What is a "No Bet" condition?', a: 'Each pick comes with conditions under which you should NOT place the bet — like key player injuries, weather changes, or significant odds movement. This protects you from uninformed bets.' },
  { q: 'How does bankroll management work?', a: 'You set your starting bankroll, unit size, daily exposure limits, and weekly loss thresholds. EdgeLedger tracks your discipline and alerts you when you\'re over-exposed.' },
  { q: 'What markets do you cover?', a: 'We analyze 1X2, Double Chance, Draw No Bet (DNB), Both Teams to Score (BTTS), Over/Under totals, and Asian Handicap markets across major leagues.' },
  { q: 'Can I export my data?', a: 'Pro and Elite users can export bet logs as CSV. All users can export their full data as JSON from the Settings page.' },
  { q: 'How do leaderboards work?', a: 'Leaderboards rank users by ROI, discipline, and streaks. To appear on the ROI leaderboard, you need at least 30 settled bets — this ensures meaningful rankings.' },
  { q: 'What leagues do you cover?', a: 'Premier League, Champions League, La Liga, Serie A, NPFL, CAF Champions League, and International fixtures.' },
  { q: 'Is my data secure?', a: 'In the current Phase 1, all data is stored locally in your browser. No data is sent to external servers. Future versions will include encrypted cloud storage.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-muted-foreground mb-12">Everything you need to know about EdgeLedger.</p>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card-elevated overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-sm">{f.q}</span>
                {open === i ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
