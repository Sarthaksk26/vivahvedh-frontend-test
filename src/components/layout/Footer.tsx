import { Link } from 'react-router-dom';
import { Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#F2F4F6] border-t mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-6 group transition-transform hover:scale-105">
              <div className="w-64 h-20 flex items-center justify-start">
                <img src="/logo.png" alt="Vivahvedh Logo" className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply" />
              </div>
            </Link>
            <p className="text-foreground/60 text-base leading-relaxed max-w-sm">
              विश्वासार्ह वैवाहिक सेवा — Maharashtra's most trusted matrimonial platform. 
              Find your soulmate with an heirloom-style digital experience.
            </p>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold uppercase tracking-widest text-primary/40">
              <Heart size={14} className="text-primary" fill="currentColor" />
              <span>Maharashtrian Pride</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-display font-extrabold text-sm uppercase tracking-[3px] text-foreground mb-8">Navigation</h3>
            <ul className="space-y-4">
              {[
                { to: '/search', label: 'Find Matches' },
                { to: '/register', label: 'Register Free' },
                { to: '/rules', label: 'Plans & Pricing' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-medium text-foreground/50 hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h3 className="font-display font-extrabold text-sm uppercase tracking-[3px] text-foreground mb-8">Connect</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-sm">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">+91 98765 43210</p>
                  <p className="text-xs text-foreground/40 mt-1 uppercase tracking-wider">Customer Support</p>
                </div>
              </li>
              <li className="flex items-start gap-4 text-sm">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">info@vivahvedh.com</p>
                  <p className="text-xs text-foreground/40 mt-1 uppercase tracking-wider">Email Inquiry</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/5 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-widest text-foreground/30">
          <p>© {new Date().getFullYear()} Vivahvedh. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
