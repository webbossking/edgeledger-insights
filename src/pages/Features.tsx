import { Target, Shield, BarChart3, Eye, AlertTriangle, Lock, Smartphone, Zap } from 'lucide-react';

const modules = [
  { icon: Target, title: 'Daily Picks Engine', desc: 'Picks generated across Safe, Value, and Avoid categories. Each comes with confidence scores, risk tags, stake suggestions, and actionable guidance.' },
  { icon: Eye, title: 'Multi-Market Analysis', desc: 'Go beyond 1X2 — we analyze Double Chance, DNB, BTTS, Over/Under, and Asian Handicap to find the best market for each fixture.' },
  { icon: Shield, title: 'Bankroll Management', desc: 'Set your starting bankroll, unit size, daily exposure limits, and weekly loss thresholds. We flag when you\'re over-exposed.' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track cumulative P/L, ROI, win rate by market, drawdown, and get AI-powered insights on your betting patterns.' },
  { icon: AlertTriangle, title: 'No-Bet Protection', desc: 'Every pick includes conditions under which you should NOT bet — lineup changes, weather, odds movement, and more.' },
  { icon: Lock, title: 'Data Reliability Layer', desc: 'See exactly whether our data sources are live, cached, or degraded. Full transparency on data freshness.' },
  { icon: Smartphone, title: 'Mobile-First Experience', desc: 'Designed for on-the-go bettors with a bottom tab bar, swipe gestures, and PWA-ready architecture.' },
  { icon: Zap, title: 'Leaderboards & Community', desc: 'Compete on ROI and discipline — not volume. Minimum bet thresholds ensure fair, meaningful rankings.' },
];

export default function Features() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Features built for serious bettors</h1>
          <p className="text-muted-foreground text-lg">Every feature in EdgeLedger is designed around one principle: help you make better, more disciplined betting decisions.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {modules.map(m => (
            <div key={m.title} className="card-elevated-hover p-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
