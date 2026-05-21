import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, Users, ShieldCheck, Heart, Compass, Search } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }} className={className}>
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
  const [searchGender, setSearchGender] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    document.title = 'Vivahvedh Matrimony – शोध नव्या नात्यांचा | Marathi Matrimony';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Vivahvedh – शोध नव्या नात्यांचा. महाराष्ट्रातील सर्वात विश्वासार्ह मराठी विवाह संस्था. 100% verified Marathi profiles.');
    setMeta('keywords', 'Marathi Matrimony, Vivahvedh, Shodh Navya Natyancha, वधू वर सूचक, Maratha Vadhu Var, Pune Matrimony, Mumbai Matrimony');

    const schemaId = 'vivahvedh-schema';
    if (!document.getElementById(schemaId)) {
      const s = document.createElement('script');
      s.id = schemaId; s.type = 'application/ld+json';
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Vivahvedh Matrimony', url: window.location.origin, logo: `${window.location.origin}/logo.png`, description: 'Premier Marathi Matrimonial service across Maharashtra.', address: { '@type': 'PostalAddress', addressLocality: 'Gadhinglaj', addressRegion: 'Maharashtra', addressCountry: 'IN' } });
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
    <div className="flex-1 w-full flex flex-col items-center bg-background overflow-x-hidden">

      {/* ══════ HERO ══════ */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-28 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-ambient border border-black/[0.04] p-4">
              <img src="/logo.png" alt="Vivahvedh Matrimony" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary text-[11px] font-black uppercase tracking-[0.35em] mb-5">
            शोध नव्या नात्यांचा
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-4xl sm:text-5xl md:text-7xl font-display font-black leading-[1.08] tracking-tight text-foreground mb-5">
            Find Your Perfect
            <br />
            <span className="text-gradient">Life Partner</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-foreground/40 text-base md:text-lg max-w-md mx-auto leading-relaxed mb-10">
            Maharashtra's most trusted Marathi matrimonial service.
            <br className="hidden md:block" />
            मराठी परंपरा, कौटुंबिक मूल्ये, विश्वासार्ह नाती.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/register" className="clay-button-primary px-10 py-4 text-[11px]">
              नोंदणी करा — Register Free
            </Link>
            <Link to="/search" className="clay-button-secondary px-10 py-4 text-[11px]">
              Explore Profiles
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex justify-center items-center gap-10 md:gap-16">
            {[{ v: '2,500+', l: 'Verified Profiles' }, { v: '500+', l: 'Marriages Fixed' }, { v: '100%', l: 'Privacy First' }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xl md:text-2xl font-display font-black text-foreground">{s.v}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/25 mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════ QUICK SEARCH BAR ══════ */}
      <section className="w-full relative z-20 -mt-14">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="bg-white rounded-3xl shadow-ambient border border-black/[0.04] p-3">
              <div className="flex flex-col md:flex-row items-stretch gap-2">
                <div className="flex-1 relative">
                  <label className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-[0.15em] text-foreground/25">Looking For</label>
                  <select value={searchGender} onChange={e => setSearchGender(e.target.value)} className="w-full h-16 pt-5 pb-1 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="">Any Gender</option>
                    <option value="MALE">Groom (वर)</option>
                    <option value="FEMALE">Bride (वधू)</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <label className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-[0.15em] text-foreground/25">Age Range</label>
                  <select value={searchAge} onChange={e => setSearchAge(e.target.value)} className="w-full h-16 pt-5 pb-1 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="">Any Age</option>
                    <option value="18-25">18 – 25</option>
                    <option value="25-30">25 – 30</option>
                    <option value="30-35">30 – 35</option>
                    <option value="35-45">35 – 45</option>
                    <option value="45-60">45+</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <label className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-[0.15em] text-foreground/25">Location</label>
                  <input type="text" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} placeholder="Pune, Mumbai..." className="w-full h-16 pt-5 pb-1 px-4 bg-[#F7F9FB] rounded-2xl text-sm font-bold text-foreground placeholder:text-foreground/15 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <button onClick={handleQuickSearch} className="h-16 px-7 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-premium flex-shrink-0">
                  <Search size={16} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="w-full pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">कसे कार्य करते</p>
            <h2 className="section-title text-foreground">Four Simple Steps</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Users size={22} />, num: '01', title: 'प्रोफाइल बनवा', sub: 'Create Profile', desc: 'तुमची माहिती, शिक्षण आणि कौटुंबिक पार्श्वभूमी भरा.' },
              { icon: <ShieldCheck size={22} />, num: '02', title: 'पडताळणी करा', sub: 'Get Verified', desc: 'विश्वासार्हतेसाठी ओळखपत्राची पडताळणी करा.' },
              { icon: <Compass size={22} />, num: '03', title: 'शोधा व जुळवा', sub: 'Search & Match', desc: 'जात, शिक्षण, शहर — तुमच्या अपेक्षांनुसार शोधा.' },
              { icon: <Heart size={22} />, num: '04', title: 'संवाद साधा', sub: 'Connect', desc: 'पसंती कळवा, संपर्क करा, नाते निश्चित करा.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative bg-white rounded-3xl p-7 border border-black/[0.04] h-full group hover:shadow-ambient transition-all duration-500">
                  <span className="absolute top-4 right-5 text-[56px] font-display font-black text-foreground/[0.03] leading-none select-none">{item.num}</span>
                  <div className="w-11 h-11 rounded-xl bg-primary/[0.06] flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-400">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/20 mb-3">{item.sub}</p>
                  <p className="text-sm text-foreground/40 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY US ══════ */}
      <section className="w-full py-24 bg-[#F7F9FB]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div className="rounded-3xl overflow-hidden shadow-ambient">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" className="w-full aspect-[4/3] object-cover" alt="Traditional Maharashtrian Wedding Celebration" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">आमचे वेगळेपण</p>
              <h2 className="section-title text-foreground mb-6">परंपरा आणि विश्वास,<br />एकत्र.</h2>
              <p className="text-foreground/40 leading-relaxed text-[15px] mb-10">
                आम्ही संख्येपेक्षा गुणवत्तेला प्राधान्य देतो. प्रत्येक प्रोफाइलची काळजीपूर्वक पडताळणी,
                तुमच्या माहितीची संपूर्ण गोपनीयता, आणि पालकांसाठी सुलभ अनुभव.
              </p>
              <div className="space-y-4">
                {[
                  { t: '१००% हस्तलिखित पडताळणी', s: 'Manually Verified Profiles' },
                  { t: 'संपूर्ण गोपनीय व सुरक्षित', s: 'End-to-End Encrypted' },
                  { t: 'पालकांसाठी सुलभ रचना', s: 'Parent-Friendly' },
                  { t: 'तत्पर ग्राहक सेवा', s: 'Dedicated Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-primary/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.t}</p>
                      <p className="text-[10px] text-foreground/25">{item.s}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════ FEATURED PROFILES ══════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24">
          <div className="max-w-5xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">नवीन सभासद</p>
                <h2 className="section-title text-foreground">Recently Joined</h2>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-foreground/25 hover:text-primary transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProfiles.map((p, i) => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <div onClick={() => navigate(`/profile/${p.id}`)} className="cursor-pointer group">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-foreground/[0.03] mb-3 relative">
                        {imgUrl ? (
                          <img src={resolveImageUrl(imgUrl)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`${p.profile?.firstName || 'Member'} profile`} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/[0.03] to-primary/[0.06]">
                            <span className="text-3xl font-display font-black text-primary/15">{initial}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md">{p.regId}</span>
                        </div>
                      </div>
                      <h3 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{p.profile?.firstName} {p.profile?.lastName}</h3>
                      <p className="text-[10px] text-foreground/25 truncate">{p.education?.trade || 'Professional'}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════ SUCCESS STORIES ══════ */}
      {successStories.length > 0 && (
        <section className="w-full py-24 bg-[#F7F9FB]">
          <div className="max-w-4xl mx-auto px-6">
            <Reveal className="text-center mb-14">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">यशोगाथा</p>
              <h2 className="section-title text-foreground">Success Stories</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {successStories.map((story, i) => (
                <Reveal key={story.id} delay={i * 0.08}>
                  <div className="bg-white rounded-3xl p-7 border border-black/[0.04] flex flex-col items-center text-center h-full hover:shadow-ambient transition-all duration-500">
                    <div className="w-14 h-14 rounded-full overflow-hidden mb-5 bg-primary/[0.04] flex-shrink-0">
                      {story.photoUrl ? (
                        <img src={resolveImageUrl(story.photoUrl)} alt={`${story.groomName} & ${story.brideName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20"><Heart size={20} /></div>
                      )}
                    </div>
                    <p className="text-sm text-foreground/40 leading-relaxed italic mb-5 flex-1">"{story.message}"</p>
                    <p className="text-sm font-bold text-foreground">{story.groomName} & {story.brideName}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ PRICING ══════ */}
      <section className="w-full py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">सदस्यत्व</p>
            <h2 className="section-title text-foreground mb-3">Simple Pricing</h2>
            <p className="text-foreground/30 text-sm">Transparent plans. No hidden fees.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Free', mr: 'विनामूल्य', price: '0', amount: 0, period: 'Forever', cta: 'Register Free', pop: false, features: ['Create Profile', 'Browse Members', 'Basic Search', 'Receive Interests'] },
              { name: 'Silver', mr: 'रोप्य', price: '2,000', amount: 2000, period: '1 Year', cta: 'Select Silver', pop: false, features: ['Send 5 Interests / day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'] },
              { name: 'Gold', mr: 'सुवर्ण', price: '5,000', amount: 5000, period: '1 Year', cta: 'Select Gold', pop: true, features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'] },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`relative flex flex-col h-full rounded-3xl p-7 border transition-all duration-500 ${plan.pop ? 'bg-primary text-white border-primary shadow-premium' : 'bg-white border-black/[0.04] hover:shadow-ambient'}`}>
                  {plan.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-secondary rounded-full text-[9px] font-black uppercase tracking-[0.12em] text-foreground shadow-sm">Most Popular</div>}

                  <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${plan.pop ? 'text-white/50' : 'text-foreground/20'}`}>{plan.mr}</p>
                  <p className={`text-xs font-bold mt-0.5 mb-5 ${plan.pop ? 'text-white/70' : 'text-foreground/40'}`}>{plan.name}</p>

                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className={`text-base font-bold ${plan.pop ? 'text-white/50' : 'text-foreground/25'}`}>₹</span>
                    <span className={`text-3xl font-display font-black ${plan.pop ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mb-7 ${plan.pop ? 'text-white/30' : 'text-foreground/15'}`}>{plan.period}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={14} className={plan.pop ? 'text-white/40' : 'text-primary/40'} />
                        <span className={plan.pop ? 'text-white/80' : 'text-foreground/50'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.amount > 0 ? (
                    <button onClick={() => { setSelectedPlan({ type: plan.name as 'SILVER' | 'GOLD', price: plan.amount }); setIsPaymentModalOpen(true); }} className={`w-full py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.12em] transition-all ${plan.pop ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90 shadow-premium'}`}>
                      {plan.cta}
                    </button>
                  ) : (
                    <Link to="/register" className="block w-full py-3 text-center rounded-2xl font-black text-[11px] uppercase tracking-[0.12em] bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.07] transition-all">
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="w-full py-28 bg-[#F7F9FB] text-center">
        <Reveal className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-display font-black text-foreground leading-[1.1] tracking-tight mb-5">
            तुमचा जोडीदार <span className="text-gradient">वाट पाहत आहे.</span>
          </h2>
          <p className="text-foreground/30 text-base mb-10 max-w-sm mx-auto">आजच नोंदणी करा आणि नव्या नात्यांचा प्रवास सुरू करा.</p>
          <Link to="/register" className="clay-button-primary px-10 py-4 text-[11px] inline-block">
            नोंदणी करा — Register Free
          </Link>
        </Reveal>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} planType={selectedPlan?.type || 'SILVER'} price={selectedPlan?.price || 2000} />
    </div>
  );
}
