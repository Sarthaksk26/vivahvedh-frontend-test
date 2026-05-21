import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Quote, CheckCircle2, Users, ShieldCheck, Sparkles, Compass } from 'lucide-react';
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
    // ========== ELITE SEO CONFIGURATION & INJECTION ==========
    document.title = "Vivahvedh Matrimony - शोध नव्या नात्यांचा | Authentic Marathi Matrimony";
    
    // Set meta description dynamically
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'विवाहवेध मॅट्रिमोनी - शोध नव्या नात्यांचा. महाराष्ट्रातील वधु-वर आणि पालकांसाठी सर्वात विश्वासार्ह विवाह संस्था. Authentic Maratha, Bramhin, and regional Marathi profile matching.');

    // Set meta keywords dynamically
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'Marathi Matrimony, Vivahvedh, Shodh Navya Natyancha, वधू वर सूचक केंद्र, Shubh Vivah, Maratha Vadhu Var, Pune Matrimony, Mumbai Matrimony, Kundali matching');

    // Inject Google Structured JSON-LD Schema dynamically for top SERP ranking
    const schemaId = 'seo-matrimonial-schema';
    let schemaScript = document.getElementById(schemaId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', schemaId);
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MatrimonialService",
        "name": "Vivahvedh Matrimony",
        "slogan": "शोध नव्या नात्यांचा (Shodh Navya Natyancha)",
        "url": window.location.origin,
        "logo": `${window.location.origin}/logo.png`,
        "description": "Vivahvedh is the premier traditional Marathi Matrimonial portal, serving verified profiles across Maharashtra with deep respect for culture, values, and family traditions.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pune",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        },
        "knowsLanguage": ["mr", "en"],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "0",
          "highPrice": "5000",
          "offerCount": "3"
        }
      });
      document.head.appendChild(schemaScript);
    }

    // Load dynamic profiles & success stories
    apiClient.get('/search')
      .then(res => setFeaturedProfiles(res.data.results.slice(0, 4)))
      .catch(err => console.error("Failed to load featured profiles", err));

    apiClient.get('/stories')
      .then(res => setSuccessStories(res.data.slice(0, 3)))
      .catch(err => console.error("Failed to load stories", err));

    // Cleanup schema script on unmount to keep DOM clean
    return () => {
      const script = document.getElementById(schemaId);
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-[#FFFBF7] font-sans overflow-x-hidden">
      
      {/* ========== TRADITIONAL HERO SECTION ========== */}
      <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF0EB] via-[#FFFBF2] to-[#FFF0EB] pt-24 border-b border-amber-500/10">
        
        {/* AUSPICIOUS WEDDING TORAN (Marigold Garland & Mango Leaves) */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-around pointer-events-none opacity-90">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-[sway_4s_ease-in-out_infinite_alternate]" style={{ animationDelay: `${i * 0.3}s` }}>
              {/* Marigold flower string */}
              <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm shadow-amber-500/40 border border-amber-600/20" />
              <div className="w-5 h-5 bg-orange-500 rounded-full shadow-sm shadow-orange-500/40 -mt-1 border border-orange-600/20" />
              <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm shadow-amber-500/40 -mt-1 border border-amber-600/20" />
              {/* Mango Leaf */}
              <div className="w-2 h-7 bg-emerald-600 rounded-b-full shadow-sm -mt-0.5 transform rotate-3 origin-top border border-emerald-700/10" />
            </div>
          ))}
        </div>

        {/* Auspicious Traditional Mandala SVG Background */}
        <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none flex items-center justify-center overflow-hidden">
          <svg width="900" height="900" viewBox="0 0 100 100" className="animate-[spin_150s_linear_infinite] text-[#8B0000]">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            <path fill="currentColor" d="M50,2 C53,25 75,47 98,50 C75,53 53,75 50,98 C47,75 25,53 2,50 C25,47 47,25 50,2 Z"/>
            <path fill="currentColor" opacity="0.6" d="M50,15 C52,32 68,48 85,50 C68,52 52,68 50,85 C48,68 32,52 15,50 C32,48 48,32 50,15 Z" transform="rotate(45 50 50)"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col items-center text-center">
          
          {/* AUSPICIOUS ROYAL MANDALA LOGO FRAME */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            {/* Pulsing Aura Gold Glow */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 opacity-20 blur-xl animate-pulse" />
            
            {/* Traditional Gold Borders Frame */}
            <div className="relative inline-flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-white shadow-2xl border-[6px] border-amber-400 p-6 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Vivahvedh Matrimony Brand Logo" 
                className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-md" 
              />
              {/* Auspicious Kumkum/Sindoor dots decoration */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#8B0000] border-2 border-white shadow-md animate-bounce" />
            </div>
            
            {/* Elegant Marathi Tag */}
            <div className="mt-5">
              <span className="px-5 py-1.5 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/20 text-[#8B0000] font-black uppercase tracking-[0.25em] text-[10px] shadow-sm">
                महाराष्ट्राची हक्काची विवाह संस्था
              </span>
            </div>
          </motion.div>

          {/* REDESIGNED CALLIGRAPHIC SLOGAN */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] via-[#C97A13] to-[#8B0000] drop-shadow-sm filter mt-2 mb-4"
          >
            शोध नव्या नात्यांचा
          </motion.h1>

          <motion.h2 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide mb-6"
          >
            शुभमंगल सावधान • Shubh Vivah Matrimony
          </motion.h2>
          
          <motion.p 
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-md md:text-lg text-gray-700 max-w-2xl leading-relaxed mb-10 font-medium"
          >
            मराठी संस्कृती आणि मूल्यांना जपून आपल्या स्वप्नातील योग्य जोडीदाराचा शोध घ्या. 
            विवाहवेध मॅट्रिमोनीच्या माध्यमातून जुळवा आयुष्यातील सोनेरी रेशीमगाठी!
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-5 relative z-30"
          >
            <Link
              to="/register"
              className="px-10 py-4.5 bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-red-900/25 hover:shadow-red-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-red-700/20"
            >
              नोंदणी करा (Register Free)
            </Link>
            <Link
              to="/search"
              className="px-10 py-4.5 bg-white text-[#8B0000] border-2 border-[#8B0000]/30 font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg hover:bg-[#FFF5F5] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Explore Profiles
            </Link>
          </motion.div>

          {/* Quick trust metrics */}
          <div className="mt-16 flex justify-center items-center gap-6 md:gap-12 border-t border-amber-900/10 pt-10 w-full max-w-xl">
            <div className="flex flex-col text-center">
              <span className="text-3xl md:text-4xl font-display font-black text-[#8B0000] tracking-tight">2.5k+</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Verified Members</span>
            </div>
            <div className="w-px h-10 bg-amber-900/10" />
            <div className="flex flex-col text-center">
              <span className="text-3xl md:text-4xl font-display font-black text-[#8B0000] tracking-tight">500+</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Happy Marriages</span>
            </div>
            <div className="w-px h-10 bg-amber-900/10" />
            <div className="flex flex-col text-center">
              <span className="text-3xl md:text-4xl font-display font-black text-[#8B0000] tracking-tight">100%</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">Marathi Tradition</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUSTED BY BAR ========== */}
      <div className="w-full py-6.5 bg-[#8B0000] flex justify-center shadow-lg relative overflow-hidden">
        {/* Soft Gold Pattern Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(#FFD700_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-amber-200">
          {['कुलीन घराणी', '१००% पडताळणी', 'सुरक्षित माहिती', 'सुलभ कुंडली जुळवणी', 'संस्कृतीचे रक्षण'].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <Sparkles size={12} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========== HOW IT WORKS - CULTURAL GRID ========== */}
      <section className="w-full py-24 bg-[#FFFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8860B] font-bold text-xs uppercase tracking-widest">
              सुलभ पावले
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4">
              शोध नव्या नात्यांचा, कसा कराल?
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">चार अत्यंत सोप्या टप्प्यात जोडा नवीन मंगल नाते</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Users size={28} />, step: '१. नोंदणी', title: 'प्रोफाइल तयार करा', desc: 'तुमची माहिती, शिक्षण आणि कौटुंबिक पार्श्वभूमी सहजपणे जोडून नोदणी पूर्ण करा.' },
              { icon: <ShieldCheck size={28} />, step: '२. पडताळणी', title: 'विश्वासार्ह पडताळणी', desc: 'विश्वासार्हता जपण्यासाठी प्रत्येक खात्याची आमच्या टीमद्वारे पडताळणी केली जाते.' },
              { icon: <Compass size={28} />, step: '३. शोध आणि जुळवणी', title: 'योग्य उमेदवार शोधा', desc: 'जात, गोत्र, शिक्षण आणि पसंतीनुसार शोध घेऊन योग्य स्थळे शोधा.' },
              { icon: <Heart size={28} />, step: '४. हितगुज', title: 'संवाद साधा', desc: 'परस्पर संमतीने पसंती कळवा आणि सोयीनुसार थेट संवाद साधून नाते निश्चित करा.' },
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-white border border-amber-900/5 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="absolute top-4 right-6 text-xs font-black text-amber-500/25 group-hover:text-amber-500/40 uppercase tracking-widest">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-[#FFF2EE] flex items-center justify-center text-[#8B0000] mb-6 group-hover:bg-[#8B0000] group-hover:text-white transition-all shadow-md shadow-red-900/5">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MANGALASHTAK PARCHMENT SHOWCASE ========== */}
      <section className="w-full py-24 bg-gradient-to-b from-[#FFFBF7] via-[#FCF6EB] to-[#FFFBF7] relative overflow-hidden">
        {/* Austere traditional border details */}
        <div className="absolute top-0 bottom-0 left-4 w-px bg-amber-500/10 border-l border-dashed border-amber-500/20" />
        <div className="absolute top-0 bottom-0 right-4 w-px bg-amber-500/10 border-r border-dashed border-amber-500/20" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 flex items-center justify-center text-[#8B0000]">
              👑
            </div>
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#B8860B] mb-2">मंगलाष्टक आशीर्वाद</h3>
          <h2 className="text-3xl md:text-5xl font-display font-black text-[#8B0000] mb-10">
            "तदेव लग्नं सुदिनं तदेव..."
          </h2>

          <div className="bg-[#FAF3E3] border-4 border-double border-amber-600/30 p-8 md:p-12 rounded-[32px] shadow-2xl relative">
            <div className="absolute -top-3.5 left-10 px-4 bg-[#FCF6EB] text-xs font-black text-amber-600 uppercase tracking-widest">
              मंगल आशीर्वाद
            </div>
            
            <Quote size={40} className="text-[#8B0000]/10 mx-auto mb-6" />
            <p className="text-xl md:text-2xl font-serif text-[#660000] font-black leading-relaxed italic">
              मराठमोळ्या संस्कृतीचे रक्षण, दोन मनांचे मंगल मिलन...<br />
              शोध नव्या नात्यांचा घडवेल विवाहाचे गोड बंध!
            </p>
            
            <div className="mt-8 pt-6 border-t border-[#8B0000]/10 max-w-sm mx-auto flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-amber-600/30" />
              <span className="text-xs font-bold text-amber-800 uppercase tracking-[0.2em]">शुभमंगल सावधान</span>
              <span className="w-8 h-px bg-amber-600/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== RECENT PROFILES ========== */}
      {featuredProfiles.length > 0 && (
        <section className="w-full py-24 bg-white border-y border-amber-500/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="px-4 py-1.5 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/20 text-[#8B0000] font-bold text-xs uppercase tracking-widest">
                  नवीन सभासद
                </span>
                <h3 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4">नुकतेच जोडलेले सभासद</h3>
              </div>
              <Link to="/search" className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-[#8B0000] hover:text-[#A00000] border-b-2 border-transparent hover:border-[#8B0000] transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProfiles.map(p => {
                const imgUrl = p.images?.[0]?.url;
                const initial = p.profile?.firstName?.[0] || 'V';
                return (
                  <div 
                    key={p.id} 
                    onClick={() => navigate(`/profile/${p.id}`)} 
                    className="cursor-pointer bg-[#FFFBF7] rounded-3xl border border-amber-900/5 p-3 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-amber-50 mb-4 relative shadow-inner">
                      {imgUrl ? (
                        <img 
                          src={resolveImageUrl(imgUrl)} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          alt={`${p.profile?.firstName} Profile`} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-rose-50 to-amber-50 text-amber-800">
                          <span className="text-5xl font-display font-black opacity-30">{initial}</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-800 shadow-sm">
                        {p.regId}
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <h4 className="text-md font-bold text-gray-900 truncate">
                        {p.profile?.firstName} {p.profile?.lastName}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 font-medium">{p.profile?.gender} • {p.profile?.maritalStatus}</p>
                      <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-1 truncate">{p.education?.trade || 'Professional'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========== WHY US ========== */}
      <section className="w-full py-24 bg-[#FFFBF7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Elegant Paithani peacock background image border */}
            <div className="bg-white p-3 rounded-[36px] shadow-xl border border-amber-900/5 relative">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-lg font-black shadow-md border-2 border-white">
                👑
              </div>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop" 
                className="w-full aspect-[4/3] object-cover rounded-[28px] shadow-inner" 
                alt="Traditional Maharashtrian Wedding" 
              />
            </div>

            <div>
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8860B] font-bold text-xs uppercase tracking-widest">
                आमचे वेगळेपण
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4 mb-6">
                परंपरा आणि विश्वासाचे सुंदर संगम!
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8 text-md font-medium">
                आम्ही केवळ संख्या वाढवण्यावर भर देत नाही, तर प्रत्येक स्थळाची सुरक्षितता आणि विश्वासार्हता आमच्यासाठी सर्वात महत्त्वाची आहे. 
                मराठी परंपरांचा सन्मान करत आम्ही जोडत आहोत अस्सल आणि खात्रीशीर संबंध.
              </p>
              
              <div className="space-y-4 mb-10">
                {[
                  { icon: <CheckCircle2 className="text-[#8B0000]" size={18} />, title: '१००% हस्तलिखित पडताळणी (Verified Profiles)' },
                  { icon: <CheckCircle2 className="text-[#8B0000]" size={18} />, title: 'गोपनीय आणि अत्यंत सुरक्षित माहिती (Secure & Private)' },
                  { icon: <CheckCircle2 className="text-[#8B0000]" size={18} />, title: 'पालकांसाठी सुलभ व सुटसुटीत रचना (Parent-Friendly)' },
                  { icon: <CheckCircle2 className="text-[#8B0000]" size={18} />, title: '२४/७ तत्पर ग्राहक सेवा (Dedicated Support)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/about" className="px-8 py-3.5 bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors inline-block">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      {successStories.length > 0 && (
        <section className="w-full py-24 bg-gradient-to-b from-[#FFFBF7] via-[#FFF5F2] to-[#FFFBF7] border-y border-amber-500/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                आनंदी कुटुंबे
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-[#8B0000] mt-4">यशोगाथा (Success Stories)</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">लग्न जुळलेल्या जोडप्यांचे गोड अनुभव</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map(story => (
                <div key={story.id} className="p-8 bg-white border border-amber-900/5 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 relative group">
                  <div className="absolute top-4 right-6 text-2xl opacity-15">💝</div>
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-amber-50 border-4 border-amber-100 shadow-lg relative z-10">
                    {story.photoUrl ? (
                      <img src={resolveImageUrl(story.photoUrl)} alt="Couple" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-500">
                        <Heart size={32} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <Quote size={20} className="text-amber-500/20 mb-4" />
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-6">"{story.message}"</p>
                  <p className="font-bold text-gray-900 text-md">
                    {story.groomName} & {story.brideName}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mt-1">यशस्वी विवाह</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== MEMBERSHIP PLANS - STATIC GRID ========== */}
      <section className="w-full py-24 bg-[#FFFBF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B8860B] font-bold text-xs uppercase tracking-widest">
              सदस्यत्व शुल्क
            </span>
            <h3 className="text-3xl md:text-5xl font-display font-black text-gray-900 mt-4 mb-4">योग्य सदस्यत्व योजना निवडा</h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">पारदर्शक किंमती, छुपे शुल्क नाही. तुमच्या गरजेनुसार निवडा.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'विनामूल्य (Free)', price: '0', amount: 0, sub: 'Lifetime', cta: 'Register Free', bg: 'bg-white', border: 'border-amber-900/5', text: 'text-gray-900', btn: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200', features: ['प्रोफाइल तयार करा', 'इतर सभासद शोधा', 'मूलभूत शोध फिल्टर', 'पसंती (Interests) पाठवा'] },
              { name: 'रोप्य (Silver)', price: '2,000', amount: 2000, sub: '1 Year Validity', cta: 'Select Silver', bg: 'bg-white border-2 border-amber-600/20 shadow-md', border: 'border-amber-600/30', text: 'text-[#8B0000]', btn: 'bg-[#8B0000] text-white hover:bg-[#660000]', features: ['दररोज ५ पसंती पाठवा', 'थेट संपर्क माहिती मिळवा', 'संपूर्ण फोटो गॅलरी पहा', 'प्रगत शोध फिल्टर्स'] },
              { name: 'सुवर्ण (Gold)', price: '5,000', amount: 5000, sub: '1 Year Validity', cta: 'Select Gold', bg: 'bg-gradient-to-b from-[#8B0000] to-[#700000] text-white shadow-xl', border: 'border-[#8B0000]', text: 'text-white', btn: 'bg-[#FFD700] text-red-950 hover:bg-[#FCD34D] shadow-lg', features: ['अमर्यादित पसंती पाठवा', 'प्रोफाइल अग्रक्रम यादीत', 'पडताळणीचा विशेष बॅज', 'थेट वैयक्तिक मदत सेवा'] },
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-[32px] flex flex-col justify-between relative overflow-hidden ${plan.bg} ${plan.border}`}>
                {plan.name.includes('Gold') && (
                  <div className="absolute top-0.5 right-6 bg-[#FFD700] text-red-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-b-xl shadow-md">
                    👑 Most Popular
                  </div>
                )}
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest mb-4 ${plan.text === 'text-white' ? 'text-white/80' : 'text-amber-800'}`}>{plan.name}</p>
                  <div className={`flex items-baseline gap-1 mb-2 ${plan.text}`}>
                    <span className="text-xl font-bold">₹</span>
                    <span className="text-4xl font-display font-black">{plan.price}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-8 ${plan.text === 'text-white' ? 'text-white/60' : 'text-gray-400'}`}>{plan.sub}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 size={16} className={plan.text === 'text-white' ? 'text-amber-300' : 'text-[#8B0000]'} />
                        <span className={plan.text === 'text-white' ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.amount > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedPlan({ type: plan.name.split(' ')[0] === 'रोप्य' ? 'SILVER' : 'GOLD', price: plan.amount });
                      setIsPaymentModalOpen(true);
                    }}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${plan.btn}`}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className={`block w-full py-3.5 text-center rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${plan.btn}`}
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
      <section className="w-full py-28 px-6 bg-gradient-to-r from-[#FFF5F2] via-[#FFFBF9] to-[#FFF5F2] border-t border-amber-500/10 text-center relative overflow-hidden">
        {/* Austerity decorations */}
        <div className="absolute top-1/2 left-5 -translate-y-1/2 text-9xl font-display opacity-5 select-none pointer-events-none text-rose-800">ॐ</div>
        <div className="absolute top-1/2 right-5 -translate-y-1/2 text-9xl font-display opacity-5 select-none pointer-events-none text-rose-800">ॐ</div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-black text-[#8B0000] tracking-tight leading-[1.2] mb-6">
            तुमचा जोडीदार वाट पाहत आहे! <br className="hidden md:block" />
            आजच नवे पर्व सुरू करा.
          </h2>
          <p className="text-gray-600 mb-10 text-md font-medium max-w-xl mx-auto leading-relaxed">
            शुभ विवाहाच्या पवित्र बंधनासाठी योग्य जोडीदार शोधण्याची सुवर्णसंधी गमावू नका. 
            नोंदणी करा आणि नव्या नात्यांचा प्रवास सुकर बनवा!
          </p>
          <Link to="/register" className="px-12 py-4.5 bg-gradient-to-r from-[#8B0000] to-[#A00000] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-red-950/30 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-red-700/10">
            नोंदणी करा (Register Free)
          </Link>
        </div>
      </section>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType={selectedPlan?.type || 'SILVER'}
        price={selectedPlan?.price || 2000}
      />
      
      {/* Auspicious CSS Sway Animations */}
      <style>{`
        @keyframes sway {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
