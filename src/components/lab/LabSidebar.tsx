import React, { useContext, useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FlaskConical,
  Scale,
  Settings,
  LogOut,
  MessageSquare,
  BookOpen,
  ShoppingBag,
  Users,
  Home,
  Globe,
  Building2,
  FileEdit,
  Languages,
  ClipboardCheck,
  Calculator,
  Award,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../lib/clinic';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'motion/react';

import { Logo } from '../clinic/Logo';
import { ProfilePortal } from '../shared/ProfilePortal';

interface LabSidebarProps {
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const LabSidebar: React.FC<LabSidebarProps> = ({ isMobileDrawer = false, onCloseDrawer }) => {
  const { logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    instruments: false,
    workflow: true,
    scientific: false,
    public: true,
  });

  const navigate = useNavigate();
  const user = getCurrentUser();

  const effectiveCollapsed = isMobileDrawer ? false : (isCollapsed && !isHovered);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const groups = [
    {
      id: 'instruments',
      title: 'إدارة المختبر والأدوات',
      links: [
        { to: '/lab/dashboard', icon: LayoutDashboard, label: 'لوحة المختبر' },
        { to: '/lab/tests', icon: FileText, label: 'الاختبارات المقننة' },
        { to: '/lab/marketplace', icon: ShoppingBag, label: 'سوق الاختبارات' },
        { to: '/lab/settings', icon: Settings, label: 'إعدادات المختبر' },
      ]
    },
    {
      id: 'scientific',
      title: 'الإنشاء والتحليل العلمي',
      links: [
        // { to: '/lab/builder', icon: PlusCircle, label: 'منشئ الاختبارات' },
        { to: '/lab/analysis', icon: BarChart3, label: 'التحليل السيكومتري' },
        { to: '/lab/studies', icon: FlaskConical, label: 'الدراسات البحثية' },
        { to: '/lab/norms', icon: Scale, label: 'المعايير والتقنين' },
        { to: '/lab/national-norms', icon: Globe, label: 'المعايير الوطنية' },
      ]
    },
    {
      id: 'workflow',
      title: 'أقسام ومصالح المختبر',
      links: [
        { to: '/lab/dashboard?tab=identity', icon: Building2, label: '١. هوية المخبر' },
        { to: '/lab/dashboard?tab=draft', icon: FileEdit, label: '٢. صياغة البنود' },
        { to: '/lab/dashboard?tab=translation', icon: Languages, label: '٣. الترجمة والمواءمة' },
        { to: '/lab/dashboard?tab=arbitration', icon: ClipboardCheck, label: '٤. التحكيم والصدق' },
        { to: '/lab/dashboard?tab=sampling', icon: Users, label: '٥. استقطاب العينات' },
        { to: '/lab/dashboard?tab=stats', icon: Calculator, label: '٦. التحليل الإحصائي' },
        { to: '/lab/dashboard?tab=certification', icon: Award, label: '٧. الاعتماد والشهادة' },
        { to: '/lab/dashboard?tab=payouts', icon: CreditCard, label: '٨. المستحقات المالية' },
      ]
    },
    {
      id: 'public',
      title: 'الفضاء المعرفي والمشترك',
      links: [
        { to: '/community', icon: MessageSquare, label: 'المجتمع العلمي' },
        { to: '/library', icon: BookOpen, label: 'المكتبة الرقمية' },
        { to: '/', icon: Home, label: 'العودة للرئيسية' },
      ]
    }
  ];

  return (
    <>
      <motion.aside
        initial={false}
        onMouseEnter={() => !isMobileDrawer && setIsHovered(true)}
        onMouseLeave={() => !isMobileDrawer && setIsHovered(false)}
        animate={isMobileDrawer ? {} : {
          width: effectiveCollapsed ? 82 : 285,
        }}
        className={`flex bg-psy-surface flex-col select-none shrink-0 relative ${isMobileDrawer
            ? 'w-full h-full border-none'
            : 'border-l border-psy-gold/15 h-screen sticky top-0 z-[100] shadow-xl'
          }`}
        style={{
          background: 'rgba(13, 12, 21, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          className={`p-6 flex items-center ${effectiveCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-500 border-b border-psy-gold/10 mb-4 relative shrink-0`}
        >
          <div className="absolute top-0 right-0 left-0 h-[1.5px] bg-gradient-to-l from-transparent via-psy-gold/40 to-transparent" />
          <Logo size={effectiveCollapsed ? 28 : 33} showText={!effectiveCollapsed} className="shrink-0 transition-all duration-300 hover:scale-102" />
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <nav className="flex-1 px-4 space-y-4 overflow-y-auto no-scrollbar py-2">
          {groups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.id] ?? false;

            return (
              <div key={group.id} className="space-y-1.5">
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
                          {/* Glowing active bar */}
                          {isActive && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-psy-gold rounded-l-full shadow-[0_0_15px_#d4af37,0_0_6px_#d4af37]" />
                          )}

                          {/* Shimmer on hover */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-psy-gold/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                          <div className="flex items-center gap-3 relative z-10">
                            <link.icon
                              size={18}
                              className={`shrink-0 transition-all duration-500 ${isActive
                                ? 'text-psy-gold filter drop-shadow-[0_0_8px_rgba(212,180,131,0.45)]'
                                : 'text-current group-hover:text-psy-gold/80'
                                } ${effectiveCollapsed ? 'group-hover:scale-115 group-hover:rotate-6' : 'group-hover:translate-x-0.5'}`}
                            />
                            {!effectiveCollapsed && (
                              <span className="text-[13px] font-bold truncate tracking-wide leading-none">{link.label}</span>
                            )}
                          </div>

                          {/* Tooltip in collapsed mode */}
                          {effectiveCollapsed && (
                            <div className="absolute left-[78px] opacity-0 group-hover:opacity-100 group-hover:left-[92px] transition-all duration-300 bg-psy-surface border border-psy-gold/25 text-psy-gold font-black px-4 py-2.5 rounded-xl text-[11px] whitespace-nowrap shadow-xl pointer-events-none z-[200] leading-none flex items-center gap-2"
                              style={{ background: '#0d0c15' }}
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

        {/* ── Footer ─────────────────────────────────────── */}
        <div
          className="p-4 mt-auto border-t border-psy-gold/10 bg-psy-surface/30 space-y-3 relative overflow-hidden shrink-0"
        >
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[radial-gradient(ellipse_at_center,rgba(212,180,131,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />

          {user && (
            <button
              onClick={() => {
                setIsProfileOpen(true);
                if (onCloseDrawer) onCloseDrawer();
              }}
              className={`w-full flex items-center gap-3 p-3 min-h-[48px] rounded-2xl transition-all duration-300 group cursor-pointer relative z-10 border border-transparent ${effectiveCollapsed ? 'justify-center bg-psy-gold/5' : 'bg-psy-gold/5 hover:bg-psy-gold/10 hover:border-psy-gold/20 hover:shadow-lg'
                }`}
            >
              <div className="relative shrink-0">
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-psy-surface z-20 shadow-[0_0_8px_#10b981]" />
                <div className="w-10 h-10 rounded-xl bg-psy-gold/10 border border-psy-gold/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-psy-gold/50 group-hover:scale-[1.03] transition-all">
                  {user.fullName ? (
                    <div className="text-psy-gold font-sans font-black uppercase text-sm">{user.fullName.charAt(0)}</div>
                  ) : (
                    <Users size={18} className="text-psy-gold" />
                  )}
                </div>
              </div>
              {!effectiveCollapsed && (
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-[13px] font-black truncate text-psy-text group-hover:text-psy-gold transition-colors">{user.fullName}</div>
                  <div className="text-[9px] font-black text-psy-text/40 uppercase tracking-widest mt-1 leading-none">الباحث الرئيسي للأبحاث</div>
                </div>
              )}
            </button>
          )}

          <button
            onClick={() => {
              handleLogout();
              if (onCloseDrawer) onCloseDrawer();
            }}
            className={`w-full flex items-center gap-3 h-12 rounded-2xl text-psy-text/40 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 font-bold text-xs cursor-pointer relative z-10 group ${effectiveCollapsed ? 'justify-center' : 'px-4'}`}
          >
            <LogOut size={14} className="shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {!effectiveCollapsed && <span className="leading-none">تسجيل الخروج المبرمج</span>}
          </button>
        </div>

        {/* ── Floating Toggle Button (مثل العيادة) ──────── */}
        {!isMobileDrawer && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-psy-gold/30 hover:border-psy-gold text-psy-gold flex items-center justify-center shadow-lg hover:shadow-[0_0_12px_rgba(212,175,55,0.35)] transition-all z-[110] cursor-pointer"
            style={{ background: '#110d0b' }}
            title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
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