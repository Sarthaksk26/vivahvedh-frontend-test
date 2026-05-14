import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ArrowRight, Quote, CheckCircle2, Users, Trophy, Zap, ShieldCheck } from 'lucide-react';
import apiClient from '../lib/apiClient';
import { resolveImageUrl } from '../lib/url';
import { PaymentModal } from '../components/PaymentModal';

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
    <div className="flex-1 w-full flex flex-col items-center bg-[#FAFAFA] font-sans">
      
      {/* ========== TRADITIONAL HERO SECTION ========== */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF5F5] to-[#FAFAFA]">
        
        {/* Subtle Traditional Mandala SVG Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
          <svg width="800" height="800" viewBox="0 0 100 100" className="animate-[spin_120s_linear_infinite]">
            <path fill="currentColor" d="M50,10 C55,30 70,45 90,50 C70,55 55,70 50,90 C45,70 30,55 10,50 C30,45 45,30 50,10 Z"/>
            <path fill="currentColor" opacity="0.5" d="M50,20 C52,35 65,48 80,50 C65,52 52,65 50,80 C48,65 35,52 20,50 C35,48 48,35 50,20 Z" transform="rotate(45 50 50)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full flex flex-col items-center text-center animate-[fadeIn_1s_ease-out]">
          
          {/* Prominent Logo */}
          <div className="mb-12 animate-[scaleIn_0.8s_ease-out]">
            <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-md border-4 border-[#8B0000]/10 p-4">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B0000]">
                <path fill="currentColor" d="M50,15 C50,15 20,40 20,60 A30,30 0 0,0 80,60 C80,40 50,15 50,15 Z" />
                <path fill="#FFD700" d="M50,30 C50,30 35,45 35,60 A15,15 0 0,0 65,60 C65,45 50,30 50,30 Z" />
              </svg>
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl font-display font-black text-[#8B0000] tracking-tight">Vivahvedh</h1>
            <p className="text-[#B8860B] font-bold tracking-widest uppercase text-sm mt-2">Matrimony</p>
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] mb-6">
             <span className="text-[#8B0000]">शुभ</span> विवाह
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed mb-12">
            महाराष्ट्रातील सर्वात विश्वासार्ह विवाह संस्था.
            <br className="hidden md:block" />
            Where pure Marathi traditions meet genuine connections.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/register"
              className="px-10 py-4 bg-[#8B0000] text-white font-bold rounded-xl shadow-md hover:bg-[#660000] transition-colors text-lg"
            >
              नोंदणी करा (Register Free)
            </Link>
            <Link
              to="/search"
              className="px-10 py-4 bg-white text-[#8B0000] border border-[#8B0000]/20 font-bold rounded-xl shadow-sm hover:bg-[#FFF5F5] transition-colors text-lg"
            >
              Explore Profiles
            </Link>
          </div>

          <div className="mt-20 flex justify-center items-center gap-8 md:gap-16 border-t border-gray-200 pt-10 w-full max-w-2xl">
            <div className="flex flex-col">
              <span className="text-3xl font-display font-black text-[#8B0000]">2.5k+</span>
              <span className="text-[11px] uppercase font-bold tracking-widest text-gray-500">Verified Profiles</span>
            </div>
            <div className="w-px h-10 bg-gray-300" />
            <div className="flex flex-col">
              <span className="text-3xl font-display font-black text-[#8B0000]">500+</span>
              <span className="text-[11px] uppercase font-bold tracking-widest text-gray-500">Marriages Fixed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUSTED BY BAR ========== */}
      <div className="w-full py-6 bg-white border-b border-gray-100 flex justify-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 text-[#8B0000]">
          {['Authentic', 'Verified', 'Secure', 'Cultural', 'Traditional'].map(text => (
            <span key={text} className="text-sm font-bold uppercase tracking-widest">{text}</span>
          ))}
        </div>
      </div>

      {/* ========== HOW IT WORKS - SIMPLE GRID ========== */}
      <section className="w-full py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-2">How It Works</h2>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900">
              Your Journey to a Perfect Match
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Users size={28} />, title: 'Create Profile', desc: 'Add your details, education, and family background easily.' },
              { icon: <ShieldCheck size={28} />, title: 'Verification', desc: 'Our team manually verifies IDs to maintain a trusted community.' },
              { icon: <Star size={28} />, title: 'Smart Search', desc: 'Filter profiles based on caste, city, education, and more.' },
              { icon: <Zap size={28} />, title: 'Connect', desc: 'Send interests and connect with your matches directly.' },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#8B0000] mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== RECENT PROFILES ========== */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-2">New Members</h2>
                <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900">Recently Joined</h3>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 font-bold text-sm text-[#8B0000] hover:text-[#660000]">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProfiles.map(p => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <div key={p.id} onClick={() => navigate(`/profile/${p.id}`)} className="cursor-pointer group">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 relative">
                      {imgUrl ? (
                        <img src={imgUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                          <span className="text-6xl font-display font-bold">{initial}</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700">
                        {p.regId}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 truncate">
                        {p.profile?.firstName} {p.profile?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">{p.profile?.gender} • {p.profile?.maritalStatus}</p>
                      <p className="text-xs text-gray-500 truncate">{p.education?.trade || 'Professional'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========== WHY US ========== */}
      <section className="w-full py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" 
                className="w-full aspect-[4/3] object-cover rounded-xl" 
                alt="Tradition" 
              />
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-2">Our Philosophy</h2>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 mb-6">
                Where Tradition Meets Trust
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                We believe in quality over quantity. Every profile on Vivahvedh undergoes a strict verification process, ensuring that your search for a life partner is secure and meaningful.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { icon: <CheckCircle2 className="text-green-600" size={20} />, title: '100% Verified Profiles' },
                  { icon: <CheckCircle2 className="text-green-600" size={20} />, title: 'Secure & Private' },
                  { icon: <CheckCircle2 className="text-green-600" size={20} />, title: 'Dedicated Customer Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-bold text-gray-800">{item.title}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/about" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors inline-block">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      {successStories.length > 0 && (
        <section className="w-full py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-2">Testimonials</h2>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900">यशोगाथा (Success Stories)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map(story => (
                <div key={story.id} className="p-8 bg-[#FAFAFA] border border-gray-100 rounded-2xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-gray-200">
                    {story.photoUrl ? (
                      <img src={resolveImageUrl(story.photoUrl)} alt="Couple" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Heart size={32} />
                      </div>
                    )}
                  </div>
                  <Quote size={24} className="text-gray-300 mb-4" />
                  <p className="text-gray-600 italic mb-6">"{story.message}"</p>
                  <p className="font-bold text-gray-900">
                    {story.groomName} & {story.brideName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== MEMBERSHIP PLANS - STATIC GRID ========== */}
      <section className="w-full py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#B8860B] mb-2">Membership</h2>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 mb-4">Choose Your Plan</h3>
            <p className="text-gray-600">Simple, transparent pricing to help you find your match.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '0', amount: 0, sub: 'Lifetime', cta: 'Register', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', btn: 'bg-gray-100 text-gray-900 hover:bg-gray-200', features: ['Create Profile', 'Browse Members', 'Basic Search', 'Receive Interests'] },
              { name: 'Silver', price: '2,000', amount: 2000, sub: '1 Year', cta: 'Select Silver', bg: 'bg-white', border: 'border-[#8B0000]/20', text: 'text-[#8B0000]', btn: 'bg-[#8B0000] text-white hover:bg-[#660000]', features: ['Send 5 Interests/day', 'View Contact Info', 'Full Photo Gallery', 'Advanced Filters'] },
              { name: 'Gold', price: '5,000', amount: 5000, sub: '1 Year', cta: 'Select Gold', bg: 'bg-[#8B0000]', border: 'border-[#8B0000]', text: 'text-white', btn: 'bg-white text-[#8B0000] hover:bg-gray-100', features: ['Unlimited Interests', 'Priority Listing', 'Verified Badge', 'Personal Assistance'] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-2xl border ${plan.bg} ${plan.border}`}>
                <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${plan.text === 'text-white' ? 'text-white/80' : 'text-gray-500'}`}>{plan.name}</p>
                <div className={`flex items-baseline gap-1 mb-2 ${plan.text}`}>
                  <span className="text-xl">₹</span>
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                </div>
                <p className={`text-xs mb-8 ${plan.text === 'text-white' ? 'text-white/60' : 'text-gray-400'}`}>{plan.sub}</p>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className={plan.text === 'text-white' ? 'text-white' : 'text-[#8B0000]'} />
                      <span className={plan.text === 'text-white' ? 'text-white' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.amount > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedPlan({ type: plan.name as 'SILVER' | 'GOLD', price: plan.amount });
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${plan.btn}`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className={`block w-full py-3 text-center rounded-lg font-bold text-sm transition-colors ${plan.btn}`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="w-full py-24 px-6 bg-white border-t border-gray-100 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#8B0000] mb-6">
          तुमचा जोडीदार वाट पाहत आहे!
        </h2>
        <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
          Start your journey today and find the one you've been waiting for.
        </p>
        <Link to="/register" className="px-10 py-4 bg-[#8B0000] text-white font-bold rounded-xl shadow-md hover:bg-[#660000] transition-colors text-lg inline-block">
          नोंदणी करा (Register Free)
        </Link>
      </section>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType={selectedPlan?.type || 'SILVER'}
        price={selectedPlan?.price || 2000}
      />
      
      {/* Keyframes for basic CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
