import React, { useState } from 'react';
import { LabSidebar } from './LabSidebar';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../clinic/Logo';

interface LabLayoutProps {
  children: React.ReactNode;
}

export const LabLayout: React.FC<LabLayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex w-full h-screen bg-psy-bg text-psy-text overflow-hidden" dir="rtl">

      {/* الشريط الجانبي للشاشات الكبيرة */}
      <div className="hidden md:block shrink-0">
        <LabSidebar />
      </div>

      {/* القائمة الجانبية المنزلقة للجوال */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* خلفية معتمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/80 z-[140] md:hidden"
            />
            {/* الدرج المنزلق */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed top-0 right-0 bottom-0 w-[285px] max-w-[85vw] bg-psy-bg border-l border-psy-gold/15 z-[150] md:hidden flex flex-col pb-safe"
            >
              {/* ترويسة الدرج */}
              <div className="p-4 border-b border-psy-gold/10 flex justify-between items-center bg-psy-surface shrink-0">
                <Logo size={28} showText={true} />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-psy-gold/10 rounded-xl transition-all text-psy-text/60 hover:text-psy-gold cursor-pointer btn-touch min-h-0"
                  aria-label="إغلاق القائمة"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <LabSidebar isMobileDrawer onCloseDrawer={() => setIsMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* منطقة المحتوى الرئيسية */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ترويسة الجوال */}
        <header className="md:hidden flex items-center justify-between p-4 bg-psy-surface/50 backdrop-blur-xl border-b border-psy-gold/10 sticky top-0 z-[50] shrink-0">
          <Logo size={28} showText={true} />
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-psy-gold/5 hover:bg-psy-gold/15 border border-psy-gold/10 rounded-xl transition-all text-psy-text/60 hover:text-psy-gold cursor-pointer btn-touch min-h-0"
            aria-label="فتح القائمة"
          >
            <Menu size={18} />
          </button>
        </header>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6 lg:p-8 xl:p-10 pb-safe md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-none"
          >
            {children}
          </motion.div>
        </main>

      </div>
    </div>
  );
};