import React, { useState } from 'react';
import { Logo } from './Logo';
import { ClinicalSidebar } from '../../components/clinic/ClinicalSidebar';
import { MobileBottomNav } from '../../components/clinic/MobileBottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export const ClinicalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="h-screen bg-psy-bg flex flex-col md:flex-row text-psy-text overflow-hidden" dir="rtl">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-psy-surface/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[60] shrink-0">
        <Logo size={32} showText={true} />
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-psy-gold/5 hover:bg-psy-gold/15 border border-psy-gold/10 rounded-xl transition-all text-psy-text/60 hover:text-psy-gold cursor-pointer btn-touch"
          aria-label="فتح القائمة"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block shrink-0">
        <ClinicalSidebar />
      </div>

      {/* Mobile Sliding Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 z-[140] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="mobile-sidebar-drawer fixed top-0 right-0 bottom-0 w-[290px] max-w-[85vw] bg-psy-bg border-l border-psy-gold/15 z-[150] md:hidden flex flex-col pb-safe"
            >
              <div className="p-4 border-b border-psy-gold/10 flex justify-between items-center bg-psy-surface shrink-0">
                <Logo size={28} showText={true} />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-psy-gold/10 rounded-xl transition-all text-psy-text/60 hover:text-psy-gold cursor-pointer btn-touch"
                  aria-label="إغلاق القائمة"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <ClinicalSidebar isMobileDrawer onCloseDrawer={() => setIsMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 h-full min-w-0 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 md:p-8 pb-bottom-nav md:pb-8">
        <div className="w-full max-w-none grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-4 md:col-span-12 space-y-6 md:space-y-8 min-w-0">
            {children}
          </div>
        </div>
      </main>

      <MobileBottomNav onOpenMenu={() => setIsMobileOpen(true)} />
    </div>
  );
};
