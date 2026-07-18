import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        token,
        newPassword: password
      });
      toast.success(res.data.message || 'Password successfully reset!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password. The link might be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}
    >
      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-premium border border-border p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-kumkum-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-block mb-6">
            <img src="/logo.png" alt="विवाहवेध" className="w-36 h-auto mx-auto object-contain mix-blend-multiply" />
          </Link>
          <h2 className="text-2xl font-display font-bold text-foreground">Create New Password</h2>
          <p className="text-muted-foreground mt-2 text-sm font-ui">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-ui font-bold text-foreground block">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-cultural pl-10"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-ui font-bold text-foreground block">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                <Lock size={18} />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-cultural pl-10"
                placeholder="Confirm your new password"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-ui font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-kumkum mt-2"
            style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-ui font-bold text-foreground/60 hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
