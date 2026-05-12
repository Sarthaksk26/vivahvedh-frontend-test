import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { authStorage } from '../../lib/authStorage';
import apiClient from '../../lib/apiClient';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const user = authStorage.getUser();
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clear local even if server fails
    }
    authStorage.clearSession();
    window.location.href = '/login';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search' },
    { to: '/success-stories', label: 'Stories' },
    { to: '/about', label: 'About' },
    { to: '/rules', label: 'Pricing' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
          ? 'h-20 bg-white/80 backdrop-blur-2xl border-b border-black/5 shadow-ambient' 
          : 'h-24 bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="relative z-50 flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-40 md:w-52 h-16 flex items-center">
              <img 
                src="/logo.png" 
                alt="Vivahvedh" 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" 
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative group ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors" title="Admin">
                    <ShieldCheck size={20} />
                  </Link>
                )}
                <Link to="/dashboard" className="p-2.5 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-colors" title="Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
                <Link to="/dashboard" onClick={() => sessionStorage.setItem('dashboard_tab', 'shortlist')} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors" title="Shortlist">
                  <Star size={20} fill="currentColor" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-2 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-8 py-3.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl shadow-[0_10px_20px_-5px_rgba(190,18,60,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(190,18,60,0.4)] transition-all">
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 p-2.5 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white pt-32 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-display font-black transition-all ${
                    location.pathname === link.to ? 'text-primary translate-x-2' : 'text-foreground/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-12 pt-12 border-t border-black/5 flex flex-col gap-5">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-lg font-bold">
                    <LayoutDashboard size={20} className="text-primary" /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-lg font-bold text-red-600">
                      <ShieldCheck size={20} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-bold text-foreground/40">
                    <LogOut size={20} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full py-5 bg-primary text-white text-center rounded-2xl font-black uppercase tracking-widest text-xs">
                    Get Started Free
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-5 bg-black/5 text-foreground text-center rounded-2xl font-black uppercase tracking-widest text-xs">
                    Member Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
