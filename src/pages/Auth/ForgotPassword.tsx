import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your email, mobile number, or registration ID.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/forgot-password', { identifier: identifier.trim() });
      toast.success(res.data.message || 'Reset link sent');
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2 className="text-2xl font-display font-bold text-foreground">Reset Password</h2>
          <p className="text-muted-foreground mt-2 text-sm font-ui">
            Enter your email, mobile number, or Reg ID to receive a reset link.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-paan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-paan-500" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Check Your Inbox</h3>
            <p className="text-muted-foreground text-sm mb-6 font-sans">
              If an account exists with that identifier, we've sent a password reset link to its registered email address.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 text-white font-ui font-bold rounded-xl transition-colors"
              style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-ui font-bold text-foreground block">
                Email, Mobile, or Reg ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                  <Mail size={18} />
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-cultural pl-10"
                  placeholder="e.g. john@example.com or 9876543210"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-ui font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-kumkum"
              style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-ui font-bold text-foreground/60 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
