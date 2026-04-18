import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-[40px] p-12 shadow-premium border border-black/5"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
            <Search size={40} className="text-primary animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg">404</div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Lost in <span className="text-primary">Eternity?</span>
          </h1>
          <p className="text-foreground/40 text-lg font-medium leading-relaxed mb-10">
            The profile or page you are looking for has either found its match elsewhere or simply doesn't exist in our repository.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 h-14 rounded-2xl border border-black/10 font-display font-black text-xs uppercase tracking-[0.2em] text-foreground/60 hover:bg-black/5 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 h-14 rounded-2xl bg-primary text-white font-display font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
            >
              <Home size={16} /> Return Home
            </button>
          </div>
        </motion.div>

        {/* Brand Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-2 opacity-30"
        >
          <div className="w-8 h-[1px] bg-foreground" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">Vivahvedh</span>
          <div className="w-8 h-[1px] bg-foreground" />
        </motion.div>
      </div>
    </div>
  );
}
