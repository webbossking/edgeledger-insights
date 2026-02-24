import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Target, Search, BookOpen, BarChart3, Trophy, Activity, Settings, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Picks', href: '/app/picks', icon: Target },
  { label: 'Matches', href: '/app/matches', icon: Search },
  { label: 'Tracker', href: '/app/tracker', icon: BookOpen },
  { label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { label: 'Leaderboards', href: '/app/leaderboards', icon: Trophy },
  { label: 'Reliability', href: '/app/reliability', icon: Activity },
  { label: 'Settings', href: '/app/settings', icon: Settings },
];

export default function AppLayout() {
  const { authenticated, loading, logout, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) navigate('/auth/login');
  }, [loading, authenticated, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!authenticated) return null;

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');
  const username = (profile as { username?: string })?.username || 'User';

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">E</span>
            </div>
            EdgeLedger
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <Link key={item.href} to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href) ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
          <div className="mt-2 pt-2 border-t border-border">
            <Link to="/app/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive('/app/admin') ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
              <Shield className="h-4 w-4 shrink-0" />
              Admin (Mock)
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-card border-r border-border flex flex-col animate-slide-in">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <span className="font-bold text-lg">EdgeLedger</span>
              <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
              {navItems.map(item => (
                <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive(item.href) ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border">
                <Link to="/app/admin/dashboard" onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive('/app/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                  <Shield className="h-4 w-4" /> Admin (Mock)
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="relative">
            <button onClick={() => setProfileMenu(!profileMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{username}</span>
            </button>
            {profileMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-card-elevated py-1 animate-fade-in">
                <Link to="/app/profile" onClick={() => setProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link to="/app/settings" onClick={() => setProfileMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
                <button onClick={async () => { setProfileMenu(false); await logout(); navigate('/'); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted w-full text-destructive">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around h-16 px-1">
        {navItems.slice(0, 5).map(item => (
          <Link key={item.href} to={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-colors min-w-[56px] ${isActive(item.href) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
            <item.icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
