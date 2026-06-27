import React, { useContext, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  Calendar,
  LogOut,
  User,
  ShieldCheck,
  Users,
  CreditCard,
  ArrowRight,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../lib/clinic';
import { AuthContext } from '../../context/AuthContext';
import { WalletWidget } from '../shared/WalletWidget';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from './Logo';
import { ProfilePortal } from '../shared/ProfilePortal';

// ─── Theme detection hook ──────────────────────────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('light-mode')
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsLight(document.body.classList.contains('light-mode'))
    );
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isLight;
}

export const PatientSidebar: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const user = getCurrentUser();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    health: false,
    comm: true,
  });
  
  const navigate = useNavigate();
  const isLight = useTheme();

  const effectiveCollapsed = isCollapsed && !isHovered;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const groups = [
    {
      id: 'health',
      title: 'الرحلة العلاجية وصحتي',
      links: [
        { to: '/patient/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
        { to: '/patient/tasks', icon: ClipboardCheck, label: 'مهامي العلاجية' },
        { to: '/patient/journal', icon: BookOpen, label: 'يومياتي الذاتية' },
      ]
    },
    {
      id: 'comm',
      title: 'التواصل والاستكشاف',
      links: [
        { to: '/patient/messages', icon: MessageSquare, label: 'مراسلة المعالج' },
        { to: '/patient/appointments', icon: Calendar, label: 'جلساتي المقررة' },
        { to: '/patient/payments', icon: CreditCard, label: 'الرصيد والمدفوعات' },
        { to: '/community', icon: Users, label: 'مجتمعنا الأكاديمي' },
        { to: '/library', icon: BookOpen, label: 'مكتبتنا الرقمية' },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Sidebar (lg Screen and Up) */}
      <motion.aside 
        initial={false}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ 
          width: effectiveCollapsed ? 82 : 285,
        }}
        style={{
          background: isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(13, 12, 21, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: isLight ? 'rgba(138, 96, 0, 0.18)' : 'rgba(212, 175, 55, 0.15)'
        }}
        className="relative hidden lg:flex border-l flex-col h-screen sticky top-0 z-[100] transition-all duration-500 shadow-xl select-none"
      >
        {/* Sidebar Header with Gold Glow Underline */}
        <div className={`p-6 flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-500 border-b relative mb-4`}
          style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
        >
          {/* Subtle gold decorative gradient indicator at top */}
          <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-l from-transparent via-psy-gold/40 to-transparent" />
          
          <Logo size={effectiveCollapsed ? 28 : 33} showText={!effectiveCollapsed} className="shrink-0 transition-all duration-300 hover:scale-102" />
        </div>

        {/* Navigation Links with Premium Hover & Active Ornaments */}
        <nav className="flex-1 px-4 space-y-4 overflow-y-auto no-scrollbar py-2">
          {groups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.id] ?? false;
            
            return (
              <div key={group.id} className="space-y-1.5">
                {/* Group Heading - Only show if not collapsed sidebar */}
                {!effectiveCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-right cursor-pointer group/header hover:text-psy-gold transition-colors text-psy-text/45 text-[10.5px] font-black uppercase tracking-wider font-sans"
                  >
                    <span>{group.title}</span>
                    <span className="text-psy-text/30 group-hover/header:text-psy-gold transition-colors">
                      {isGroupCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    </span>
                  </button>
                ) : (
                  <div className="h-0.5 my-2 bg-psy-gold/5 w-10 mx-auto" />
                )}

                {/* Sub-items list with anim */}
                <motion.div
                  initial={false}
                  animate={{
                    height: (effectiveCollapsed || !isGroupCollapsed) ? 'auto' : 0,
                    opacity: (effectiveCollapsed || !isGroupCollapsed) ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-1.5"
                >
                  {group.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) => `
                        relative flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 min-h-[48px] rounded-2xl transition-all duration-300 group overflow-hidden border
                        ${isActive 
                          ? 'bg-psy-gold/15 text-psy-gold font-black border-psy-gold/30 shadow-md' 
                          : 'border-transparent text-psy-text/60 hover:bg-psy-gold/5 hover:text-psy-gold hover:shadow-sm'}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {/* Glowing vertical bar with gold neon bloom */}
                          {isActive && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-psy-gold rounded-l-full shadow-[0_0_15px_#d4af37,0_0_6px_#d4af37]" />
                          )}

                          {/* Highlight sheen animation on hover */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-psy-gold/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                          <div className="flex items-center gap-3 relative z-10">
                            <link.icon 
                              size={18} 
                              className={`shrink-0 transition-all duration-500 ${
                                isActive 
                                  ? 'text-psy-gold filter drop-shadow-[0_0_8px_rgba(212,180,131,0.45)]' 
                                  : 'text-current group-hover:text-psy-gold/80'
                              } ${effectiveCollapsed ? 'group-hover:scale-115 group-hover:rotate-6' : 'group-hover:translate-x-0.5'}`} 
                            />
                            {!effectiveCollapsed && (
                              <span className="text-[13px] font-bold truncate tracking-wide leading-none">{link.label}</span>
                            )}
                          </div>

                          {/* High Quality Tooltip Pop-out for Collapsed State */}
                          {effectiveCollapsed && (
                            <div className="absolute left-[78px] opacity-0 group-hover:opacity-100 group-hover:left-[92px] transition-all duration-300 bg-psy-surface border border-psy-gold/25 text-psy-gold font-black px-4 py-2.5 rounded-xl text-[11px] whitespace-nowrap shadow-xl pointer-events-none z-[200] leading-none flex items-center gap-2"
                              style={{
                                background: isLight ? '#ffffff' : '#0d0c15',
                              }}
                            >
                              <span>{link.label}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-psy-gold animate-pulse" />
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer with Beautiful Live Identity Widget */}
        <div className="p-4 mt-auto border-t bg-psy-surface/30 space-y-3 relative overflow-hidden shrink-0"
          style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
        >
          {/* Subtle bottom canvas grid ornament */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,180,131,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />

          <button 
            onClick={() => setIsProfileOpen(true)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl min-h-[48px] transition-all duration-300 group cursor-pointer relative z-10 border border-transparent ${
              effectiveCollapsed ? 'justify-center bg-psy-gold/5' : 'bg-psy-gold/5 hover:bg-psy-gold/10 hover:border-psy-gold/20 hover:shadow-lg'
            }`}
          >
            <div className="relative shrink-0">
              {/* Dynamic pulse indicator for status */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-psy-surface z-20 shadow-[0_0_8px_#10b981]" />
              
              <div className="w-10 h-10 rounded-xl bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-psy-gold/50 group-hover:scale-[1.03] transition-all outline outline-2 outline-transparent group-hover:outline-psy-gold/15">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user?.fullName || 'User'} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                  <User size={18} className="text-psy-gold" />
                )}
              </div>
            </div>
            {!effectiveCollapsed && (
              <div className="flex-1 min-w-0 text-right">
                <div className="text-[13px] font-black truncate text-psy-text group-hover:text-psy-gold transition-colors">{user?.fullName || 'المستفيد'}</div>
                <div className="text-[9px] font-black text-psy-text/45 uppercase tracking-widest mt-1 leading-none">{user?.patientCode || 'رمزي معتمد'}</div>
              </div>
            )}
          </button>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 h-12 rounded-2xl text-psy-text/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 font-bold text-xs cursor-pointer relative z-10 group ${effectiveCollapsed ? 'justify-center' : 'px-4'}`}
          >
            <LogOut size={14} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {!effectiveCollapsed && <span className="leading-none">تسجيل الخروج المبرمج</span>}
          </button>
        </div>

        {/* Floating Toggle Button on Left Edge (Boundary) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-psy-surface border border-psy-gold/30 hover:border-psy-gold text-psy-gold flex items-center justify-center shadow-lg hover:shadow-[0_0_12px_rgba(212,175,55,0.35)] transition-all z-[110] cursor-pointer"
          style={{
            background: isLight ? '#ffffff' : '#110d0b',
          }}
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </motion.aside>

      {/* Mobile Glass Header (Below lg screen) */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b sticky top-0 z-[90] w-full shrink-0 h-16 transition-colors duration-500"
        style={{
          background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(13, 12, 21, 0.85)',
          borderColor: isLight ? 'rgba(138, 96, 0, 0.12)' : 'rgba(212, 175, 55, 0.1)'
        }}
      >
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-psy-gold/5 hover:bg-psy-gold/15 active:scale-95 rounded-xl transition-all text-psy-text hover:text-psy-gold border border-psy-gold/10 shadow-sm cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <Logo size={28} showText={true} className="shrink-0" />
        
        {user ? (
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-9 h-9 rounded-xl bg-psy-gold/10 border border-psy-gold/15 flex items-center justify-center font-bold text-xs text-psy-gold shadow-inner cursor-pointer"
          >
            {user.fullName ? user.fullName.charAt(0) : <Users size={14} />}
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Mobile Sliding Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              style={{
                background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(13, 12, 21, 0.95)',
                borderColor: isLight ? 'rgba(138, 96, 0, 0.18)' : 'rgba(212, 175, 55, 0.15)'
              }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[290px] max-w-[85vw] border-l z-[120] flex flex-col shadow-2xl pb-safe animate-in"
              dir="rtl"
            >
              {/* Drawer header */}
              <div className="p-5 flex items-center justify-between border-b bg-psy-surface/30"
                style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
              >
                <Logo size={28} showText={true} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center bg-psy-gold/5 hover:bg-psy-gold/15 active:scale-95 rounded-2xl transition-all text-psy-text hover:text-psy-gold cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navlinks inside drawer */}
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
                {groups.flatMap(g => g.links).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-2xl transition-all duration-300 border text-right
                      ${isActive 
                        ? 'bg-psy-gold/15 text-psy-gold font-bold border-psy-gold/20' 
                        : 'border-transparent text-psy-text/50 hover:bg-psy-gold/5 hover:text-psy-text'}
                    `}
                  >
                    <link.icon size={18} className="shrink-0 transition-transform text-current" />
                    <span className="text-[13px] font-black truncate">{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t bg-psy-surface/30 space-y-3"
                style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
              >
                {user && (
                  <div className="flex items-center gap-3 p-2 bg-psy-gold/5 rounded-2xl min-h-[48px]">
                    <div className="w-10 h-10 rounded-xl bg-psy-gold/10 border border-psy-gold/15 flex items-center justify-center font-bold text-psy-gold shrink-0 uppercase shadow-inner">
                      {user.fullName ? user.fullName.charAt(0) : "U"}
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <div className="text-xs font-black text-psy-text truncate">{user.fullName}</div>
                      <span className="text-[9px] font-black text-psy-text/45 block mt-0.5 leading-none">المستفيد</span>
                    </div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all font-black text-xs cursor-pointer"
                >
                  <LogOut size={14} className="shrink-0" />
                  <span>تسجيل خروج</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProfilePortal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export { PatientSidebar as default };
