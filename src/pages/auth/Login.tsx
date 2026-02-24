import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.length < 8) { setError('Enter a valid phone number'); return; }
    setLoading(true);
    try {
      await login('+234' + phone.replace(/^0/, ''));
      navigate('/auth/otp', { state: { phone: '+234' + phone.replace(/^0/, '') } });
    } catch (err: any) {
      setError(err.message);
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
          <h1 className="text-2xl font-bold">Welcome to EdgeLedger</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your phone number to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-muted rounded-lg text-sm font-medium shrink-0">+234</div>
              <Input
                type="tel" placeholder="8012345678" value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={11} className="flex-1"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground border-0">
            {loading ? 'Sending...' : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms of Service. Demo OTP: <span className="font-mono font-medium">123456</span>
        </p>
      </div>
    </div>
  );
}
