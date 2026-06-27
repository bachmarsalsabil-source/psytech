import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const links = [
    { to: '/clinic/dashboard', icon: LayoutDashboard, label: 'الرئيسية', type: 'link' as const },
    { to: '/clinic/patients', icon: Users, label: 'الحالات', type: 'link' as const },
    { to: '/clinic/calendar', icon: Calendar, label: 'المواعيد', type: 'link' as const },
    { to: '/clinic/messages', icon: MessageSquare, label: 'الرسائل', type: 'link' as const },
    { to: '/clinic/settings', icon: Menu, label: 'المزيد', type: 'menu' as const },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-psy-surface/80 backdrop-blur-3xl border-t border-white/5 pb-safe" aria-label="التنقل السريع">
      <div className="flex justify-around items-center h-16 px-2">
        {links.map((link) =>
          link.type === 'menu' && onOpenMenu ? (
            <button
              key={link.label}
              type="button"
              onClick={onOpenMenu}
              className="flex flex-col items-center justify-center gap-1 flex-1 btn-touch text-psy-text/30 hover:text-psy-gold min-h-0"
              aria-label="فتح القائمة الكاملة"
            >
              <link.icon size={22} className="transition-transform active:scale-90" aria-hidden="true" />
              <span className="text-[10px] font-bold font-sans">{link.label}</span>
            </button>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              aria-label={link.label}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 flex-1 btn-touch min-h-0
                ${isActive ? 'text-psy-gold' : 'text-psy-text/30'}
              `}
            >
              <link.icon size={22} className="transition-transform active:scale-90" aria-hidden="true" />
              <span className="text-[10px] font-bold font-sans">{link.label}</span>
            </NavLink>
          )
        )}
      </div>
    </nav>
  );
};
