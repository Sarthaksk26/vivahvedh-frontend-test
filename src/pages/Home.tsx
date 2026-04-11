import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Shield, Star, ArrowRight, Sparkles, Quote } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.7, delay }
});

export default function Home() {
  return (
    <div className="flex-1 w-full flex flex-col items-center overflow-hidden">

      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden -mt-24 pt-24">
        {/* Full background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/wedding_hero.png" alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[15%] left-[8%] text-5xl opacity-30"
          >🪷</motion.div>
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[25%] right-[12%] text-4xl opacity-25"
          >🌺</motion.div>
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-[30%] left-[15%] text-3xl opacity-20"
          >✨</motion.div>
          <motion.div
            animate={{ y: [5, -10, 5], x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-[25%] right-[8%] text-4xl opacity-25"
          >💐</motion.div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 text-center">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-bold tracking-wide backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" /> विश्वासार्ह वैवाहिक सेवा • Since 2010
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 {...fadeUp(0.1)} className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[1.05] text-white">
            शोध
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              नव्या नात्यांचा
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Find your perfect life partner with Maharashtra's most trusted matrimonial platform.
            <span className="block mt-2 text-white/50 text-base">
              तुमच्या कुटुंबासाठी योग्य जोडीदार — विश्वासार्ह, सुरक्षित, आणि वैयक्तिक सेवा.
            </span>
          </motion.p>

          <motion.div {...fadeUp(0.35)} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-rose-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
            >
              नोंदणी करा — Register Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/search"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 border-2 border-white/25 backdrop-blur-sm text-white hover:bg-white/20 rounded-2xl font-bold text-lg transition-all duration-300"
            >
              जोडीदार शोधा — Browse
            </Link>
          </motion.div>

          {/* Mini Stats */}
          <motion.div {...fadeUp(0.5)} className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-14 text-sm">
            {[
              { count: '2,500+', label: 'Active Profiles', color: 'bg-green-400' },
              { count: '500+', label: 'यशस्वी विवाह', color: 'bg-amber-400' },
              { count: '100%', label: 'Verified & Safe', color: 'bg-blue-400' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/60">
                <div className={`w-2 h-2 ${stat.color} rounded-full animate-pulse`} />
                <span><strong className="text-white font-bold">{stat.count}</strong> {stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ========== TRADITIONAL DECORATIVE STRIP ========== */}
      <section className="w-full relative overflow-hidden">
        <img src="/traditional_elements.png" alt="Traditional Decorations" className="w-full h-28 md:h-36 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[4px] text-primary/80">कसे काम करते</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">How Vivahvedh Works</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">सोपे, सुरक्षित, आणि वैयक्तिक — Simple and personal, just 4 steps.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 z-0" />

            {[
              { step: '01', icon: '📝', title: 'नोंदणी करा', sub: 'Create Profile', desc: 'Register with basic details — it takes just 2 minutes.', color: 'from-rose-500/10 to-primary/5' },
              { step: '02', icon: '✅', title: 'मान्यता मिळवा', sub: 'Get Verified', desc: 'Our team reviews and verifies your profile within 24 hours.', color: 'from-green-500/10 to-emerald-500/5' },
              { step: '03', icon: '🔍', title: 'जोडीदार शोधा', sub: 'Find Matches', desc: 'Advanced filters — age, education, location, income & more.', color: 'from-blue-500/10 to-indigo-500/5' },
              { step: '04', icon: '💑', title: 'भेटा & जोडले जा', sub: 'Meet & Connect', desc: 'Exchange contacts, and we arrange personal meetings.', color: 'from-amber-500/10 to-orange-500/5' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-gradient-to-br ${item.color} border rounded-3xl p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-400 group z-10`}
              >
                {/* Step number circle */}
                <div className="w-8 h-8 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-lg font-extrabold mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-primary/80 mb-3">{item.sub}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                  <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-300 font-bold text-lg">R</div>
                  <div>
                    <p className="text-white font-bold">Rahul & Priya</p>
                    <p className="text-white/50 text-sm">Married in 2024 • Pune</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY VIVAHVEDH ========== */}
      <section className="w-full py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[4px] text-primary/80">आमची वैशिष्ट्ये</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight">Why Choose Vivahvedh?</h2>
            <p className="text-muted-foreground mt-3">आमच्याकडे इतर कुणाकडे नसलेली खासियत आहे</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={28} />,
                title: 'सुरक्षित प्रोफाइल',
                sub: 'Verified & Safe',
                desc: 'Every profile is manually verified. Your privacy and data security are our top priority. No fake profiles, guaranteed.',
                gradient: 'from-green-500/10 to-emerald-500/5',
                iconBg: 'bg-green-500/15 text-green-600',
                border: 'border-green-200/50'
              },
              {
                icon: <Heart size={28} />,
                title: 'वैयक्तिक सेवा',
                sub: 'Personal Matchmaking',
                desc: 'Gold members get a dedicated relationship manager. We personally facilitate meetings, counselling, and family introductions.',
                gradient: 'from-primary/10 to-rose-500/5',
                iconBg: 'bg-primary/15 text-primary',
                border: 'border-primary/20'
              },
              {
                icon: <Star size={28} />,
                title: 'महाराष्ट्रीय कुटुंबांसाठी',
                sub: 'Built for Maharashtra',
                desc: 'Designed specifically for Maharashtrian families. We understand your values, traditions, कुंडली matching, and community expectations.',
                gradient: 'from-amber-500/10 to-orange-500/5',
                iconBg: 'bg-amber-500/15 text-amber-600',
                border: 'border-amber-200/50'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${item.gradient} border ${item.border} rounded-3xl p-10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-extrabold mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-primary/70 mb-4">{item.sub}</p>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PLANS TEASER ========== */}
      <section className="w-full py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <span className="text-xs font-bold uppercase tracking-[4px] text-primary/80">आमच्या योजना</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 tracking-tight mb-4">Plans Starting from ₹0</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              मोफत नोंदणी करा, Silver ने कनेक्ट व्हा, Gold ने वैयक्तिक सेवा मिळवा.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { name: 'Free', price: '₹0', sub: 'Forever', color: 'text-green-600', bg: 'bg-green-50 border-green-200', features: ['Profile creation', 'Browse profiles', 'Receive proposals'] },
              { name: 'Silver', price: '₹2,000', sub: '6 Months', color: 'text-primary', bg: 'bg-primary/5 border-primary/20 ring-2 ring-primary/10 shadow-lg', features: ['Send proposals', 'View contacts', 'Full gallery', 'Advanced filters'] },
              { name: 'Gold', price: '₹5,000', sub: '1 Year', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-300', features: ['All Silver features', 'Priority listing ⭐', 'Verified badge ✅', 'Personal manager 🤝'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${plan.bg} border rounded-2xl p-8 text-center hover:shadow-xl transition-all`}
              >
                <p className={`text-sm font-bold uppercase tracking-widest ${plan.color} mb-2`}>{plan.name}</p>
                <p className={`text-4xl font-extrabold ${plan.color} mb-1`}>{plan.price}</p>
                <p className="text-sm text-muted-foreground mb-5">{plan.sub}</p>
                <ul className="space-y-2 text-sm text-left">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <Link to="/rules" className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-lg group">
            सर्व योजना पहा — View All Plans
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="w-full py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-primary via-rose-600 to-amber-600 rounded-[32px] p-12 md:p-16 text-center text-white overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            {/* Floating elements */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-8 left-12 text-3xl opacity-30">💍</motion.div>
            <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-8 right-12 text-3xl opacity-30">🪷</motion.div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                तुमचा जोडीदार वाट पाहत आहे!
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Your soulmate is waiting. Join thousands of happy families who found love through Vivahvedh.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  आजच नोंदणी करा — It's Free
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/15 border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/25 transition-all backdrop-blur-sm"
                >
                  📞 संपर्क करा — Call Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
