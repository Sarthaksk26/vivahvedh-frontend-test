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
  Handshake,
  Phone,
  MessageCircle
} from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';
import { SEO } from '../components/common/SEO';
import { authStorage } from '../lib/authStorage';
import { SUPPORT_PHONE, WHATSAPP_DISPLAY, getWhatsAppUrl } from '../lib/constants';

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
    document.title = 'विवाहवेध | Premium Marathi Matrimony';
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

  const handlePlanSelect = (type: 'SILVER' | 'GOLD', price: number) => {
    if (!authStorage.isAuthenticated()) {
      navigate(`/login?returnUrl=${encodeURIComponent('/#plans')}`);
      return;
    }
    setSelectedPlan({ type, price });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center overflow-x-hidden font-sans text-foreground">
      <SEO />
      
      {/* ═══════════════════════════════════════════════════
          HERO SECTION — विवाह मंडप (Wedding Pavilion) — Compact & Premium
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full py-10 lg:py-16 flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 30%, #FFF5E1 60%, #FFFCF5 100%)' }}
      >
        {/* Decorative ambient blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kumkum-500/5 rounded-full blur-[120px] -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-haldi-500/8 rounded-full blur-[120px] translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-haldi-400/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center">
          
          {/* Logo as Sacred Hero Centerpiece */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-5"
          >
            {/* Radial glow behind logo */}
            <div className="absolute inset-0 -m-16 bg-haldi-400/10 rounded-full blur-[60px] animate-pulse-glow pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="विवाहवेध — शोध नव्या नात्यांचा" 
              className="w-[240px] sm:w-[320px] md:w-[380px] h-auto object-contain relative z-10 mix-blend-multiply" 
            />
          </motion.div>

          {/* Paithani decorative divider */}
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }} 
            animate={{ opacity: 1, scaleX: 1 }} 
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-48 h-[3px] mb-6"
            style={{
              background: 'repeating-linear-gradient(90deg, #C41E2A 0px, #C41E2A 8px, #E8A317 8px, #E8A317 16px, transparent 16px, transparent 20px)'
            }}
          />

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-foreground/60 mb-3 max-w-xl leading-relaxed font-sans"
          >
            महाराष्ट्रातील सुशिक्षित आणि प्रतिष्ठित कुटुंबांसाठी एक खात्रीशीर व सुरक्षित विवाह व्यासपीठ.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-foreground/40 mb-8 font-ui"
          >
            १००% पडताळणी केलेले प्रोफाइल्स • Trusted by 2,500+ Families
          </motion.p>
          
          {/* Primary CTAs — Register (bold/prominent) + Know About Us */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-6"
          >
            {/* REGISTER — extra bold & prominent */}
            <Link 
              to="/register" 
              className="relative h-[56px] text-base px-12 w-full sm:w-auto flex items-center justify-center font-ui font-black tracking-wide text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)',
                boxShadow: '0 10px 30px -6px rgba(196, 30, 42, 0.5), 0 0 0 2px rgba(196, 30, 42, 0.1)'
              }}
            >
              {/* Animated shimmer overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 animate-hero-shimmer" />
              <span className="relative z-10 flex items-center gap-2">
                मोफत नोंदणी करा — Register Free
                <ArrowRight size={18} />
              </span>
            </Link>
            <Link 
              to="/about" 
              className="h-[52px] text-sm px-8 w-full sm:w-auto flex items-center justify-center border-2 border-primary/15 bg-white hover:bg-primary/5 text-foreground rounded-xl transition-all font-ui font-bold hover:border-primary/30 hover:shadow-sm"
            >
              आमच्याबद्दल जाणा — Know About Us
            </Link>
          </motion.div>

          {/* Secondary Row — Call Us + WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-sm"
          >
            <a 
              href={`tel:${SUPPORT_PHONE.split(',')[0].trim().replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors font-sans group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Phone size={14} className="text-primary" />
              </div>
              <span>Call Us: <span className="font-bold text-foreground/70">7447448844</span></span>
            </a>
            <span className="hidden sm:block text-foreground/15">|</span>
            <a 
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/50 hover:text-[#25D366] transition-colors font-sans group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/8 flex items-center justify-center group-hover:bg-[#25D366]/15 transition-colors">
                <MessageCircle size={14} className="text-[#25D366]" />
              </div>
              <span>WhatsApp: <span className="font-bold text-foreground/70">{WHATSAPP_DISPLAY}</span></span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SEARCH CONSOLE
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-7 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-premium border border-haldi-500/10 p-4 flex flex-col md:flex-row gap-3 font-sans">
          
          <div className="flex-1 bg-background border border-border rounded-xl p-3 flex items-center gap-3 focus-within:border-primary/40 transition-colors">
            <Heart size={16} className="text-primary/50" />
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
          
          <div className="flex-1 bg-background border border-border rounded-xl p-3 flex items-center gap-3 focus-within:border-primary/40 transition-colors">
            <Compass size={16} className="text-haldi-500" />
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
          
          <div className="flex-1 bg-background border border-border rounded-xl p-3 flex items-center gap-3 focus-within:border-primary/40 transition-colors">
            <MapPin size={16} className="text-primary/50" />
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
            className="md:w-36 btn-premium-primary h-auto py-3.5 md:py-0 flex items-center justify-center gap-2 font-ui"
          >
            <Search size={16} />
            शोधा
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST METRICS — Golden Strip
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-2xl border border-haldi-500/15 p-10 shadow-md-soft">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                {[
                  { val: '2,500+', label: 'व्हेरिफाइड प्रोफाइल्स' },
                  { val: '100%', label: 'सुरक्षितता व गोपनीयता' },
                  { val: '500+', label: 'यशस्वी विवाह' },
                  { val: '24/7', label: 'उत्कृष्ट सपोर्ट' },
                ].map((stat, i) => (
                  <div key={i} className={`text-center ${i < 3 ? 'md:border-r md:border-haldi-500/10' : ''}`}>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">{stat.val}</h3>
                    <p className="text-xs font-ui font-bold text-foreground/40 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — कसे काम करते?
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-20 bg-rangoli-pattern">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-3 block">प्रक्रिया • Process</span>
            <h2 className="section-title text-foreground mb-3">कसे काम करते?</h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto font-sans">योग्य जोडीदार शोधण्याचा तुमचा प्रवास आम्ही अत्यंत सोपा आणि सुरक्षित केला आहे.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '१', icon: <Users size={22} />, title: 'नोंदणी करा', desc: 'तुमची मोफत नोंदणी करा आणि तुमची माहिती सविस्तर भरा.' },
              { num: '२', icon: <ShieldCheck size={22} />, title: 'पडताळणी', desc: 'तुमचे शासकीय ओळखपत्र अपलोड करून प्रोफाइल व्हेरिफाय करा.' },
              { num: '३', icon: <Compass size={22} />, title: 'स्थळे शोधा', desc: 'तुमच्या अपेक्षेनुसार शिक्षण, जात आणि नोकरीच्या आधारावर स्थळे शोधा.' },
              { num: '४', icon: <Heart size={22} />, title: 'संपर्क साधा', desc: 'पसंत असलेल्या स्थळांशी संवाद साधा आणि पुढील निर्णय घ्या.' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-7 border border-border h-full flex flex-col hover:shadow-card-hover transition-all duration-500 group relative overflow-hidden">
                  {/* Golden top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kumkum-500 to-haldi-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-9 h-9 rounded-full bg-haldi-500/10 flex items-center justify-center text-haldi-600 font-display text-lg font-bold">{step.num}</span>
                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
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
          FEATURED PROFILES — नवे सभासद
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-3 block">प्रोफाइल्स • Profiles</span>
                <h2 className="section-title text-foreground mb-2">नवे सभासद</h2>
                <p className="text-muted-foreground text-base font-sans">विवाहवेधवर नव्याने जोडले गेलेले काही प्रतिष्ठित प्रोफाइल्स.</p>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-sm font-ui font-bold text-primary hover:text-primary/80 transition-colors">
                सर्व स्थळे पाहा <ArrowRight size={16} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featuredProfiles.map((user, i) => {
                const imgUrl = user.images?.[0]?.url;
                const initial = user.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={user.id} delay={i * 0.05}>
                    <div 
                      onClick={() => navigate(`/profile/${user.id}`)} 
                      className="group cursor-pointer flex flex-col gap-3 bg-white border border-border rounded-2xl p-3 hover:shadow-card-hover transition-all duration-500"
                    >
                      <div className="aspect-[4/5] relative bg-background rounded-xl overflow-hidden border border-border">
                        {imgUrl ? (
                          <img 
                            src={resolveImageUrl(imgUrl)} 
                            alt="Profile" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-haldi-500/5">
                            <span className="text-3xl font-display font-bold text-primary/30">{initial}</span>
                          </div>
                        )}
                        
                        {user.kycVerified && (
                          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur border border-paan-500/30 px-2.5 py-1 rounded-lg text-[10px] font-ui font-bold text-paan-600 flex items-center gap-1.5 uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-paan-500" />
                            Verified
                          </div>
                        )}
                      </div>
                      
                      <div className="px-1 text-center font-sans">
                        <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
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
          SUCCESS STORIES — यशोगाथा
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 overflow-hidden relative" 
        style={{ background: 'linear-gradient(135deg, #7a1018 0%, #520A0D 100%)' }}
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{
          background: 'repeating-linear-gradient(90deg, #E8A317 0px, #E8A317 12px, #C41E2A 12px, #C41E2A 24px)'
        }} />

        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-14 items-center">
            
            {/* Image */}
            <div className="w-full md:w-1/2 aspect-[4/5] rounded-t-full rounded-b-2xl overflow-hidden border-2 border-white/10 relative p-2 bg-white/5">
              <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden">
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

            {/* Text */}
            <div className="w-full md:w-1/2 flex flex-col text-white">
              <span className="text-haldi-400 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-8">कथा यशस्वितेच्या • Success Stories</span>
              
              <div className="min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStory}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-lg md:text-xl font-display text-white/90 leading-relaxed mb-6 italic">
                      "{successStories[currentStory].quote}"
                    </p>
                    <h4 className="text-lg font-bold text-white font-sans">{successStories[currentStory].couple}</h4>
                    <p className="text-sm text-haldi-400 mt-1 font-sans">
                      {successStories[currentStory].location}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-10">
                <button 
                  onClick={prevStory} 
                  className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-haldi-400/50 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={nextStory} 
                  className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/10 hover:border-haldi-400/50 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
                {/* Dots */}
                <div className="flex items-center gap-2 ml-3">
                  {successStories.map((_, i) => (
                    <button key={i} onClick={() => setCurrentStory(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentStory ? 'bg-haldi-400 w-6' : 'bg-white/20'}`} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRICING — सभासदत्व योजना
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-24 bg-rangoli-pattern">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-3 block">योजना • Plans</span>
            <h2 className="section-title text-foreground mb-3">सभासदत्व योजना</h2>
            <p className="text-muted-foreground text-base max-w-sm mx-auto font-sans">तुमच्या गरजेनुसार योग्य प्लॅन निवडा.</p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 font-sans">
            
            {/* --- FREE PLAN --- */}
            <Reveal delay={0.1} className="h-full">
              <div className="bg-white rounded-3xl p-8 border border-border h-full flex flex-col shadow-sm-soft relative overflow-hidden group hover:shadow-md-soft transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-paan-500" />
                <h3 className="text-2xl font-display font-bold text-paan-600 mb-1">मोफत</h3>
                <p className="text-xs font-ui text-foreground/40 uppercase tracking-wider mb-1">Free Plan</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-bold text-paan-600">₹0</span>
                </div>
                <p className="text-foreground/50 text-sm mb-8 font-ui">Forever • No expiry</p>
                
                <ul className="space-y-3.5 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-paan-500 flex-shrink-0" /> प्रोफाइल तयार करा
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-paan-500 flex-shrink-0" /> ३ फोटो अपलोड करा
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-paan-500 flex-shrink-0" /> स्थळे शोधा
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-paan-500 flex-shrink-0" /> प्रस्ताव प्राप्त करा
                  </li>
                  <li className="flex items-center gap-3 text-foreground/30 text-sm">
                    <X size={16} className="text-foreground/15 flex-shrink-0" /> प्रस्ताव पाठवता येत नाही
                  </li>
                  <li className="flex items-center gap-3 text-foreground/30 text-sm">
                    <X size={16} className="text-foreground/15 flex-shrink-0" /> संपर्क माहिती पाहता येत नाही
                  </li>
                </ul>

                <Link 
                  to="/register" 
                  className="w-full py-3.5 text-center rounded-xl font-ui font-bold text-sm border-2 border-paan-500 text-paan-600 hover:bg-paan-500 hover:text-white transition-all duration-300 block"
                >
                  Get Started Free
                </Link>
              </div>
            </Reveal>

            {/* --- SILVER PLAN --- */}
            <Reveal delay={0.2} className="h-full">
              <div className="rounded-3xl p-8 h-full flex flex-col relative shadow-kumkum scale-100 lg:scale-[1.04] z-10 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
              >
                {/* Popular Ribbon */}
                <div className="absolute top-0 right-6 bg-haldi-500 text-white text-[10px] font-ui font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-lg flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> POPULAR
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-1 mt-2">रौप्य</h3>
                <p className="text-xs font-ui text-white/50 uppercase tracking-wider mb-1">Silver Plan</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-bold text-white">₹2,000</span>
                </div>
                <p className="text-white/60 text-sm mb-8 font-ui">Valid for 1 Year</p>
                
                <ul className="space-y-3.5 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> Free मधील सर्व सुविधा
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> दररोज ४ प्रस्ताव पाठवा
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> संपर्क माहिती पाहा
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> सर्व फोटो पाहा
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> प्रगत शोध फिल्टर
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> कोणी प्रोफाइल पाहिले
                  </li>
                  <li className="flex items-center gap-3 text-white/90 text-sm">
                    <Check size={16} className="text-haldi-400 flex-shrink-0" /> ईमेल सपोर्ट
                  </li>
                </ul>

                <button 
                  onClick={() => handlePlanSelect('SILVER', 2000)}
                  className="w-full py-3.5 text-center rounded-xl font-ui font-bold text-sm bg-white text-kumkum-500 hover:bg-white/90 transition-all duration-300"
                >
                  Upgrade to Silver
                </button>
              </div>
            </Reveal>

            {/* --- GOLD PLAN --- */}
            <Reveal delay={0.3} className="h-full">
              <div className="bg-white rounded-3xl p-8 border-2 border-haldi-500/30 h-full flex flex-col relative shadow-gold overflow-hidden group hover:shadow-lg-soft transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-haldi-500 to-haldi-700" />
                
                {/* Premium Ribbon */}
                <div className="absolute top-0 right-6 bg-haldi-500 text-white text-[10px] font-ui font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-lg flex items-center gap-1">
                  👑 PREMIUM
                </div>

                <h3 className="text-2xl font-display font-bold text-haldi-700 mb-1 mt-2">सुवर्ण</h3>
                <p className="text-xs font-ui text-foreground/40 uppercase tracking-wider mb-1">Gold Plan</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-display font-bold text-haldi-700">₹5,000</span>
                </div>
                <p className="text-foreground/50 text-sm mb-8 font-ui">Valid for 1 Year</p>
                
                <ul className="space-y-3.5 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-haldi-600 flex-shrink-0" /> Silver मधील सर्व सुविधा
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Check size={16} className="text-haldi-600 flex-shrink-0" /> अमर्यादित प्रस्ताव
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Star size={16} className="text-haldi-600 fill-haldi-600 flex-shrink-0" /> शोधात प्राधान्य
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <div className="w-4 h-4 bg-paan-500 rounded flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    Verified बॅज
                  </li>
                  <li className="flex items-start gap-3 text-foreground/70 text-sm">
                    <Handshake size={16} className="text-haldi-600 flex-shrink-0 mt-0.5" /> 
                    <span>Dedicated Offline Relationship Manager</span>
                  </li>
                  <li className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Smartphone size={16} className="text-haldi-600 flex-shrink-0" /> Premium WhatsApp Support
                  </li>
                </ul>

                <button 
                  onClick={() => handlePlanSelect('GOLD', 5000)}
                  className="w-full py-3.5 text-center rounded-xl font-ui font-bold text-sm text-white transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #E8A317 0%, #CA8A04 100%)' }}
                >
                  Upgrade to Gold
                </button>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA — शुभारंभ करा
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF5E1 100%)' }}
      >
        <div className="absolute inset-0 bg-rangoli-pattern pointer-events-none" />
        <Reveal className="max-w-2xl mx-auto px-6 relative z-10">
          {/* Cultural ornament */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-haldi-500/40" />
            <span className="text-haldi-500 text-lg">✦</span>
            <div className="w-12 h-px bg-haldi-500/40" />
          </div>
          
          <h2 className="section-title text-foreground mb-4">तुमचा शोध आजच सुरू करा</h2>
          <p className="text-muted-foreground text-base mb-10 font-sans">फक्त २ मिनिटांत मोफत प्रोफाइल तयार करा आणि योग्य जोडीदार मिळवा.</p>
          <Link to="/register" className="btn-premium-primary h-14 text-sm px-12 font-ui inline-flex items-center justify-center">
            मोफत नोंदणी करा — Register Free
          </Link>
          
          <p className="mt-6 text-xs font-ui text-foreground/30">
            १००% मोफत • कोणतेही शुल्क नाही • तात्काळ सुरू करा
          </p>
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
