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
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-black/5 p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-black tracking-tighter text-primary">Vivahvedh</h1>
          </Link>
          <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email, mobile number, or Reg ID to receive a reset link.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Check Your Inbox</h3>
            <p className="text-muted-foreground text-sm mb-6">
              If an account exists with that identifier, we've sent a password reset link to its registered email address.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-bold text-foreground block">
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
                  className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-black/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-medium"
                  placeholder="e.g. john@example.com or 9876543210"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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
              <Link to="/login" className="inline-flex items-center text-sm font-bold text-foreground/60 hover:text-primary transition-colors">
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
