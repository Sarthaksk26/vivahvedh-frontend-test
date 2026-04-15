import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { PaymentModal } from '../../components/PaymentModal';

const features = [
  { name: 'Create & complete profile', free: true, silver: true, gold: true },
  { name: 'Upload photos', free: 'Up to 3', silver: 'Up to 8', gold: 'Up to 15' },
  { name: 'Browse & search profiles', free: true, silver: true, gold: true },
  { name: 'Search filters', free: 'Basic', silver: 'All', gold: 'All' },
  { name: "View other's photos", free: 'Primary only', silver: 'Full gallery', gold: 'Full gallery' },
  { name: 'Send match proposals', free: false, silver: '5 per day', gold: 'Unlimited' },
  { name: 'Receive match proposals', free: true, silver: true, gold: true },
  { name: 'View contact info', free: false, silver: true, gold: true },
  { name: 'Shortlist profiles', free: 'Up to 5', silver: 'Up to 50', gold: 'Unlimited' },
  { name: 'Who viewed my profile', free: false, silver: '30 days', gold: 'Full history' },
  { name: 'Priority listing', free: false, silver: false, gold: true },
  { name: 'Verified badge', free: false, silver: false, gold: true },
  { name: 'Personal assistance', free: false, silver: 'Email', gold: 'Dedicated' },
  { name: 'Meeting arrangement', free: false, silver: false, gold: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={18} className="text-green-600 mx-auto" />;
  if (value === false) return <X size={18} className="text-gray-300 mx-auto" />;
  return <span className="text-sm font-semibold">{value}</span>;
}

export default function Rules() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ type: 'SILVER' | 'GOLD', price: number } | null>(null);

  const handleUpgrade = (type: 'SILVER' | 'GOLD', price: number) => {
    setSelectedPlan({ type, price });
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 mb-20">

      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">Find the perfect tier for your matrimony journey with transparent pricing and premium features.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20">

        {/* FREE */}
        <div className="bg-card border p-8 rounded-3xl shadow-sm hover:shadow-md transition">
          <h3 className="text-2xl font-bold mb-2 text-green-600">Free</h3>
          <p className="text-4xl font-extrabold mb-1 text-green-600">₹0</p>
          <p className="text-sm text-muted-foreground font-medium mb-6">Forever • No expiry</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-500 flex-shrink-0" /> Create & complete profile</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-500 flex-shrink-0" /> Upload up to 3 photos</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-500 flex-shrink-0" /> Search active profiles</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="text-green-500 flex-shrink-0" /> Receive match proposals</li>
            <li className="flex items-center gap-3 text-sm opacity-50"><X size={16} className="text-gray-400 flex-shrink-0" /> Cannot send proposals</li>
            <li className="flex items-center gap-3 text-sm opacity-50"><X size={16} className="text-gray-400 flex-shrink-0" /> Cannot view contact info</li>
          </ul>
          <Link to="/register" className="block w-full py-3 border-2 border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-50 transition text-center">
            Get Started Free
          </Link>
        </div>

        {/* SILVER */}
        <div className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl transform md:-translate-y-4 relative border-4 border-primary-foreground/10">
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-2xl tracking-widest uppercase shadow">★ Popular</div>
          <h3 className="text-2xl font-bold mb-2 text-primary-foreground/90">Silver</h3>
          <p className="text-4xl font-extrabold mb-1">₹2,000</p>
          <p className="text-sm text-primary-foreground/70 font-medium mb-6">Valid for 6 Months</p>
          <ul className="space-y-3 mb-8 text-primary-foreground/90">
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Everything in Free</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Send 5 proposals per day</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> View contact on mutual accept</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Full photo gallery access</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Advanced search filters</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Who viewed my profile</li>
            <li className="flex items-center gap-3 text-sm"><Check size={16} className="flex-shrink-0" /> Email support</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('SILVER', 2000)}
            className="block w-full py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-gray-100 transition text-center"
          >
            Upgrade to Silver
          </button>
        </div>

        {/* GOLD */}
        <div className="bg-card border-2 border-amber-300 p-8 rounded-3xl shadow-sm hover:shadow-md transition relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl tracking-widest uppercase shadow">👑 Premium</div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <h3 className="text-2xl font-bold mb-2 text-amber-700">Gold</h3>
          <p className="text-4xl font-extrabold text-amber-700 mb-1">₹5,000</p>
          <p className="text-sm text-muted-foreground font-medium mb-6">Valid for 1 Year</p>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> Everything in Silver</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> Unlimited match proposals</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> ⭐ Priority listing in search</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> ✅ Verified profile badge</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> Dedicated relationship manager</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> Meeting arrangement</li>
            <li className="flex items-center gap-3"><Check size={16} className="text-amber-600 flex-shrink-0" /> Personal counselling</li>
          </ul>
          <button 
            onClick={() => handleUpgrade('GOLD', 5000)}
            className="block w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 transition text-center"
          >
            Upgrade to Gold
          </button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-card border rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-muted/50 px-8 py-6 border-b">
          <h2 className="text-2xl font-bold">Feature Comparison</h2>
          <p className="text-muted-foreground mt-1">Detailed breakdown across all plans</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold text-green-600">Free</th>
                <th className="text-center p-4 font-semibold text-primary">Silver</th>
                <th className="text-center p-4 font-semibold text-amber-700">Gold</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {features.map((f, i) => (
                <tr key={i} className="hover:bg-muted/20 transition">
                  <td className="p-4 font-medium">{f.name}</td>
                  <td className="p-4 text-center"><FeatureValue value={f.free} /></td>
                  <td className="p-4 text-center"><FeatureValue value={f.silver} /></td>
                  <td className="p-4 text-center"><FeatureValue value={f.gold} /></td>
                </tr>
              ))}
              <tr className="border-t-2 bg-muted/30">
                <td className="p-4 font-bold">Duration</td>
                <td className="p-4 text-center font-bold">Lifetime</td>
                <td className="p-4 text-center font-bold text-primary">6 Months</td>
                <td className="p-4 text-center font-bold text-amber-700">1 Year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">Ready to find your perfect match?</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary/90 transition">
            Register Now
          </Link>
          <Link to="/contact" className="px-8 py-3 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition">
            Contact Us
          </Link>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        planType={selectedPlan?.type || 'SILVER'}
        amount={selectedPlan?.price || 2000}
      />
    </div>
  );
}
