import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Reactively check auth state
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('vivah_auth_token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('vivah_auth_token');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search' },
    { to: '/about', label: 'About Us' },
    { to: '/rules', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-20 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-glass">
        <div className="w-full h-full flex items-center justify-between px-4 md:px-12 relative max-w-[1920px] mx-auto">

          {/* Logo */}
          <Link to="/" className="z-20 transform hover:scale-105 transition-transform" onClick={() => setMobileOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-48 md:w-64 h-20 flex items-center justify-start"
            >
              <img src="/logo.png" alt="Vivahvedh Logo" className="w-full h-full object-contain filter drop-shadow-sm mix-blend-multiply" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 font-sans font-semibold text-foreground/70 text-sm uppercase tracking-[0.15em] z-10 transition-all">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-primary relative group py-2 ${location.pathname === link.to ? 'text-primary' : ''}`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6 z-20">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="clay-button-secondary text-sm px-6 py-2.5">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-foreground/40 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="clay-button-primary text-sm px-7 py-3">
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden z-20 p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-background pt-24 px-6 pb-8 flex flex-col gap-2 overflow-y-auto lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <hr className="my-4 border-border" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-lg font-bold text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="px-4 py-3 text-red-500 font-semibold text-center hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 border rounded-lg font-semibold text-center hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-center shadow-md"
                >
                  Join Free
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
