import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Shield, BarChart3, Flame } from 'lucide-react';

export default function Profile() {
  const { profile } = useAuth();
  const p = profile as any || {};

  const stats = [
    { label: 'ROI', value: '+14.2%', icon: BarChart3 },
    { label: 'Win Rate', value: '68%', icon: Target },
    { label: 'Discipline', value: '92', icon: Shield },
    { label: 'Streak', value: '7 days', icon: Flame },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="card-elevated p-6 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mx-auto mb-4">
          {(p.username || 'U')[0]?.toUpperCase()}
        </div>
        <h1 className="text-xl font-bold">{p.username || 'User'}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Trophy className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium text-warning">Gold Tier</span>
        </div>
        {p.leagues && <p className="text-xs text-muted-foreground mt-2">Leagues: {p.leagues.join(', ')}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="card-elevated p-4 text-center">
            <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link to="/app/analytics"><Button variant="outline" className="flex-1">View My Analytics</Button></Link>
        <Link to="/app/settings"><Button variant="outline" className="flex-1">Edit Settings</Button></Link>
      </div>
    </div>
  );
}
