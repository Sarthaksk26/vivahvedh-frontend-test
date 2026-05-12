import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Star, ArrowRight, Sparkles, Quote, CheckCircle2, Users, Trophy, Zap, ShieldCheck } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD', price: number } | null>(null);

  useEffect(() => {
    apiClient.get('/search')
      .then(res => setFeaturedProfiles(res.data.results.slice(0, 4)))
      .catch(err => console.error("Failed to load featured profiles", err));

    apiClient.get('/stories')
      .then(res => setSuccessStories(res.data.slice(0, 3)))
      .catch(err => console.error("Failed to load stories", err));
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#FCFDFF]">
      
      {/* ========== PREMIUM HERO SECTION ========== */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-white to-accent/10" />
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-primary/10 rounded-full text-primary text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md shadow-sm mb-8">
              <Sparkles size={14} className="text-primary animate-pulse" /> Maharashtra's Premier Matrimony
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight mb-8">
              शोध <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-600 to-primary-container">
                नव्या नात्यांचा
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-lg leading-relaxed mb-12">
              Experience a sophisticated journey to find your life partner. We combine deep cultural heritage with modern matchmaking technology.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/register"
                className="px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(190,18,60,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(190,18,60,0.4)] hover:-translate-y-1 transition-all duration-300 text-lg flex items-center gap-2"
              >
                Join Free <ArrowRight size={20} />
              </Link>
              <Link
                to="/search"
                className="px-10 py-5 bg-white text-foreground border border-foreground/5 font-bold rounded-2xl shadow-sm hover:bg-foreground/5 transition-all duration-300 text-lg"
              >
                Explore Profiles
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-10 pt-10 border-t border-black/5 w-full max-w-md">
              <div className="flex flex-col">
                <span className="text-3xl font-display font-black text-foreground">2.5k+</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/60">Verified Members</span>
              </div>
              <div className="w-px h-10 bg-black/5" />
              <div className="flex flex-col">
                <span className="text-3xl font-display font-black text-foreground">500+</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/60">Success Stories</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main Visual Container */}
            <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              {/* High-res photography placeholder */}
              <div className="w-full h-full bg-[#E2E8F0] flex items-center justify-center">
                <img 
                  src="/real_couple_hero.jpg" 
                  alt="Premium Matrimony" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2000&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <div className="absolute bottom-10 left-10 z-20">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-bold">Trusted by Thousands</p>
                    <p className="text-[10px] opacity-70 uppercase font-black tracking-tighter">Premium Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ========== TRUSTED BY BAR ========== */}
      <div className="w-full py-10 bg-white border-y border-black/5 flex justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale contrast-125">
          {['Authentic', 'Verified', 'Secure', 'Personal', 'Traditional'].map(text => (
            <span key={text} className="text-sm font-black uppercase tracking-[0.3em] font-display whitespace-nowrap">{text}</span>
          ))}
        </div>
      </div>

      {/* ========== HOW IT WORKS - REFINED ========== */}
      <section className="w-full py-32 bg-[#FCFDFF]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="max-w-2xl mb-24">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Simple Process</h2>
            <h3 className="text-4xl md:text-6xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight">
              Four Steps to Your <br />Perfect Life Match.
            </h3>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-10"
          >
            {[
              { icon: <Users size={32} />, title: 'Create Profile', desc: 'Detail your background, values, and what you seek in a partner.' },
              { icon: <ShieldCheck size={32} />, title: 'Verification', desc: 'We verify every profile manually to ensure a safe, genuine community.' },
              { icon: <Star size={32} />, title: 'Smart Search', desc: 'Use advanced filters to find profiles that align with your lifestyle.' },
              { icon: <Zap size={32} />, title: 'Instant Connect', desc: 'Express interest and start meaningful conversations immediately.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative p-10 bg-white border border-black/5 rounded-[40px] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h4 className="text-xl font-display font-black mb-4">{item.title}</h4>
                <p className="text-sm text-foreground/60 leading-relaxed font-medium">{item.desc}</p>
                <div className="absolute top-10 right-10 text-4xl font-display font-black text-black/[0.03]">{String(i + 1).padStart(2, '0')}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FEATURED PROFILES - LUXURY CARDS ========== */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <motion.div {...fadeInUp}>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Recent Members</h2>
                <h3 className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight">Discover New Possibilities.</h3>
              </motion.div>
              <motion.div {...fadeInUp}>
                <Link to="/search" className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                  View All Profiles <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featuredProfiles.map((p, i) => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/profile/${p.id}`)}
                    className="relative group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[#F2F4F7] mb-6">
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          alt="Profile" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <span className="text-6xl font-display font-black text-primary/10">{initial}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)]" />
                          <span className="text-[10px] text-white/70 uppercase font-black tracking-widest">{p.regId}</span>
                        </div>
                        <p className="text-xl text-white font-display font-bold leading-tight truncate">
                          {p.profile?.firstName} {p.profile?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="px-4">
                      <p className="text-sm font-bold text-foreground mb-1">{p.profile?.gender} • {p.profile?.maritalStatus}</p>
                      <p className="text-xs text-foreground/60 font-medium truncate">{p.education?.trade || 'Professional'}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========== WHY VIVAHVEDH - TRUST & QUALITY ========== */}
      <section className="w-full py-32 bg-[#FCFDFF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div {...fadeInUp} className="relative">
              <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-premium">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop" 
                  className="w-full h-full object-cover" 
                  alt="Tradition" 
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[40px] shadow-ambient hidden md:block">
                <Trophy size={40} className="text-primary mb-4" />
                <p className="text-2xl font-display font-black text-foreground leading-tight">10+ Years of <br />Excellence</p>
              </div>
            </motion.div>

            <motion.div {...fadeInUp}>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Our Philosophy</h2>
              <h3 className="text-4xl md:text-6xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-10">
                Where Tradition <br />Meets Integrity.
              </h3>
              <p className="text-lg text-foreground/60 leading-relaxed mb-12">
                We believe in quality over quantity. Every profile on Vivahvedh undergoes a strict verification process, ensuring that your search for a life partner is secure and meaningful.
              </p>
              
              <div className="space-y-8 mb-12">
                {[
                  { icon: <CheckCircle2 className="text-green-500" />, title: '100% Verified Profiles', desc: 'Manual screening of every single user identity.' },
                  { icon: <CheckCircle2 className="text-green-500" />, title: 'Cultural Deep-Dive', desc: 'Sophisticated matching based on family values.' },
                  { icon: <CheckCircle2 className="text-green-500" />, title: 'Strict Privacy Controls', desc: 'You decide who sees your contact information.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h5 className="font-bold text-foreground mb-1">{item.title}</h5>
                      <p className="text-sm text-foreground/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/about" className="px-8 py-4 bg-foreground text-white font-bold rounded-2xl hover:bg-foreground/90 transition-all duration-300">
                Learn More About Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== SUCCESS STORIES - TESTIMONIALS ========== */}
      {successStories.length > 0 && (
        <section className="w-full py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-24">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Testimonials</h2>
              <h3 className="text-4xl md:text-5xl font-display font-extrabold text-foreground tracking-tight">यशोगाथा — Success Stories</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {successStories.map((story, i) => (
                <motion.div 
                  key={story.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-10 bg-[#FCFDFF] border border-black/5 rounded-[48px] hover:shadow-ambient transition-all duration-500 group"
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-10 ring-4 ring-white shadow-premium group-hover:scale-105 transition-transform duration-500">
                    {story.photoUrl ? (
                      <img src={resolveImageUrl(story.photoUrl)} alt="Couple" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                        <Heart size={40} fill="currentColor" className="opacity-10" />
                      </div>
                    )}
                  </div>
                  <Quote size={32} className="text-primary/20 mb-8" />
                  <p className="text-lg text-foreground/70 font-medium italic mb-10 line-clamp-4">"{story.message}"</p>
                  <p className="text-xl font-display font-black text-foreground">
                    {story.groomName} <span className="text-primary">&</span> {story.brideName}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-20">
              <Link to="/success-stories" className="text-sm font-black uppercase tracking-[0.3em] text-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
                Discover More Stories <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== MEMBERSHIP PLANS - PREMIUM ALIGNMENT ========== */}
      <section className="w-full py-32 bg-[#FCFDFF]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">Membership</h2>
            <h3 className="text-4xl md:text-6xl font-display font-extrabold text-foreground tracking-tight mb-8">Elevate Your Search.</h3>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto font-medium">Simple, premium pricing to help you find your perfect match faster.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
            {[
              { name: 'Free', price: '0', amount: 0, sub: 'Lifetime Access', cta: 'Join Now', variant: 'secondary', features: ['Create Profile', 'Browse Members', 'Basic Search', 'Receive Proposals'] },
              { name: 'Silver', price: '2,000', amount: 2000, sub: 'Valid for 1 Year', cta: 'Choose Silver', variant: 'primary', features: ['Send Proposals (5/day)', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters', 'Who Viewed Me'] },
              { name: 'Gold', price: '5,000', amount: 5000, sub: 'Valid for 1 Year', cta: 'Go Gold', variant: 'luxury', features: ['Unlimited Proposals', 'Priority Listing ⭐', 'Verified Badge ✅', 'Offline Manager 🤝', 'WhatsApp Support 📱'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-12 rounded-[48px] transition-all duration-500 hover:-translate-y-2 ${
                  plan.variant === 'luxury' 
                  ? 'bg-foreground text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] md:p-14' 
                  : plan.variant === 'primary'
                  ? 'bg-white border-2 border-primary/10 shadow-premium md:p-14'
                  : 'bg-white border border-black/5'
                }`}
              >
                {plan.variant === 'luxury' && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-lg">
                    Recommended Premium
                  </div>
                )}
                
                <p className={`text-xs font-black uppercase tracking-[0.3em] mb-4 ${plan.variant === 'luxury' ? 'text-primary' : 'text-primary'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">₹</span>
                  <span className="text-5xl md:text-6xl font-display font-black tracking-tighter">{plan.price}</span>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-10 ${plan.variant === 'luxury' ? 'text-white/40' : 'text-foreground/30'}`}>{plan.sub}</p>
                
                <ul className="space-y-4 mb-12 border-t border-white/10 pt-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={18} className={plan.variant === 'luxury' ? 'text-primary' : 'text-primary'} />
                      <span className={plan.variant === 'luxury' ? 'text-white/80' : 'text-foreground/80'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.amount > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedPlan({ type: plan.name as 'SILVER' | 'GOLD', price: plan.amount });
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 ${
                      plan.variant === 'luxury' 
                      ? 'bg-primary text-white hover:bg-rose-600 shadow-[0_10px_30px_-5px_rgba(190,18,60,0.5)]' 
                      : 'bg-foreground text-white hover:bg-foreground/90'
                    }`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className="block w-full py-5 text-center rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-black/5 text-foreground hover:bg-black/10 transition-all"
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA - ELEVATED ========== */}
      <section className="w-full py-40 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-6xl md:text-8xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight mb-12">
              तुमचा जोडीदार वाट <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">पाहत आहे!</span>
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
              Join a distinguished community where tradition meets technology. Start your journey today and find the one you've been waiting for.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/register" className="px-12 py-6 bg-primary text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-[0_20px_40px_-10px_rgba(190,18,60,0.3)] hover:-translate-y-1 transition-all">
                Register Now Free
              </Link>
              <Link to="/contact" className="px-12 py-6 bg-white border border-black/5 text-foreground font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:bg-black/5 transition-all shadow-sm">
                Inquire Locally
              </Link>
            </div>
          </motion.div>
        </div>
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
