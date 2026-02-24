import { Link } from 'react-router-dom';
import { BarChart3, Target, Shield } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-sm text-muted-foreground">Mock admin area for pick publishing and source management</p></div>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/app/admin/picks" className="card-elevated-hover p-6 text-center">
          <Target className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold">Manage Picks</h3>
          <p className="text-sm text-muted-foreground mt-1">Create and publish picks</p>
        </Link>
        <Link to="/app/admin/sources" className="card-elevated-hover p-6 text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold">Source Status</h3>
          <p className="text-sm text-muted-foreground mt-1">Toggle data source states</p>
        </Link>
        <div className="card-elevated p-6 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming in Phase 2</p>
        </div>
      </div>
    </div>
  );
}
