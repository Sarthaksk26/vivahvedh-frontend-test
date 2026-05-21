import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Quote, CheckCircle2, Users, ShieldCheck, Heart, Compass, Search, ChevronDown } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

/* ─── Scroll reveal wrapper ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD'; price: number } | null>(null);

  /* ─── Quick search state ─── */
  const [searchGender, setSearchGender] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    /* ── SEO ── */
    document.title = 'Vivahvedh Matrimony – शोध नव्या नात्यांचा | Marathi Matrimony';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Vivahvedh – शोध नव्या नात्यांचा. महाराष्ट्रातील सर्वात विश्वासार्ह मराठी विवाह संस्था. 100% verified profiles, secure connections, and family-first values.');
    setMeta('keywords', 'Marathi Matrimony, Vivahvedh, Shodh Navya Natyancha, वधू वर सूचक, Maratha Vadhu Var, Pune Matrimony, Mumbai Matrimony, शुभ विवाह');

    const schemaId = 'vivahvedh-schema';
    if (!document.getElementById(schemaId)) {
      const s = document.createElement('script');
      s.id = schemaId; s.type = 'application/ld+json';
      s.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization',
        name: 'Vivahvedh Matrimony', url: window.location.origin,
        logo: `${window.location.origin}/logo.png`,
        description: 'Premier Marathi Matrimonial service — tradition, trust, verified profiles across Maharashtra.',
        address: { '@type': 'PostalAddress', addressLocality: 'Gadhinglaj', addressRegion: 'Maharashtra', addressCountry: 'IN' },
      });
      document.head.appendChild(s);
    }

    apiClient.get('/search').then(r => setFeaturedProfiles(r.data.results.slice(0, 6))).catch(() => {});
    apiClient.get('/stories').then(r => setSuccessStories(r.data.slice(0, 3))).catch(() => {});

    return () => { document.getElementById(schemaId)?.remove(); };
  }, []);

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (searchGender) params.set('gender', searchGender);
    if (searchAge) { params.set('ageMin', searchAge.split('-')[0]); params.set('ageMax', searchAge.split('-')[1] || '60'); }
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO — Cinematic, immersive, branded
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0C0A09]">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?q=80&w=1920&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0C0A09]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0A09]/80 via-transparent to-[#0C0A09]/80" />
        </div>

        {/* Decorative top border — subtle Paithani-inspired gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-24 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/10 p-4 shadow-2xl">
              <img src="/logo.png" alt="Vivahvedh Matrimony" className="w-full h-full object-contain brightness-0 invert" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-amber-400/80 text-[11px] font-black uppercase tracking-[0.4em] mb-6"
          >
            शोध नव्या नात्यांचा
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[1.05] tracking-tight mb-6"
          >
            Find Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">Perfect Match</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-12 font-medium"
          >
            Maharashtra's most trusted matrimonial service.
            <br className="hidden md:block" />
            मराठी परंपरा, कौटुंबिक मूल्ये, विश्वासार्ह नाती.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center items-center gap-8 md:gap-14 mb-16"
          >
            {[
              { val: '2,500+', label: 'Verified Profiles' },
              { val: '500+', label: 'Marriages Fixed' },
              { val: '100%', label: 'Privacy First' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-display font-black text-white">{s.val}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register" className="px-10 py-4 bg-white text-[#0C0A09] font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.15)]">
              नोंदणी करा — Register Free
            </Link>
            <Link to="/search" className="px-10 py-4 bg-white/[0.08] text-white/80 border border-white/10 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-white/[0.12] transition-all backdrop-blur-sm">
              Explore Profiles
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          QUICK SEARCH BAR — Overlapping the hero/content boundary
      ═══════════════════════════════════════════════════ */}
      <section className="w-full relative z-20 -mt-12">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-black/[0.04] p-3">
              <div className="flex flex-col md:flex-row items-stretch gap-2">
                {/* Gender */}
                <div className="flex-1 relative">
                  <label className="absolute top-2.5 left-4 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">Looking For</label>
                  <select
                    value={searchGender}
                    onChange={e => setSearchGender(e.target.value)}
                    className="w-full h-[72px] pt-6 pb-2 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Any Gender</option>
                    <option value="MALE">Groom (वर)</option>
                    <option value="FEMALE">Bride (वधू)</option>
                  </select>
                </div>

                {/* Age */}
                <div className="flex-1 relative">
                  <label className="absolute top-2.5 left-4 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">Age Range</label>
                  <select
                    value={searchAge}
                    onChange={e => setSearchAge(e.target.value)}
                    className="w-full h-[72px] pt-6 pb-2 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Any Age</option>
                    <option value="18-25">18 – 25 years</option>
                    <option value="25-30">25 – 30 years</option>
                    <option value="30-35">30 – 35 years</option>
                    <option value="35-45">35 – 45 years</option>
                    <option value="45-60">45+ years</option>
                  </select>
                </div>

                {/* Location */}
                <div className="flex-1 relative">
                  <label className="absolute top-2.5 left-4 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">Location</label>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                    placeholder="Pune, Mumbai..."
                    className="w-full h-[72px] pt-6 pb-2 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Search button */}
                <button
                  onClick={handleQuickSearch}
                  className="h-[72px] px-8 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 hover:bg-primary/90 transition-all shadow-[0_10px_20px_-5px_rgba(184,0,53,0.25)] flex-shrink-0"
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST STRIP — Warm Marathi identity bar
      ═══════════════════════════════════════════════════ */}
      <section className="w-full pt-20 pb-16">
        <Reveal className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {[
              'कुलीन घराणी', '१००% पडताळणी', 'गोपनीय माहिती', 'कुंडली जुळवणी', 'संस्कृतीचे जतन'
            ].map((text, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/15">{text}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — Numbered steps with warm bg
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-[#F7F9FB]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">कसे कार्य करते</p>
            <h2 className="section-title text-foreground">Your Journey Begins Here</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Users size={22} />, num: '01', title: 'Create Profile', titleMr: 'प्रोफाइल बनवा', desc: 'तुमची माहिती, शिक्षण आणि कौटुंबिक पार्श्वभूमी भरा.' },
              { icon: <ShieldCheck size={22} />, num: '02', title: 'Get Verified', titleMr: 'पडताळणी करा', desc: 'विश्वासार्हतेसाठी ओळखपत्राची पडताळणी करा.' },
              { icon: <Compass size={22} />, num: '03', title: 'Search & Match', titleMr: 'शोधा व जुळवा', desc: 'जात, शिक्षण, शहर — तुमच्या अपेक्षांनुसार शोधा.' },
              { icon: <Heart size={22} />, num: '04', title: 'Connect', titleMr: 'संवाद साधा', desc: 'पसंती कळवा, संपर्क करा, नाते निश्चित करा.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative bg-white rounded-3xl p-7 border border-black/[0.04] h-full group hover:shadow-ambient transition-all duration-500">
                  {/* Large background number */}
                  <span className="absolute top-5 right-6 text-[64px] font-display font-black text-foreground/[0.03] leading-none select-none">{item.num}</span>

                  <div className="w-11 h-11 rounded-xl bg-primary/[0.06] flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-400">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-0.5">{item.titleMr}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/25 mb-3">{item.title}</p>
                  <p className="text-sm text-foreground/45 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BRAND PHILOSOPHY — Dark cinematic section
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 bg-[#0C0A09] relative overflow-hidden">
        {/* Subtle gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        <Reveal className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] mb-8">
            <Quote size={20} className="text-amber-400/60" />
          </div>
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-white leading-[1.15] tracking-tight mb-8">
            मराठमोळ्या संस्कृतीचे जतन करत,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">दोन कुटुंबांचे मंगल मिलन.</span>
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <span className="w-10 h-px bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/25">Vivahvedh Matrimony</span>
            <span className="w-10 h-px bg-white/10" />
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY VIVAHVEDH — Split layout, warm section
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="rounded-[32px] overflow-hidden shadow-ambient">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop"
                  className="w-full aspect-[4/3] object-cover"
                  alt="Traditional Maharashtrian Wedding Celebration"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">आमचे वेगळेपण</p>
              <h2 className="section-title text-foreground mb-6">
                Tradition Meets
                <br />
                Modern Trust.
              </h2>
              <p className="text-foreground/45 leading-relaxed text-[15px] mb-10">
                आम्ही संख्येपेक्षा गुणवत्तेला प्राधान्य देतो. प्रत्येक प्रोफाइलची काळजीपूर्वक पडताळणी,
                तुमच्या माहितीची संपूर्ण गोपनीयता, आणि पालकांसाठी सुलभ अनुभव.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { title: '१००% हस्तलिखित पडताळणी', sub: 'Manually Verified Profiles' },
                  { title: 'संपूर्ण गोपनीय व सुरक्षित', sub: 'End-to-End Encrypted Data' },
                  { title: 'पालकांसाठी सुलभ रचना', sub: 'Parent-Friendly Experience' },
                  { title: 'तत्पर ग्राहक सेवा', sub: 'Dedicated Personal Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-primary/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-[11px] text-foreground/30 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/about" className="clay-button-secondary px-8 py-3.5 text-[10px] inline-block">
                Learn More
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROFILES — Elegant grid
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-28 bg-[#F7F9FB]">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">नवीन सभासद</p>
                <h2 className="section-title text-foreground">Recently Joined</h2>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/30 hover:text-primary transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProfiles.map((p, i) => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={p.id} delay={i * 0.06}>
                    <div onClick={() => navigate(`/profile/${p.id}`)} className="cursor-pointer group">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/[0.03] mb-3 relative">
                        {imgUrl ? (
                          <img
                            src={resolveImageUrl(imgUrl)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={`${p.profile?.firstName || 'Member'} profile`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/[0.03] to-primary/[0.07]">
                            <span className="text-4xl font-display font-black text-primary/15">{initial}</span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{p.regId}</span>
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {p.profile?.firstName} {p.profile?.lastName}
                      </h3>
                      <p className="text-[10px] text-foreground/30 mt-0.5 truncate">{p.education?.trade || 'Professional'}</p>
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
      {successStories.length > 0 && (
        <section className="w-full py-28 bg-background">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="text-center mb-16">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">यशोगाथा</p>
              <h2 className="section-title text-foreground">Success Stories</h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {successStories.map((story, i) => (
                <Reveal key={story.id} delay={i * 0.08}>
                  <div className="bg-white rounded-3xl p-8 border border-black/[0.04] flex flex-col items-center text-center h-full hover:shadow-ambient transition-all duration-500">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-6 bg-primary/[0.04] border-2 border-white shadow-lg flex-shrink-0">
                      {story.photoUrl ? (
                        <img src={resolveImageUrl(story.photoUrl)} alt={`${story.groomName} & ${story.brideName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/25">
                          <Heart size={24} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground/45 leading-relaxed italic mb-6 flex-1">"{story.message}"</p>
                    <p className="text-sm font-bold text-foreground">{story.groomName} & {story.brideName}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          PRICING — Three elegant tiers
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-[#F7F9FB]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">सदस्यत्व</p>
            <h2 className="section-title text-foreground mb-3">Simple Pricing</h2>
            <p className="text-foreground/35 text-sm">Transparent plans. No hidden fees.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Free', nameMr: 'विनामूल्य', price: '0', amount: 0, period: 'Forever',
                cta: 'Register Free', dark: false,
                features: ['Create Profile', 'Browse Members', 'Basic Search', 'Receive Interests'],
              },
              {
                name: 'Silver', nameMr: 'रोप्य', price: '2,000', amount: 2000, period: '1 Year',
                cta: 'Select Silver', dark: false,
                features: ['Send 5 Interests / day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'],
              },
              {
                name: 'Gold', nameMr: 'सुवर्ण', price: '5,000', amount: 5000, period: '1 Year',
                cta: 'Select Gold', dark: true,
                features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'],
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`relative flex flex-col h-full rounded-3xl p-8 transition-all duration-500 ${
                  plan.dark
                    ? 'bg-[#0C0A09] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]'
                    : 'bg-white border border-black/[0.04] hover:shadow-ambient'
                }`}>
                  {plan.dark && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${plan.dark ? 'text-white/40' : 'text-foreground/25'}`}>{plan.nameMr}</p>
                    <p className={`text-xs font-bold mt-0.5 ${plan.dark ? 'text-white/60' : 'text-foreground/50'}`}>{plan.name}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-base font-bold ${plan.dark ? 'text-white/50' : 'text-foreground/30'}`}>₹</span>
                    <span className={`text-4xl font-display font-black ${plan.dark ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-8 ${plan.dark ? 'text-white/30' : 'text-foreground/20'}`}>{plan.period}</p>

                  <ul className="space-y-3 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 size={15} className={plan.dark ? 'text-amber-400/70' : 'text-primary/50'} />
                        <span className={plan.dark ? 'text-white/70' : 'text-foreground/55'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.amount > 0 ? (
                    <button
                      onClick={() => {
                        setSelectedPlan({ type: plan.name as 'SILVER' | 'GOLD', price: plan.amount });
                        setIsPaymentModalOpen(true);
                      }}
                      className={`w-full py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                        plan.dark
                          ? 'bg-white text-[#0C0A09] hover:bg-white/90'
                          : 'bg-primary text-white hover:bg-primary/90 shadow-[0_10px_20px_-5px_rgba(184,0,53,0.2)]'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      to="/register"
                      className="block w-full py-3.5 text-center rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.08] transition-all duration-300"
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
          FINAL CTA — Clean closer
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 bg-background text-center">
        <Reveal className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-display font-black text-foreground leading-[1.1] tracking-tight mb-6">
            तुमचा जोडीदार
            <br />
            <span className="text-gradient">वाट पाहत आहे.</span>
          </h2>
          <p className="text-foreground/35 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
            आजच नोंदणी करा आणि नव्या नात्यांचा प्रवास सुरू करा.
          </p>
          <Link to="/register" className="clay-button-primary px-12 py-4.5 text-[11px] inline-block">
            नोंदणी करा — Register Free
          </Link>
        </Reveal>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType={selectedPlan?.type || 'SILVER'}
        price={selectedPlan?.price || 2000}
      />
    </div>
  );
}
