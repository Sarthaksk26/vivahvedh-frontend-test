import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../../lib/apiClient';
import { authStorage } from '../../lib/authStorage';
import { LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      const { token, user } = response.data;
      authStorage.setToken(token);
      authStorage.setUser(user);

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
      if (user.role === 'ADMIN') {
        toast.success('Welcome back, Admin!');
        navigate('/admin');
      } else {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error;
      const displayMsg = typeof errorMsg === 'string' 
        ? errorMsg 
        : Array.isArray(errorMsg)
          ? errorMsg.map((e: any) => e.message).join(', ')
          : "Login failed. Please check your credentials.";
      
      toast.error(displayMsg);
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-[10%] w-[300px] h-[300px] bg-amber-300/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl border shadow-2xl shadow-primary/5 rounded-3xl p-8 md:p-10 relative overflow-hidden">
          {/* Decorative gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-amber-400" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">पुन्हा स्वागत!</h1>
            <p className="text-muted-foreground text-sm">Welcome back — Sign in to find your match</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Mobile / Email / RegID</label>
              <input
                {...register("identifier")}
                type="text"
                className="flex h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
                placeholder="e.g. 9876543210 or VV-100201"
              />
              {errors.identifier && <p className="text-red-500 text-xs font-medium">{errors.identifier.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-foreground/80">Password</label>
                <a href="#" className="text-xs text-primary hover:underline font-semibold">Forgot?</a>
              </div>
              <input
                {...register("password")}
                type="password"
                className="flex h-12 w-full rounded-xl border border-input bg-background/80 px-4 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-xs font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white h-12 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In — लॉगिन करा'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Register Free — मोफत नोंदणी
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicator below card */}
        <p className="text-center mt-5 text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-primary/50" />
          सुरक्षित • Encrypted • 100% Private
        </p>
      </motion.div>
    </div>
  );
}
