import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Quote, CheckCircle2, Users, ShieldCheck, Heart, Compass } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

/* ─── Fade-up wrapper for scroll animations ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
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

  useEffect(() => {
    /* ── SEO: Dynamic title & meta ── */
    document.title = 'Vivahvedh Matrimony – शोध नव्या नात्यांचा | Marathi Matrimony';

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', 'Vivahvedh – शोध नव्या नात्यांचा. महाराष्ट्रातील सर्वात विश्वासार्ह मराठी विवाह संस्था. 100% verified Marathi profiles, secure connections, and family-first values.');
    setMeta('keywords', 'Marathi Matrimony, Vivahvedh, Shodh Navya Natyancha, वधू वर सूचक, Maratha Vadhu Var, Pune Matrimony, Mumbai Matrimony, शुभ विवाह');

    /* ── SEO: JSON-LD structured data ── */
    const schemaId = 'vivahvedh-schema';
    if (!document.getElementById(schemaId)) {
      const s = document.createElement('script');
      s.id = schemaId;
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Vivahvedh Matrimony',
        url: window.location.origin,
        logo: `${window.location.origin}/logo.png`,
        description: 'Premier Marathi Matrimonial service honouring tradition, trust, and verified profiles across Maharashtra.',
        address: { '@type': 'PostalAddress', addressLocality: 'Gadhinglaj', addressRegion: 'Maharashtra', addressCountry: 'IN' },
        sameAs: [],
      });
      document.head.appendChild(s);
    }

    /* ── Data fetching ── */
    apiClient.get('/search').then(r => setFeaturedProfiles(r.data.results.slice(0, 4))).catch(() => {});
    apiClient.get('/stories').then(r => setSuccessStories(r.data.slice(0, 3))).catch(() => {});

    return () => { document.getElementById(schemaId)?.remove(); };
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-background font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          HERO — Clean, cinematic, brand-first
      ═══════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Warm ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/80 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="inline-flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-[0_20px_60px_-15px_rgba(184,0,53,0.12)] border border-black/[0.04] p-4">
              <img src="/logo.png" alt="Vivahvedh Matrimony" className="w-full h-full object-contain" />
            </div>
          </motion.div>

          {/* Tagline chip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary/[0.06] text-primary text-[11px] font-black uppercase tracking-[0.3em]">
              महाराष्ट्राची विश्वासू विवाह संस्था
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-6xl md:text-[5.5rem] font-display font-black leading-[1.05] tracking-tight text-foreground mb-6"
          >
            शोध नव्या
            <br />
            <span className="text-gradient">नात्यांचा</span>
          </motion.h1>

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-lg md:text-xl text-foreground/50 max-w-xl mx-auto leading-relaxed mb-12 font-medium"
          >
            मराठी संस्कृती, कौटुंबिक मूल्ये आणि विश्वासाच्या पायावर —
            <br className="hidden md:block" />
            आपल्या स्वप्नातील जोडीदाराचा शोध इथे सुरू होतो.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register" className="clay-button-primary px-10 py-4 text-[11px]">
              नोंदणी करा — Register Free
            </Link>
            <Link to="/search" className="clay-button-secondary px-10 py-4 text-[11px]">
              Explore Profiles
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20 flex justify-center items-center gap-10 md:gap-16"
          >
            {[
              { value: '2,500+', label: 'Verified Profiles' },
              { value: '500+', label: 'Marriages Fixed' },
              { value: '100%', label: 'Privacy First' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-display font-black text-foreground">{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/30 mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS — Four clean steps
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">कसे कार्य करते</p>
            <h2 className="section-title text-foreground">Four Simple Steps</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users size={24} />, num: '01', title: 'प्रोफाइल बनवा', sub: 'Create Profile', desc: 'तुमची माहिती, शिक्षण, कुटुंब — सर्व एकाच ठिकाणी.' },
              { icon: <ShieldCheck size={24} />, num: '02', title: 'पडताळणी', sub: 'Get Verified', desc: 'विश्वासार्हतेसाठी प्रत्येक प्रोफाइलची तपासणी.' },
              { icon: <Compass size={24} />, num: '03', title: 'शोधा', sub: 'Smart Search', desc: 'जात, शिक्षण, शहर — तुमच्या पसंतीनुसार शोधा.' },
              { icon: <Heart size={24} />, num: '04', title: 'जोडा नाते', sub: 'Connect', desc: 'पसंती कळवा, संवाद साधा, नाते जुळवा.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="premium-card p-8 h-full group cursor-default">
                  <span className="text-[10px] font-black text-foreground/10 uppercase tracking-[0.25em] block mb-6">{item.num}</span>
                  <div className="w-12 h-12 rounded-2xl bg-primary/[0.06] flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/25 mb-3">{item.sub}</p>
                  <p className="text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BRAND QUOTE — Elegant, minimal
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-gradient-to-b from-background via-rose-50/40 to-background">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          <Quote size={32} className="text-primary/15 mx-auto mb-8" />
          <blockquote className="text-2xl md:text-4xl font-display font-black text-foreground leading-snug mb-8">
            "मराठमोळ्या संस्कृतीचे जतन करत,
            <br />
            दोन कुटुंबांचे मंगल मिलन घडवणे
            <br />
            हेच आमचे ध्येय."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-foreground/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">विवाहवेध मॅट्रिमोनी</span>
            <span className="w-8 h-px bg-foreground/10" />
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHY VIVAHVEDH — Split layout
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <Reveal>
              <div className="premium-card p-2 md:p-3">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop"
                  className="w-full aspect-[4/3] object-cover rounded-[32px]"
                  alt="Traditional Maharashtrian Wedding Celebration"
                />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">आमचे वेगळेपण</p>
              <h2 className="section-title text-foreground mb-6">
                परंपरा आणि विश्वास,
                <br />
                एकत्र.
              </h2>
              <p className="text-foreground/50 leading-relaxed text-[15px] mb-10">
                आम्ही संख्येपेक्षा गुणवत्तेला प्राधान्य देतो. प्रत्येक प्रोफाइलची काळजीपूर्वक पडताळणी,
                तुमच्या माहितीची संपूर्ण गोपनीयता, आणि पालकांसाठी सुलभ अनुभव — हेच विवाहवेधचे वचन.
              </p>

              <div className="space-y-5">
                {[
                  '१००% हस्तलिखित पडताळणी — Verified Profiles',
                  'संपूर्ण गोपनीय व सुरक्षित — Secure & Private',
                  'पालकांसाठी सुलभ — Parent-Friendly Design',
                  'तत्पर ग्राहक सेवा — Dedicated Support',
                ].map((txt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground/70">{txt}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PROFILES — Minimal cards
      ═══════════════════════════════════════════════════ */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-28 bg-[#F7F9FB]">
          <div className="max-w-6xl mx-auto px-6">
            <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">नवीन सभासद</p>
                <h2 className="section-title text-foreground">Recently Joined</h2>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProfiles.map((p, i) => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <Reveal key={p.id} delay={i * 0.08}>
                    <div
                      onClick={() => navigate(`/profile/${p.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-black/[0.03] mb-4 relative">
                        {imgUrl ? (
                          <img
                            src={resolveImageUrl(imgUrl)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={`${p.profile?.firstName || 'Member'} profile`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/[0.04] to-primary/[0.08]">
                            <span className="text-5xl font-display font-black text-primary/20">{initial}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-foreground/60">
                          {p.regId}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {p.profile?.firstName} {p.profile?.lastName}
                      </h3>
                      <p className="text-xs text-foreground/40 mt-0.5">{p.profile?.gender} · {p.education?.trade || 'Professional'}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, i) => (
                <Reveal key={story.id} delay={i * 0.1}>
                  <div className="premium-card p-8 flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6 bg-primary/[0.04] border-2 border-white shadow-lg flex-shrink-0">
                      {story.photoUrl ? (
                        <img src={resolveImageUrl(story.photoUrl)} alt={`${story.groomName} & ${story.brideName}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/30">
                          <Heart size={28} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-foreground/50 leading-relaxed italic mb-6 flex-1">"{story.message}"</p>
                    <p className="text-sm font-bold text-foreground">{story.groomName} & {story.brideName}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          PRICING — Three clean tiers
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-28 bg-[#F7F9FB]">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-3">सदस्यत्व</p>
            <h2 className="section-title text-foreground mb-4">Choose Your Plan</h2>
            <p className="text-foreground/40 text-sm max-w-md mx-auto">Transparent pricing. No hidden fees.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free', nameMarathi: 'विनामूल्य', price: '0', amount: 0, period: 'Lifetime',
                cta: 'Register Free', featured: false,
                features: ['Create Profile', 'Browse Members', 'Basic Search', 'Receive Interests'],
              },
              {
                name: 'Silver', nameMarathi: 'रोप्य', price: '2,000', amount: 2000, period: '1 Year',
                cta: 'Select Silver', featured: false,
                features: ['Send 5 Interests / day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'],
              },
              {
                name: 'Gold', nameMarathi: 'सुवर्ण', price: '5,000', amount: 5000, period: '1 Year',
                cta: 'Select Gold', featured: true,
                features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'],
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative flex flex-col h-full rounded-[32px] p-8 transition-all duration-500 ${
                  plan.featured
                    ? 'bg-foreground text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]'
                    : 'premium-card'
                }`}>
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${plan.featured ? 'text-white/50' : 'text-foreground/30'}`}>
                      {plan.nameMarathi}
                    </p>
                    <p className={`text-xs font-bold ${plan.featured ? 'text-white/70' : 'text-foreground/60'}`}>{plan.name}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-lg font-bold ${plan.featured ? 'text-white/60' : 'text-foreground/40'}`}>₹</span>
                    <span className={`text-4xl font-display font-black ${plan.featured ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-8 ${plan.featured ? 'text-white/40' : 'text-foreground/25'}`}>{plan.period}</p>

                  <ul className="space-y-3.5 mb-10 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 size={15} className={plan.featured ? 'text-primary' : 'text-primary/60'} />
                        <span className={plan.featured ? 'text-white/80' : 'text-foreground/60'}>{f}</span>
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
                        plan.featured
                          ? 'bg-white text-foreground hover:bg-white/90'
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
          FINAL CTA — One powerful closer
      ═══════════════════════════════════════════════════ */}
      <section className="w-full py-32 bg-background text-center">
        <Reveal className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-display font-black text-foreground leading-[1.1] tracking-tight mb-6">
            तुमचा जोडीदार
            <br />
            <span className="text-gradient">वाट पाहत आहे.</span>
          </h2>
          <p className="text-foreground/40 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            आजच नोंदणी करा आणि नव्या नात्यांचा सुंदर प्रवास सुरू करा.
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
