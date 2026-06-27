import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { GoldButton } from '../components/clinic/GoldButton';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6" dir="rtl">
    <div className="w-20 h-20 rounded-2xl bg-psy-gold/10 flex items-center justify-center text-psy-gold">
      <FileQuestion size={40} aria-hidden="true" />
    </div>
    <div className="space-y-2 max-w-md">
      <h1 className="text-3xl font-black text-psy-text mb-0">الصفحة غير موجودة</h1>
      <p className="text-psy-text/50 mb-0">
        عذراً، الرابط الذي طلبته غير متاح أو تم نقله إلى موقع آخر.
      </p>
    </div>
    <Link to="/">
      <GoldButton>العودة للرئيسية</GoldButton>
    </Link>
  </div>
);
