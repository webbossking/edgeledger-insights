import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, Palette, Shield, Eye, Database, AlertTriangle, Download, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { profile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [bankroll, setBankroll] = useState<any>({});

  useEffect(() => {
    setSettings(storage.getSettings());
    setBankroll(storage.getBankrollPlan() || { startingBankroll: 100000, currentBankroll: 100000, unitSize: 2, maxDailyExposure: 10, weeklyLossLimit: 15 });
  }, []);

  const updateSetting = (key: string, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    storage.setSettings(updated);
  };

  const saveBankroll = () => {
    storage.setBankrollPlan(bankroll);
    toast({ title: 'Bankroll plan saved' });
  };

  const exportData = () => {
    const data = { profile: storage.getProfile(), settings: storage.getSettings(), bankroll: storage.getBankrollPlan(), betLogs: storage.getBetLogs(), savedPicks: storage.getSavedPicks() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edgeledger-data.json'; a.click();
    toast({ title: 'Data exported' });
  };

  const clearData = () => {
    if (confirm('This will clear all local data. Are you sure?')) { storage.clearAll(); toast({ title: 'Data cleared' }); window.location.reload(); }
  };

  const Section = ({ icon: Icon, title, desc, children }: { icon: any; title: string; desc: string; children: React.ReactNode }) => (
    <div className="card-elevated p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
        <div><h3 className="font-semibold">{title}</h3><p className="text-xs text-muted-foreground">{desc}</p></div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-2">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  const username = (profile as any)?.username || 'User';

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Manage your preferences and risk controls</p></div>

      {/* Overview card */}
      <div className="card-elevated p-5 gradient-primary text-primary-foreground">
        <h3 className="font-semibold text-lg mb-2">Settings Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="opacity-70 text-xs">Theme</span><p className="font-medium">{settings.darkMode ? 'Dark' : 'Light'}</p></div>
          <div><span className="opacity-70 text-xs">Low Data</span><p className="font-medium">{settings.lowDataMode ? 'On' : 'Off'}</p></div>
          <div><span className="opacity-70 text-xs">Risk Plan</span><p className="font-medium">{bankroll?.startingBankroll ? 'Configured' : 'Not set'}</p></div>
          <div><span className="opacity-70 text-xs">Last Sync</span><p className="font-medium">Just now</p></div>
        </div>
      </div>

      <Section icon={User} title="Profile" desc="Your account details">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">{username[0]?.toUpperCase()}</div>
          <div><p className="font-medium">{username}</p><p className="text-sm text-muted-foreground">+234XXXXXXXXXX</p></div>
        </div>
      </Section>

      <Section icon={Palette} title="Preferences" desc="Customize your experience">
        <Toggle label="Dark Mode" desc="Switch between light and dark themes" value={!!settings.darkMode} onChange={v => { updateSetting('darkMode', v); document.documentElement.classList.toggle('dark', v); }} />
        <Toggle label="Low Data Mode" desc="Reduce images and animations for slower connections" value={!!settings.lowDataMode} onChange={v => updateSetting('lowDataMode', v)} />
      </Section>

      <Section icon={Shield} title="Risk Controls" desc="Bankroll management and discipline tools">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs font-medium mb-1 block">Starting Bankroll (₦)</label><Input type="number" value={bankroll.startingBankroll || ''} onChange={e => setBankroll({ ...bankroll, startingBankroll: +e.target.value })} /></div>
          <div><label className="text-xs font-medium mb-1 block">Unit Size (%)</label><Input type="number" value={bankroll.unitSize || ''} onChange={e => setBankroll({ ...bankroll, unitSize: +e.target.value })} /></div>
          <div><label className="text-xs font-medium mb-1 block">Max Daily Exposure (%)</label><Input type="number" value={bankroll.maxDailyExposure || ''} onChange={e => setBankroll({ ...bankroll, maxDailyExposure: +e.target.value })} /></div>
          <div><label className="text-xs font-medium mb-1 block">Weekly Loss Limit (%)</label><Input type="number" value={bankroll.weeklyLossLimit || ''} onChange={e => setBankroll({ ...bankroll, weeklyLossLimit: +e.target.value })} /></div>
        </div>
        <Button onClick={saveBankroll} size="sm" className="gradient-primary text-primary-foreground border-0">Save Risk Plan</Button>
        <Toggle label="Cool-off Reminders" desc="Get reminded after consecutive losses" value={!!settings.coolOffReminders} onChange={v => updateSetting('coolOffReminders', v)} />
        <Toggle label="Chasing Losses Detection" desc="Alert when betting pattern suggests chasing" value={!!settings.chasingDetection} onChange={v => updateSetting('chasingDetection', v)} />
      </Section>

      <Section icon={Eye} title="Privacy" desc="Control your visibility">
        <Toggle label="Show on Leaderboard" desc="Allow your stats to appear on public leaderboards" value={settings.leaderboardVisible !== false} onChange={v => updateSetting('leaderboardVisible', v)} />
        <Toggle label="Hide ROI from Public" desc="Only you can see your ROI percentage" value={!!settings.hideRoi} onChange={v => updateSetting('hideRoi', v)} />
      </Section>

      <Section icon={Database} title="Data" desc="Export or clear your data">
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={exportData}><Download className="h-4 w-4 mr-1" />Export My Data</Button>
          <Button variant="outline" size="sm" className="text-destructive border-destructive/30" onClick={clearData}><Trash2 className="h-4 w-4 mr-1" />Clear Local Data</Button>
        </div>
      </Section>

      <div className="card-elevated p-5 border-destructive/20">
        <div className="flex items-center gap-3 mb-4"><AlertTriangle className="h-5 w-5 text-destructive" /><h3 className="font-semibold text-destructive">Danger Zone</h3></div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-destructive border-destructive/30" onClick={async () => { await logout(); navigate('/'); }}><LogOut className="h-4 w-4 mr-1" />Logout</Button>
          <Button variant="outline" className="text-destructive border-destructive/30" onClick={clearData}><Trash2 className="h-4 w-4 mr-1" />Reset Demo Data</Button>
        </div>
      </div>
    </div>
  );
}
