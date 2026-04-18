import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Star, ArrowRight, Sparkles, Quote } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, delay }
});

export default function Home() {
  const navigate = useNavigate();
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD', price: number } | null>(null);

  useEffect(() => {
    // Fetch generic/public profiles
    apiClient.get('/search')
      .then(res => {
        // take first 4 for home page
        setFeaturedProfiles(res.data.results.slice(0, 4));
      })
      .catch(err => console.error("Failed to load featured profiles", err));

    apiClient.get('/stories')
      .then(res => setSuccessStories(res.data.slice(0, 3)))
      .catch(err => console.error("Failed to load stories", err));
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col items-center overflow-hidden">

      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24">
        {/* Refined background layers - No excessive blurs to prevent distortion */}
        <div className="absolute inset-0 z-0 bg-[#F7F9FB] overflow-hidden">
          <div className="absolute top-0 right-0 w-[65%] h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-40" />
        </div>

        {/* Floating 3D-style elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] right-[10%] drop-shadow-2xl"
          >
            <div className="text-8xl filter blur-[1px] opacity-20">🪷</div>
          </motion.div>
          <motion.div
            animate={{ 
              y: [20, -20, 20],
              rotate: [0, -15, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-[20%] left-[8%] drop-shadow-premium"
          >
            <div className="text-7xl opacity-15">✨</div>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm shadow-sm">
                <Sparkles size={14} className="animate-pulse" /> The Royal Curator of Matches
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 {...fadeUp(0.1)} className="display-lg text-foreground mb-8 leading-[1.2]">
              शोध <br />
              <span className="silk-gradient bg-clip-text text-transparent italic px-4 py-2">
                नव्या नात्यांचा
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-foreground/80 max-w-xl leading-relaxed mb-12">
              Experience the grandest bridge between Maharashtrian heritage and modern luxury. 
              Find your partner on a platform designed like an heirloom.
            </motion.p>

            <motion.div {...fadeUp(0.35)} className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to="/register"
                className="clay-button-primary px-10 py-5 text-xl flex items-center gap-3"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/search"
                className="clay-button-secondary px-10 py-5 text-xl"
              >
                Browse Now
              </Link>
            </motion.div>

            {/* Stats Summary */}
            <motion.div {...fadeUp(0.5)} className="mt-20 flex gap-12 pt-12 border-t border-black/5">
              {[
                { count: '2.5k+', label: 'Verified Profiles' },
                { count: '500+', label: 'Royal Stories' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-display font-black text-foreground">{stat.count}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative aspect-square"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 border-[20px] border-white/40 rounded-[40px] shadow-ambient" />
              <img 
                src="/wedding_hero.png" 
                className="w-full h-full object-cover rounded-[32px] shadow-premium" 
                alt="Royal Wedding" 
              />
              
              {/* Floating Match Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 glass-card p-6 w-56 flex items-center gap-4 animate-in fade-in zoom-in duration-1000 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl silk-gradient flex items-center justify-center text-white font-bold shadow-lg">
                  98%
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Perfect Match</p>
                  <p className="text-[10px] uppercase text-foreground/70 font-black tracking-tighter">Found Today</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TRADITIONAL DECORATIVE STRIP ========== */}
      <section className="w-full relative overflow-hidden h-28 md:h-36">
        <img src="/traditional_elements.png" alt="Traditional Decorations" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="w-full py-32 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-left mb-20 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[4px] text-primary/60">Step-by-Step Guide</span>
            <h2 className="display-md text-foreground mt-4">Simple, Personal, <br />Secure.</h2>
            <p className="text-foreground/70 mt-6 text-lg">Four intentional steps to finding a partner who shares your values and family traditions.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Create your detailed profile with family values and expectations.', color: 'bg-[#F2F4F6]' },
              { step: '02', icon: '✅', title: 'Verify', desc: 'Every profile is reviewed to ensure a 100% genuine community.', color: 'bg-[#F2F4F6]' },
              { step: '03', icon: '🔍', title: 'Discover', desc: 'Explore curated matches with advanced cultural and educational filters.', color: 'bg-primary/5' },
              { step: '04', icon: '💑', title: 'Connect', desc: 'Personal introductions and meetings facilitated by our curators.', color: 'bg-primary/10' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${item.color} rounded-[32px] p-10 group hover:shadow-ambient transition-all duration-500`}
              >
                <div className="absolute top-10 right-10 text-[60px] opacity-[0.05] font-display font-black group-hover:opacity-10 transition-opacity">
                  {item.step}
                </div>
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 origin-left">{item.icon}</div>
                <h3 className="text-xl font-display font-black mb-4">{item.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROFILES (PUBLIC PREVIEW) ========== */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-32 relative bg-[#F7F9FB]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[4px] text-primary/60">Curation Highlights</span>
              <h2 className="display-md text-foreground mt-4">Discover Your Match.</h2>
              <p className="text-foreground/60 mt-6 max-w-lg mx-auto">A glimpse into our diverse and growing community of verified individuals.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProfiles.map((p, i) => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/profile/${p.id}`)}
                    className="glass-card group cursor-pointer hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  >
                    <div className="h-72 relative bg-[#eceef0] overflow-hidden">
                      {imgUrl ? (
                         <img src={imgUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <span className="text-6xl font-display font-black text-primary/10">{initial}</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-6">
                         <h3 className="text-white font-display font-bold text-xl leading-tight truncate">
                           {p.profile?.firstName} {p.profile?.lastName}
                         </h3>
                         <div className="flex items-center gap-2 mt-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                           <p className="text-white/80 text-[10px] font-black uppercase tracking-widest">{p.regId}</p>
                         </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                       <ul className="text-sm font-medium text-foreground/80 space-y-1">
                         <li className="text-foreground font-bold">{p.profile?.maritalStatus} • {p.profile?.gender}</li>
                         {p.education?.trade && <li className="text-xs text-foreground/60 italic">🎓 {p.education.trade}</li>}
                       </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-20 text-center">
               <Link to="/search" className="clay-button-secondary px-10 py-4 text-sm uppercase tracking-widest">
                 View All Profiles
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== HAPPY COUPLE BANNER ========== */}
      <section className="w-full py-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[32px] overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center">
            <img src="/happy_couple.png" alt="Happy Couple" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            
            <div className="relative z-10 p-10 md:p-16 max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Quote size={36} className="text-amber-400/60 mb-4" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                  "विवाहवेधने आमचं आयुष्य बदललं"
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                  "Vivahvedh helped us find each other. The personal touch and verified profiles made all the difference. We are forever grateful!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-primary font-bold text-lg shadow-lg">R</div>
                  <div>
                    <p className="text-white font-bold">Rahul & Priya</p>
                    <p className="text-white/70 text-sm">Married in 2024 • Pune</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY VIVAHVEDH ========== */}
      <section className="w-full py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <span className="text-xs font-bold uppercase tracking-[4px] text-primary/40">Our Commitment</span>
              <h2 className="display-md text-foreground mt-4 mb-8">What Makes Us <br />Regal.</h2>
              <p className="text-foreground/50 text-lg mb-10">We prioritize family dignity over digital volume, ensuring every connection is meaningful and culturally aligned.</p>
              <Link to="/about" className="clay-button-secondary px-8 py-3.5 inline-block">Learn Our Story</Link>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield size={28} />,
                  title: 'Pure Integrity',
                  desc: 'Every profile is manually curated and verified. We maintain a zero-tolerance policy for misleading information.',
                  color: 'bg-white'
                },
                {
                  icon: <Heart size={28} />,
                  title: 'Personal Curation',
                  desc: 'Our relationship managers don\'t just match data; they facilitate introductions and family meetings with care.',
                  color: 'bg-primary/5'
                },
                {
                  icon: <Star size={28} />,
                  title: 'Cultural Alignment',
                  desc: 'Tailored specifically for Maharashtrian households who value tradition, education, and family legacy.',
                  color: 'bg-accent/10'
                },
                {
                   icon: <Quote size={28} />,
                   title: 'Match Privacy',
                   desc: 'Control who sees your PII. We mask email and mobile data until you decide to connect.',
                   color: 'bg-[#F2F4F6]'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`${item.color} rounded-[32px] p-8 shadow-ambient group hover:-translate-y-2 transition-all duration-500`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center mb-6 text-primary scale-90 group-hover:scale-100 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-display font-black mb-3">{item.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      {successStories.length > 0 && (
        <section className="w-full py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeUp()} className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-[4px] text-primary/40">Real Couples</span>
              <h2 className="display-md text-foreground mt-4 mb-4">यशोगाथा — Success Stories</h2>
              <p className="text-foreground/40 max-w-xl mx-auto text-lg">Celebrating unions forged through Vivahvedh.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {successStories.map((story: any, i: number) => (
                <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="bg-card rounded-[32px] overflow-hidden shadow-premium border border-primary/10 hover:-translate-y-3 transition-all duration-500 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/80 backdrop-blur-md text-[10px] uppercase font-black tracking-widest text-primary rounded-full shadow-sm">
                    Featured Highlight
                  </div>
                  <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                    {story.photoUrl ? (
                      <img src={resolveImageUrl(story.photoUrl)} alt={`${story.groomName} & ${story.brideName}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Heart size={40} className="text-primary/15" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                    <p className="absolute bottom-5 left-6 text-white font-display font-black text-xl drop-shadow-lg leading-tight">
                      {story.groomName} <br/><span className="text-primary-foreground/70 text-sm font-medium italic">&</span> {story.brideName}
                    </p>
                  </div>
                  <div className="p-8">
                    <Quote size={24} className="text-primary/20 mb-3" />
                    <p className="text-foreground/80 text-sm leading-relaxed line-clamp-4 italic font-medium">"{story.message}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/success-stories" className="clay-button-secondary px-10 py-5 text-sm uppercase tracking-[0.2em] inline-flex items-center gap-3">
                Read More Heartwarming Stories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== PLANS TEASER ========== */}
      <section className="w-full py-32 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <span className="text-xs font-bold uppercase tracking-[4px] text-primary/40">Premium Membership</span>
            <h2 className="display-md text-foreground mt-4 mb-6">Invest in Your Future.</h2>
            <p className="text-foreground/40 max-w-xl mx-auto mb-16 text-lg">
              Choose a plan that fits your family's needs. From basic browsing to full personalized matchmaking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { name: 'Basic', price: '₹0', amount: 0, sub: 'Forever', color: 'text-foreground/40', bg: 'bg-white', features: ['Profile creation', 'Browse profiles', 'Basic search'] },
              { name: 'Silver', price: '₹2,000', amount: 2000, sub: '6 Months', color: 'text-primary', bg: 'bg-white shadow-ambient ring-1 ring-primary/5', features: ['Send proposals', 'View contacts', 'Full gallery', 'Advanced filters'] },
              { name: 'Gold', price: '₹5,000', amount: 5000, sub: '1 Year', color: 'text-amber-700', bg: 'bg-primary/5 border border-primary/10', features: ['All Silver features', 'Priority listing ⭐', 'Verified badge ✅', 'Personal manager 🤝'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${plan.bg} rounded-[40px] p-12 text-center transition-all duration-500 hover:scale-105`}
              >
                <p className={`text-xs font-black uppercase tracking-[3px] ${plan.color} mb-4`}>{plan.name}</p>
                <p className={`text-5xl font-display font-black ${plan.color} mb-2`}>{plan.price}</p>
                <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest mb-10">{plan.sub}</p>
                <ul className="space-y-4 text-sm text-left mb-12 border-t border-black/5 pt-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 font-medium text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {f}
                    </li>
                  ))}
                </ul>
                {plan.name !== 'Basic' && (
                  <button
                    onClick={() => {
                      setSelectedPlan({ type: plan.name as 'SILVER' | 'GOLD', price: plan.amount });
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-full py-4 text-sm uppercase tracking-widest ${plan.name === 'Gold' ? 'clay-button-primary silk-gradient' : 'clay-button-secondary'}`}
                  >
                    Select Plan
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          <Link to="/rules" className="text-primary font-bold hover:underline tracking-widest text-xs uppercase group inline-flex items-center gap-2">
            Compare All Features
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="w-full py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative silk-gradient rounded-[60px] p-20 md:p-32 text-center text-white overflow-hidden shadow-premium"
          >
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[6px] text-white/60 mb-8 block font-display">Let's Begin</span>
              <h2 className="display-lg text-white mb-10">
                तुमचा जोडीदार वाट <br />पाहत आहे!
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-16 leading-relaxed">
                Join a community where tradition meets the future. Your perfect match is just a click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="clay-button bg-white text-primary px-12 py-5 text-xl"
                >
                  Join Free
                </Link>
                <Link
                  to="/contact"
                  className="clay-button bg-white/20 backdrop-blur-md border border-white/20 text-white px-12 py-5 text-xl"
                >
                  Contact Us
                </Link>
              </div>
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
