import React, { useContext, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  LogOut,
  Home,
  Menu,
  User,
  Database,
  ChevronLeft,
  ChevronRight,
  X,
  Archive,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  BookOpen,
  Settings,
  UserCog,
  CreditCard,
  Wallet,
  Stethoscope
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, getClinicStats, getCurrentUser } from '../../lib/clinic';
import { AuthContext } from '../../context/AuthContext';
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

interface ClinicalSidebarProps {
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const ClinicalSidebar: React.FC<ClinicalSidebarProps> = ({ isMobileDrawer = false, onCloseDrawer }) => {
  const { logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    clinic: false,
    resources: true,
    admin: true,
  });

  const navigate = useNavigate();
  const user = getCurrentUser();
  const stats = getClinicStats(user?.id || '');
  const isLight = useTheme();

  const effectiveCollapsed = isMobileDrawer ? false : (isCollapsed && !isHovered);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const groups = user?.role === 'owner'
    ? [
        {
          id: 'owner_main',
          title: 'إدارة النظام والتحكم',
          links: [
            { to: '/clinic/dashboard', icon: LayoutDashboard, label: 'لوحة المدير' },
            { to: '/clinic/staff', icon: UserCog, label: 'إدارة الطاقم' },
            { to: '/clinic/billing', icon: CreditCard, label: 'الفوترة والمدفوعات' },
            { to: '/clinic/economy', icon: Wallet, label: 'الاقتصاد والاشتراكات' },
            { to: '/clinic/audits', icon: Database, label: 'سجّل تدقيق النظام' },
            { to: '/clinic/settings', icon: Settings, label: 'إعدادات العيادة' },
          ]
        },
        {
          id: 'owner_clinic',
          title: 'العيادة والحالات',
          links: [
            { to: '/clinic/patients', icon: Users, label: 'الحالات المرضية', badge: stats.activeCases },
            { to: '/clinic/sessions', icon: Stethoscope, label: 'سجل الجلسات' },
            { to: '/clinic/calendar', icon: Calendar, label: 'مواعيد الجلسات' },
            { to: '/clinic/messages', icon: MessageSquare, label: 'المحادثات', badge: stats.unreadNotifications },
          ]
        },
        {
          id: 'owner_public',
          title: 'الروابط العامة',
          links: [
            { to: '/clinic/profile', icon: User, label: 'الملف الشخصي' },
            { to: '/community', icon: Home, label: 'المجتمع العام' },
          ]
        }
      ]
    : [
        {
          id: 'clinic',
          title: 'العيادة والحالات',
          links: [
            { to: '/clinic/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
            { to: '/clinic/patients', icon: Users, label: 'الحالات المرضية', badge: stats.activeCases },
            { to: '/clinic/sessions', icon: Stethoscope, label: 'سجل الجلسات' },
            { to: '/clinic/tasks', icon: ClipboardList, label: 'المهام العلاجية', badge: stats.pendingTasks },
            { to: '/clinic/journals', icon: BookOpen, label: 'اليوميات المشتركة' },
            { to: '/clinic/calendar', icon: Calendar, label: 'مواعيد الجلسات' },
            { to: '/clinic/messages', icon: MessageSquare, label: 'المحادثات', badge: stats.unreadNotifications },
          ]
        },
        {
          id: 'resources',
          title: 'المختبر والمصادر المتقدمة',
          links: [
            { to: '/clinic/plans', icon: Sparkles, label: 'بروتوكولات الشفاء' },
            { to: '/clinic/locker', icon: Archive, label: 'مخزني الخاص' },
            { to: '/clinic/reports', icon: BarChart3, label: 'التقارير العلمية' },
          ]
        },
        {
          id: 'admin',
          title: 'الأمان والبيئة التعليمية',
          links: [
            { to: '/clinic/settings', icon: Settings, label: 'إعدادات العيادة' },
            { to: '/clinic/audits', icon: Database, label: 'سجّل تدقيق النظام' },
            { to: '/clinic/profile', icon: User, label: 'الملف الشخصي' },
            { to: '/community', icon: Home, label: 'المجتمع العام' },
          ]
        }
      ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      <motion.aside 
        initial={false}
        onMouseEnter={() => !isMobileDrawer && setIsHovered(true)}
        onMouseLeave={() => !isMobileDrawer && setIsHovered(false)}
        animate={isMobileDrawer ? {} : { 
          width: effectiveCollapsed ? 82 : 285,
        }}
        style={{
          background: isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(13, 12, 21, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: isLight ? 'rgba(138, 96, 0, 0.18)' : 'rgba(212, 175, 55, 0.15)'
        }}
        className={`relative border-l flex flex-col ${isMobileDrawer ? 'h-full min-h-0' : 'h-screen sticky top-0'} z-[100] transition-all duration-500 shadow-xl select-none ${isMobileDrawer ? 'w-full !shadow-none' : ''}`}
      >
        {/* Sidebar Header with Gold Glow Underline */}
        <div className={`p-6 flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-500 border-b relative mb-4`}
          style={{ borderColor: isLight ? 'rgba(138, 96, 0, 0.1)' : 'rgba(212, 175, 55, 0.1)' }}
        >
          {/* Subtle gold decorative gradient indicator at top */}
          <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-l from-transparent via-psy-gold/40 to-transparent" />
          
          <Logo size={effectiveCollapsed ? 28 : 33} showText={!effectiveCollapsed} className="shrink-0 transition-all duration-300 hover:scale-102" />
        </div>

        {/* Navigation Groups / Links with Premium Collapsible Accents */}
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
                      onClick={onCloseDrawer}
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

                          {!effectiveCollapsed && link.badge !== undefined && link.badge > 0 && (
                            <span className="bg-psy-gold text-psy-bg text-[9.5px] font-black px-2 py-1 rounded-lg min-w-[20px] text-center shadow-lg shadow-psy-gold/25 relative z-10">
                              {link.badge}
                            </span>
                          )}

                          {/* High Quality Tooltip Pop-out for Collapsed State */}
                          {effectiveCollapsed && (
                            <div className="absolute left-[78px] opacity-0 group-hover:opacity-100 group-hover:left-[92px] transition-all duration-300 bg-psy-surface border border-psy-gold/25 text-psy-gold font-black px-4 py-2.5 rounded-xl text-[11px] whitespace-nowrap shadow-xl pointer-events-none z-[200] leading-none flex items-center gap-2"
                              style={{
                                background: isLight ? '#ffffff' : '#0d0c15',
                              }}
                            >
                              <span>{link.label}</span>
                              {link.badge !== undefined && link.badge > 0 && (
                                <span className="bg-psy-gold text-psy-bg text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                  {link.badge}
                                </span>
                              )}
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
              {/* Dynamic pulse indicator for current status */}
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
                <div className="text-[13px] font-black truncate text-psy-text group-hover:text-psy-gold transition-colors">{user?.fullName || 'عضو طاقم العيادة'}</div>
                <div className="text-[9px] font-black text-psy-text/45 uppercase tracking-widest mt-1 leading-none">{user?.specialization || 'المعالج المشرف'}</div>
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
        {!isMobileDrawer && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sidebar-collapse-toggle absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-psy-surface border border-psy-gold/30 hover:border-psy-gold text-psy-gold flex items-center justify-center shadow-lg hover:shadow-[0_0_12px_rgba(212,175,55,0.35)] transition-all z-[110] cursor-pointer"
          style={{
            background: isLight ? '#ffffff' : '#110d0b',
          }}
          title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        )}
      </motion.aside>

      <ProfilePortal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export { ClinicalSidebar as default };
