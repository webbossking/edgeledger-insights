import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, Shield, BarChart3, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap, Eye, Lock } from 'lucide-react';
import PickCard from '@/components/PickCard';
import { picks } from '@/data/mockData';

const trustStats = [
  { label: 'Avg ROI', value: '+14.2%', icon: TrendingUp },
  { label: 'Win Rate', value: '68%', icon: Target },
  { label: 'Daily Picks', value: '15-25', icon: Zap },
  { label: 'Markets Covered', value: '7+', icon: Eye },
  { label: 'Risk Controls', value: 'Built-in', icon: Shield },
  { label: 'Bettors Trust Us', value: '2,400+', icon: CheckCircle },
];

const features = [
  { icon: Target, title: 'Daily Picks', desc: 'Safe, Value, and Avoid categories with confidence scores and risk tags.' },
  { icon: Eye, title: 'Multi-Market Intelligence', desc: '1X2, DNB, Double Chance, BTTS, Totals — not just straight win analysis.' },
  { icon: Shield, title: 'Bankroll Guardrails', desc: 'Unit-based staking, daily exposure limits, and loss streak detection.' },
  { icon: BarChart3, title: 'Performance Analytics', desc: 'Track ROI, P/L, drawdown, and win rate by market and league.' },
  { icon: AlertTriangle, title: '"No-Bet" Protection', desc: 'We tell you when NOT to bet — lineup risk, weather, odds drops.' },
  { icon: Lock, title: 'Reliability Layer', desc: 'Know if data is live, cached, or degraded. Full transparency always.' },
];

const steps = [
  { num: '01', title: 'View Today\'s Picks', desc: 'Browse analyzed picks with confidence scores, risk tags, and recommended stakes.' },
  { num: '02', title: 'Follow Your Risk Plan', desc: 'Set your bankroll, unit size, and exposure limits. We enforce discipline.' },
  { num: '03', title: 'Track & Improve', desc: 'Log your bets, analyze performance, and let data guide your next decision.' },
];

const plans = [
  { name: 'Free', price: '₦0', period: '/forever', features: ['3 daily picks', 'Basic analytics', 'Bet tracker', 'Community leaderboard'], cta: 'Get Started', highlight: false },
  { name: 'Pro', price: '₦4,999', period: '/month', features: ['All daily picks', 'Full analytics', 'Advanced risk controls', 'Match analyzer', 'Priority picks drop', 'CSV export'], cta: 'Coming Soon', highlight: true },
  { name: 'Elite', price: '₦12,999', period: '/month', features: ['Everything in Pro', 'Admin tools access', 'Custom alerts', 'Private leaderboard', 'API access (soon)', '1-on-1 support'], cta: 'Coming Soon', highlight: false },
];

export default function Landing() {
  const samplePick = picks[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" /> Data-backed betting intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance">
              Smarter, safer football betting decisions.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Data-backed picks with confidence scores, risk controls, and performance tracking. Stop guessing. Start analyzing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/login">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 hover:opacity-90 px-8 h-12 text-base">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="h-12 text-base px-8">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mt-16 max-w-lg mx-auto">
            {samplePick && <PickCard pick={samplePick} />}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">Trusted by disciplined bettors</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustStats.map(s => (
              <div key={s.label} className="card-elevated text-center p-4">
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to bet smarter</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete intelligence platform for football bettors who take their results seriously.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map(f => (
              <div key={f.title} className="card-elevated-hover p-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map(s => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-black text-primary/20 mb-3">{s.num}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive pick */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See a pick in action</h2>
            <p className="text-muted-foreground">Every pick includes analysis, risk assessment, and actionable guidance.</p>
          </div>
          <div className="max-w-lg mx-auto">
            {picks[1] && <PickCard pick={picks[1]} />}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map(p => (
              <div key={p.name} className={`card-elevated p-6 flex flex-col ${p.highlight ? 'ring-2 ring-primary' : ''}`}>
                {p.highlight && <span className="text-xs font-medium text-primary mb-2">Most Popular</span>}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-3 mb-4">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={p.cta === 'Get Started' ? '/auth/login' : '#'}>
                  <Button className={`w-full ${p.highlight ? 'gradient-primary text-primary-foreground border-0' : ''}`} variant={p.highlight ? 'default' : 'outline'} disabled={p.cta === 'Coming Soon'}>
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Committed to responsible betting</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            EdgeLedger is a decision-support tool — not a guarantee of profit. Gambling carries risk and you should never bet more than you can afford to lose. Our tools are designed to encourage discipline, risk awareness, and informed decision-making. If you feel your betting is becoming a problem, please seek help at <span className="text-primary font-medium">gamblinghelp.org</span>. 18+ only.
          </p>
        </div>
      </section>
    </div>
  );
}
