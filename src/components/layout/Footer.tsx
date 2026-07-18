import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      
      {/* Paithani decorative border at the top */}
      <div className="h-[4px] w-full" style={{
        background: 'repeating-linear-gradient(90deg, #C41E2A 0px, #C41E2A 12px, #E8A317 12px, #E8A317 24px, #C41E2A 24px, #C41E2A 28px, transparent 28px, transparent 32px)'
      }} />

      {/* Main Footer — Deep Kumkum Red */}
      <div className="bg-gradient-to-b from-[#7a1018] to-[#520A0D] text-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16">

            {/* Brand Identity */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <Link to="/" className="inline-block mb-8 group transition-transform duration-300 hover:scale-105">
                <div className="w-52 h-16 flex items-center">
                  <img 
                    src="/logo.png" 
                    alt="विवाहवेध" 
                    className="w-full h-full object-contain brightness-0 invert opacity-90" 
                  />
                </div>
              </Link>
              <p className="text-white/60 leading-relaxed max-w-sm mb-6 font-sans text-[15px]">
                महाराष्ट्रातील सर्वात विश्वासार्ह विवाह व्यासपीठ. कौटुंबिक मूल्ये, परंपरा आणि विश्वास जपत आधुनिक सुविधा देणारे एक अनोखे ठिकाण.
              </p>
              {/* Marathi blessing */}
              <div className="flex items-center gap-3 text-haldi-400 mb-8">
                <div className="w-8 h-px bg-haldi-400/40" />
                <span className="text-sm font-display italic text-haldi-400/80">
                  ॥ शुभ मंगल सावधान ॥
                </span>
                <div className="w-8 h-px bg-haldi-400/40" />
              </div>
              {/* Social placeholders */}
              <div className="flex items-center gap-3">
                {['𝕏', 'ⓕ', '▶'].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:bg-haldi-500 hover:text-white transition-all duration-300 text-sm font-bold">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-3">
              <h3 className="text-haldi-400 text-[10px] font-ui font-bold uppercase tracking-[0.4em] mb-8">व्यासपीठ</h3>
              <ul className="space-y-4">
                {[
                  { to: '/search', label: 'स्थळे शोधा', sub: 'Explore Profiles' },
                  { to: '/success-stories', label: 'यशोगाथा', sub: 'Success Stories' },
                  { to: '/rules', label: 'दरपत्रक', sub: 'Pricing Plans' },
                  { to: '/about', label: 'आमच्याबद्दल', sub: 'Our Story' },
                  { to: '/contact', label: 'संपर्क', sub: 'Help & Support' },
                  { to: '/privacy-policy', label: 'गोपनीयता धोरण', sub: 'Privacy Policy' },
                  { to: '/terms-of-service', label: 'सेवा अटी', sub: 'Terms of Service' },
                ].map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm font-sans text-white/50 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-haldi-400 transition-all duration-300 group-hover:w-3" />
                      <span>{link.label}</span>
                      <span className="text-[9px] font-ui text-white/20 ml-1">{link.sub}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-4">
              <h3 className="text-haldi-400 text-[10px] font-ui font-bold uppercase tracking-[0.4em] mb-8">संपर्क</h3>
              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-haldi-500 transition-all duration-300">
                    <Phone size={18} className="text-haldi-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-white/30 mb-1">Call Us</span>
                    <span className="text-base font-bold text-white font-sans">{SUPPORT_PHONE}</span>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-haldi-500 transition-all duration-300">
                    <Mail size={18} className="text-haldi-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-white/30 mb-1">Email</span>
                    <span className="text-base font-bold text-white font-sans">{SUPPORT_EMAIL}</span>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-haldi-500 transition-all duration-300">
                    <MapPin size={18} className="text-haldi-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-ui font-bold uppercase tracking-widest text-white/30 mb-1">Office</span>
                    <span className="text-base font-bold text-white font-sans leading-tight">पुणे, महाराष्ट्र</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge Strip */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-6 text-white/30 text-xs font-ui">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-paan-500" />
              १००% सुरक्षित
            </span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-haldi-500" />
              पडताळणी केलेले प्रोफाइल्स
            </span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-kumkum-500" />
              कौटुंबिक मूल्ये
            </span>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-ui font-bold text-white/20 uppercase tracking-wider">
              © {new Date().getFullYear()} Vivahvedh Matrimony. All Rights Reserved.
            </div>
            <div className="flex gap-6">
              {[
                { to: '/privacy-policy', label: 'Privacy' },
                { to: '/terms-of-service', label: 'Terms' },
                { to: '/contact', label: 'Support' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-[10px] font-ui font-bold uppercase tracking-wider text-white/20 hover:text-haldi-400 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
