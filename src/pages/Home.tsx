import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Users, ShieldCheck, Heart, Compass, Search, MapPin, Briefcase } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

// --- Reusable Scroll Animation Wrapper ---
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

// --- Akshata (Rice, Haldi, Kumkum) Falling Animation ---
const AkshataAnimation = () => {
  const [grains, setGrains] = useState<{ id: number, x: number, delay: number, duration: number, color: string, rotation: number }[]>([]);

  useEffect(() => {
    // Generate 60 grains of rice
    // Colors: Kumkum (Red/Rose), Haldi (Yellow/Amber), White (Plain Rice)
    const colors = ['bg-rose-600', 'bg-amber-400', 'bg-white', 'bg-rose-500', 'bg-amber-500', 'bg-yellow-400'];
    const newGrains = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random x percentage
      delay: Math.random() * 5, // random delay up to 5s
      duration: 3 + Math.random() * 5, // 3 to 8 seconds fall time
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
          className={`absolute top-[-20px] w-1.5 h-3.5 rounded-full ${grain.color} opacity-80 shadow-[0_2px_4px_rgba(0,0,0,0.1)]`}
          style={{ left: `${grain.x}%` }}
          initial={{ y: 0, x: 0, rotate: grain.rotation, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'], 
            x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20], // subtle drift
            rotate: grain.rotation + (Math.random() > 0.5 ? 720 : -720), // spinning while falling
            opacity: [0, 1, 1, 0]
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

// --- Lord Ganesha Elegant Inline SVG ---
const GaneshaIcon = () => (
  <svg 
    viewBox="0 0 120 120" 
    className="w-full h-full text-orange-600" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ganeshaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
    </defs>
    {/* Ears */}
    <path 
      d="M35 50 C20 50, 15 70, 30 80 C32 82, 38 82, 40 75" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M85 50 C100 50, 105 70, 90 80 C88 82, 82 82, 80 75" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    {/* Head / Face */}
    <path 
      d="M48 40 C48 30, 72 30, 72 40 C72 50, 48 50, 48 40 Z" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    {/* Trunk */}
    <path 
      d="M60 45 C60 65, 45 75, 45 85 C45 92, 55 95, 60 95 C68 95, 72 88, 68 82 C65 78, 58 78, 55 82" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    {/* Crown (Mukut) */}
    <path 
      d="M50 30 L60 10 L70 30 Z" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
      strokeLinecap="round" 
    />
    <path 
      d="M53 25 L60 15 L67 25" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    {/* Tusk */}
    <path 
      d="M50 56 L44 58" 
      fill="none" 
      stroke="url(#ganeshaGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    {/* Red Tilak */}
    <path 
      d="M58 28 L62 28 M60 28 L60 36" 
      fill="none" 
      stroke="#BE123C" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
    />
    <circle cx="60" cy="24" r="3" fill="#BE123C" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD'; price: number } | null>(null);
  
  // Quick Search State
  const [searchGender, setSearchGender] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    document.title = 'Vivahvedh Matrimony – शोध नव्या नात्यांचा | Trusted Marathi Matrimony';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Vivahvedh Matrimony – शोध नव्या नात्यांचा. Trusted by thousands of Marathi families. 100% mobile-verified profiles, strict privacy controls, and dedicated support.');
    
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

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#FAFCFF] overflow-x-hidden font-sans">

      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Trust, Elegance & Culture
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full pt-32 lg:pt-36 pb-36 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white border-b border-primary/5">
        
        {/* Soft abstract background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/[0.04] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/[0.03] rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />

        {/* Akshata Animation Layer */}
        <AkshataAnimation />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Column: Text & Logo */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left pt-8">
            
            {/* Small Ganesha Icon */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-orange-100 p-2.5 flex items-center justify-center mx-auto lg:mx-0">
                <GaneshaIcon />
              </div>
            </motion.div>

            {/* Animated Brand Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, ease: "easeOut" }} 
              className="mb-8 relative mx-auto lg:mx-0"
            >
              {/* Outer rotating glowing ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary/30 via-rose-300/30 to-amber-300/30 blur-md animate-[spin_8s_linear_infinite]" />
              <div className="absolute -inset-5 rounded-full bg-primary/10 blur-xl animate-pulse" />
              
              {/* Main Logo Container */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-white shadow-[0_20px_60px_-15px_rgba(184,0,53,0.2)] p-4 border border-primary/10 flex items-center justify-center z-10 overflow-hidden group">
                <img 
                  src="/logo.png" 
                  alt="Vivahvedh Matrimony" 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold tracking-[0.2em] uppercase mb-5 border border-primary/10 shadow-sm">
                श्री गणेशाय नमः • महाराष्ट्राची हक्काची विवाह संस्था
              </span>
            </motion.div>

            {/* Headline - Elegant Scale */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="text-4xl md:text-5xl lg:text-[52px] font-display font-black leading-[1.15] text-slate-900 mb-6 tracking-tight max-w-xl mx-auto lg:mx-0"
            >
              मराठी परंपरांचा आदर करत,<br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">योग्य जोडीदाराचा शोध घ्या.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }} 
              className="text-slate-600 text-sm md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10 font-medium"
            >
              Join thousands of Marathi families who found their perfect match. 
              Experience 100% verified profiles, strict privacy controls, and traditional values in a modern platform.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="h-14 px-8 bg-primary hover:bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
                Create Free Profile <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Premium Couple Photo Arched Frame */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1 w-full max-w-md hidden lg:block relative"
          >
            {/* Decorative background elements behind photo */}
            <div className="absolute top-10 -right-8 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl z-0" />
            <div className="absolute -bottom-10 -left-8 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl z-0" />
            
            {/* The Arched Frame */}
            <div className="relative z-10 w-full aspect-[3/4] rounded-t-full rounded-b-[40px] border-4 border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden group">
              <img 
                src="/happy_couple.png" 
                alt="Traditional Marathi Couple" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Subtle inner gradient to make it pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60" />
            </div>

            {/* Floating verification badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-12 -left-12 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">100% Secure</p>
                <p className="text-sm font-black text-slate-800">Verified Profiles</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          INLINE SEARCH BAR — Strategic placement overlapping hero
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-2 md:p-3">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative bg-[#F8FAFC] rounded-xl group hover:bg-[#F1F5F9] transition-colors">
              <label className="absolute top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Looking For</label>
              <select value={searchGender} onChange={e => setSearchGender(e.target.value)} className="w-full h-[68px] pt-6 pb-2 px-4 bg-transparent text-slate-800 font-semibold text-sm outline-none cursor-pointer appearance-none">
                <option value="">Any Gender</option>
                <option value="MALE">Groom (वर)</option>
                <option value="FEMALE">Bride (वधू)</option>
              </select>
            </div>
            
            <div className="flex-1 relative bg-[#F8FAFC] rounded-xl group hover:bg-[#F1F5F9] transition-colors">
              <label className="absolute top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Age Range</label>
              <select value={searchAge} onChange={e => setSearchAge(e.target.value)} className="w-full h-[68px] pt-6 pb-2 px-4 bg-transparent text-slate-800 font-semibold text-sm outline-none cursor-pointer appearance-none">
                <option value="">Any Age</option>
                <option value="18-25">18 – 25 years</option>
                <option value="25-30">25 – 30 years</option>
                <option value="30-35">30 – 35 years</option>
                <option value="35-45">35 – 45 years</option>
                <option value="45-60">45+ years</option>
              </select>
            </div>
            
            <div className="flex-1 relative bg-[#F8FAFC] rounded-xl group hover:bg-[#F1F5F9] transition-colors">
              <label className="absolute top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
              <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} placeholder="E.g. Pune, Mumbai" className="w-full h-[68px] pt-6 pb-2 px-4 bg-transparent text-slate-800 font-semibold text-sm outline-none placeholder:text-slate-400/70" />
            </div>

            <button onClick={handleQuickSearch} className="h-[68px] px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-lg shadow-slate-900/20">
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST METRICS — Building immediate credibility
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-[#FAFCFF]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/60">
            {[
              { val: '2.5k+', label: 'Verified Profiles' },
              { val: '100%', label: 'Mobile Verified' },
              { val: '500+', label: 'Happy Marriages' },
              { val: '24/7', label: 'Dedicated Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-1">{stat.val}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW TO FIND YOUR MATCH — Clear Process
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">प्रक्रिया</span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mt-4 mb-4">How It Works</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Your journey to finding the perfect life partner is just four simple steps away.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users />, title: 'Create Profile', sub: 'नोंदणी करा', desc: 'Sign up and create a detailed profile sharing your background and preferences.' },
              { icon: <ShieldCheck />, title: 'Get Verified', sub: 'पडताळणी', desc: 'Submit ID proof for the trusted "Verified" badge to attract genuine matches.' },
              { icon: <Compass />, title: 'Search Matches', sub: 'स्थळे शोधा', desc: 'Use advanced filters like education, caste, and location to find compatible profiles.' },
              { icon: <Heart />, title: 'Start Connecting', sub: 'संवाद सुरू करा', desc: 'Express interest, view contact details, and start meaningful conversations.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#FAFCFF] rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all h-full group">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-[11px] font-bold text-slate-400 mb-3">{step.sub}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
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
        <section className="w-full py-28 bg-[#F4F7FB]">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-2">Recently Joined Profiles</h2>
                <p className="text-slate-500 text-sm">Discover verified members who recently joined our community.</p>
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
                  <Reveal key={user.id} delay={i * 0.05}>
                    <div onClick={() => navigate(`/profile/${user.id}`)} className="bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                      <div className="aspect-[4/5] relative bg-slate-100 overflow-hidden">
                        {imgUrl ? (
                          <img src={resolveImageUrl(imgUrl)} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <span className="text-5xl font-display font-black text-slate-300">{initial}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {user.kycVerified && (
                            <span className="bg-white/90 backdrop-blur text-slate-800 text-[9px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <ShieldCheck size={10} className="text-green-600"/> Verified
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded-md">{user.regId}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-base font-bold text-slate-900 truncate mb-1">{user.profile?.firstName} {user.profile?.lastName}</h3>
                        <div className="flex flex-col gap-1 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><Briefcase size={12}/> {user.education?.jobBusiness || 'Professional'}</span>
                          {user.addresses?.[0]?.city && <span className="flex items-center gap-1.5"><MapPin size={12}/> {user.addresses[0].city}</span>}
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

      {/* ═══════════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-6 leading-tight">
                Why trust <span className="text-primary">Vivahvedh</span> for your partner search?
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                We blend traditional Marathi values with state-of-the-art matchmaking technology. 
                Our strict verification processes ensure a safe environment for you and your family.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { title: 'Privacy Guaranteed', desc: 'You control who sees your photos and contact details.' },
                  { title: 'Manual Verification', desc: 'Every profile is screened manually to block fake accounts.' },
                  { title: 'Advanced Matching', desc: 'Find matches based on exact education, caste, and lifestyle preferences.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAFCFF] border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="text-sm font-bold text-primary hover:text-rose-700 inline-flex items-center gap-2">
                Learn about our story <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={0.2} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-amber-100/50 rounded-3xl transform rotate-3" />
              <img src="/wedding_hero.png" className="relative z-10 rounded-3xl shadow-xl w-full aspect-[4/3] object-cover" alt="Maharashtrian Wedding" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SIMPLE PRICING
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-[#FAFCFF]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-4">Transparent Pricing</h2>
            <p className="text-slate-500 text-sm">Choose a plan that fits your search phase. No hidden charges.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '0', period: 'Forever', amount: 0, cta: 'Register Free', bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-900', features: ['Create Profile', 'Basic Search', 'Receive Interests'] },
              { name: 'Silver', price: '2,000', period: '1 Year', amount: 2000, cta: 'Select Silver', bg: 'bg-white shadow-xl scale-100 md:scale-105 z-10', border: 'border-primary/20', text: 'text-slate-900', features: ['Send 5 Interests/day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'] },
              { name: 'Gold', price: '5,000', period: '1 Year', amount: 5000, cta: 'Select Gold', bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'] }
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`rounded-3xl p-8 border ${plan.bg} ${plan.border} flex flex-col h-full transition-transform`}>
                  {plan.name === 'Silver' && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">Most Popular</span>}
                  
                  <h3 className={`text-xl font-display font-black mb-2 ${plan.text}`}>{plan.name} Plan</h3>
                  <div className={`flex items-baseline gap-1 mb-1 ${plan.text}`}>
                    <span className="text-lg font-bold">₹</span>
                    <span className="text-4xl font-display font-black">{plan.price}</span>
                  </div>
                  <p className={`text-xs font-semibold mb-8 ${plan.name === 'Gold' ? 'text-slate-400' : 'text-slate-500'}`}>valid for {plan.period}</p>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className={plan.name === 'Gold' ? 'text-primary' : 'text-green-600'} />
                        <span className={`text-sm ${plan.name === 'Gold' ? 'text-slate-300' : 'text-slate-600'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.amount > 0 ? (
                    <button onClick={() => { setSelectedPlan({ type: plan.name as 'SILVER'|'GOLD', price: plan.amount }); setIsPaymentModalOpen(true); }} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${plan.name === 'Gold' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-primary text-white hover:bg-rose-700 shadow-md shadow-primary/20'}`}>
                      {plan.cta}
                    </button>
                  ) : (
                    <Link to="/register" className="block w-full py-3.5 text-center rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
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
          FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-white text-center border-t border-slate-100">
        <Reveal className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 leading-tight mb-5">
            Ready to find your <span className="text-primary">perfect match?</span>
          </h2>
          <p className="text-slate-500 text-base mb-10 max-w-md mx-auto">Register for free today and take the first step towards a beautiful new relationship.</p>
          <Link to="/register" className="h-14 px-10 inline-flex items-center justify-center bg-primary hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
            Create Profile Free
          </Link>
        </Reveal>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} planType={selectedPlan?.type || 'SILVER'} price={selectedPlan?.price || 2000} />
    </div>
  );
}
