import { useState, useEffect } from 'react';
import * as api from '@/services/api';
import { defaultSourceStatus } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

export default function AdminSources() {
  const [sources, setSources] = useState<any>(defaultSourceStatus);
  const { toast } = useToast();

  useEffect(() => { api.getSourceStatus().then(setSources); }, []);

  const toggle = async (key: string) => {
    const statuses = ['live', 'cached', 'degraded'];
    const current = sources[key]?.status || 'live';
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    const updated = { ...sources, [key]: { status: next, lastUpdated: new Date().toISOString() } };
    await api.setSourceStatus(updated);
    setSources(updated);
    toast({ title: `${key} set to ${next}` });
  };

  const statusColor: Record<string, string> = { live: 'bg-success', cached: 'bg-warning', degraded: 'bg-destructive' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Admin Sources</h1><p className="text-sm text-muted-foreground">Toggle source statuses to test reliability UI</p></div>
      {['fixtures', 'odds', 'news'].map(key => (
        <div key={key} className="card-elevated p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <div><p className="font-medium capitalize">{key}</p><p className="text-xs text-muted-foreground">Current: {sources[key]?.status}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${statusColor[sources[key]?.status || 'live']}`} />
            <Button variant="outline" size="sm" onClick={() => toggle(key)}>Toggle</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
