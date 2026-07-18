import { Link } from 'react-router-dom';
import { Check, X, Star, Handshake, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { PaymentModal } from '../../components/PaymentModal';
import { SEO } from '../../components/common/SEO';

const features = [
  { name: 'प्रोफाइल तयार करा (Create profile)', free: true, silver: true, gold: true },
  { name: 'फोटो अपलोड (Upload photos)', free: 'Up to 3', silver: 'Up to 8', gold: 'Up to 15' },
  { name: 'स्थळे शोधा (Browse profiles)', free: true, silver: true, gold: true },
  { name: 'शोध फिल्टर (Search filters)', free: 'Basic', silver: 'All', gold: 'All' },
  { name: "फोटो पाहा (View photos)", free: 'Primary only', silver: 'Full gallery', gold: 'Full gallery' },
  { name: 'प्रस्ताव पाठवा (Send proposals)', free: false, silver: '4 per day', gold: 'Unlimited' },
  { name: 'प्रस्ताव प्राप्त करा (Receive proposals)', free: true, silver: true, gold: true },
  { name: 'संपर्क माहिती (Contact info)', free: false, silver: true, gold: true },
  { name: 'शॉर्टलिस्ट (Shortlist)', free: 'Up to 5', silver: 'Up to 50', gold: 'Unlimited' },
  { name: 'कोणी प्रोफाइल पाहिले (Profile views)', free: false, silver: '30 days', gold: 'Full history' },
  { name: 'प्राधान्य सूची (Priority listing)', free: false, silver: false, gold: true },
  { name: 'Verified बॅज', free: false, silver: false, gold: true },
  { name: 'Dedicated Relationship Manager', free: false, silver: false, gold: true },
  { name: 'Premium WhatsApp Support', free: false, silver: false, gold: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={18} className="text-paan-500 mx-auto" />;
  if (value === false) return <X size={18} className="text-foreground/15 mx-auto" />;
  return <span className="text-sm font-ui font-bold text-foreground/60">{value}</span>;
}

export default function Rules() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD', price: number } | null>(null);

  const handleUpgrade = (type: 'SILVER' | 'GOLD', price: number) => {
    setSelectedPlan({ type, price });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 50%, #FFFCF5 100%)' }}>
      <SEO title="दरपत्रक | Vivahvedh" description="Choose the right Vivahvedh plan for your matrimony journey." />

      {/* Hero */}
      <div className="relative py-16 text-center">
        <div className="absolute inset-0 bg-rangoli-pattern pointer-events-none" />
        <div className="relative z-10">
          <span className="text-haldi-500 text-xs font-ui font-bold uppercase tracking-[0.3em] mb-3 block">योजना • Plans</span>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 tracking-tight">सभासदत्व योजना</h1>
          <p className="text-lg text-muted-foreground font-sans max-w-md mx-auto">तुमच्या गरजेनुसार योग्य प्लॅन निवडा</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start mb-20">

          {/* FREE */}
          <div className="bg-white/90 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-sm-soft hover:shadow-md-soft transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-paan-500" />
            <h3 className="text-2xl font-display font-bold mb-1 text-paan-600">मोफत</h3>
            <p className="text-xs font-ui text-foreground/40 uppercase tracking-wider mb-1">Free Plan</p>
            <p className="text-4xl font-display font-bold mb-1 text-paan-600">₹0</p>
            <p className="text-sm text-muted-foreground font-ui mb-6">Forever • No expiry</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-paan-500 flex-shrink-0" /> प्रोफाइल तयार करा</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-paan-500 flex-shrink-0" /> ३ फोटो अपलोड</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-paan-500 flex-shrink-0" /> स्थळे शोधा</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-paan-500 flex-shrink-0" /> प्रस्ताव प्राप्त करा</li>
              <li className="flex items-center gap-3 text-sm font-sans opacity-40"><X size={16} className="flex-shrink-0" /> प्रस्ताव पाठवता येत नाही</li>
              <li className="flex items-center gap-3 text-sm font-sans opacity-40"><X size={16} className="flex-shrink-0" /> संपर्क माहिती नाही</li>
            </ul>
            <Link to="/register" className="block w-full py-3.5 border-2 border-paan-500 text-paan-600 font-ui font-bold rounded-xl hover:bg-paan-500 hover:text-white transition-all duration-300 text-center text-sm">
              Get Started Free
            </Link>
          </div>

          {/* SILVER */}
          <div className="p-8 rounded-3xl flex flex-col relative shadow-kumkum transform md:-translate-y-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)' }}
          >
            <div className="absolute top-0 right-6 bg-haldi-500 text-white text-[10px] font-ui font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-lg flex items-center gap-1">
              <Star size={10} fill="currentColor" /> POPULAR
            </div>
            <h3 className="text-2xl font-display font-bold mb-1 text-white mt-2">रौप्य</h3>
            <p className="text-xs font-ui text-white/50 uppercase tracking-wider mb-1">Silver Plan</p>
            <p className="text-4xl font-display font-bold mb-1 text-white">₹2,000</p>
            <p className="text-sm text-white/60 font-ui mb-6">Valid for 1 Year</p>
            <ul className="space-y-3 mb-8 text-white/90">
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> Free मधील सर्व सुविधा</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> दररोज ४ प्रस्ताव</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> संपर्क माहिती पाहा</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> सर्व फोटो पाहा</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> प्रगत शोध फिल्टर</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> प्रोफाइल दर्शक</li>
              <li className="flex items-center gap-3 text-sm font-sans"><Check size={16} className="text-haldi-400 flex-shrink-0" /> ईमेल सपोर्ट</li>
            </ul>
            <button 
              onClick={() => handleUpgrade('SILVER', 2000)}
              className="block w-full py-3.5 bg-white text-kumkum-500 font-ui font-bold rounded-xl shadow-lg hover:bg-white/90 transition-all text-center text-sm"
            >
              Upgrade to Silver
            </button>
          </div>

          {/* GOLD */}
          <div className="bg-white/90 backdrop-blur-xl border-2 border-haldi-500/30 p-8 rounded-3xl shadow-gold hover:shadow-lg-soft transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-haldi-500 to-haldi-700" />
            <div className="absolute top-0 right-6 bg-haldi-500 text-white text-[10px] font-ui font-bold uppercase tracking-wider px-3 py-1.5 rounded-b-lg flex items-center gap-1">
              👑 PREMIUM
            </div>
            <h3 className="text-2xl font-display font-bold mb-1 text-haldi-700 mt-2">सुवर्ण</h3>
            <p className="text-xs font-ui text-foreground/40 uppercase tracking-wider mb-1">Gold Plan</p>
            <p className="text-4xl font-display font-bold text-haldi-700 mb-1">₹5,000</p>
            <p className="text-sm text-muted-foreground font-ui mb-6">Valid for 1 Year</p>
            <ul className="space-y-3 mb-8 text-sm font-sans">
              <li className="flex items-center gap-3"><Check size={16} className="text-haldi-600 flex-shrink-0" /> Silver मधील सर्व</li>
              <li className="flex items-center gap-3"><Check size={16} className="text-haldi-600 flex-shrink-0" /> अमर्यादित प्रस्ताव</li>
              <li className="flex items-center gap-3"><Star size={16} className="text-haldi-600 fill-haldi-600 flex-shrink-0" /> शोधात प्राधान्य</li>
              <li className="flex items-center gap-3"><Check size={16} className="text-haldi-600 flex-shrink-0" /> Verified बॅज</li>
              <li className="flex items-center gap-3"><Handshake size={16} className="text-haldi-600 flex-shrink-0" /> Dedicated Manager</li>
              <li className="flex items-center gap-3"><Smartphone size={16} className="text-haldi-600 flex-shrink-0" /> WhatsApp Support</li>
            </ul>
            <button 
              onClick={() => handleUpgrade('GOLD', 5000)}
              className="block w-full py-3.5 text-white font-ui font-bold rounded-xl shadow-gold hover:shadow-lg transition-all text-center text-sm"
              style={{ background: 'linear-gradient(135deg, #E8A317 0%, #CA8A04 100%)' }}
            >
              Upgrade to Gold
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white/90 backdrop-blur-xl border border-border rounded-3xl shadow-premium overflow-hidden">
          <div className="px-8 py-6 border-b border-border">
            <h2 className="text-2xl font-display font-bold">तुलनात्मक तक्ता</h2>
            <p className="text-muted-foreground mt-1 text-sm font-sans">Detailed feature comparison across all plans</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-background/50">
                  <th className="text-left p-4 font-ui font-bold text-foreground/60">Feature</th>
                  <th className="text-center p-4 font-ui font-bold text-paan-600">मोफत</th>
                  <th className="text-center p-4 font-ui font-bold text-primary">रौप्य</th>
                  <th className="text-center p-4 font-ui font-bold text-haldi-700">सुवर्ण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-haldi-50/30 transition font-sans">
                    <td className="p-4 font-medium text-foreground/70">{f.name}</td>
                    <td className="p-4 text-center"><FeatureValue value={f.free} /></td>
                    <td className="p-4 text-center"><FeatureValue value={f.silver} /></td>
                    <td className="p-4 text-center"><FeatureValue value={f.gold} /></td>
                  </tr>
                ))}
                <tr className="border-t-2 border-border bg-background/50 font-ui">
                  <td className="p-4 font-bold">Duration</td>
                  <td className="p-4 text-center font-bold">Lifetime</td>
                  <td className="p-4 text-center font-bold text-primary">1 Year</td>
                  <td className="p-4 text-center font-bold text-haldi-700">1 Year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-haldi-500/40" />
            <span className="text-haldi-500 text-lg">✦</span>
            <div className="w-12 h-px bg-haldi-500/40" />
          </div>
          <p className="text-muted-foreground mb-4 font-sans">Ready to find your perfect match?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-premium-primary px-8 py-3 font-ui text-sm">
              Register Now
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-primary/20 text-primary rounded-xl font-ui font-bold hover:bg-primary/5 transition text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType={selectedPlan?.type || 'SILVER'}
        price={selectedPlan?.price || 2000}
      />
    </div>
  );
}
