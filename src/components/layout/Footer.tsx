import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../clinic/Logo';

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-psy-bg border-t border-psy-gold/10 pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-full h-[240px] bg-gradient-to-t from-psy-gold/5 to-transparent -z-10 pointer-events-none" />
      <div className="page-container grid md:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
        <div className="col-span-1 md:col-span-2 space-y-5 md:space-y-8">
          <Link to="/" className="flex items-center gap-4" aria-label="psyTech - الرئيسية">
            <Logo size={48} showText className="items-start" />
          </Link>
          <div className="space-y-4">
            <p className="text-psy-text/50 max-w-md leading-relaxed font-light mb-0 text-sm md:text-base">
              نحن نبني البنية التحتية الرقمية لمستقبل علم النفس في العالم العربي، نجمع بين العلم والتكنولوجيا لخدمة
              الإنسان في بيئة آمنة تماماً.
            </p>
            <div className="text-lg md:text-xl font-serif italic text-psy-gold/40 font-light">
              &quot;نحو وعي أعمق... لحياة أفضل&quot;
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-serif font-bold text-base mb-5 md:mb-6 text-psy-gold">روابط سريعة</h4>
          <ul className="space-y-3 text-psy-text/40 text-sm font-medium">
            <li>
              <Link to="/community" className="hover:text-psy-gold transition-colors">
                المجتمع
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-psy-gold transition-colors">
                المكتبة
              </Link>
            </li>
            <li>
              <Link to="/academy" className="hover:text-psy-gold transition-colors">
                الأكاديمية
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-psy-gold transition-colors">
                تسجيل الدخول
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-bold text-base mb-5 md:mb-6 text-psy-gold">الدعم الفني</h4>
          <ul className="space-y-3 text-psy-text/40 text-sm font-medium">
            <li>
              <Link to="/community" className="hover:text-psy-gold transition-colors">
                مركز المساعدة
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-psy-gold transition-colors">
                الموارد التعليمية
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="page-container pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-psy-text/20 text-xs font-bold uppercase tracking-[0.2em]">
        <div>© 2026 PsyTech Platform. All Rights Reserved.</div>
      </div>
    </footer>
  );
});
