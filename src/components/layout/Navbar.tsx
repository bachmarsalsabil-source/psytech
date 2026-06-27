/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Bell, Search, Moon, Sun } from 'lucide-react';
import { Logo } from '../clinic/Logo';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import { AppNotification } from '../../types';
import * as clinic_lib from '../../lib/clinic';
import * as lab_lib from '../../lib/lab';
import { avatarUrl } from '../../lib/imageUtils';
import { OptimizedImage } from '../shared/OptimizedImage';

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const jsxDEV: any;
  export const Fragment: any;
}

declare module 'react/jsx-runtime.js' {
  export * from 'react/jsx-runtime';
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

function getDashboardPath(role?: string): string {
  if (role === 'clinician' || role === 'owner') return '/clinic/dashboard';
  if (role === 'researcher') return '/lab/dashboard';
  if (role === 'patient') return '/patient/dashboard';
  return '/auth';
}

const NAV_LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/#vision', label: 'الرؤية' },
  { to: '/#portals', label: 'البوابات' },
  { to: '/community', label: 'المجتمع' },
  { to: '/library', label: 'المكتبة' },
  { to: '/academy', label: 'الأكاديمية' },
] as const;

const NotificationBell = memo(function NotificationBell() {
  const { notifications, setNotifications } = React.useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useMemo(
    () => notifications.filter((n: AppNotification) => !n.read).length,
    [notifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev: AppNotification[]) => prev.map((n: AppNotification) => (n.id === id ? { ...n, read: true } : n)));
    },
    [setNotifications]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v: boolean) => !v)}
        className="p-2 hover:bg-white/5 rounded-full relative btn-touch"
        aria-label={`التنبيهات${unreadCount > 0 ? `، ${unreadCount} غير مقروءة` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] flex items-center justify-center rounded-full text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[55] cursor-default"
              aria-label="إغلاق التنبيهات"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-4 w-80 max-w-[calc(100vw-2rem)] glass p-4 shadow-2xl z-[60]"
              role="dialog"
              aria-label="قائمة التنبيهات"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold mb-0">التنبيهات</h4>
                <button
                  type="button"
                  onClick={() => setNotifications((prev: AppNotification[]) => prev.map((n: AppNotification) => ({ ...n, read: true })))}
                  className="text-xs text-psy-gold hover:underline min-h-0 px-2 py-1"
                >
                  تحديد الكل كمقروء
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-psy-text/30 text-sm">لا توجد تنبيهات جديدة</div>
                ) : (
                  notifications.map((n: AppNotification) => (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full text-right p-3 rounded-xl transition-all cursor-pointer ${n.read ? 'bg-white/5 opacity-60' : 'bg-psy-gold/10 border border-psy-gold/20'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="font-bold text-sm">{n.title}</span>
                        <span className="text-[10px] text-psy-text/40 shrink-0">
                          {new Date(n.timestamp).toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-xs text-psy-text/70 mb-0">{n.body}</p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export const Navbar = memo(function Navbar() {
  const { setNotifications } = React.useContext(SocketContext);
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme_preference');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim().toLowerCase();
      if (!q) return;

      const patient = clinic_lib.getCases().find(
        (c) => c.patientCode.toLowerCase().includes(q) || c.reasonForVisit.toLowerCase().includes(q)
      );
      if (patient && (user?.role === 'clinician' || user?.role === 'owner')) {
        navigate(`/clinic/patients/${patient.id}`);
        setSearchQuery('');
        return;
      }

      const tests = lab_lib.getTests();
      const test = tests.find(
        (t: { title?: string; id?: string }) =>
          t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q)
      );
      if (test?.id && (user?.role === 'researcher' || user?.role === 'clinician' || user?.role === 'owner')) {
        navigate(`/lab/test/${test.id}`);
        setSearchQuery('');
        return;
      }

      if (q.includes('مكتبة') || q.includes('library')) navigate('/library');
      else if (q.includes('مجتمع') || q.includes('community')) navigate('/community');
      else if (q.includes('أكاديم') || q.includes('academy')) navigate('/academy');
      else if (q.includes('عياد') || q.includes('clinic')) navigate(getDashboardPath(user?.role));
      else if (q.includes('مختبر') || q.includes('lab')) navigate('/lab/dashboard');

      setSearchQuery('');
    },
    [navigate, searchQuery, user?.role]
  );

  const addNotification = useCallback(
    (title: string, body: string) => {
      const newNotif: AppNotification = {
        id: crypto.randomUUID(),
        type: 'system',
        title,
        body,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    [setNotifications]
  );

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme_preference', newTheme);
    addNotification('تغيير المظهر', `تم تفعيل الوضع ${newTheme === 'dark' ? 'الليلي' : 'النهاري'} بنجاح.`);
  }, [theme, addNotification]);

  const userAvatar = user
    ? user.avatarUrl || avatarUrl(user.fullName || user.name)
    : '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'glass border-b border-psy-gold/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl py-3'
          : 'bg-transparent py-4 md:py-5'
        }`}
      aria-label="التنقل الرئيسي"
    >
      <div className="page-container grid grid-cols-4 md:grid-cols-12 items-center gap-4">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-3 group" aria-label="psyTech - الرئيسية">
            <Logo size={40} showText={false} className="items-start" priority />
            <span className="hidden lg:block text-xl font-serif font-black text-psy-gold gold-text-gradient">
              psyTech
            </span>
          </Link>
        </div>

        <div className="hidden md:block col-span-5 relative">
          <form onSubmit={handleSearch} className="relative group">
            <label htmlFor="global-search" className="sr-only">
              البحث في المنصة
            </label>
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-psy-text/40 group-focus-within:text-psy-gold transition-colors"
              size={18}
              aria-hidden="true"
            />

          </form>
        </div>

        <div className="hidden md:flex col-span-5 items-center justify-end gap-x-5">
          <div className="flex items-center gap-4 lg:gap-5 text-xs lg:text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-psy-gold transition-colors py-2 relative group">
                <span>{link.label}</span>
                <span className="absolute bottom-0 right-0 left-0 h-[2px] bg-psy-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded-full" />
              </Link>
            ))}
          </div>

          <div className="h-8 w-px bg-psy-gold/20 mx-1" aria-hidden="true" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 hover:bg-psy-gold/10 rounded-xl transition-all btn-touch text-psy-gold min-h-0"
              aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link to={getDashboardPath(user.role)} className="btn-primary btn-sm">
                  المنصة
                </Link>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-psy-gold/20">
                  <OptimizedImage
                    src={userAvatar}
                    alt={user.fullName || user.name}
                    width={88}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              <Link to="/auth?tab=login" className="btn-primary">
                دخول
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden col-span-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 btn-touch text-psy-gold min-h-0"
            aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            className="p-2 btn-touch text-psy-gold min-h-0"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-50 bg-psy-bg/95 backdrop-blur-3xl p-6 pt-safe pb-safe flex flex-col gap-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
          >
            <div className="flex justify-between items-center mb-4 shrink-0">
              <Logo size={48} showText={false} />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 btn-touch bg-white/5 rounded-2xl min-h-0"
                aria-label="إغلاق القائمة"
              >
                <X size={32} />
              </button>
            </div>

            <nav className="flex flex-col gap-3 text-xl font-serif font-black">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-4 pt-6">
              {user ? (
                <>
                  <Link
                    to={getDashboardPath(user.role)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary btn-lg w-full"
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="btn-danger w-full"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <Link
                  to="/auth?tab=register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary btn-lg w-full"
                >
                  ابدأ الآن مجاناً
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export { getDashboardPath };
