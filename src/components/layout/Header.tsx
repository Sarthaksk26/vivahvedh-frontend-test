import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star, LayoutDashboard, LogOut, ShieldCheck, Bell } from 'lucide-react';
import { authStorage } from '../../lib/authStorage';
import apiClient from '../../lib/apiClient';
import { formatApiError } from '../../lib/errorUtils';

// ═══════════════════════════════════════════════════════════════════
//  Notification Bell (logged-in non-admin users)
// ═══════════════════════════════════════════════════════════════════

interface UserNotification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedUserId: string | null;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'just now';
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/notifications/unread-count');
      setUnreadCount(data?.unreadCount ?? 0);
    } catch {
      // Silently ignore — badge just stays where it was
    }
  }, []);

  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/notifications', { params: { limit: 10 } });
      setItems(Array.isArray(data?.notifications) ? data.notifications : []);
    } catch {
      // Keep existing items on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll unread-count every 60s while mounted (mounts only for logged-in users)
  useEffect(() => {
    refreshUnreadCount();
    const id = window.setInterval(refreshUnreadCount, 60_000);
    return () => window.clearInterval(id);
  }, [refreshUnreadCount]);

  // Fetch list + close-on-outside-click when dropdown is opened
  useEffect(() => {
    if (!open) return;
    refreshList();
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open, refreshList]);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/mark-all-read');
      setItems((curr) => curr.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read failed:', formatApiError(err));
    }
  };

  const handleClickItem = async (n: UserNotification) => {
    if (!n.isRead) {
      try {
        await apiClient.patch(`/notifications/${n.id}/read`);
        setItems((curr) => curr.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error('Mark read failed:', formatApiError(err));
      }
    }
    setOpen(false);
    if (n.relatedUserId) navigate(`/profile/${n.relatedUserId}`);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
         </span>
        )}
     </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-ambient border border-black/5 overflow-hidden z-[110]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
              <h4 className="font-display font-black text-xs uppercase tracking-widest text-foreground/60">
                Notifications
             </h4>
              <button
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 disabled:text-foreground/30 disabled:cursor-not-allowed"
              >
                Mark all read
             </button>
           </div>
            <div className="max-h-96 overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-foreground/40">Loading…</div>
              ) : items.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-foreground/40">No notifications yet</div>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClickItem(n)}
                    className={`w-full text-left px-4 py-3 flex gap-3 items-start border-b border-black/5 last:border-b-0 hover:bg-sky-50/40 transition-colors ${
                      !n.isRead ? 'bg-sky-50/30' : ''
                    }`}
                  >
                    <span
                      className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${
                        n.isRead ? 'bg-transparent' : 'bg-red-500'
                      }`}
                      aria-hidden
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug break-words ${
                          n.isRead ? 'text-foreground/60' : 'text-foreground font-medium'
                        }`}
                      >
                        {n.message}
                     </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mt-1">
                        {timeAgo(n.createdAt)}
                     </p>
                   </div>
                 </button>
                ))
              )}
           </div>
         </motion.div>
        )}
     </AnimatePresence>
   </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const user = authStorage.getUser();
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'ADMIN';

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    authStorage.clearSession();
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Server cleanup failed, but local is already clear
    }
    navigate('/login');
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
                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative group ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
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
                {!isAdmin && <NotificationBell />}
                <Link to="/dashboard" className="p-2.5 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-colors" title="Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
                <Link to="/dashboard" onClick={() => sessionStorage.setItem('dashboard_tab', 'shortlist')} className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors" title="Shortlist">
                  <Star size={20} fill="currentColor" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-2 text-sm font-semibold tracking-wide text-foreground/70 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-semibold tracking-wide text-foreground/70 hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-primary text-white text-sm font-bold tracking-wide rounded-full shadow-[0_10px_20px_-5px_rgba(190,18,60,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(190,18,60,0.4)] transition-all">
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
