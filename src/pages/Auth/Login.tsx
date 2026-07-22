import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../lib/apiClient';
import { authStorage } from '../../lib/authStorage';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import type { LoginResponse, ApiErrorResponse } from '../../types';
import type { AxiosError } from 'axios';
import { SEO } from '../../components/common/SEO';

const loginSchema = z.object({
  identifier: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    if (authStorage.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;

      authStorage.setUser(user);
      if (accessToken && refreshToken) {
        authStorage.setTokens(accessToken, refreshToken);
      }

      // If admin-created account, force password change on first login
      if (user.requiresPasswordChange) {
        authStorage.setForcePasswordChange(true);
        toast('⚠️ Your account was created by an admin. You MUST change your password now for security.', {
          icon: '🔒',
          duration: 6000
        });
      } else {
        authStorage.setForcePasswordChange(false);
      }

      // Route based on role
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');

      if (user.role === 'ADMIN') {
        toast.success('Welcome back, Admin!');
        navigate(returnUrl || '/admin');
      } else {
        toast.success('Welcome back!');
        navigate(returnUrl || '/dashboard');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMsg = axiosError.response?.data?.error;
      const displayMsg = typeof errorMsg === 'string' 
        ? errorMsg 
        : "Login failed. Please check your credentials.";
      
      toast.error(displayMsg);
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}
    >
      <SEO 
        title="Login | Vivahvedh" 
        description="Sign in to your Vivahvedh account to continue your matchmaking journey."
      />
      {/* Background decorations */}
      <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-kumkum-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-[300px] h-[300px] bg-haldi-400/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-border shadow-premium rounded-3xl p-8 md:p-10 relative overflow-hidden">
          {/* Cultural gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />

          <div className="text-center mb-8">
            {/* Logo */}
            <Link to="/" className="inline-block mb-5">
              <img src="/logo.png" alt="विवाहवेध" className="w-36 h-auto mx-auto object-contain mix-blend-multiply" />
            </Link>
            <h1 className="text-2xl font-display font-bold tracking-tight mb-1">पुन्हा स्वागत!</h1>
            <p className="text-muted-foreground text-sm font-ui">Welcome back — Sign in to find your match</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80 font-ui">Mobile / Email / RegID</label>
              <input
                {...register("identifier")}
                type="text"
                className="input-cultural"
                placeholder="e.g. 9876543210 or VV-100201"
              />
              {errors.identifier && <p className="text-red-500 text-xs font-medium font-ui">{errors.identifier.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground/80 font-ui">Password</label>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="input-cultural pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-medium font-ui">{errors.password.message}</p>}
              
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" className="text-xs font-ui font-bold text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl font-ui font-bold text-sm text-white shadow-kumkum hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In — लॉगिन करा
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-sans">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Register Free — मोफत नोंदणी
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicator below card */}
        <div className="text-center mt-5 flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-haldi-500/30" />
          <p className="text-xs text-muted-foreground/50 font-ui">
            सुरक्षित • Encrypted • 100% Private
          </p>
          <div className="w-8 h-px bg-haldi-500/30" />
        </div>
      </motion.div>
    </div>
  );
}
