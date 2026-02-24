import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function MarketingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">E</span>
            </div>
            <span>EdgeLedger</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} to={l.href}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${location.pathname === l.href ? 'text-foreground font-medium bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/login">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0 hover:opacity-90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map(l => (
                <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-muted">{l.label}</Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gradient-primary text-primary-foreground border-0">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-black">E</span>
                </div>
                EdgeLedger
              </Link>
              <p className="text-sm text-muted-foreground">Smarter, safer football betting decisions backed by data.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/features" className="hover:text-foreground">Features</Link>
                <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
                <Link to="/how-it-works" className="hover:text-foreground">How it Works</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Resources</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/blog" className="hover:text-foreground">Blog</Link>
                <Link to="/faq" className="hover:text-foreground">FAQ</Link>
                <Link to="/contact" className="hover:text-foreground">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span>Terms of Service</span>
                <span>Privacy Policy</span>
                <span>Responsible Betting</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 EdgeLedger. All rights reserved.</p>
            <p>⚠️ Gambling involves risk. Only bet what you can afford to lose. 18+ only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
