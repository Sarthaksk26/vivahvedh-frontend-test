import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Search, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

// --- Reusable Scroll Animation Wrapper ---
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 28 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}} 
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Luxury Traditional Garland Visual Divider (झेंडूची माळ) ---
const GarlandDivider = () => (
  <div className="flex flex-col items-center justify-center my-16 select-none opacity-90 scale-90 md:scale-100">
    <svg viewBox="0 0 400 30" className="w-full max-w-lg text-amber-500 fill-none" stroke="currentColor">
      <defs>
        <linearGradient id="marigoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>
      
      {/* Golden String */}
      <path d="M 10 10 Q 100 25 200 10 Q 300 25 390 10" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Leaf & Flower elements */}
      <circle cx="10" cy="10" r="3" fill="#D97706" />
      
      <path d="M 60 14 Q 50 35 60 40 Q 70 35 60 14" fill="url(#leafGrad)" stroke="none" />
      <circle cx="60" cy="13" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="60" cy="13" r="3" fill="#EF4444" />

      <circle cx="110" cy="17" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="110" cy="17" r="3" fill="#EF4444" />
      
      <path d="M 150 18 Q 140 38 150 45 Q 160 38 150 18" fill="url(#leafGrad)" stroke="none" />
      <circle cx="150" cy="17" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      
      <g transform="translate(200, 18)">
        <circle cx="0" cy="0" r="10" fill="url(#marigoldGrad)" className="animate-pulse" />
        <circle cx="0" cy="0" r="6" fill="#EA580C" />
        <circle cx="0" cy="0" r="3" fill="#EF4444" />
        <path d="M -3 10 L 3 10 L 4 15 L -4 15 Z" fill="#D4AF37" />
        <circle cx="0" cy="17" r="1.5" fill="#D4AF37" />
      </g>

      <path d="M 250 18 Q 240 38 250 45 Q 260 38 250 18" fill="url(#leafGrad)" stroke="none" />
      <circle cx="250" cy="17" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      
      <circle cx="290" cy="17" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="290" cy="17" r="3" fill="#EF4444" />
      
      <path d="M 340 14 Q 330 35 340 40 Q 350 35 340 14" fill="url(#leafGrad)" stroke="none" />
      <circle cx="340" cy="13" r="7" fill="url(#marigoldGrad)" stroke="#F59E0B" strokeWidth="1" />
      <circle cx="340" cy="13" r="3" fill="#EF4444" />
      
      <circle cx="390" cy="10" r="3" fill="#D97706" />
    </svg>
    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-ping" />
  </div>
);



// --- 3D Akshata Particle System with Depth of Field ---
const AkshataAnimation = () => {
  const [grains, setGrains] = useState<{
    id: number,
    x: number,
    delay: number,
    duration: number,
    scale: number,
    color: string,
    rotation: number,
    dir: number,
    blur: string,
    wind: number
  }[]>([]);

  useEffect(() => {
    // Haldi (saffron/gold), Kumkum (deep crimson/rose), and raw sacred rice (silver-white)
    const colors = [
      'bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.4)] border border-amber-200/30',
      'bg-gradient-to-b from-rose-500 to-rose-700 shadow-[0_2px_8px_rgba(190,18,60,0.4)] border border-rose-400/20',
      'bg-gradient-to-b from-slate-50 to-white shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-slate-100/50'
    ];

    const newGrains = Array.from({ length: 70 }).map((_, i) => {
      const sizeRandom = Math.random();
      let scale = 0.5 + Math.random() * 0.6;
      let blur = 'blur-none';
      
      if (sizeRandom > 0.8) {
        // Foreground bokeh particles (large, blurry, faster)
        scale = 1.3 + Math.random() * 0.7;
        blur = 'blur-[1.5px]';
      } else if (sizeRandom < 0.2) {
        // Deep background particles (tiny, transparent, slow)
        scale = 0.3 + Math.random() * 0.3;
        blur = 'blur-[0.5px]';
      }

      return {
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8, 
        duration: 9 + Math.random() * 9 - (scale * 2), 
        scale: scale,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        dir: Math.random() > 0.5 ? 1 : -1,
        blur: blur,
        wind: 15 + Math.random() * 25 
      };
    });
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setGrains(newGrains);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {grains.map((grain) => (
        <motion.div
          key={grain.id}
          className={`absolute top-[-25px] w-2 h-4 rounded-full ${grain.color} ${grain.blur}`}
          style={{ 
            left: `${grain.x}%`,
            transform: `scale(${grain.scale})`,
            transformOrigin: 'center'
          }}
          initial={{ y: -50, x: 0, rotate: grain.rotation, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'], 
            x: [0, grain.wind, grain.wind * 1.5], 
            rotate: grain.rotation + grain.dir * 720,
            opacity: [0, 0.9, 0.9, 0]
          }}
          transition={{
            duration: grain.duration,
            delay: grain.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD'; price: number } | null>(null);
  
  // Quick Search Fields
  const [searchGender, setSearchGender] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Success Stories Carousel State
  const [currentStory, setCurrentStory] = useState(0);

  const successStories = [
    {
      couple: "राहुल आणि स्नेहा पाटील",
      romanized: "Rahul & Sneha Patil",
      location: "Pune",
      date: "Nov 2025",
      img: "/happy_couple.png",
      quote: "Finding someone with the exact same moral fabric felt completely organic on Vivahvedh. The platform respects traditional Marathi culture while delivering an incredibly gorgeous, elite-level interface. An absolute masterpiece!"
    },
    {
      couple: "अमित आणि प्रियांका देशमुख",
      romanized: "Amit & Priyanka Deshmukh",
      location: "Mumbai",
      date: "Jan 2026",
      img: "/traditional_elements.png",
      quote: "The manual profile screening, background verification and focus on privacy took away all our safety anxieties. It is designed for elite families seeking real relationships rather than casual messaging."
    },
    {
      couple: "विक्रम आणि अदिती जोशी",
      romanized: "Vikram & Aditi Joshi",
      location: "Nashik",
      date: "April 2026",
      img: "/happy_couple.png",
      quote: "A genuinely editorial-level experience for elite traditional Marathi families. The filters are extremely granular, and the premium gold matchmaking assistance is truly dedicated and helpful."
    }
  ];

  useEffect(() => {
    document.title = 'Vivahvedh Matrimony – शोध नव्या नात्यांचा | Premium Marathi Matrimony';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Vivahvedh Matrimony – शोध नव्या नात्यांचा. Trusted by elite Marathi families. 100% verified profiles, advanced matching filters, and premium dedicated assistance.');
    
    // Fetch initial data
    apiClient.get('/search').then(r => setFeaturedProfiles(r.data.results.slice(0, 8))).catch(() => {});
  }, []);

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (searchGender) params.set('gender', searchGender);
    if (searchAge) { params.set('ageMin', searchAge.split('-')[0]); params.set('ageMax', searchAge.split('-')[1] || '60'); }
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/search?${params.toString()}`);
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#FAF8F5] overflow-x-hidden font-sans">
      
      {/* ═══════════════════════════════════════════════════
          CINEMATIC HERO SECTION (Luxury Editorial)
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-14 lg:pb-16 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF9F2] via-[#FCFAF7] to-white border-b border-amber-200/10">
        
        {/* Soft abstract glowing mesh */}
        <div className="absolute top-0 right-0 w-[950px] h-[950px] bg-gradient-to-tr from-amber-400/[0.05] to-rose-400/[0.03] rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-rose-500/[0.04] to-amber-500/[0.03] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />
        
        {/* 3D Akshata Particle System */}
        <AkshataAnimation />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          
          {/* Left Column: Brand & Slogan */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-2">
            
            {/* Elegant Website Logo & Ganesha Blessing Row (Bigger, Zoom effects) */}
            <motion.div 
              initial={{ opacity: 0, y: -12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 relative"
            >
              <div className="w-[300px] sm:w-[380px] md:w-[480px] h-22 sm:h-26 md:h-30 flex items-center justify-center lg:justify-start relative group">
                <img 
                  src="/logo.png" 
                  alt="Vivahvedh Logo" 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              
              {/* Premium Proper Ganesha Painting Beside Logo */}
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-12 bg-gradient-to-b from-amber-300 via-rose-500 to-amber-300 rounded-full opacity-60 hidden sm:block" />
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl p-1 bg-white shadow-[0_10px_30px_rgba(245,158,11,0.15)] border-2 border-amber-300/80 flex items-center justify-center overflow-hidden"
                >
                  <img 
                    src="/proper_ganesha.png" 
                    alt="Ganesha Blessing" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Slogan of the Website (शोध नव्या नात्यांचा) */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/[0.03] via-rose-500/[0.03] to-amber-500/[0.03] border border-amber-500/15 text-amber-700 text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_4px_12px_rgba(245,158,11,0.03)] backdrop-blur-sm">
                <Sparkles size={11} className="text-amber-500 animate-pulse" />
                <span>॥ शोध नव्या नात्यांचा ॥</span>
              </div>
            </motion.div>

            {/* Simple Elegant Divider Line (Replacing Headings and Description text) */}
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }} 
              animate={{ opacity: 1, scaleX: 1 }} 
              transition={{ delay: 0.3, duration: 1.2 }}
              className="w-48 sm:w-64 h-[1.5px] bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 my-4 lg:origin-left origin-center"
            />
            
            {/* Premium CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6 lg:mb-0"
            >
              <Link to="/register" className="h-14 px-10 bg-gradient-to-r from-primary to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300 shadow-[0_20px_40px_-8px_rgba(184,0,53,0.3)] hover:shadow-[0_20px_40px_-4px_rgba(184,0,53,0.45)] hover:-translate-y-0.5 active:scale-95">
                Register Free Profile <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Clean Couple Collage (Responsive for Mobile too) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-lg relative mt-6 lg:mt-0 flex justify-center items-center"
          >
            {/* Abstract Glowing Luxury Backdrop Orbs */}
            <div className="absolute top-20 -right-20 w-80 h-80 bg-gradient-to-tr from-amber-200/40 to-rose-200/10 rounded-full blur-3xl opacity-60 z-0 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-amber-300/10 rounded-full blur-3xl opacity-50 z-0" />
            
            {/* Elegant Ornamental Floral Leaf SVG Behind Frames */}
            <div className="absolute -top-6 -right-6 w-32 h-32 opacity-25 pointer-events-none text-amber-400 z-0 hidden lg:block">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M30 80 C30 50, 50 30, 80 30 C50 30, 30 50, 30 80 Z" />
                <path d="M10 90 C10 70, 30 50, 60 50 C30 50, 10 70, 10 90 Z" />
                <path d="M50 60 C50 40, 70 20, 90 20 C70 20, 50 40, 50 60 Z" />
              </svg>
            </div>

            {/* Majestic Palace Arch Frame (Main Image - Keeping Couple photo) */}
            <div className="z-10 w-[84%] aspect-[3/4.2] rounded-t-[200px] rounded-b-[48px] p-2 bg-gradient-to-br from-amber-400/40 via-white to-rose-400/40 shadow-[0_32px_80px_rgba(184,0,53,0.12)]">
              <div className="w-full h-full rounded-t-[192px] rounded-b-[40px] overflow-hidden bg-slate-50 group border-2 border-white relative">
                <img 
                  src="/happy_couple.png" 
                  alt="Traditional Marathi Couple" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-transparent" />
                
                {/* Small Divine Ganesha Medallion blessing the couple */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 left-4 w-12 h-12 rounded-full p-1 bg-white shadow-xl border border-amber-200 z-30 flex items-center justify-center overflow-hidden"
                >
                  <img 
                    src="/proper_ganesha.png" 
                    alt="Ganesha Blessing" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GLASSMORPHIC SEARCH DASHBOARD CONSOLE (No cropping layout)
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-16 px-4">
        <div className="max-w-5xl mx-auto bg-white/75 backdrop-blur-3xl rounded-[36px] shadow-[0_32px_80px_-16px_rgba(184,0,53,0.08)] border border-white/90 p-4 relative overflow-hidden group">
          
          {/* Fine inner glowing border effect */}
          <div className="absolute inset-0 border border-amber-300/10 rounded-[36px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Field: Looking For */}
            <div className="flex-1 bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all duration-300 hover:border-amber-300/80 focus-within:border-amber-400 group flex flex-col justify-center min-h-[80px]">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 block mb-1.5 leading-none">Looking For</span>
              <div className="flex items-center gap-2.5">
                <Heart size={16} className="text-primary/70" />
                <select 
                  value={searchGender} 
                  onChange={e => setSearchGender(e.target.value)} 
                  className="w-full bg-transparent text-slate-800 font-extrabold text-sm outline-none cursor-pointer py-1"
                >
                  <option value="">Any Gender</option>
                  <option value="MALE">Groom (वर)</option>
                  <option value="FEMALE">Bride (वधू)</option>
                </select>
              </div>
            </div>
            
            {/* Field: Age Range */}
            <div className="flex-1 bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all duration-300 hover:border-amber-300/80 focus-within:border-amber-400 group flex flex-col justify-center min-h-[80px]">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 block mb-1.5 leading-none">Age Group</span>
              <div className="flex items-center gap-2.5">
                <Compass size={16} className="text-amber-600/70" />
                <select 
                  value={searchAge} 
                  onChange={e => setSearchAge(e.target.value)} 
                  className="w-full bg-transparent text-slate-800 font-extrabold text-sm outline-none cursor-pointer py-1"
                >
                  <option value="">Any Age</option>
                  <option value="18-25">18 – 25 years</option>
                  <option value="25-30">25 – 30 years</option>
                  <option value="30-35">30 – 35 years</option>
                  <option value="35-45">35 – 45 years</option>
                  <option value="45-60">45+ years</option>
                </select>
              </div>
            </div>
            
            {/* Field: Location */}
            <div className="flex-1 bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all duration-300 hover:border-amber-300/80 focus-within:border-amber-400 group flex flex-col justify-center min-h-[80px]">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 block mb-1.5 leading-none">Location</span>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-emerald-600/70" />
                <input 
                  type="text" 
                  value={searchLocation} 
                  onChange={e => setSearchLocation(e.target.value)} 
                  placeholder="E.g. Pune, Mumbai" 
                  className="w-full bg-transparent text-slate-800 font-extrabold text-sm outline-none placeholder:text-slate-400 py-1 font-sans" 
                />
              </div>
            </div>

            {/* Ultimate Premium Search Button */}
            <button 
              onClick={handleQuickSearch} 
              className="lg:w-48 h-16 bg-gradient-to-r from-primary to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3.5 flex-shrink-0 shadow-[0_12px_28px_rgba(184,0,53,0.25)] hover:shadow-[0_16px_36px_rgba(184,0,53,0.4)] hover:-translate-y-0.5 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_ease-out]" />
              <Search size={16} />
              <span>Find Matches</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST METRICS — Refined Hallmarks of Trust
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-amber-200/20">
            {[
              { val: '2.5k+', label: 'Verified Profiles' },
              { val: '100%', label: 'Mobile Verified' },
              { val: '500+', label: 'Happy Marriages' },
              { val: '24/7', label: 'Dedicated Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center pt-8 md:pt-0">
                <h3 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-2 leading-none">{stat.val}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <GarlandDivider />

      {/* ═══════════════════════════════════════════════════
          HOW TO FIND YOUR MATCH — Refined Bento Grid
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-[#FCFAF7]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600 bg-amber-500/[0.05] px-4 py-2 rounded-full border border-amber-300/20">मंगलाष्टक</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-5 mb-4 leading-tight">Four Steps to Union</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">Your journey to finding the perfect Maharashtrian partner is designed with ultimate security and respect.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={22} />, title: 'Create Profile', sub: 'नोंदणी करा', desc: 'Register for free and describe your traditional background, lineage, and lifestyle.' },
              { icon: <ShieldCheck size={22} />, title: 'Get Verified', sub: 'पडताळणी', desc: 'Secure the prestigious "Verified Badge" by uploading government ID credentials.' },
              { icon: <Compass size={22} />, title: 'Search Matches', sub: 'स्थळे शोधा', desc: 'Discover prospects using precise cast, educational, and astrological matches.' },
              { icon: <Heart size={22} />, title: 'Connect & Meet', sub: 'संवाद सुरू करा', desc: 'Initiate interaction, request strict photo visibility, and align families.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="bg-white hover:bg-gradient-to-b hover:from-white hover:to-amber-500/[0.02] rounded-[32px] p-8 border border-amber-200/20 hover:border-amber-300/60 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF9F2] border border-amber-100 flex items-center justify-center text-primary mb-8 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-rose-600 group-hover:text-white transition-all duration-500">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1 leading-snug">{step.title}</h3>
                    <p className="text-[11px] font-black text-amber-500 tracking-widest mb-4 uppercase leading-relaxed">{step.sub}</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium font-sans">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PREMIUM PROFILES (Polaroid Invite Grid)
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600 bg-amber-500/[0.05] px-4 py-2 rounded-full border border-amber-300/20">नवे सभासद</span>
                <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-5 mb-3 leading-tight">Recently Joined Members</h2>
                <p className="text-slate-500 text-sm">Discover verified elite profiles who recently entered the community.</p>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary hover:text-rose-700 transition-colors">
                View All Matches <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProfiles.map((user, i) => {
                const imgUrl = user.images?.[0]?.url;
                const initial = user.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={user.id} delay={i * 0.08}>
                    <div 
                      onClick={() => navigate(`/profile/${user.id}`)} 
                      className="bg-[#FAF8F5] rounded-[28px] overflow-hidden border border-amber-200/30 hover:border-amber-400/60 hover:shadow-[0_24px_50px_rgba(184,0,53,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group p-3.5"
                    >
                      {/* Polaroid Picture Frame */}
                      <div className="aspect-[4/5] relative bg-slate-100 rounded-[20px] overflow-hidden border border-white shadow-inner">
                        {imgUrl ? (
                          <img 
                            src={resolveImageUrl(imgUrl)} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50/50 to-rose-50/40">
                            <span className="text-5xl font-display font-black text-slate-300/80">{initial}</span>
                          </div>
                        )}

                        {/* Saffron Gradient Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Dynamic tags inside image */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {user.kycVerified && (
                            <span className="bg-white/95 backdrop-blur-md text-amber-700 text-[9px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border border-amber-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <span className="text-[10px] font-black text-white bg-black/40 backdrop-blur px-2.5 py-1 rounded-md tracking-wider">{user.regId}</span>
                        </div>
                      </div>
                      
                      {/* Polaroid Caption Info */}
                      <div className="pt-5 pb-2 px-1 text-center">
                        <h3 className="text-base font-extrabold text-slate-800 truncate mb-2 group-hover:text-primary transition-colors leading-snug">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </h3>
                        <div className="flex flex-col items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-2 truncate max-w-full"><Briefcase size={12} className="text-amber-500/80"/> {user.education?.jobBusiness || 'Professional'}</span>
                          {user.addresses?.[0]?.city && <span className="flex items-center gap-2"><MapPin size={12} className="text-amber-500/80"/> {user.addresses[0].city}</span>}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <GarlandDivider />

      {/* ═══════════════════════════════════════════════════
          SUCCESS STORIES (कथा यशस्वितेच्या) - Luxury Double-Page Ledger (No AI images)
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-gradient-to-b from-white via-[#FCFAF7] to-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-rose-50 px-4 py-2 rounded-full border border-rose-300/20">कथा यशस्वितेच्या</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-5 mb-3 leading-tight">Stories of Eternal Bond</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">Read the heartwarming journeys of Marathi souls who found each other here.</p>
          </Reveal>

          {/* The Ledger Book container */}
          <div className="relative bg-[#FAF6F0] rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.04)] border border-amber-200/30 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
            
            {/* Decorative vertical binding line in center for book look */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-200/40 to-transparent" />
            
            {/* Left Page (Visual Frame - authentic non-AI images) */}
            <div className="w-56 h-76 md:w-68 md:h-90 rounded-t-[140px] rounded-b-[36px] overflow-hidden bg-slate-50 border-[6px] border-white shadow-xl flex-shrink-0 relative">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentStory}
                  src={successStories[currentStory].img} 
                  alt="Happy Couple" 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover" 
                />
              </AnimatePresence>
              {/* Ivory warm overlay for editorial feel */}
              <div className="absolute inset-0 bg-[#FAF6F0]/5 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Right Page (Typography Ledger) */}
            <div className="flex-1 flex flex-col justify-between h-full pt-4 md:pl-6">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Quote size={40} className="text-amber-500/20" />
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-200/40 to-transparent" />
                </div>
                
                <div className="min-h-[160px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-slate-700 text-sm md:text-[17px] italic font-serif leading-relaxed mb-8 font-medium">
                        "{successStories[currentStory].quote}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-t border-amber-200/40 pt-6 gap-6">
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">{successStories[currentStory].couple}</h4>
                  <p className="text-xs font-black text-amber-600 uppercase tracking-widest mt-1.5 leading-none">
                    {successStories[currentStory].location} • Married {successStories[currentStory].date}
                  </p>
                </div>

                {/* Luxury gold navigation keys */}
                <div className="flex gap-3">
                  <button 
                    onClick={prevStory} 
                    className="w-11 h-11 rounded-full border border-amber-300/40 bg-white hover:bg-amber-500/5 hover:border-amber-400 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextStory} 
                    className="w-11 h-11 rounded-full border border-amber-300/40 bg-white hover:bg-amber-500/5 hover:border-amber-400 flex items-center justify-center text-slate-700 active:scale-95 transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY CHOOSE US - Editorial Layout
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-white border-y border-amber-200/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <Reveal>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-rose-50 px-4 py-2 rounded-full border border-rose-300/20">गुणवत्ता</span>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-5 mb-6 leading-tight">
                Why trust <span className="text-primary font-serif italic font-normal">Vivahvedh</span> for your family?
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                We blend highly respected Maharashtrian family values with strict privacy settings. No generic indexing or unverified entries.
              </p>

              <div className="space-y-8 mb-10">
                {[
                  { title: 'Privacy Guaranteed', desc: 'Complete authority over photo viewing and contact data sharing.' },
                  { title: '100% Manual KYC Screening', desc: 'Each entry is screened with physical ID proofs for verified badges.' },
                  { title: 'Granular Search Filters', desc: 'Filter strictly by education, cast, sub-caste, and job locations.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FFF9F2] border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Check size={16} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Layered collage visual for Trust Section (Using authentic images) */}
            <Reveal delay={0.25} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/10 to-rose-200/10 rounded-[32px] transform rotate-3" />
              <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <img 
                  src="/traditional_elements.png" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                  alt="Maharashtrian Wedding Ceremony" 
                />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SIMPLE & PREMIUM PRICING ( लग्नपत्रिका / Invitations )
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-[#FCFAF7]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 bg-amber-500/[0.05] px-4 py-2 rounded-full border border-amber-300/20">सदस्यत्व शुल्क</span>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mt-5 mb-4 leading-tight">Transparent Subscriptions</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">Find your life partner with transparent, fixed pricing plans.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Free', 
                price: '0', 
                period: 'Lifetime', 
                amount: 0, 
                cta: 'Register Free', 
                bg: 'bg-white border-amber-200/30 shadow-[0_12px_36px_rgba(0,0,0,0.02)]', 
                textClass: 'text-slate-900', 
                subText: 'text-slate-500',
                tag: null, 
                features: ['Create Profile', 'Basic Search', 'Receive Interests'] 
              },
              { 
                name: 'Silver', 
                price: '2,000', 
                period: '1 Year Validity', 
                amount: 2000, 
                cta: 'Choose Silver Plan', 
                bg: 'bg-gradient-to-b from-[#FFFDF9] to-white border-primary/20 shadow-[0_24px_50px_rgba(184,0,53,0.04)] md:scale-105 z-10', 
                textClass: 'text-slate-900', 
                subText: 'text-slate-500',
                tag: 'Most Popular', 
                features: ['Send 5 Interests/day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'] 
              },
              { 
                name: 'Gold', 
                price: '5,000', 
                period: '1 Year Validity', 
                amount: 5000, 
                cta: 'Choose Gold Plan', 
                bg: 'bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFF5E6] border-amber-400 shadow-[0_24px_60px_rgba(217,119,6,0.08)] md:scale-105 z-10 border-2', 
                textClass: 'text-slate-900', 
                subText: 'text-amber-800 font-bold',
                tag: 'Royal Choice', 
                features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'] 
              }
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className={`rounded-[32px] p-8 border ${plan.bg} flex flex-col h-full transition-all duration-300 hover:shadow-2xl relative overflow-hidden group`}>
                  
                  {plan.tag && (
                    <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full shadow-sm ${plan.name === 'Gold' ? 'bg-amber-400 text-slate-900 font-black' : 'bg-primary text-white'}`}>
                      {plan.tag}
                    </span>
                  )}
                  
                  <h3 className={`text-xl font-black mb-3 ${plan.textClass} leading-snug`}>{plan.name} Plan</h3>
                  <div className={`flex items-baseline gap-1.5 mb-2.5 ${plan.textClass}`}>
                    <span className="text-lg font-extrabold text-amber-500">₹</span>
                    <span className={`text-4xl font-serif font-black ${plan.name === 'Gold' ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800' : 'text-slate-900'}`}>{plan.price}</span>
                  </div>
                  <p className={`text-xs font-bold mb-8 uppercase tracking-widest ${plan.subText}`}>{plan.period}</p>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.name === 'Gold' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium ${plan.name === 'Gold' ? 'text-slate-800' : 'text-slate-600'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.amount > 0 ? (
                    <button 
                      onClick={() => { setSelectedPlan({ type: plan.name as 'SILVER'|'GOLD', price: plan.amount }); setIsPaymentModalOpen(true); }} 
                      className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${plan.name === 'Gold' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:opacity-90 shadow-lg shadow-amber-500/20' : 'bg-primary text-white hover:bg-rose-700 shadow-md shadow-primary/20'}`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link 
                      to="/register" 
                      className="block w-full py-4 text-center rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA - High-end Invitation scroll
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 bg-white text-center border-t border-amber-200/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-400/[0.02] to-transparent rounded-full blur-[100px] pointer-events-none" />
        <Reveal className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
            Ready to find your <span className="text-primary font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">perfect match?</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-10 font-medium">Create your secure profile in under 2 minutes and initiate your matrimonial search.</p>
          <Link to="/register" className="h-14 px-10 inline-flex items-center justify-center bg-gradient-to-r from-primary to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_20px_40px_rgba(184,0,53,0.18)] hover:-translate-y-1 active:scale-95">
            Create Profile Free
          </Link>
        </Reveal>
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        planType={selectedPlan?.type || 'SILVER'} 
        price={selectedPlan?.price || 2000} 
      />
    </div>
  );
}
