import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, X } from 'lucide-react';

const plans = [
  { name: 'Free', price: '₦0', period: '/forever', features: { 'Daily picks': '3', 'Analytics': 'Basic', 'Bet tracker': true, 'Leaderboard': true, 'Match analyzer': false, 'Advanced risk controls': false, 'CSV export': false, 'Admin tools': false }, cta: 'Get Started', highlight: false },
  { name: 'Pro', price: '₦4,999', period: '/month', features: { 'Daily picks': 'Unlimited', 'Analytics': 'Full', 'Bet tracker': true, 'Leaderboard': true, 'Match analyzer': true, 'Advanced risk controls': true, 'CSV export': true, 'Admin tools': false }, cta: 'Join Waitlist', highlight: true },
  { name: 'Elite', price: '₦12,999', period: '/month', features: { 'Daily picks': 'Unlimited + Priority', 'Analytics': 'Full + Insights', 'Bet tracker': true, 'Leaderboard': true, 'Match analyzer': true, 'Advanced risk controls': true, 'CSV export': true, 'Admin tools': true }, cta: 'Join Waitlist', highlight: false },
];

const featureKeys = Object.keys(plans[0].features);

export default function Pricing() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Choose your plan</h1>
          <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more picks and advanced features.</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map(p => (
            <div key={p.name} className={`card-elevated p-6 flex flex-col ${p.highlight ? 'ring-2 ring-primary' : ''}`}>
              {p.highlight && <span className="text-xs font-medium text-primary mb-2">Most Popular</span>}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="mt-3 mb-6"><span className="text-3xl font-bold">{p.price}</span><span className="text-sm text-muted-foreground">{p.period}</span></div>
              <Link to={p.cta === 'Get Started' ? '/auth/login' : '#'} className="mt-auto">
                <Button className={`w-full ${p.highlight ? 'gradient-primary text-primary-foreground border-0' : ''}`} variant={p.highlight ? 'default' : 'outline'}>
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Feature</th>
                {plans.map(p => <th key={p.name} className="text-center py-3 px-4 font-semibold">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map(k => (
                <tr key={k} className="border-b border-border">
                  <td className="py-3 px-4">{k}</td>
                  {plans.map(p => {
                    const v = p.features[k as keyof typeof p.features];
                    return (
                      <td key={p.name} className="text-center py-3 px-4">
                        {v === true ? <CheckCircle className="h-4 w-4 text-success mx-auto" /> : v === false ? <X className="h-4 w-4 text-muted-foreground mx-auto" /> : <span>{v}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
