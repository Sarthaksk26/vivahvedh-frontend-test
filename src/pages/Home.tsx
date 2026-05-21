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
      initial={{ opacity: 0, y: 24 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}} 
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Luxury Traditional Garland Visual Divider ---
const GarlandDivider = () => (
  <div className="flex items-center justify-center gap-2 my-12 opacity-80 select-none">
    <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-amber-300/60 to-amber-400" />
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.6)]" />
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500 fill-none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.22 5.22l13.56 13.56M18.78 5.22L5.22 19.12" />
      </svg>
      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.6)]" />
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
    </div>
    <div className="h-[1px] w-28 bg-gradient-to-l from-transparent via-amber-300/60 to-amber-400" />
  </div>
);

// --- Lord Ganesha Breathtaking Radial SVG Medallion ---
const GaneshaIcon = () => (
  <svg 
    viewBox="0 0 120 120" 
    className="w-full h-full text-orange-600 drop-shadow-[0_2px_8px_rgba(234,88,12,0.2)]" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ganeshaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" /> {/* orange-600 */}
        <stop offset="40%" stopColor="#F59E0B" /> {/* amber-500 */}
        <stop offset="100%" stopColor="#BE123C" /> {/* rose-700 */}
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
    
    {/* Auspicious Ears */}
    <path 
      d="M35 52 C20 52, 12 72, 28 82 C30 84, 38 84, 40 76" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M85 52 C100 52, 108 72, 92 82 C90 84, 82 84, 80 76" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    
    {/* Elegant Crown (Mukut) */}
    <path 
      d="M50 32 L60 8 L70 32 Z" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
      strokeLinecap="round" 
    />
    <path 
      d="M53 26 L60 14 L67 26" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    <circle cx="60" cy="5" r="2" fill="#F59E0B" />

    {/* Head Silhouette */}
    <path 
      d="M48 42 C48 30, 72 30, 72 42 C72 52, 48 52, 48 42 Z" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    
    {/* Royal Trunk curving left (Vamavarti) */}
    <path 
      d="M60 48 C60 68, 44 76, 44 86 C44 93, 56 96, 61 96 C70 96, 74 88, 69 82 C66 78, 58 78, 55 83" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    
    {/* Single Tusk */}
    <path 
      d="M49 58 L42 60" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    
    {/* Red Tilak of Auspiciousness */}
    <path 
      d="M57 30 L63 30 M60 30 L60 38" 
      fill="none" 
      stroke="#BE123C" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <circle cx="60" cy="24" r="3" fill="#BE123C" />
  </svg>
);

// --- Premium Akshata falling animation (High-fidelity particles) ---
const AkshataAnimation = () => {
  const [grains, setGrains] = useState<{ id: number, x: number, delay: number, duration: number, scale: number, color: string, rotation: number }[]>([]);

  useEffect(() => {
    // Elegant combination of Haldi, Kumkum, and sacred rice grains
    const colors = [
      'bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_2px_6px_rgba(245,158,11,0.4)]', // Haldi
      'bg-gradient-to-b from-rose-500 to-rose-700 shadow-[0_2px_6px_rgba(190,18,60,0.4)]',   // Kumkum
      'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)]' // Rice
    ];
    
    const newGrains = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8, 
      duration: 5 + Math.random() * 6, // slower fall speed for a mesmerizing, dreamy effect
      scale: 0.6 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
    setGrains(newGrains);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {grains.map((grain) => (
        <motion.div
          key={grain.id}
          className={`absolute top-[-20px] w-1.5 h-3 rounded-full ${grain.color} opacity-75 backdrop-blur-[0.5px]`}
          style={{ 
            left: `${grain.x}%`,
            transform: `scale(${grain.scale})`
          }}
          initial={{ y: 0, x: 0, rotate: grain.rotation, opacity: 0 }}
          animate={{ 
            y: ['0vh', '105vh'], 
            x: [0, Math.random() * 30 - 15, Math.random() * 30 - 15], 
            rotate: grain.rotation + (Math.random() > 0.5 ? 540 : -540),
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
      quote: "Vivahvedh values our cultural roots while offering a modern UI. Finding someone with the exact same moral fabric felt completely organic. Highly recommended platform!"
    },
    {
      couple: "अमित आणि प्रियांका देशमुख",
      romanized: "Amit & Priyanka Deshmukh",
      location: "Mumbai",
      date: "Jan 2026",
      img: "/wedding_hero.png",
      quote: "The manual profile screening and focus on security took away all our online safety anxiety. Excellent personal assistance and direct family interaction."
    },
    {
      couple: "विक्रम आणि अदिती जोशी",
      romanized: "Vikram & Aditi Joshi",
      location: "Nashik",
      date: "April 2026",
      img: "/happy_couple.png",
      quote: "A genuinely elite portal designed for traditional Maharashtrian families. Seamless filtering, secure photo visibility, and an absolutely stunning interface."
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
    <div className="flex-1 w-full flex flex-col items-center bg-[#FDFBF9] overflow-x-hidden font-sans">
      
      {/* ═══════════════════════════════════════════════════
          CINEMATIC HERO SECTION
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full pt-36 lg:pt-40 pb-44 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF9F3] via-[#FDFBF7] to-white border-b border-amber-100/30">
        
        {/* Soft abstract glowing mesh */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-tr from-amber-400/[0.04] to-rose-400/[0.02] rounded-full blur-[130px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-rose-500/[0.03] to-amber-500/[0.03] rounded-full blur-[110px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />
        
        {/* Sacred Akshata Animation Layer */}
        <AkshataAnimation />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-10">
          
          {/* Left Column: Brand, Divine Intro & Headings */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-6">
            
            {/* Elegant Medallion for Lord Ganesha */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 relative"
            >
              {/* Outer spinning gold frame */}
              <div className="absolute -inset-2 rounded-full border border-dashed border-amber-300/40 animate-[spin_30s_linear_infinite]" />
              <div className="w-20 h-20 rounded-full bg-white shadow-[0_12px_30px_rgba(245,158,11,0.08)] border border-amber-100/60 p-3 flex items-center justify-center">
                <GaneshaIcon />
              </div>
            </motion.div>

            {/* Cultural Intro tag */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/[0.04] border border-amber-500/10 text-amber-600 text-xs font-bold tracking-[0.15em] uppercase mb-6 shadow-sm">
                <Sparkles size={12} className="text-amber-500" />
                <span>श्री गणेशाय नमः • शोध नव्या नात्यांचा</span>
              </div>
            </motion.div>

            {/* Editorial Luxury Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 18 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }} 
              className="text-4xl md:text-5xl lg:text-[56px] font-display font-black leading-[1.12] text-slate-900 mb-6 tracking-tight max-w-xl mx-auto lg:mx-0"
            >
              मराठी परंपरांचा आदर,<br/>
              <span className="font-serif italic font-normal text-primary">उत्कृष्ट</span> जोडीदाराचा शोध.
            </motion.h1>

            {/* Sub-description */}
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }} 
              className="text-slate-600 text-sm md:text-[15px] max-w-md mx-auto lg:mx-0 leading-relaxed mb-10 font-medium"
            >
              Welcome to the elite matrimony circle for Marathi families. Discover handcrafted profiles, secure photo controls, and verified listings honoring traditional values.
            </motion.p>
            
            {/* Premium CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }} 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link to="/register" className="h-14 px-10 bg-primary hover:bg-rose-700 text-white rounded-2xl font-bold text-sm tracking-wider flex items-center gap-3 transition-all shadow-[0_20px_40px_-8px_rgba(184,0,53,0.3)] hover:shadow-[0_20px_40px_-4px_rgba(184,0,53,0.45)] hover:-translate-y-0.5">
                Register Free Profile <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Layered Artistic Collage */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex-1 w-full max-w-lg hidden lg:block relative"
          >
            {/* Background luxury gradient circles */}
            <div className="absolute top-10 -right-10 w-72 h-72 bg-gradient-to-tr from-amber-300/30 to-amber-400/5 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-rose-400/20 to-rose-600/5 rounded-full blur-3xl z-0" />
            
            {/* The Majestic Arch Frame (Main Image) */}
            <div className="relative z-10 w-[78%] ml-auto aspect-[3/4.2] rounded-t-[180px] rounded-b-[48px] p-2 bg-gradient-to-br from-amber-300/40 via-white to-rose-300/40 shadow-premium">
              <div className="w-full h-full rounded-t-[172px] rounded-b-[40px] overflow-hidden bg-slate-100 group border-2 border-white">
                <img 
                  src="/happy_couple.png" 
                  alt="Traditional Marathi Couple" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />
              </div>
            </div>

            {/* Elegant Overlapping Circular Sub-Frame */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 left-0 w-48 h-48 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 to-amber-200 shadow-2xl z-20"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border-4 border-white">
                <img 
                  src="/wedding_hero.png" 
                  alt="Maharashtrian Wedding Traditional" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Floating verification badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="absolute top-24 -left-8 bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-[0_24px_50px_rgba(0,0,0,0.06)] border border-white/50 flex items-center gap-4 z-20 animate-bounce"
              style={{ animationDuration: '3s' }}
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Verified</p>
                <p className="text-sm font-extrabold text-slate-800">100% Secure Matches</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GLASSMORPHIC SEARCH DASHBOARD WIDGET
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-16 px-4">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_32px_60px_-16px_rgba(184,0,53,0.06)] border border-white/80 p-3 md:p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* Field: Looking For */}
            <div className="flex-1 relative bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all hover:border-amber-300 focus-within:border-amber-400 group">
              <span className="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-amber-500/80">Looking For</span>
              <div className="flex items-center gap-3 mt-4">
                <Heart size={18} className="text-primary/70 group-hover:scale-110 transition-transform" />
                <select 
                  value={searchGender} 
                  onChange={e => setSearchGender(e.target.value)} 
                  className="w-full bg-transparent text-slate-800 font-bold text-sm outline-none cursor-pointer appearance-none"
                >
                  <option value="">Any Gender</option>
                  <option value="MALE">Groom (वर)</option>
                  <option value="FEMALE">Bride (वधू)</option>
                </select>
              </div>
            </div>
            
            {/* Field: Age Range */}
            <div className="flex-1 relative bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all hover:border-amber-300 focus-within:border-amber-400 group">
              <span className="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-amber-500/80">Age Group</span>
              <div className="flex items-center gap-3 mt-4">
                <Compass size={18} className="text-primary/70 group-hover:scale-110 transition-transform" />
                <select 
                  value={searchAge} 
                  onChange={e => setSearchAge(e.target.value)} 
                  className="w-full bg-transparent text-slate-800 font-bold text-sm outline-none cursor-pointer appearance-none"
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
            <div className="flex-1 relative bg-gradient-to-b from-[#FDFBF9] to-white border border-amber-100/50 rounded-2xl p-4 transition-all hover:border-amber-300 focus-within:border-amber-400 group">
              <span className="absolute top-3 left-4 text-[9px] font-black uppercase tracking-widest text-amber-500/80">Location</span>
              <div className="flex items-center gap-3 mt-4">
                <MapPin size={18} className="text-primary/70 group-hover:scale-110 transition-transform" />
                <input 
                  type="text" 
                  value={searchLocation} 
                  onChange={e => setSearchLocation(e.target.value)} 
                  placeholder="E.g. Pune, Mumbai" 
                  className="w-full bg-transparent text-slate-800 font-bold text-sm outline-none placeholder:text-slate-400" 
                />
              </div>
            </div>

            {/* Ultimate Premium Search Button */}
            <button 
              onClick={handleQuickSearch} 
              className="lg:w-44 h-16 bg-primary hover:bg-rose-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-3 flex-shrink-0 shadow-[0_12px_24px_rgba(184,0,53,0.25)] hover:shadow-[0_12px_24px_rgba(184,0,53,0.4)] hover:-translate-y-0.5 active:scale-95"
            >
              <Search size={18} />
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
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-amber-100/60">
            {[
              { val: '2.5k+', label: 'Verified Profiles' },
              { val: '100%', label: 'Mobile Verified' },
              { val: '500+', label: 'Happy Marriages' },
              { val: '24/7', label: 'Dedicated Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center pt-8 md:pt-0">
                <h3 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-2">{stat.val}</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <GarlandDivider />

      {/* ═══════════════════════════════════════════════════
          HOW TO FIND YOUR MATCH — Refined Bento Grid
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 bg-amber-500/[0.05] px-3.5 py-1.5 rounded-full border border-amber-300/20">मंगलाष्टक</span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mt-4 mb-4">Four Simple Steps</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Your journey to finding the perfect Maharashtrian partner is designed for ease and respect.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={22} />, title: 'Create Profile', sub: 'नोंदणी करा', desc: 'Register for free and describe your lifestyle, family background, and interests.' },
              { icon: <ShieldCheck size={22} />, title: 'Get Verified', sub: 'पडताळणी', desc: 'Secure the trusted "Verified Badge" by uploading genuine government IDs.' },
              { icon: <Compass size={22} />, title: 'Search Matches', sub: 'स्थळे शोधा', desc: 'Narrow down compatible prospects using precise educational and demographic filters.' },
              { icon: <Heart size={22} />, title: 'Connect & Meet', sub: 'संवाद सुरू करा', desc: 'Express mutual interests, unlock strict photo access, and meet with family consent.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="bg-white hover:bg-gradient-to-b hover:from-white hover:to-amber-500/[0.02] rounded-3xl p-8 border border-amber-200/30 hover:border-amber-300 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF9F3] border border-amber-100 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-[11px] font-bold text-amber-500 tracking-wider mb-4">{step.sub}</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PREMIUM PROFILES
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 bg-amber-500/[0.05] px-3.5 py-1.5 rounded-full border border-amber-300/20">नवे सभासद</span>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mt-4 mb-2">Recently Joined Members</h2>
                <p className="text-slate-500 text-sm">Discover verified elite profiles who recently entered the community.</p>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-rose-700 transition-colors">
                View All Matches <ArrowRight size={16} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProfiles.map((user, i) => {
                const imgUrl = user.images?.[0]?.url;
                const initial = user.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={user.id} delay={i * 0.08}>
                    <div onClick={() => navigate(`/profile/${user.id}`)} className="bg-[#FFFDFB] rounded-[24px] overflow-hidden border border-amber-100/50 hover:border-amber-300/70 hover:shadow-[0_20px_40px_rgba(184,0,53,0.04)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group">
                      <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                        {imgUrl ? (
                          <img src={resolveImageUrl(imgUrl)} alt="Profile" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50/40 to-rose-50/30">
                            <span className="text-5xl font-display font-black text-slate-300">{initial}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {user.kycVerified && (
                            <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[9px] px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-emerald-100">
                              <ShieldCheck size={11} className="text-green-600"/> Verified
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-md">{user.regId}</span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-base font-extrabold text-slate-900 truncate mb-2">{user.profile?.firstName} {user.profile?.lastName}</h3>
                        <div className="flex flex-col gap-1.5 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-2"><Briefcase size={12} className="text-amber-500/80"/> {user.education?.jobBusiness || 'Professional'}</span>
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
          SUCCESS STORIES (कथा यशस्वितेच्या) - Luxury Slider
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-gradient-to-b from-white to-[#FDFBF7] overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-300/20">कथा यशस्वितेच्या</span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 mt-4 mb-2">Our Successful Couples</h2>
            <p className="text-slate-500 text-sm">Read the heartwarming journeys of Marathi souls who found each other here.</p>
          </Reveal>

          <div className="relative bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(184,0,53,0.04)] border border-amber-200/20 p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center">
            
            {/* Slider Image arched top */}
            <div className="w-48 h-64 md:w-60 md:h-80 rounded-t-full rounded-b-[24px] overflow-hidden bg-slate-100 border-4 border-[#FFF9F3] shadow-md flex-shrink-0 relative">
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
            </div>

            {/* Slider Content */}
            <div className="flex-1 flex flex-col justify-between h-full pt-4">
              <div>
                <Quote size={44} className="text-amber-300/40 -ml-4 mb-2" />
                <div className="min-h-[140px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-slate-700 text-sm md:text-base italic font-serif leading-relaxed mb-6 font-medium">
                        "{successStories[currentStory].quote}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-amber-100/50 pt-6">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">{successStories[currentStory].couple}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">{successStories[currentStory].location} • Married {successStories[currentStory].date}</p>
                </div>

                {/* Slider Controls */}
                <div className="flex gap-2">
                  <button onClick={prevStory} className="w-10 h-10 rounded-full border border-amber-200/60 hover:bg-amber-50/50 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextStory} className="w-10 h-10 rounded-full border border-amber-200/60 hover:bg-amber-50/50 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
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
      <section className="w-full py-24 bg-white border-y border-amber-100/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <Reveal>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-300/20">गुणवत्ता</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900 mt-5 mb-6 leading-tight">
                Why trust <span className="text-primary">Vivahvedh</span> for your family?
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                We blend respected Maharashtrian family values with strict privacy settings. No generic indexing or unverified entries.
              </p>

              <div className="space-y-8 mb-10">
                {[
                  { title: 'Privacy Guaranteed', desc: 'Complete authority over photo viewing and contact data sharing.' },
                  { title: '100% Manual KYC Screening', desc: 'Each entry is screened with physical ID proofs for verified badges.' },
                  { title: 'Granular Search Filters', desc: 'Filter strictly by education, cast, sub-caste, and job locations.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#FFF9F3] border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Check size={18} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Layered collage visual for Trust Section */}
            <Reveal delay={0.25} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/10 to-rose-200/10 rounded-[32px] transform rotate-3" />
              <div className="relative z-10 rounded-[32px] overflow-hidden shadow-xl border-4 border-white aspect-[4/3]">
                <img 
                  src="/wedding_hero.png" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                  alt="Maharashtrian Wedding Ceremony" 
                />
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SIMPLE & PREMIUM PRICING
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-[#FDFBF7]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500 bg-amber-500/[0.05] px-3.5 py-1.5 rounded-full border border-amber-300/20">सदस्यत्व शुल्क</span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mt-4 mb-4">Transparent Subscriptions</h2>
            <p className="text-slate-500 text-sm">Find your life partner with transparent, fixed pricing plans.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Free', price: '0', period: 'Lifetime', amount: 0, cta: 'Register Free', bg: 'bg-white', border: 'border-amber-200/20', text: 'text-slate-900', features: ['Create Profile', 'Basic Search', 'Receive Interests'] },
              { name: 'Silver', price: '2,000', period: '1 Year Validity', amount: 2000, cta: 'Choose Silver Plan', bg: 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.03)] scale-100 md:scale-105 z-10 border-primary/20', border: 'border-primary/20', text: 'text-slate-900', features: ['Send 5 Interests/day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'] },
              { name: 'Gold', price: '5,000', period: '1 Year Validity', amount: 5000, cta: 'Choose Gold Plan', bg: 'bg-slate-900 shadow-xl', border: 'border-slate-800', text: 'text-white', features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'] }
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className={`rounded-3xl p-8 border ${plan.bg} ${plan.border} flex flex-col h-full transition-all duration-300 hover:shadow-lg relative overflow-hidden`}>
                  {plan.name === 'Silver' && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                      Most Popular
                    </span>
                  )}
                  
                  <h3 className={`text-xl font-extrabold mb-3 ${plan.text}`}>{plan.name} Plan</h3>
                  <div className={`flex items-baseline gap-1.5 mb-2 ${plan.text}`}>
                    <span className="text-lg font-bold">₹</span>
                    <span className="text-4xl font-serif font-black">{plan.price}</span>
                  </div>
                  <p className={`text-xs font-semibold mb-8 ${plan.name === 'Gold' ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</p>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.name === 'Gold' ? 'bg-primary/20 text-primary' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className={`text-sm ${plan.name === 'Gold' ? 'text-slate-300' : 'text-slate-600'} font-medium`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.amount > 0 ? (
                    <button 
                      onClick={() => { setSelectedPlan({ type: plan.name as 'SILVER'|'GOLD', price: plan.amount }); setIsPaymentModalOpen(true); }} 
                      className={`w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all ${plan.name === 'Gold' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-primary text-white hover:bg-rose-700 shadow-md shadow-primary/20'}`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link 
                      to="/register" 
                      className="block w-full py-4 text-center rounded-xl font-bold text-sm tracking-wider bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all font-medium"
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
          FINAL CTA - High-end Invitation
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-white text-center border-t border-amber-100/30">
        <Reveal className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
            Ready to find your <span className="text-primary font-serif italic font-normal">perfect match?</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed mb-10 font-medium">Create your secure profile in under 2 minutes and initiate your matrimonial search.</p>
          <Link to="/register" className="h-14 px-10 inline-flex items-center justify-center bg-primary hover:bg-rose-700 text-white rounded-2xl font-bold text-sm tracking-wider transition-all shadow-[0_20px_40px_rgba(184,0,53,0.18)] hover:-translate-y-1">
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
