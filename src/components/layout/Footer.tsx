import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Globe, MessageCircle, Share2 } from 'lucide-react';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '../../lib/constants';

export default function Footer() {
  return (
    <footer className="relative bg-[#FCFDFF] border-t border-black/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-24">

          {/* Brand Identity */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link to="/" className="inline-block mb-10 group transition-transform duration-300 hover:scale-105">
              <div className="w-56 h-20 flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Vivahvedh" 
                  className="w-full h-full object-contain mix-blend-multiply" 
                />
              </div>
            </Link>
            <p className="text-lg text-foreground/50 leading-relaxed max-w-sm mb-10">
              Maharashtra's most distinguished matrimonial platform. We provide a sophisticated digital experience for those who value heritage, trust, and lasting connections.
            </p>
            <div className="flex items-center gap-6">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Platform</h3>
            <ul className="space-y-5">
              {[
                { to: '/search', label: 'Explore Profiles' },
                { to: '/success-stories', label: 'Success Stories' },
                { to: '/rules', label: 'Pricing Plans' },
                { to: '/about', label: 'Our Story' },
                { to: '/contact', label: 'Help & Support' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-bold text-foreground/50 hover:text-foreground transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">Connect</h3>
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-ambient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone size={20} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Call Us</span>
                  <span className="text-lg font-bold text-foreground">{SUPPORT_PHONE}</span>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-ambient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Email Inquiry</span>
                  <span className="text-lg font-bold text-foreground">{SUPPORT_EMAIL}</span>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-ambient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">Office</span>
                  <span className="text-lg font-bold text-foreground leading-tight">Pune, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Bottom */}
        <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
            <Heart size={14} fill="currentColor" className="text-primary/40" />
            <span>Maharashtrian Heritage</span>
          </div>
          <div className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Vivahvedh Matrimony. All Rights Reserved.
          </div>
          <div className="flex gap-10">
            {['Privacy Policy', 'Terms of Service', 'Legal Notice'].map(txt => (
              <a key={txt} href="#" className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/20 hover:text-primary transition-colors">{txt}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
