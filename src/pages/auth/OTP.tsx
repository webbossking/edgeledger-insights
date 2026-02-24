import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as { phone?: string })?.phone || '+234XXXXXXXXXX';

  useEffect(() => {
    if (timer > 0) { const t = setTimeout(() => setTimer(timer - 1), 1000); return () => clearTimeout(t); }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      const hasProfile = await verifyOtp(phone, otp);
      navigate(hasProfile ? '/app/dashboard' : '/onboarding/profile');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground text-lg font-black">E</span>
          </div>
          <h1 className="text-2xl font-bold">Verify your phone</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the code sent to <strong>{phone}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">OTP Code</label>
            <Input
              type="text" placeholder="123456" value={otp} maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-muted-foreground">Resend code in {timer}s</p>
            ) : (
              <button type="button" onClick={() => setTimer(60)} className="text-xs text-primary hover:underline">Resend OTP</button>
            )}
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">Demo OTP: <span className="font-mono font-medium">123456</span></p>
      </div>
    </div>
  );
}
