import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

const leagueOptions = ['EPL', 'UCL', 'La Liga', 'Serie A', 'NPFL', 'CAF', 'International'];
const clubOptions = ['Arsenal', 'Man City', 'Liverpool', 'Real Madrid', 'Barcelona', 'Bayern Munich', 'Juventus', 'PSG', 'Enyimba FC'];

export default function OnboardingProfile() {
  const { setProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [leagues, setLeagues] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const [experience, setExperience] = useState('Beginner');
  const [riskPref, setRiskPref] = useState('Balanced');
  const [notifTime, setNotifTime] = useState('Morning');

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ username: username || 'bettor_001', leagues, clubs, experience, riskPref, notifTime });
    navigate('/app/dashboard');
  };

  const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selected ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary/50'}`}>
      {selected && <CheckCircle className="inline h-3 w-3 mr-1" />}{label}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Set Up Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalize your EdgeLedger experience</p>
        </div>
        <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Username</label>
            <Input placeholder="e.g. bettor_king" value={username} onChange={e => setUsername(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Favorite Leagues</label>
            <div className="flex flex-wrap gap-2">
              {leagueOptions.map(l => <Chip key={l} label={l} selected={leagues.includes(l)} onClick={() => toggle(leagues, l, setLeagues)} />)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Favorite Clubs</label>
            <div className="flex flex-wrap gap-2">
              {clubOptions.map(c => <Chip key={c} label={c} selected={clubs.includes(c)} onClick={() => toggle(clubs, c, setClubs)} />)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Betting Experience</label>
            <div className="flex gap-2">
              {['Beginner', 'Intermediate', 'Advanced'].map(e => <Chip key={e} label={e} selected={experience === e} onClick={() => setExperience(e)} />)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Risk Preference</label>
            <div className="flex gap-2">
              {['Conservative', 'Balanced', 'Aggressive'].map(r => <Chip key={r} label={r} selected={riskPref === r} onClick={() => setRiskPref(r)} />)}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notification Time</label>
            <div className="flex gap-2">
              {['Morning', 'Afternoon', 'Evening'].map(t => <Chip key={t} label={t} selected={notifTime === t} onClick={() => setNotifTime(t)} />)}
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground border-0">
            Save & Enter App
          </Button>
        </form>
      </div>
    </div>
  );
}
