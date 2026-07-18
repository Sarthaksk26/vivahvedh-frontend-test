import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-kumkum-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-haldi-400/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl rounded-[32px] p-12 shadow-premium border border-border relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 via-haldi-500 to-kumkum-500" />
          
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
            <Search size={40} className="text-primary animate-pulse" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-kumkum-500 text-white rounded-full flex items-center justify-center text-xs font-ui font-bold shadow-lg">404</div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            हे पान <span className="text-primary">सापडले नाही</span>
          </h1>
          <p className="text-foreground/40 text-base font-sans leading-relaxed mb-10">
            The page you are looking for has either found its match elsewhere or simply doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 h-12 rounded-xl border-2 border-border font-ui font-bold text-sm text-foreground/60 hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> मागे जा
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 h-12 rounded-xl text-white font-ui font-bold text-sm shadow-kumkum transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
            >
              <Home size={16} /> मुखपृष्ठ
            </button>
          </div>
        </motion.div>

        {/* Brand Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex items-center justify-center gap-3 opacity-30"
        >
          <div className="w-8 h-px bg-haldi-500" />
          <span className="text-xs font-ui font-bold uppercase tracking-[0.3em] text-foreground">विवाहवेध</span>
          <div className="w-8 h-px bg-haldi-500" />
        </motion.div>
      </div>
    </div>
  );
}
