import { CheckCircle } from 'lucide-react';

const steps = [
  { num: '01', title: 'Sign Up & Set Your Profile', desc: 'Create your account, select your favorite leagues and clubs, and set your risk preference. This personalizes your picks feed.', details: ['Choose leagues and clubs', 'Set experience level', 'Define risk appetite (Conservative / Balanced / Aggressive)'] },
  { num: '02', title: 'Browse Today\'s Picks', desc: 'Every day, EdgeLedger analyzes fixtures across 7+ leagues and generates picks with confidence scores and risk tags.', details: ['Safe, Value, and Avoid categories', 'Multi-market suggestions (1X2, BTTS, DNB, etc.)', '"No-bet" conditions for each pick'] },
  { num: '03', title: 'Set Your Bankroll Plan', desc: 'Define your starting bankroll, unit size, and exposure limits. EdgeLedger tracks your discipline automatically.', details: ['Starting bankroll & unit size', 'Max daily exposure percentage', 'Weekly loss limit & cool-off reminders'] },
  { num: '04', title: 'Place & Track Your Bets', desc: 'Log every bet with odds, stake, and result. EdgeLedger calculates your running P/L, ROI, and performance metrics.', details: ['One-click bet logging', 'Settle as win/loss/void', 'CSV export for external analysis'] },
  { num: '05', title: 'Analyze & Improve', desc: 'Review your analytics dashboard to understand your best markets, leagues, and patterns — then refine your strategy.', details: ['Cumulative P/L and ROI charts', 'Win rate by market and league', 'Drawdown tracking and insights'] },
];

export default function HowItWorks() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">How EdgeLedger Works</h1>
          <p className="text-muted-foreground text-lg">A step-by-step guide to using EdgeLedger for smarter, more disciplined betting.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((s, i) => (
            <div key={s.num} className="card-elevated p-6 md:p-8 flex gap-6">
              <div className="text-4xl font-black text-primary/20 shrink-0 hidden md:block">{s.num}</div>
              <div>
                <h3 className="text-lg font-semibold mb-2"><span className="md:hidden text-primary/40 mr-2">{s.num}</span>{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{s.desc}</p>
                <ul className="space-y-1.5">
                  {s.details.map(d => (
                    <li key={d} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
