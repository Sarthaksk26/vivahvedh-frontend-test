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
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Smartphone,
  Handshake
} from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';
import { SEO } from '../components/common/SEO';

// --- Reusable Scroll Animation Wrapper ---
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div 
      ref={ref} 
      initial={{ opacity: 0, y: 24 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}} 
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }} 
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
      location: "पुणे",
      date: "Nov 2025",
      img: "/happy_couple.png",
      quote: "विवाहवेधमुळे आम्हाला आमचा योग्य जोडीदार मिळाला. येथील सुरक्षितता आणि पारदर्शकता खरोखरच कौतुकास्पद आहे. आमचा हा प्रवास खूप सुंदर होता."
    },
    {
      couple: "अमित आणि प्रियांका देशमुख",
      location: "मुंबई",
      date: "Jan 2026",
      img: "/traditional_elements.png",
      quote: "खात्रीशीर आणि व्हेरिफाइड प्रोफाइल्स असल्यामुळे विश्वास बसला. मराठी परंपरा जपत आधुनिक सुविधा देणारे हे एक उत्तम व्यासपीठ आहे."
    },
    {
      couple: "विक्रम आणि अदिती जोशी",
      location: "नाशिक",
      date: "April 2026",
      img: "/happy_couple.png",
      quote: "आम्हाला आमच्या अपेक्षेप्रमाणे जोडीदार इथेच मिळाला. प्रीमियम सपोर्ट आणि फिल्टरचे पर्याय खूप उपयुक्त ठरले. विवाहवेधचे मनःपूर्वक आभार!"
    }
  ];

  useEffect(() => {
    document.title = 'Vivahvedh | Premium Marathi Matrimony';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'विवाहवेध - शोध नव्या नात्यांचा. Trusted by elite Marathi families. Verified profiles, advanced matching filters, and premium assistance.');
    
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
    <div className="flex-1 w-full flex flex-col items-center bg-background overflow-x-hidden font-sans text-foreground">
      <SEO />
      
      {/* ═══════════════════════════════════════════════════
          MINIMALIST ROYAL HERO SECTION (WITH MORE MARATHI)
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full pt-20 lg:pt-28 pb-20 lg:pb-32 flex flex-col items-center justify-center bg-[#fcfaf7] border-b border-border overflow-hidden">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Copy & Logo */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Elegant Logo above text */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-[220px] sm:w-[280px] h-auto relative mb-10"
            >
              <img 
                src="/logo.png" 
                alt="Vivahvedh Logo" 
                className="w-full h-auto object-contain mix-blend-multiply" 
              />
            </motion.div>

            {/* Slogan Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[#e5d5b5] bg-white/60 text-sm font-semibold mb-6 shadow-sm"
            >
              <span className="font-display tracking-wide text-primary">॥ शोध नव्या नात्यांचा ॥</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-[1.25]"
            >
              तुमचा योग्य <br className="hidden lg:block"/> जीवनसाथी शोधा.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg text-[#52525b] mb-10 max-w-[480px] leading-[1.7] font-sans"
            >
              महाराष्ट्रातील सुशिक्षित आणि प्रतिष्ठित कुटुंबांसाठी एक खात्रीशीर व सुरक्षित विवाह व्यासपीठ. १००% पडताळणी केलेले प्रोफाइल्स.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.8 }} 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto"
            >
              <Link to="/register" className="btn-premium-primary h-[50px] text-sm shadow-sm px-10 w-full sm:w-auto flex items-center justify-center font-sans tracking-wide">
                मोफत नोंदणी करा
              </Link>
              <Link to="/search" className="h-[50px] text-sm px-10 w-full sm:w-auto flex items-center justify-center border border-[#e4e4e7] bg-white hover:bg-zinc-50 text-foreground rounded-lg transition-colors font-sans font-medium tracking-wide">
                स्थळे पाहा
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Beautiful Image to fill space */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} 
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="flex-1 w-full max-w-md lg:max-w-lg relative mt-12 lg:mt-0"
          >
            {/* Decorative background shape */}
            <div className="absolute inset-0 bg-primary/5 rounded-[40px] transform rotate-3 scale-105" />
            
            <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden bg-white border border-border p-2 shadow-xl">
              <div className="w-full h-full rounded-[32px] overflow-hidden">
                <img 
                  src="/happy_couple.png" 
                  alt="Happy Couple" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Floating Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">100% Verified</p>
                <p className="text-xs text-muted-foreground">Genuine Profiles</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MINIMALIST SEARCH CONSOLE
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-8 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md-soft border border-border p-3 flex flex-col md:flex-row gap-3 font-sans">
          
          <div className="flex-1 bg-background border border-border rounded-lg p-3 flex items-center gap-3 focus-within:border-primary/50 transition-colors">
            <Heart size={16} className="text-primary/60" />
            <select 
              value={searchGender} 
              onChange={e => setSearchGender(e.target.value)} 
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
            >
              <option value="">तुम्ही शोधत आहात</option>
              <option value="MALE">वर (Groom)</option>
              <option value="FEMALE">वधू (Bride)</option>
            </select>
          </div>
          
          <div className="flex-1 bg-background border border-border rounded-lg p-3 flex items-center gap-3 focus-within:border-primary/50 transition-colors">
            <Compass size={16} className="text-secondary" />
            <select 
              value={searchAge} 
              onChange={e => setSearchAge(e.target.value)} 
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
            >
              <option value="">वय गट (Age)</option>
              <option value="18-25">18 - 25 वर्षे</option>
              <option value="25-30">25 - 30 वर्षे</option>
              <option value="30-35">30 - 35 वर्षे</option>
              <option value="35-45">35 - 45 वर्षे</option>
              <option value="45-60">45+ वर्षे</option>
            </select>
          </div>
          
          <div className="flex-1 bg-background border border-border rounded-lg p-3 flex items-center gap-3 focus-within:border-primary/50 transition-colors">
            <MapPin size={16} className="text-primary/60" />
            <input 
              type="text" 
              value={searchLocation} 
              onChange={e => setSearchLocation(e.target.value)} 
              placeholder="शहर (उदा. पुणे)" 
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button 
            onClick={handleQuickSearch} 
            className="md:w-32 btn-premium-primary h-auto py-3 md:py-0 flex items-center justify-center gap-2"
          >
            <Search size={16} />
            शोधा
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST METRICS
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 border-y border-border py-16">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { val: '2.5k+', label: 'व्हेरिफाइड प्रोफाइल्स' },
              { val: '100%', label: 'सुरक्षितता व गोपनियता' },
              { val: '500+', label: 'यशस्वी विवाह' },
              { val: '24/7', label: 'उत्कृष्ट सपोर्ट' },
            ].map((stat, i) => (
              <div key={i} className="text-center pt-8 md:pt-0">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{stat.val}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="section-title text-foreground mb-4 font-display">सोपी आणि सुरक्षित पद्धत</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto font-sans">योग्य जोडीदार शोधण्याचा तुमचा प्रवास आम्ही अत्यंत सोपा आणि सुरक्षित केला आहे.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={20} />, title: 'नोंदणी करा', desc: 'तुमची मोफत नोंदणी करा आणि तुमची माहिती सविस्तर भरा.' },
              { icon: <ShieldCheck size={20} />, title: 'पडताळणी (Verified)', desc: 'तुमचे शासकीय ओळखपत्र अपलोड करून प्रोफाइल व्हेरिफाय करा.' },
              { icon: <Compass size={20} />, title: 'स्थळे शोधा', desc: 'तुमच्या अपेक्षेनुसार शिक्षण, जात आणि नोकरीच्या आधारावर स्थळे शोधा.' },
              { icon: <Heart size={20} />, title: 'संपर्क साधा', desc: 'पसंत असलेल्या स्थळांशी संवाद साधा आणि पुढील निर्णय घ्या.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-8 border border-border h-full flex flex-col hover:shadow-sm-soft transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROFILES
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="section-title text-foreground mb-2 font-display">नवे सभासद</h2>
                <p className="text-muted-foreground text-lg font-sans">विवाहवेधवर नव्याने जोडले गेलेले काही प्रतिष्ठित प्रोफाइल्स.</p>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors font-sans">
                सर्व स्थळे पाहा <ArrowRight size={16} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProfiles.map((user, i) => {
                const imgUrl = user.images?.[0]?.url;
                const initial = user.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={user.id} delay={i * 0.05}>
                    <div 
                      onClick={() => navigate(`/profile/${user.id}`)} 
                      className="group cursor-pointer flex flex-col gap-4 bg-background border border-border rounded-xl p-3 hover:shadow-md-soft transition-all"
                    >
                      <div className="aspect-[4/5] relative bg-white rounded-lg overflow-hidden border border-border">
                        {imgUrl ? (
                          <img 
                            src={resolveImageUrl(imgUrl)} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-3xl font-display font-medium text-muted-foreground">{initial}</span>
                          </div>
                        )}
                        
                        {user.kycVerified && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-border px-2 py-1 rounded text-[10px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            Verified
                          </div>
                        )}
                      </div>
                      
                      <div className="px-1 text-center font-sans">
                        <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-1 font-medium">
                          {user.education?.jobBusiness || 'Professional'} • {user.addresses?.[0]?.city || 'India'}
                        </p>
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
          SUCCESS STORIES 
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            
            <div className="w-full md:w-1/2 aspect-[4/5] rounded-t-full rounded-b-xl overflow-hidden border border-white/20 relative p-2 bg-white/5">
              <div className="w-full h-full rounded-t-full rounded-b-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentStory}
                    src={successStories[currentStory].img} 
                    alt="Couple" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover opacity-90" 
                  />
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary mb-8 font-sans">कथा यशस्वितेच्या</h2>
              
              <div className="min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-xl md:text-2xl font-display text-white/95 leading-relaxed mb-6 italic">
                      "{successStories[currentStory].quote}"
                    </p>
                    <h4 className="text-lg font-bold text-white font-sans">{successStories[currentStory].couple}</h4>
                    <p className="text-sm text-secondary mt-1 font-sans">
                      {successStories[currentStory].location}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-12">
                <button 
                  onClick={prevStory} 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={nextStory} 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          EXACT PRICING DESIGN REPLICATION
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="section-title text-foreground mb-4 font-display">सभासदत्व योजना (Membership Plans)</h2>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto font-sans">तुमच्या गरजेनुसार योग्य प्लॅन निवडा.</p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
            
            {/* --- FREE PLAN --- */}
            <Reveal delay={0.1} className="h-full">
              <div className="bg-white rounded-[24px] p-8 border border-gray-200 h-full flex flex-col shadow-sm">
                <h3 className="text-[28px] font-bold text-[#1a8c3d] mb-1">Free</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-[#1a8c3d]">₹0</span>
                </div>
                <p className="text-[#64748b] text-[15px] mb-8 font-medium">Forever • No expiry</p>
                
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#1a8c3d] flex-shrink-0" /> Create & complete profile
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#1a8c3d] flex-shrink-0" /> Upload up to 3 photos
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#1a8c3d] flex-shrink-0" /> Search active profiles
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#1a8c3d] flex-shrink-0" /> Receive match proposals
                  </li>
                  <li className="flex items-center gap-3 text-[#94a3b8] text-[15px]">
                    <X size={18} className="text-[#cbd5e1] flex-shrink-0" /> Cannot send proposals
                  </li>
                  <li className="flex items-center gap-3 text-[#94a3b8] text-[15px]">
                    <X size={18} className="text-[#cbd5e1] flex-shrink-0" /> Cannot view contact info
                  </li>
                </ul>

                <Link 
                  to="/register" 
                  className="w-full py-4 text-center rounded-[12px] font-bold text-[16px] border-2 border-[#1a8c3d] text-[#1a8c3d] hover:bg-[#1a8c3d] hover:text-white transition-colors block"
                >
                  Get Started Free
                </Link>
              </div>
            </Reveal>

            {/* --- SILVER PLAN --- */}
            <Reveal delay={0.2} className="h-full">
              <div className="bg-[#b30f36] rounded-[24px] p-8 h-full flex flex-col relative shadow-xl shadow-primary/20 scale-100 lg:scale-105 z-10 border-4 border-[#b30f36]">
                
                {/* Popular Ribbon */}
                <div className="absolute top-0 right-6 bg-[#fbbf24] text-[#78350f] text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-md flex items-center gap-1 shadow-sm">
                  <Star size={12} fill="currentColor" /> POPULAR
                </div>

                <h3 className="text-[28px] font-bold text-white mb-1 mt-2">Silver</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">₹2,000</span>
                </div>
                <p className="text-white/80 text-[15px] mb-8 font-medium">Valid for 1 Year</p>
                
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Everything in Free
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Send 4 proposals per day
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> View contact on mutual accept
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Full photo gallery access
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Advanced search filters
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Who viewed my profile
                  </li>
                  <li className="flex items-center gap-3 text-white text-[15px]">
                    <Check size={18} className="text-white flex-shrink-0" /> Email support
                  </li>
                </ul>

                <button 
                  onClick={() => { setSelectedPlan({ type: 'SILVER', price: 2000 }); setIsPaymentModalOpen(true); }}
                  className="w-full py-4 text-center rounded-[12px] font-bold text-[16px] bg-white text-[#b30f36] hover:bg-gray-50 transition-colors"
                >
                  Upgrade to Silver
                </button>
              </div>
            </Reveal>

            {/* --- GOLD PLAN --- */}
            <Reveal delay={0.3} className="h-full">
              <div className="bg-white rounded-[24px] p-8 border-2 border-[#f59e0b] h-full flex flex-col relative shadow-md shadow-amber-500/10">
                
                {/* Premium Ribbon */}
                <div className="absolute top-0 right-6 bg-[#f59e0b] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-md flex items-center gap-1 shadow-sm">
                  👑 PREMIUM
                </div>

                <h3 className="text-[28px] font-bold text-[#d97706] mb-1 mt-2">Gold</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-[#b45309]">₹5,000</span>
                </div>
                <p className="text-[#64748b] text-[15px] mb-8 font-medium">Valid for 1 Year</p>
                
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#d97706] flex-shrink-0" /> Everything in Silver
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Check size={18} className="text-[#d97706] flex-shrink-0" /> Unlimited match proposals
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Star size={18} className="text-[#d97706] fill-[#d97706] flex-shrink-0" /> Priority listing in search
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <div className="w-[18px] h-[18px] bg-[#22c55e] rounded-sm flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                    Verified profile badge
                  </li>
                  <li className="flex items-start gap-3 text-[#334155] text-[15px]">
                    <Handshake size={18} className="text-[#d97706] flex-shrink-0 mt-0.5" /> 
                    <span>Dedicated Offline Relationship Manager</span>
                  </li>
                  <li className="flex items-center gap-3 text-[#334155] text-[15px]">
                    <Smartphone size={18} className="text-[#4f46e5] fill-[#4f46e5] flex-shrink-0" /> Premium WhatsApp Support
                  </li>
                </ul>

                <button 
                  onClick={() => { setSelectedPlan({ type: 'GOLD', price: 5000 }); setIsPaymentModalOpen(true); }}
                  className="w-full py-4 text-center rounded-[12px] font-bold text-[16px] bg-[#f59e0b] text-white hover:bg-[#d97706] transition-colors"
                >
                  Upgrade to Gold
                </button>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 bg-background text-center border-t border-border">
        <Reveal className="max-w-2xl mx-auto px-6">
          <h2 className="section-title text-foreground mb-6 font-display">तुमचा शोध आजच सुरु करा</h2>
          <p className="text-muted-foreground text-lg mb-10 font-sans">फक्त २ मिनिटांत मोफत प्रोफाइल तयार करा आणि योग्य जोडीदार मिळवा.</p>
          <Link to="/register" className="btn-premium-primary h-14 text-sm px-10 font-sans">
            मोफत नोंदणी करा (Register Free)
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
