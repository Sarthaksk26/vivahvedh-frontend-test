import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-card to-muted/30 border-t mt-16 overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-5 group">
              <div className="w-64 h-20 flex items-center justify-start transition-transform group-hover:scale-105">
                <img src="/logo.png" alt="Vivahvedh Logo" className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply" />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              विश्वासार्ह वैवाहिक सेवा — Maharashtra's most trusted matrimonial platform. Helping families find perfect matches with verified profiles and personal assistance.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs text-muted-foreground/70">
              <Heart size={12} className="text-primary" fill="currentColor" />
              <span>Made with love in Maharashtra</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-bold text-sm uppercase tracking-[2px] text-foreground/80 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/search', label: 'जोडीदार शोधा — Find Matches' },
                { to: '/register', label: 'नोंदणी करा — Register Free' },
                { to: '/login', label: 'लॉगिन — Member Login' },
                { to: '/rules', label: 'योजना — Plans & Pricing' },
                { to: '/about', label: 'आमच्याबद्दल — About Us' },
                { to: '/contact', label: 'संपर्क — Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h3 className="font-bold text-sm uppercase tracking-[2px] text-foreground/80 mb-5">संपर्क करा — Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">+91 98765 43210</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">सोम - शनि, सकाळी 10 ते संध्या 7</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">info@vivahvedh.com</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">ईमेल द्वारे संपर्क साधा</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Vivahvedh Office</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">पुणे, महाराष्ट्र, भारत</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground/70">
          <p>© {new Date().getFullYear()} Vivahvedh Matrimony. सर्व हक्क राखीव — All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
